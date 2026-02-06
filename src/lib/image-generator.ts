import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BannerFormat, FORMAT_DIMENSIONS } from './types';

export async function generateBannerImage(
  element: HTMLElement,
  format: BannerFormat
): Promise<Blob> {
  const { width, height } = FORMAT_DIMENSIONS[format];

  // Get current scale from element
  const currentWidth = element.offsetWidth;
  const scale = width / currentWidth;

  const dataUrl = await toPng(element, {
    width,
    height,
    pixelRatio: 1,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    },
  });

  const response = await fetch(dataUrl);
  return response.blob();
}

export function getFileName(format: BannerFormat, bookSlug: string): string {
  const { width, height } = FORMAT_DIMENSIONS[format];
  const formatNames: Record<BannerFormat, string> = {
    square: 'square',
    vertical: 'story',
  };
  return `${bookSlug}_${formatNames[format]}_${width}x${height}.png`;
}

export async function downloadSingleBanner(
  blob: Blob,
  fileName: string
): Promise<void> {
  saveAs(blob, fileName);
}

export async function downloadAllBannersAsZip(
  banners: { format: BannerFormat; blob: Blob }[],
  bookSlug: string
): Promise<void> {
  const zip = new JSZip();

  banners.forEach(({ format, blob }) => {
    const fileName = getFileName(format, bookSlug);
    zip.file(fileName, blob);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${bookSlug}_banners.zip`);
}
