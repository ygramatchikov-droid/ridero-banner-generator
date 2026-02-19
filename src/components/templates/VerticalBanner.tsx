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

interface VerticalBannerProps {
  book: BookData;
  colorScheme: ColorScheme;
  bannerType: BannerType;
  presentation?: PresentationData;
  title: string;
  author: string;
  annotation: string;
  qrUrl?: string;
}

const BACKGROUND_MAP: Record<ColorScheme, string> = {
  yellow: '/assets/Фон желтый, вертикальный.svg',
  lightblue: '/assets/Фон голубой, вертикальный.svg',
  mint: '/assets/Фон мятный, вертикальный.svg',
  pink: '/assets/Фон розовый, вертикальный.svg',
  white: '/assets/Фон белый, вертикальный.svg',
  dark: '/assets/Фон темный, вертикальный.svg',
};

export const VerticalBanner = forwardRef<HTMLDivElement, VerticalBannerProps>(
  ({ book, colorScheme, bannerType, presentation, title, annotation, qrUrl: customQrUrl }, ref) => {
    const colors = COLOR_SCHEMES[colorScheme];
    const qrUrl = customQrUrl || book.freeFragmentUrl || book.bookUrl;
    const proxiedCoverUrl = book.coverUrl.startsWith('http')
      ? `/api/proxy-image?url=${encodeURIComponent(book.coverUrl)}`
      : book.coverUrl;
    const backgroundSvg = BACKGROUND_MAP[colorScheme];
    const logoSvg = colors.logoVariant === 'white' ? '/assets/Лого белый.svg' : '/assets/Лого черный.svg';
    const dateIcon = colors.logoVariant === 'white' ? '/assets/Дата, белый.svg' : '/assets/Дата, черный.svg';
    const locationIcon = colors.logoVariant === 'white' ? '/assets/Место, белый.svg' : '/assets/Место, черный.svg';
    const standIcon = colors.logoVariant === 'white' ? '/assets/Стенд, белый.svg' : '/assets/Стенд, черный.svg';

    const exhibitionName = presentation?.exhibitionName || 'Non/fiction';
    const bannerTitle = bannerType === 'book'
      ? `Моя книга на\u00A0${exhibitionName}!`
      : `Презентация моей книги на\u00A0${exhibitionName}!`;

    // Book cover dimensions differ between book and presentation types
    const coverLayout = bannerType === 'book'
      ? { x: 80, y: 496, w: 680, h: 960 }    // Figma: 8541:1262
      : { x: 80, y: 368, w: 624, h: 872 };    // Figma: 8335:1145

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1920,
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
            right: 64,
            top: 64,
            width: 130,
            height: 40,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSvg}
            alt="Rideró"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Banner title — x=80, top=88, PT Serif Bold 60px, w=664
             top=88 gives room for 3-line wrapping (88+216=304, matching Figma bottom-align at y=304) */}
        <p
          style={{
            position: 'absolute',
            left: 80,
            top: 88,
            width: 664,
            ...TYPOGRAPHY.title,
            fontWeight: 700,
            fontSize: 60,
            lineHeight: '72px',
            color: colors.text,
          }}
        >
          {bannerTitle}
        </p>

        {/* Figma: Date + Location + Stand row — x=80, y=336, h=48 (book type only) */}
        {bannerType === 'book' && (
          <div
            style={{
              position: 'absolute',
              left: 80,
              top: 336,
            }}
          >
            {/* Use inline-block groups instead of flex to avoid foreignObject issues */}
            {/* Date: icon 48x48 + text */}
            <div style={{ display: 'inline-block', verticalAlign: 'top', position: 'relative', paddingLeft: 64, marginRight: 32 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dateIcon} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
              <p
                style={{
                  ...TYPOGRAPHY.bold,
                  fontSize: 34,
                  lineHeight: '48px',
                  color: colors.text,
                  whiteSpace: 'nowrap',
                }}
              >
                {presentation?.date || '5–9 декабря'}
              </p>
            </div>

            {/* Location: icon 48x48 + text */}
            <div style={{ display: 'inline-block', verticalAlign: 'top', position: 'relative', paddingLeft: 64, marginRight: 32 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={locationIcon} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 34,
                  lineHeight: '48px',
                  color: colors.text,
                  whiteSpace: 'nowrap',
                }}
              >
                {presentation?.location || 'Москва, Гостиный двор'}
              </p>
            </div>

            {/* Stand: icon 48x48 + text */}
            <div style={{ display: 'inline-block', verticalAlign: 'top', position: 'relative', paddingLeft: 64 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={standIcon} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 34,
                  lineHeight: '48px',
                  color: colors.text,
                  whiteSpace: 'nowrap',
                }}
              >
                {presentation?.stand || 'Стенд Е-19'}
              </p>
            </div>
          </div>
        )}

        {/* Book cover */}
        <div
          style={{
            position: 'absolute',
            left: coverLayout.x,
            top: coverLayout.y,
            width: coverLayout.w,
            height: coverLayout.h,
            borderRadius: '2px 8px 8px 2px',
            boxShadow: SHADOWS.bookCoverLarge,
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

        {/* Right-side info — depends on banner type */}
        {bannerType === 'book' ? (
          /* Figma Book: QR card — x=712, y=1168, padding=32, radius=16 */
          <div
            style={{
              position: 'absolute',
              left: 712,
              top: 1168,
              padding: 32,
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              boxShadow: SHADOWS.cardLarge,
              zIndex: 2,
            }}
          >
            {/* "Сканируй и читай:" — PT Sans 28px, w=240 */}
            <p
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 28,
                lineHeight: '32px',
                color: '#000000',
                width: 240,
                marginBottom: 16,
              }}
            >
              Сканируй и читай:
            </p>
            {/* QR code — 240x240 */}
            <QRCodeSVG
              value={qrUrl}
              size={240}
              bgColor={colors.cardBg}
              fgColor="#000000"
              level="M"
            />
          </div>
        ) : (
          /* Figma Presentation: Info card — x=544, y=1160, w=488, padding=32, radius=16 */
          <div
            style={{
              position: 'absolute',
              left: 544,
              top: 1160,
              width: 488,
              padding: 32,
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              boxShadow: SHADOWS.cardLarge,
              zIndex: 2,
            }}
          >
            {/* Time — PT Serif Bold 72px */}
            {presentation?.time && (
              <p
                style={{
                  ...TYPOGRAPHY.title,
                  fontWeight: 700,
                  fontSize: 72,
                  lineHeight: '88px',
                  color: '#000000',
                  marginBottom: 32,
                }}
              >
                {presentation.time}
              </p>
            )}

            {/* Always use black icons on the white info card */}
            {/* Date — icon 48x48 + PT Sans Bold 34px */}
            <div style={{ position: 'relative', paddingLeft: 64, marginBottom: 32, minHeight: 48 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Дата, черный.svg" alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
              <p
                style={{
                  ...TYPOGRAPHY.bold,
                  fontSize: 34,
                  lineHeight: '48px',
                  color: '#000000',
                }}
              >
                {presentation?.date || '5 мая'}
              </p>
            </div>

            {/* Location — icon 48x48 + PT Sans 34px */}
            <div style={{ position: 'relative', paddingLeft: 64, marginBottom: 32, minHeight: 48 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Место, черный.svg" alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 34,
                  lineHeight: '48px',
                  color: '#000000',
                }}
              >
                {presentation?.location || 'Москва, Гостиный двор'}
              </p>
            </div>

            {/* Stand — icon 48x48 + PT Sans 34px */}
            <div style={{ position: 'relative', paddingLeft: 64, minHeight: 48 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Стенд, черный.svg" alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 34,
                  lineHeight: '48px',
                  color: '#000000',
                }}
              >
                {presentation?.stand || 'Стенд Е-19'}
              </p>
            </div>
          </div>
        )}

        {/* Figma: Annotation — x=80, y=1608 (book) / y=1600 (presentation), w=920, PT Sans 44px */}
        {annotation && (
          <p
            style={{
              position: 'absolute',
              left: 80,
              top: bannerType === 'book' ? 1608 : 1600,
              width: 920,
              ...TYPOGRAPHY.body,
              fontSize: 44,
              lineHeight: '56px',
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

VerticalBanner.displayName = 'VerticalBanner';
