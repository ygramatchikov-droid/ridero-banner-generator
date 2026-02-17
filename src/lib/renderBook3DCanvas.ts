/**
 * Canvas-based 3D book renderer for PNG export.
 * Draws a 3D hardcover book directly on canvas,
 * bypassing CSS 3D transform limitations of DOM-to-image libraries.
 *
 * Matches book-cover-3d library orientation:
 * - Front cover angled (left side farther, right side closer)
 * - Page edges visible on the RIGHT (derived from thickness)
 * - Spine hidden (goes to the back on the left side)
 * - Smooth edges via trapezoid clip path (no strip artifacts)
 */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export interface Book3DCanvasOptions {
  angle?: number;        // Y-rotation in degrees (default: 25)
  thickness?: number;    // Spine thickness (default: width * 0.2)
}

/**
 * Render a 3D hardcover book on canvas and return a data URL.
 * Layout: COVER (left=farther, right=closer) → PAGES on the right.
 */
export async function renderBook3DCanvas(
  coverUrl: string,
  coverWidth: number,
  coverHeight: number,
  options: Book3DCanvasOptions = {}
): Promise<string> {
  const {
    angle = 25,
    thickness: customThickness,
  } = options;

  const thickness = customThickness ?? coverWidth * 0.2;
  const rad = (angle * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);

  // Projected dimensions
  const faceW = Math.round(coverWidth * cosA);
  // Pages width derived from thickness (like book-cover-3d)
  const pagesW = Math.round(thickness * sinA * 0.35);

  // Canvas size with generous padding for elliptical shadow
  const padLeft = 15;
  const padRight = 50;
  const padTop = 10;
  const padBottom = 50;
  const totalW = padLeft + faceW + pagesW + padRight;
  const totalH = padTop + coverHeight + padBottom;

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Load cover image
  const img = await loadImage(coverUrl);

  // --- Perspective foreshortening params ---
  // Left edge is farther from viewer → shorter
  // Right edge is closer to viewer → full height
  const shrink = sinA * 0.15;
  const yShift = coverHeight * shrink * 0.5;

  // Cover starts at padLeft
  const coverStartX = padLeft;

  // Trapezoid corners
  const tlX = coverStartX;
  const tlY = padTop + yShift;
  const trX = coverStartX + faceW;
  const trY = padTop;
  const brX = coverStartX + faceW;
  const brY = padTop + coverHeight;
  const blX = coverStartX;
  const blY = padTop + yShift + coverHeight * (1 - shrink);

  // --- 1. Drop shadow (elliptical, behind everything) ---
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  const dropShadowCenterX = coverStartX + faceW * 0.55 + 8;
  const dropShadowCenterY = (trY + brY) / 2 + 15;
  const dropShadowRx = faceW * 0.48;
  const dropShadowRy = coverHeight * 0.48;
  ctx.filter = 'blur(18px)';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(dropShadowCenterX, dropShadowCenterY, dropShadowRx, dropShadowRy, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- 2. Floor shadow (blurred ellipse at bottom) ---
  const floorShadowCX = coverStartX + faceW * 0.55;
  const floorShadowCY = totalH - padBottom * 0.45;
  const floorShadowRx = faceW * 0.5;
  const floorShadowRy = 14;

  ctx.save();
  ctx.filter = 'blur(12px)';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(floorShadowCX, floorShadowCY, floorShadowRx, floorShadowRy, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- 3. Cover face (single drawImage + trapezoid clip for smooth edges) ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tlX, tlY);
  ctx.lineTo(trX, trY);
  ctx.lineTo(brX, brY);
  ctx.lineTo(blX, blY);
  ctx.closePath();
  ctx.clip();

  // Draw cover image filling the bounding box of the trapezoid
  // The clip path provides perfectly anti-aliased edges
  ctx.drawImage(img, coverStartX, padTop, faceW, coverHeight);
  ctx.restore();

  // --- 4. Cover lighting overlay ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tlX, tlY);
  ctx.lineTo(trX, trY);
  ctx.lineTo(brX, brY);
  ctx.lineTo(blX, blY);
  ctx.closePath();
  ctx.clip();

  // Left edge darkening (farther side)
  const edgeShadow = ctx.createLinearGradient(coverStartX, 0, coverStartX + faceW * 0.06, 0);
  edgeShadow.addColorStop(0, 'rgba(0, 0, 0, 0.15)');
  edgeShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = edgeShadow;
  ctx.fillRect(coverStartX, padTop, faceW, coverHeight + yShift);

  // Subtle overall lighting
  const lighting = ctx.createLinearGradient(coverStartX, 0, coverStartX + faceW, 0);
  lighting.addColorStop(0, 'rgba(0, 0, 0, 0.04)');
  lighting.addColorStop(0.15, 'rgba(0, 0, 0, 0)');
  lighting.addColorStop(0.85, 'rgba(255, 255, 255, 0)');
  lighting.addColorStop(1, 'rgba(255, 255, 255, 0.03)');
  ctx.fillStyle = lighting;
  ctx.fillRect(coverStartX, padTop, faceW, coverHeight + yShift);
  ctx.restore();

  // --- 5. Page edges (RIGHT side of cover) ---
  if (pagesW > 2) {
    const pagesX = coverStartX + faceW;
    const pagesTopY = padTop + 3;
    const pagesH = coverHeight - 6;

    ctx.save();
    const pagesGrad = ctx.createLinearGradient(pagesX, 0, pagesX + pagesW, 0);
    pagesGrad.addColorStop(0, '#f5f5f0');
    pagesGrad.addColorStop(0.2, '#eaeae5');
    pagesGrad.addColorStop(0.5, '#e0e0db');
    pagesGrad.addColorStop(1, '#d5d5d0');
    ctx.fillStyle = pagesGrad;

    // Pages as a slight parallelogram
    ctx.beginPath();
    ctx.moveTo(pagesX, pagesTopY);
    ctx.lineTo(pagesX + pagesW, pagesTopY + 2);
    ctx.lineTo(pagesX + pagesW, pagesTopY + pagesH - 2);
    ctx.lineTo(pagesX, pagesTopY + pagesH);
    ctx.closePath();
    ctx.fill();

    // Horizontal line textures on pages
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let y = pagesTopY + 4; y < pagesTopY + pagesH - 4; y += 3) {
      ctx.beginPath();
      ctx.moveTo(pagesX + 1, y);
      ctx.lineTo(pagesX + pagesW - 1, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}
