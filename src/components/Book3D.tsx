'use client';

import { BookCover } from 'book-cover-3d';

interface Book3DProps {
  coverUrl: string;
  alt: string;
  width: number;
  height: number;
  spineWidth?: number;
  angle?: number;
  scale?: number;
}

/**
 * Pseudo-3D Book component using 2D transforms (skew) for PNG export compatibility
 * No CSS 3D transforms - works with html-to-image
 */
export function Book3D({
  coverUrl,
  alt,
  width,
  height,
  spineWidth: customSpineWidth,
  angle = 15,
  scale = 1,
}: Book3DProps) {
  const w = width * scale;
  const h = height * scale;
  const spineW = (customSpineWidth ?? width * 0.08) * scale;

  // Skew angle for pseudo-3D effect (converted from perspective angle)
  const skewAngle = angle * 0.6;

  // Height reduction due to perspective
  const perspectiveRatio = 0.92;
  const coverH = h * perspectiveRatio;

  // Total width including spine
  const totalWidth = w + spineW + 20 * scale;

  return (
    <div
      style={{
        position: 'relative',
        width: totalWidth,
        height: h + 50 * scale,
      }}
    >
      {/* Floor shadow - ellipse */}
      <div
        style={{
          position: 'absolute',
          bottom: 5 * scale,
          left: spineW * 0.5,
          width: w * 0.95,
          height: 25 * scale,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 40%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Book spine - left side */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: h * 0.02,
          width: spineW,
          height: coverH,
          background: 'linear-gradient(to right, #1a1a1a 0%, #3d3d3d 20%, #4a4a4a 50%, #3a3a3a 80%, #2a2a2a 100%)',
          borderRadius: `${3 * scale}px 0 0 ${3 * scale}px`,
          transform: `skewY(-${skewAngle}deg)`,
          transformOrigin: 'top left',
          boxShadow: `inset -${2 * scale}px 0 ${4 * scale}px rgba(0,0,0,0.3)`,
        }}
      />

      {/* Book cover - main */}
      <div
        style={{
          position: 'absolute',
          left: spineW - 1,
          top: 0,
          width: w,
          height: coverH,
          borderRadius: `0 ${4 * scale}px ${4 * scale}px 0`,
          overflow: 'hidden',
          transform: `skewY(-${skewAngle}deg)`,
          transformOrigin: 'top left',
          boxShadow: `${8 * scale}px ${12 * scale}px ${20 * scale}px rgba(0,0,0,0.3)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: `skewY(${skewAngle}deg) scale(1.1)`,
            transformOrigin: 'top left',
          }}
          crossOrigin="anonymous"
        />

        {/* Lighting gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.15) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Spine edge shadow */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6 * scale,
            background: 'linear-gradient(to right, rgba(0,0,0,0.25), transparent)',
          }}
        />
      </div>

      {/* Pages edge - right side */}
      <div
        style={{
          position: 'absolute',
          left: spineW + w - 1,
          top: 3 * scale,
          width: 8 * scale,
          height: coverH - 6 * scale,
          background: 'linear-gradient(to right, #f8f8f5 0%, #e5e5e0 30%, #d8d8d3 100%)',
          borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`,
          transform: `skewY(-${skewAngle}deg)`,
          transformOrigin: 'top left',
          boxShadow: `${2 * scale}px 0 ${4 * scale}px rgba(0,0,0,0.1)`,
        }}
      />
    </div>
  );
}

export interface Book3DColoredProps extends Omit<Book3DProps, 'spineWidth'> {
  spineColor?: string;
  spineWidth?: number;
}

interface Book3DHardcoverProps extends Book3DProps {
  bgColor?: string;
}

/**
 * 3D Hardcover Book using book-cover-3d library
 * Provides proper CSS 3D perspective with unified viewpoint
 */
