'use client';

import { QRCodeSVG } from 'qrcode.react';
import { BookData, ColorScheme, COLOR_SCHEMES, BannerType, PresentationData } from '@/lib/types';

interface BannerBaseProps {
  book: BookData;
  colorScheme: ColorScheme;
  bannerType: BannerType;
  presentation?: PresentationData;
  title: string;
  author: string;
  annotation: string;
  showQR?: boolean;
  scale?: number;
}

export function BannerBase({
  book,
  colorScheme,
  bannerType,
  presentation,
  title,
  author,
  annotation,
  showQR = true,
  scale = 1,
}: BannerBaseProps) {
  const colors = COLOR_SCHEMES[colorScheme];
  const qrUrl = book.freeFragmentUrl || book.bookUrl;

  return {
    colors,
    qrUrl,
    title,
    author,
    annotation,
    coverUrl: book.coverUrl,
    showQR,
    scale,
    bannerType,
    presentation,
    QRCode: showQR ? (
      <QRCodeSVG
        value={qrUrl}
        size={80 * scale}
        bgColor={colors.bg}
        fgColor={colors.text}
        level="M"
        includeMargin={false}
      />
    ) : null,
  };
}
