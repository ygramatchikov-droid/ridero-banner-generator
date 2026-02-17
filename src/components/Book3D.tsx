'use client';

import { BookCover } from 'book-cover-3d';
import { BOOK_COVER_OVERLAY } from '@/lib/types';

interface Book3DHardcoverProps {
  coverUrl: string;
  alt: string;
  width: number;
  height: number;
  spineWidth?: number;
  angle?: number;
  scale?: number;
  bgColor?: string;
}

/**
 * 3D Hardcover Book using book-cover-3d library
 * Provides proper CSS 3D perspective with unified viewpoint
 * NOTE: Currently not used in UI (bookStyle selector removed),
 * but kept for potential future reactivation of the 3D feature.
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
  const thickness = width * 0.2 * scale;

  // Floor shadow: squashed ellipse
  const shadowWidth = w * 0.85;
  const shadowHeight = thickness * 0.5;

  return (
    <div
      style={{
        position: 'relative',
        width: w + thickness + 10 * scale,
        height: h + 30 * scale,
      }}
    >
      {/* Floor shadow - SVG ellipse with inline blur filter (preserves blend mode) */}
      <svg
        style={{
          position: 'absolute',
          bottom: -10 * scale,
          left: 0,
          width: (w + thickness) * 1.05,
          height: 40 * scale,
          mixBlendMode: 'multiply',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id={`floorBlur-${scale}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={8 * scale} />
          </filter>
        </defs>
        <ellipse
          cx={(w + thickness) * 0.525}
          cy={20 * scale}
          rx={shadowWidth * 0.6}
          ry={shadowHeight * 0.5}
          fill="black"
          fillOpacity={0.3}
          filter={`url(#floorBlur-${scale})`}
        />
      </svg>

      {/* 3D Book using library - only remove cover shadow, keep page edges */}
      <style>{`
        .book-no-shadow .book > :first-child {
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
          pagesOffset={16 * scale}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
        </BookCover>
      </div>
    </div>
  );
}
