'use client';

import { forwardRef, useRef, useState, useEffect } from 'react';
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

    // Hide QR when text block overflows into QR card area (book type only)
    const textBlockRef = useRef<HTMLDivElement>(null);
    const [hideQr, setHideQr] = useState(false);

    useEffect(() => {
      if (bannerType === 'book' && textBlockRef.current) {
        const textBottom = 168 + textBlockRef.current.scrollHeight;
        setHideQr(textBottom > 525);
      } else {
        setHideQr(false);
      }
    });

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1080,
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

        {/* Figma: Book cover — x=64, y=80, w=480, h=680 */}
        <div
          style={{
            position: 'absolute',
            left: 64,
            top: 80,
            width: 480,
            height: 680,
            borderRadius: '2px 8px 8px 2px',
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
              ref={textBlockRef}
              style={{
                position: 'absolute',
                left: 600,
                top: 168,
                width: 416,
              }}
            >
              {/* Exhibition title — PT Sans Bold 34px */}
              <p
                style={{
                  ...TYPOGRAPHY.bold,
                  fontSize: 34,
                  lineHeight: '48px',
                  color: colors.text,
                  marginBottom: 32,
                }}
              >
                {bannerTitle}
              </p>

              {/* Date — icon 48x48 + PT Sans Bold 34px */}
              <div style={{ position: 'relative', paddingLeft: 64, marginBottom: 32, minHeight: 48 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dateIcon} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
                <p
                  style={{
                    ...TYPOGRAPHY.bold,
                    fontSize: 34,
                    lineHeight: '48px',
                    color: colors.text,
                  }}
                >
                  {presentation?.date || '9–12 апреля'}
                </p>
              </div>

              {/* Location — icon 48x48 + PT Sans 34px */}
              <div style={{ position: 'relative', paddingLeft: 64, marginBottom: 32, minHeight: 48 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={locationIcon} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 34,
                    lineHeight: '48px',
                    color: colors.text,
                  }}
                >
                  {presentation?.location || 'Москва, Гостиный двор'}
                </p>
              </div>

              {/* Stand — icon 48x48 + PT Sans 34px */}
              <div style={{ position: 'relative', paddingLeft: 64, minHeight: 48 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={standIcon} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 34,
                    lineHeight: '48px',
                    color: colors.text,
                  }}
                >
                  {presentation?.stand || 'Стенд Е-32'}
                </p>
              </div>
            </div>

            {/* Figma Book: QR block — x=512, y=525, w=264, h=288, radius=8 */}
            {!hideQr && <div
              style={{
                position: 'absolute',
                left: 512,
                top: 525,
                width: 264,
                height: 288,
                backgroundColor: colors.cardBg,
                borderRadius: 8,
                boxShadow: SHADOWS.card,
                zIndex: 2,
                paddingTop: 16,
                paddingLeft: 32,
                paddingRight: 32,
                paddingBottom: 32,
              }}
            >
              <p
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 20,
                  lineHeight: '24px',
                  color: '#000000',
                  marginBottom: 16,
                  width: 200,
                  textAlign: 'left',
                }}
              >
                Сканируй и читай:
              </p>
              <QRCodeSVG
                value={qrUrl}
                size={200}
                bgColor={colors.cardBg}
                fgColor="#000000"
                level="M"
              />
            </div>}
          </>
        ) : (
          <>
            {/* Figma Presentation: Title — x=600, y=216, w=415, PT Sans Bold 34px */}
            <p
              style={{
                position: 'absolute',
                left: 600,
                top: 216,
                width: 415,
                ...TYPOGRAPHY.bold,
                fontSize: 34,
                lineHeight: '48px',
                color: colors.text,
              }}
            >
              {bannerTitle}
            </p>

            {/* Figma Presentation: Time — x=600, y=376, PT Serif Bold 60px */}
            <p
              style={{
                position: 'absolute',
                left: 600,
                top: 376,
                ...TYPOGRAPHY.title,
                fontWeight: 700,
                fontSize: 60,
                lineHeight: '72px',
                color: colors.text,
                whiteSpace: 'nowrap',
              }}
            >
              {presentation?.time || '14:30–15:00'}
            </p>

            {/* Figma Presentation: Date, Location & Stand — x=600, y=480, w=416 */}
            <div
              style={{
                position: 'absolute',
                left: 600,
                top: 480,
                width: 416,
              }}
            >
              {/* Date — icon 48x48 + PT Sans Bold 34px */}
              <div style={{ position: 'relative', paddingLeft: 64, marginBottom: 32, minHeight: 48 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dateIcon} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
                <p
                  style={{
                    ...TYPOGRAPHY.bold,
                    fontSize: 34,
                    lineHeight: '48px',
                    color: colors.text,
                  }}
                >
                  {presentation?.date || '9 апреля'}
                </p>
              </div>

              {/* Location — icon 48x48 + PT Sans 34px */}
              <div style={{ position: 'relative', paddingLeft: 64, marginBottom: 32, minHeight: 48 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={locationIcon} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 34,
                    lineHeight: '48px',
                    color: colors.text,
                  }}
                >
                  {presentation?.location || 'Москва, Гостиный двор'}
                </p>
              </div>

              {/* Stand — icon 48x48 + PT Sans 34px */}
              <div style={{ position: 'relative', paddingLeft: 64, minHeight: 48 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={standIcon} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48 }} />
                <p
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 34,
                    lineHeight: '48px',
                    color: colors.text,
                  }}
                >
                  {presentation?.stand || 'Стенд Е-32'}
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
              left: 64,
              top: 860,
              width: 930,
              ...TYPOGRAPHY.body,
              fontSize: 34,
              lineHeight: '48px',
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
