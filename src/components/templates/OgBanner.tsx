'use client';

import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  BookData,
  ColorScheme,
  COLOR_SCHEMES,
  BannerType,
  PresentationData,
  TYPOGRAPHY,
  SHADOWS,
  BOOK_COVER_OVERLAY,
  BookStyle,
} from '@/lib/types';
import { Book3D, Book3DHardcover } from '@/components/Book3D';

interface OgBannerProps {
  book: BookData;
  colorScheme: ColorScheme;
  bannerType: BannerType;
  bookStyle?: BookStyle;
  presentation?: PresentationData;
  title: string;
  author: string;
  annotation: string;
  scale?: number;
}

// Location icon SVG
const LocationIcon = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      d="M24 4C16.268 4 10 10.268 10 18c0 10.5 14 26 14 26s14-15.5 14-26c0-7.732-6.268-14-14-14zm0 19a5 5 0 110-10 5 5 0 010 10z"
      fill={color}
    />
  </svg>
);

// Stand/booth icon SVG
const StandIcon = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="8" y="12" width="32" height="24" rx="2" stroke={color} strokeWidth="3" fill="none" />
    <path d="M8 20h32" stroke={color} strokeWidth="3" />
    <rect x="14" y="24" width="8" height="8" rx="1" fill={color} />
    <rect x="26" y="24" width="8" height="8" rx="1" fill={color} />
  </svg>
);

// Wave decoration component for OG format
const WaveDecoration = ({
  color,
  scale,
  position,
}: {
  color: string;
  scale: number;
  position: 'topLeft' | 'topRight' | 'bottomRight';
}) => {
  const size = 500 * scale;
  const positions = {
    topLeft: { left: -200 * scale, top: -100 * scale },
    topRight: { left: 900 * scale, top: -200 * scale },
    bottomRight: { left: 800 * scale, top: 400 * scale },
  };
  const pos = positions[position];

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        width: size,
        height: size * 0.89,
        opacity: 0.3,
      }}
    >
      <svg viewBox="0 0 932 834" fill="none" style={{ width: '100%', height: '100%' }}>
        <path
          d="M0 417C0 186.7 186.7 0 417 0h98c230.3 0 417 186.7 417 417s-186.7 417-417 417h-98C186.7 834 0 647.3 0 417z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export const OgBanner = forwardRef<HTMLDivElement, OgBannerProps>(
  ({ book, colorScheme, bannerType, bookStyle = 'flat', presentation, title, author, annotation, scale = 0.4 }, ref) => {
    const colors = COLOR_SCHEMES[colorScheme];
    const qrUrl = book.freeFragmentUrl || book.bookUrl;
    const width = 1200 * scale;
    const height = 630 * scale;
    const is3D = bookStyle === '3d';
    const isHardcover = bookStyle === '3d-hardcover';

    // Truncate annotation for OG format
    const shortAnnotation =
      annotation.length > 100 ? annotation.slice(0, 97) + '...' : annotation;

    return (
      <div
        ref={ref}
        style={{
          width,
          height,
          backgroundColor: colors.bg,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Wave decorations */}
        <WaveDecoration color={colors.wave} scale={scale} position="topLeft" />
        <WaveDecoration color={colors.wave} scale={scale} position="topRight" />
        <WaveDecoration color={colors.wave} scale={scale} position="bottomRight" />

        {/* Ridero logo */}
        <div
          style={{
            position: 'absolute',
            top: 32 * scale,
            right: 40 * scale,
            ...TYPOGRAPHY.heading,
            fontSize: 12 * scale,
            letterSpacing: 2 * scale,
            color: colors.logoVariant === 'white' ? '#FFFFFF' : '#000000',
          }}
        >
          Ridero
        </div>

        {/* Book cover */}
        {is3D ? (
          <div
            style={{
              position: 'absolute',
              left: 32 * scale,
              top: 48 * scale,
            }}
          >
            <Book3D
              coverUrl={book.coverUrl}
              alt={`${title} - ${author}`}
              width={280}
              height={400}
              scale={scale}
              angle={12}
            />
          </div>
        ) : isHardcover ? (
          <div
            style={{
              position: 'absolute',
              left: 24 * scale,
              top: 48 * scale,
            }}
          >
            <Book3DHardcover
              coverUrl={book.coverUrl}
              alt={`${title} - ${author}`}
              width={200}
              height={290}
              scale={scale}
              angle={16}
              bgColor={colors.bg}
            />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: 48 * scale,
              top: 48 * scale,
              width: 280 * scale,
              height: 400 * scale,
              borderRadius: `${2 * scale}px ${6 * scale}px ${6 * scale}px ${2 * scale}px`,
              boxShadow: SHADOWS.bookCover,
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.coverUrl}
              alt={`${title} - ${author}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              crossOrigin="anonymous"
            />
            {/* Book spine effect */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: BOOK_COVER_OVERLAY.multiply,
                mixBlendMode: 'multiply',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: BOOK_COVER_OVERLAY.lighten,
                mixBlendMode: 'lighten',
              }}
            />
          </div>
        )}

        {/* Content area */}
        <div
          style={{
            position: 'absolute',
            left: 400 * scale,
            top: 64 * scale,
            width: 480 * scale,
          }}
        >
          {bannerType === 'presentation' && presentation ? (
            // Presentation info
            <div>
              {/* Time */}
              <p
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 36 * scale,
                  lineHeight: `${44 * scale}px`,
                  color: colors.text,
                  marginBottom: 16 * scale,
                }}
              >
                {presentation.time || '14:30–15:00'}
              </p>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 * scale, marginBottom: 12 * scale }}>
                <LocationIcon color={colors.text} size={24 * scale} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 16 * scale,
                    lineHeight: `${22 * scale}px`,
                    color: colors.text,
                  }}
                >
                  {presentation.location || 'Москва, Гостиный двор'}
                </p>
              </div>

              {/* Stand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 * scale }}>
                <StandIcon color={colors.text} size={24 * scale} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 16 * scale,
                    lineHeight: `${22 * scale}px`,
                    color: colors.text,
                  }}
                >
                  {presentation.stand || 'Стенд Е-19'}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* QR Code card */}
        <div
          style={{
            position: 'absolute',
            right: 40 * scale,
            bottom: 40 * scale,
            padding: 16 * scale,
            backgroundColor: colors.cardBg,
            borderRadius: 8 * scale,
            boxShadow: SHADOWS.card,
          }}
        >
          <p
            style={{
              ...TYPOGRAPHY.body,
              fontSize: 12 * scale,
              lineHeight: `${16 * scale}px`,
              color: colors.text,
              marginBottom: 8 * scale,
            }}
          >
            Сканируй и читай:
          </p>
          <QRCodeSVG
            value={qrUrl}
            size={100 * scale}
            bgColor={colors.cardBg}
            fgColor={colors.text}
            level="M"
          />
        </div>
      </div>
    );
  }
);

OgBanner.displayName = 'OgBanner';
