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
} from '@/lib/types';

interface SquareBannerProps {
  book: BookData;
  colorScheme: ColorScheme;
  bannerType: BannerType;
  presentation?: PresentationData;
  title: string;
  author: string;
  annotation: string;
  qrUrl?: string;
  scale?: number;
}

const BACKGROUND_MAP: Record<ColorScheme, string> = {
  yellow: '/assets/Фон желтый, квадрат.svg',
  lightblue: '/assets/Фон голубой, квадрат.svg',
  mint: '/assets/Фон мятный, квадрат.svg',
  pink: '/assets/Фон розовый, квадрат.svg',
  white: '/assets/Фон белый, квадрат.svg',
  dark: '/assets/Фон темный, квадрат.svg',
};

export const SquareBanner = forwardRef<HTMLDivElement, SquareBannerProps>(
  ({ book, colorScheme, bannerType, presentation, title, annotation, qrUrl: customQrUrl, scale = 0.4 }, ref) => {
    const colors = COLOR_SCHEMES[colorScheme];
    const qrUrl = customQrUrl || book.freeFragmentUrl || book.bookUrl;
    const proxiedCoverUrl = book.coverUrl.startsWith('http')
      ? `/api/proxy-image?url=${encodeURIComponent(book.coverUrl)}`
      : book.coverUrl;
    const size = 1080 * scale;
    const backgroundSvg = BACKGROUND_MAP[colorScheme];
    const logoSvg = colors.logoVariant === 'white' ? '/assets/Лого белый.svg' : '/assets/Лого черный.svg';
    const dateIcon = colors.logoVariant === 'white' ? '/assets/Дата, белый.svg' : '/assets/Дата, черный.svg';
    const locationIcon = colors.logoVariant === 'white' ? '/assets/Место, белый.svg' : '/assets/Место, черный.svg';
    const standIcon = colors.logoVariant === 'white' ? '/assets/Стенд, белый.svg' : '/assets/Стенд, черный.svg';

    const exhibitionName = presentation?.exhibitionName || 'Non/fiction';
    const bannerTitle = bannerType === 'book'
      ? `Моя книга на\u00A0${exhibitionName}!`
      : `Презентация моей книги на\u00A0${exhibitionName}!`;

    return (
      <div
        ref={ref}
        style={{
          width: size,
          height: size,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `url('${backgroundSvg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Figma: Rideró logo — right=64, top=64, w=130, h=40 */}
        <div
          style={{
            position: 'absolute',
            right: 64 * scale,
            top: 64 * scale,
            width: 130 * scale,
            height: 40 * scale,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSvg}
            alt="Rideró"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Figma: Book cover — x=64, y=80, w=480, h=680 */}
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
            src={proxiedCoverUrl}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            crossOrigin="anonymous"
          />
          {/* Spine gradient overlays */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: BOOK_COVER_OVERLAY.multiply,
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: BOOK_COVER_OVERLAY.lighten,
              mixBlendMode: 'lighten',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Right column content — depends on banner type */}
        {bannerType === 'book' ? (
          <>
            {/* Figma Book: Event info — x=600, y=168, w=416 */}
            <div
              style={{
                position: 'absolute',
                left: 600 * scale,
                top: 168 * scale,
                width: 416 * scale,
              }}
            >
              {/* Exhibition title — PT Sans Bold 34px */}
              <p
                style={{
                  ...TYPOGRAPHY.bold,
                  fontSize: 34 * scale,
                  lineHeight: `${48 * scale}px`,
                  color: colors.text,
                  marginBottom: 32 * scale,
                }}
              >
                {bannerTitle}
              </p>

              {/* Date — icon 48x48 + PT Sans Bold 34px, gap=16 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 * scale, marginBottom: 32 * scale }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dateIcon} alt="" style={{ width: 48 * scale, height: 48 * scale, flexShrink: 0 }} />
                <p
                  style={{
                    ...TYPOGRAPHY.bold,
                    fontSize: 34 * scale,
                    lineHeight: `${48 * scale}px`,
                    color: colors.text,
                  }}
                >
                  {presentation?.date || '5–9 декабря'}
                </p>
              </div>

              {/* Location — icon 48x48 + PT Sans 34px, gap=16 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 * scale, marginBottom: 32 * scale }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={locationIcon} alt="" style={{ width: 48 * scale, height: 48 * scale, flexShrink: 0 }} />
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

              {/* Stand — icon 48x48 + PT Sans 34px, gap=16 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 * scale }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={standIcon} alt="" style={{ width: 48 * scale, height: 48 * scale, flexShrink: 0 }} />
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

            {/* Figma Book: QR block — x=512, y=525, w=264, h=288, radius=8 */}
            <div
              style={{
                position: 'absolute',
                left: 512 * scale,
                top: 525 * scale,
                width: 264 * scale,
                height: 288 * scale,
                backgroundColor: colors.cardBg,
                borderRadius: 8 * scale,
                boxShadow: SHADOWS.card,
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: 16 * scale,
                paddingLeft: 32 * scale,
                paddingRight: 32 * scale,
                paddingBottom: 32 * scale,
              }}
            >
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 20 * scale,
                  lineHeight: `${24 * scale}px`,
                  color: '#000000',
                  marginBottom: 16 * scale,
                  width: 200 * scale,
                  textAlign: 'left',
                }}
              >
                Сканируй и читай:
              </p>
              <QRCodeSVG
                value={qrUrl}
                size={200 * scale}
                bgColor={colors.cardBg}
                fgColor="#000000"
                level="M"
              />
            </div>
          </>
        ) : (
          <>
            {/* Figma Presentation: Title — x=600, y=216, w=415, PT Sans Bold 34px */}
            <p
              style={{
                position: 'absolute',
                left: 600 * scale,
                top: 216 * scale,
                width: 415 * scale,
                ...TYPOGRAPHY.bold,
                fontSize: 34 * scale,
                lineHeight: `${48 * scale}px`,
                color: colors.text,
              }}
            >
              {bannerTitle}
            </p>

            {/* Figma Presentation: Time — x=600, bottom-aligned to y=448, PT Serif Bold 60px */}
            {presentation?.time && (
              <p
                style={{
                  position: 'absolute',
                  left: 600 * scale,
                  top: 376 * scale,
                  ...TYPOGRAPHY.title,
                  fontWeight: 700,
                  fontSize: 60 * scale,
                  lineHeight: `${72 * scale}px`,
                  color: colors.text,
                  whiteSpace: 'nowrap',
                }}
              >
                {presentation.time}
              </p>
            )}

            {/* Figma Presentation: Date, Location & Stand — x=600, y=480, w=416, gap=32 */}
            <div
              style={{
                position: 'absolute',
                left: 600 * scale,
                top: 480 * scale,
                width: 416 * scale,
                display: 'flex',
                flexDirection: 'column',
                gap: 32 * scale,
              }}
            >
              {/* Date — icon 48x48 + PT Sans Bold 34px, gap=16 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 * scale }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dateIcon} alt="" style={{ width: 48 * scale, height: 48 * scale, flexShrink: 0 }} />
                <p
                  style={{
                    ...TYPOGRAPHY.bold,
                    fontSize: 34 * scale,
                    lineHeight: `${48 * scale}px`,
                    color: colors.text,
                  }}
                >
                  {presentation?.date || '5 мая'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 * scale }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={locationIcon} alt="" style={{ width: 48 * scale, height: 48 * scale, flexShrink: 0 }} />
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

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 * scale }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={standIcon} alt="" style={{ width: 48 * scale, height: 48 * scale, flexShrink: 0 }} />
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
          </>
        )}

        {/* Figma: Annotation — x=64, y=860, w=930, PT Sans 34px */}
        {annotation && (
          <p
            style={{
              position: 'absolute',
              left: 64 * scale,
              top: 860 * scale,
              width: 930 * scale,
              ...TYPOGRAPHY.body,
              fontSize: 34 * scale,
              lineHeight: `${48 * scale}px`,
              color: colors.text,
            }}
          >
            {annotation}
          </p>
        )}
      </div>
    );
  }
);

SquareBanner.displayName = 'SquareBanner';