export function Book3DHardcover({
  coverUrl,
  alt,
  width,
  height,
  angle = 30,
  scale = 1,
}: Book3DHardcoverProps) {
  const w = width * scale;
  const h = height * scale;
  const thickness = width * 0.5 * scale; // Much thicker book (5x from 0.1)

  // Floor shadow: squashed ellipse
  const shadowWidth = w * 0.9;
  const shadowHeight = thickness * 0.4; // Very flat ellipse

  return (
    <div
      style={{
        position: 'relative',
        width: w + thickness + 40 * scale,
        height: h + 70 * scale,
      }}
    >
      {/* Floor shadow - SVG ellipse with inline blur filter (preserves blend mode) */}
      <svg
        style={{
          position: 'absolute',
          bottom: -20 * scale,
          left: 0,
          width: (w + thickness) * 1.05,
          height: 60 * scale,
          mixBlendMode: 'multiply',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id={`floorBlur-${scale}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={12 * scale} />
          </filter>
        </defs>
        <ellipse
          cx={(w + thickness) * 0.525}
          cy={30 * scale}
          rx={shadowWidth * 0.65}
          ry={shadowHeight * 0.25}
          fill="black"
          fillOpacity={0.35}
          filter={`url(#floorBlur-${scale})`}
        />
      </svg>

      {/* 3D Book using library - wrapped to override box-shadows */}
      <style>{`
        .book-no-shadow .book > :first-child,
        .book-no-shadow .book::after {
          box-shadow: none !important;
        }
      `}</style>
      <div className="book-no-shadow" style={{ position: 'relative', zIndex: 1 }}>
        <BookCover
          rotate={angle}
          rotateHover={angle}
          perspective={600}
          transitionDuration={0}
          thickness={thickness}
          width={w}
          height={h}
          bgColor="#1a1a1a"
          shadowColor="rgba(0,0,0,0)"
          pagesOffset={8 * scale}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            crossOrigin="anonymous"
          />
        </BookCover>
      </div>
    </div>
  );
}

export interface Book3DColoredProps extends Omit<Book3DProps, 'spineWidth'> {
  spineColor?: string;
  spineWidth?: number;
}

export function Book3DColored({
  coverUrl,
  alt,
  width,
  height,
  spineWidth: customSpineWidth,
  spineColor = '#3a3a3a',
  angle = 15,
  scale = 1,
}: Book3DColoredProps) {
  const w = width * scale;
  const h = height * scale;
  const spineW = (customSpineWidth ?? width * 0.06) * scale;
  const perspective = w * 2.5;
  const totalWidth = w + spineW;

  const darkenColor = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - amount);
    return `rgb(${r},${g},${b})`;
  };

  const lightenColor = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + amount);
    const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + amount);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: totalWidth,
        height: h + 40 * scale,
      }}
    >
      {/* Shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          width: '90%',
          height: 30 * scale,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translateY(10px)',
        }}
      />

      {/* 3D Book container */}
      <div
        style={{
          position: 'relative',
          width: totalWidth,
          height: h,
          perspective: perspective,
          perspectiveOrigin: '30% 50%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Spine */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: spineW,
              height: h,
              background: `linear-gradient(to right, ${darkenColor(spineColor, 40)} 0%, ${lightenColor(spineColor, 20)} 30%, ${spineColor} 70%, ${darkenColor(spineColor, 30)} 100%)`,
              transformOrigin: 'right center',
              transform: `rotateY(${90 - angle}deg)`,
              borderRadius: '2px 0 0 2px',
            }}
          />

          {/* Cover */}
          <div
            style={{
              position: 'absolute',
              left: spineW - 1,
              top: 0,
              width: w,
              height: h,
              transformOrigin: 'left center',
              transform: `rotateY(-${angle}deg)`,
              borderRadius: '0 4px 4px 0',
              overflow: 'hidden',
              boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              crossOrigin="anonymous"
            />

            {/* Lighting overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, rgba(255,255,255,0.1) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.1) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Spine edge highlight */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                background: 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)',
              }}
            />
          </div>

          {/* Top edge (pages) */}
          <div
            style={{
              position: 'absolute',
              left: spineW,
              top: 0,
              width: w - 4,
              height: 4 * scale,
              background: 'linear-gradient(to bottom, #f5f5f0, #e8e8e0)',
              transformOrigin: 'left bottom',
              transform: `rotateX(90deg) rotateY(-${angle}deg)`,
            }}
          />

          {/* Bottom edge (pages) */}
          <div
            style={{
              position: 'absolute',
              left: spineW,
              top: h - 1,
              width: w - 4,
              height: 4 * scale,
              background: 'linear-gradient(to top, #f5f5f0, #e8e8e0)',
              transformOrigin: 'left top',
              transform: `rotateX(-90deg) rotateY(-${angle}deg)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
