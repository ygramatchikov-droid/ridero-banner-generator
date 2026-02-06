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

interface VerticalBannerProps {
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
  position: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';
}) => {
  const size = 932 * scale;
  // Figma exact positions for wave decorations
  const positions = {
    topLeft: { left: -371 * scale, top: 181 * scale },
    topRight: { left: 519 * scale, top: -245 * scale },
    bottomRight: { left: 448 * scale, top: 774 * scale },
    bottomLeft: { left: -400 * scale, top: 1200 * scale },
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

// Book cover component for reuse
const BookCover = ({
  book,
  title,
  author,
  bookStyle,
  scale,
  width,
  height,
  left,
  top,
  bgColor,
}: {
  book: BookData;
  title: string;
  author: string;
  bookStyle: BookStyle;
  scale: number;
  width: number;
  height: number;
  left: number;
  top: number;
  bgColor: string;
}) => {
  const is3D = bookStyle === '3d';
  const isHardcover = bookStyle === '3d-hardcover';

  if (is3D) {
    return (
      <div style={{ position: 'absolute', left: left * scale, top: top * scale }}>
        <Book3D
          coverUrl={book.coverUrl}
          alt={`${title} - ${author}`}
          width={width}
          height={height}
          scale={scale}
          angle={12}
        />
      </div>
    );
  }

  if (isHardcover) {
    return (
      <div style={{ position: 'absolute', left: left * scale, top: top * scale }}>
        <Book3DHardcover
          coverUrl={book.coverUrl}
          alt={`${title} - ${author}`}
          width={width * 0.75}
          height={height * 0.75}
          scale={scale}
          angle={18}
          bgColor={bgColor}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: left * scale,
        top: top * scale,
        width: width * scale,
        height: height * scale,
        borderRadius: `${2 * scale}px ${8 * scale}px ${8 * scale}px ${2 * scale}px`,
        boxShadow: SHADOWS.bookCoverLarge,
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={book.coverUrl}
        alt={`${title} - ${author}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        crossOrigin="anonymous"
      />
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
  );
};

export const VerticalBanner = forwardRef<HTMLDivElement, VerticalBannerProps>(
  ({ book, colorScheme, bannerType, bookStyle = 'flat', presentation, title, author, annotation, genre, scale = 0.25 }, ref) => {
    const colors = COLOR_SCHEMES[colorScheme];
    const qrUrl = book.freeFragmentUrl || book.bookUrl;
    const width = 1080 * scale;
    const height = 1920 * scale;

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

        {/* Ridero logo - Figma: x=886, y=64, w=130, h=40 → right=64 */}
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

        {bannerType === 'book' ? (
          // Book banner: Author + Title + Genre at top, cover left, QR right, annotation at bottom
          <>
            {/* Header: Author, Title, Genre - from Figma: x=80, y=156, w=936 */}
            <div
              style={{
                position: 'absolute',
                left: 80 * scale,
                top: 156 * scale,
                width: 700 * scale,
              }}
            >
              {/* Author */}
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontWeight: 700,
                  fontSize: 40 * scale,
                  lineHeight: `${48 * scale}px`,
                  color: colors.text,
                  marginBottom: 16 * scale,
                }}
              >
                {author}
              </p>

              {/* Title */}
              <p
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 48 * scale,
                  lineHeight: `${56 * scale}px`,
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

            {/* Book cover - shifted right to account for 3D perspective */}
            <BookCover
              book={book}
              title={title}
              author={author}
              bookStyle={bookStyle}
              scale={scale}
              width={420}
              height={590}
              left={140}
              top={420}
              bgColor={colors.bg}
            />

            {/* QR Code card - right side, overlapping book */}
            <div
              style={{
                position: 'absolute',
                right: 80 * scale,
                top: 900 * scale,
                padding: 24 * scale,
                backgroundColor: colors.cardBg,
                borderRadius: 16 * scale,
                boxShadow: SHADOWS.cardLarge,
              }}
            >
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 22 * scale,
                  lineHeight: `${28 * scale}px`,
                  color: colors.text,
                  marginBottom: 12 * scale,
                }}
              >
                Сканируй и читай:
              </p>
              <QRCodeSVG
                value={qrUrl}
                size={180 * scale}
                bgColor={colors.cardBg}
                fgColor={colors.text}
                level="M"
              />
            </div>

            {/* Annotation at bottom */}
            {annotation && (
              <p
                style={{
                  position: 'absolute',
                  left: 80 * scale,
                  bottom: 80 * scale,
                  width: 920 * scale,
                  ...TYPOGRAPHY.body,
                  fontSize: 36 * scale,
                  lineHeight: `${48 * scale}px`,
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
          // Presentation banner: Title at top, cover below, time/location card, annotation at bottom
          <>
            {/* Title */}
            <p
              style={{
                position: 'absolute',
                left: 80 * scale,
                top: 140 * scale,
                width: 700 * scale,
                ...TYPOGRAPHY.title,
                fontSize: 64 * scale,
                lineHeight: `${76 * scale}px`,
                color: colors.text,
              }}
            >
              Презентация моей книги на Non/fiction!
            </p>

            {/* Book cover */}
            <BookCover
              book={book}
              title={title}
              author={author}
              bookStyle={bookStyle}
              scale={scale}
              width={560}
              height={790}
              left={80}
              top={380}
              bgColor={colors.bg}
            />

            {/* Time/Location/Stand card - bottom right */}
            <div
              style={{
                position: 'absolute',
                right: 80 * scale,
                bottom: 320 * scale,
                padding: 40 * scale,
                backgroundColor: colors.cardBg,
                borderRadius: 16 * scale,
                boxShadow: SHADOWS.cardLarge,
              }}
            >
              {/* Time */}
              <p
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 64 * scale,
                  lineHeight: `${76 * scale}px`,
                  color: colors.text,
                  marginBottom: 24 * scale,
                }}
              >
                {presentation?.time || '14:30–15:00'}
              </p>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 * scale, marginBottom: 16 * scale }}>
                <LocationIcon color={colors.text} size={36 * scale} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 28 * scale,
                    lineHeight: `${36 * scale}px`,
                    color: colors.text,
                  }}
                >
                  {presentation?.location || 'Москва, Гостиный двор'}
                </p>
              </div>

              {/* Stand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 * scale }}>
                <StandIcon color={colors.text} size={36 * scale} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 28 * scale,
                    lineHeight: `${36 * scale}px`,
                    color: colors.text,
                  }}
                >
                  {presentation?.stand || 'Стенд Е-19'}
                </p>
              </div>
            </div>

            {/* Annotation at bottom */}
            {annotation && (
              <p
                style={{
                  position: 'absolute',
                  left: 80 * scale,
                  bottom: 80 * scale,
                  width: 920 * scale,
                  ...TYPOGRAPHY.body,
                  fontSize: 36 * scale,
                  lineHeight: `${48 * scale}px`,
                  color: colors.text,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
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

VerticalBanner.displayName = 'VerticalBanner';
