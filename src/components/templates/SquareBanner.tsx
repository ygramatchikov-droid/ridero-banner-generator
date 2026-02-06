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

interface SquareBannerProps {
  book: BookData;
  colorScheme: ColorScheme;
  bannerType: BannerType;
  bookStyle?: BookStyle;
  presentation?: PresentationData;
  title: string;
  author: string;
  annotation: string;
  genre?: string;
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

// Wave decoration component
const WaveDecoration = ({
  color,
  scale,
  position,
}: {
  color: string;
  scale: number;
  position: 'topLeft' | 'topRight' | 'bottomRight';
}) => {
  const size = 932 * scale;
  const positions = {
    topLeft: { left: -371 * scale, top: 181 * scale },
    topRight: { left: 519 * scale, top: -245 * scale },
    bottomRight: { left: 448 * scale, top: 774 * scale },
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

export const SquareBanner = forwardRef<HTMLDivElement, SquareBannerProps>(
  ({ book, colorScheme, bannerType, bookStyle = 'flat', presentation, title, author, annotation, genre, scale = 0.4 }, ref) => {
    const colors = COLOR_SCHEMES[colorScheme];
    const qrUrl = book.freeFragmentUrl || book.bookUrl;
    const size = 1080 * scale;
    const is3D = bookStyle === '3d';
    const isHardcover = bookStyle === '3d-hardcover';

    return (
      <div
        ref={ref}
        style={{
          width: size,
          height: size,
          backgroundColor: colors.bg,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Wave decorations */}
        <WaveDecoration color={colors.wave} scale={scale} position="topLeft" />
        <WaveDecoration color={colors.wave} scale={scale} position="topRight" />
        <WaveDecoration color={colors.wave} scale={scale} position="bottomRight" />

        {/* Ridero logo - Figma: x=886, y=64 → right=64 */}
        <div
          style={{
            position: 'absolute',
            top: 64 * scale,
            right: 64 * scale,
            width: 130 * scale,
            height: 40 * scale,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            ...TYPOGRAPHY.heading,
            fontSize: 32 * scale,
            letterSpacing: 2 * scale,
            color: colors.logoVariant === 'white' ? '#FFFFFF' : '#000000',
          }}
        >
          Ridero
        </div>

        {/* Book cover - shifted right to account for 3D perspective */}
        {is3D ? (
          <div
            style={{
              position: 'absolute',
              left: 100 * scale,
              top: 100 * scale,
            }}
          >
            <Book3D
              coverUrl={book.coverUrl}
              alt={title}
              width={300}
              height={420}
              scale={scale}
              angle={12}
            />
          </div>
        ) : isHardcover ? (
          <div
            style={{
              position: 'absolute',
              left: 100 * scale,
              top: 100 * scale,
            }}
          >
            <Book3DHardcover
              coverUrl={book.coverUrl}
              alt={title}
              width={300}
              height={420}
              scale={scale}
              angle={18}
              bgColor={colors.bg}
            />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: 64 * scale,
              top: 80 * scale,
              width: 480 * scale,
              height: 680 * scale,
              borderRadius: `${2 * scale}px ${8 * scale}px ${8 * scale}px ${2 * scale}px`,
              boxShadow: SHADOWS.bookCover,
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.coverUrl}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              crossOrigin="anonymous"
            />
            {/* Book spine effect - multiply gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: BOOK_COVER_OVERLAY.multiply,
                mixBlendMode: 'multiply',
                borderRadius: `${2 * scale}px ${8 * scale}px ${8 * scale}px ${2 * scale}px`,
              }}
            />
            {/* Book spine effect - lighten gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: BOOK_COVER_OVERLAY.lighten,
                mixBlendMode: 'lighten',
                borderRadius: `${2 * scale}px ${8 * scale}px ${8 * scale}px ${2 * scale}px`,
              }}
            />
          </div>
        )}

        {/* Right side content */}
        {bannerType === 'book' ? (
          // Book banner: Author + Title + Genre + QR + Annotation
          <>
            {/* Text block - Figma: x=600, y=160, w=415 */}
            <div
              style={{
                position: 'absolute',
                left: 600 * scale,
                top: 160 * scale,
                width: 415 * scale,
              }}
            >
              {/* Author */}
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontWeight: 700,
                  fontSize: 36 * scale,
                  lineHeight: `${44 * scale}px`,
                  color: colors.text,
                  marginBottom: 24 * scale,
                }}
              >
                {author}
              </p>

              {/* Title */}
              <p
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 36 * scale,
                  lineHeight: `${44 * scale}px`,
                  color: colors.text,
                  marginBottom: 12 * scale,
                }}
              >
                {title}
              </p>

              {/* Genre */}
              {genre && (
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontStyle: 'italic',
                    fontSize: 36 * scale,
                    lineHeight: `${44 * scale}px`,
                    color: colors.text,
                    opacity: 0.4,
                  }}
                >
                  {genre}
                </p>
              )}
            </div>

            {/* QR Code card - Figma: x=600, y=472, inner padding 32/16, QR=200x200 */}
            <div
              style={{
                position: 'absolute',
                left: 600 * scale,
                top: 472 * scale,
                paddingLeft: 32 * scale,
                paddingRight: 32 * scale,
                paddingTop: 16 * scale,
                paddingBottom: 32 * scale,
                backgroundColor: colors.cardBg,
                borderRadius: 16 * scale,
                boxShadow: SHADOWS.card,
              }}
            >
              {/* Text - Figma: h=24 */}
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 20 * scale,
                  lineHeight: `${24 * scale}px`,
                  color: colors.text,
                  marginBottom: 16 * scale,
                }}
              >
                Сканируй и читай:
              </p>
              {/* QR - Figma: 200x200 */}
              <QRCodeSVG
                value={qrUrl}
                size={200 * scale}
                bgColor={colors.cardBg}
                fgColor={colors.text}
                level="M"
              />
            </div>

            {/* Annotation - Figma: x=64, y=824, w=952 */}
            {annotation && (
              <p
                style={{
                  position: 'absolute',
                  left: 64 * scale,
                  top: 824 * scale,
                  width: 952 * scale,
                  ...TYPOGRAPHY.body,
                  fontSize: 32 * scale,
                  lineHeight: `${42 * scale}px`,
                  color: colors.text,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {annotation}
              </p>
            )}
          </>
        ) : (
          // Presentation banner: Time + Location + Stand
          // Figma coords from frame 0:46
          <>
            {/* Title - Figma: x=600, y=216, w=415, h=96 */}
            <p
              style={{
                position: 'absolute',
                left: 600 * scale,
                top: 216 * scale,
                width: 415 * scale,
                ...TYPOGRAPHY.body,
                fontSize: 34 * scale,
                lineHeight: `${48 * scale}px`,
                color: colors.text,
              }}
            >
              Презентация моей книги на Non/fiction!
            </p>

            {/* Time - Figma: x=600, y=376, h=72 */}
            <p
              style={{
                position: 'absolute',
                left: 600 * scale,
                top: 376 * scale,
                ...TYPOGRAPHY.title,
                fontSize: 60 * scale,
                lineHeight: `${72 * scale}px`,
                color: colors.text,
              }}
            >
              {presentation?.time || '14:30–15:00'}
            </p>

            {/* Location & Stand block - Figma: x=600, y=480, w=416 */}
            <div
              style={{
                position: 'absolute',
                left: 600 * scale,
                top: 480 * scale,
                width: 416 * scale,
              }}
            >
              {/* Location - icon 48x48, text gap=64 from left */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 * scale, marginBottom: 32 * scale }}>
                <LocationIcon color={colors.text} size={48 * scale} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 34 * scale,
                    lineHeight: `${48 * scale}px`,
                    color: colors.text,
                  }}
                >
                  {presentation?.location || 'Москва, Гостиный двор'}
                </p>
              </div>

              {/* Stand - icon 48x48, text gap=64 from left */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 * scale }}>
                <StandIcon color={colors.text} size={48 * scale} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 34 * scale,
                    lineHeight: `${48 * scale}px`,
                    color: colors.text,
                  }}
                >
                  {presentation?.stand || 'Стенд Е-19'}
                </p>
              </div>
            </div>

            {/* Annotation - Figma: x=64, y=824, w=920, h=168 */}
            {annotation && (
              <p
                style={{
                  position: 'absolute',
                  left: 64 * scale,
                  top: 824 * scale,
                  width: 920 * scale,
                  ...TYPOGRAPHY.body,
                  fontSize: 32 * scale,
                  lineHeight: `${42 * scale}px`,
                  color: colors.text,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {annotation}
              </p>
            )}
          </>
        )}

      </div>
    );
  }
);

SquareBanner.displayName = 'SquareBanner';
