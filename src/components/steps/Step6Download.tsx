'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { domToBlob } from 'modern-screenshot';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useBannerStore } from '@/lib/store';
import { Button } from '@/components/ui';
import { SquareBanner, VerticalBanner } from '@/components/templates';
import { BannerFormat, FORMAT_DIMENSIONS } from '@/lib/types';
import { extractBookSlug } from '@/lib/mock-books';
import { AlertIcon, CheckCircleIcon, ArchiveIcon, RefreshIcon } from '@/components/ui/Icons';

interface GeneratedBanner {
  format: BannerFormat;
  blob: Blob;
  previewUrl: string;
}

export function Step6Download() {
  const {
    bookData,
    bookUrl,
    bannerType,
    selectedFormats,
    colorScheme,
    presentationData,
    editedTitle,
    editedAuthor,
    editedAnnotation,
    qrUrl,
    reset,
    prevStep,
  } = useBannerStore();

  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedBanners, setGeneratedBanners] = useState<GeneratedBanner[]>([]);
  const [error, setError] = useState<string | null>(null);

  const squareRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);

  const bookSlug = extractBookSlug(bookUrl) || 'book';

  const refs: Record<BannerFormat, React.RefObject<HTMLDivElement | null>> = {
    square: squareRef,
    vertical: verticalRef,
  };

  // Wait for all images inside a container to load
  const waitForImages = useCallback(async (container: HTMLElement) => {
    const images = container.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );
  }, []);

  useEffect(() => {
    const generateBanners = async () => {
      if (!bookData) return;

      setIsGenerating(true);
      setError(null);

      // Wait for banner DOM to render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Wait for all images to load
      const containers = [squareRef.current, verticalRef.current].filter(Boolean) as HTMLElement[];
      await Promise.all(containers.map(waitForImages));

      // Extra delay for rendering (fonts, SVGs)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const banners: GeneratedBanner[] = [];

      for (const format of selectedFormats) {
        const ref = refs[format];
        if (!ref.current) continue;

        try {
          const { width, height } = FORMAT_DIMENSIONS[format];

          const blob = await domToBlob(ref.current, {
            width,
            height,
            scale: 1,
            style: {
              transform: 'none',
              transformOrigin: 'top left',
            },
            fetch: {
              requestInit: {
                mode: 'cors',
              },
              bypassingCache: true,
            },
          });

          if (!blob) throw new Error('Failed to create image blob');

          const previewUrl = URL.createObjectURL(blob);

          banners.push({
            format,
            blob,
            previewUrl,
          });
        } catch (err) {
          console.error(`Failed to generate ${format} banner:`, err);
          setError(`Ошибка при\u00A0генерации баннера. Попробуйте еще раз.`);
        }
      }

      setGeneratedBanners(banners);
      setIsGenerating(false);
    };

    generateBanners();

    // Cleanup object URLs on unmount
    return () => {
      generatedBanners.forEach((b) => URL.revokeObjectURL(b.previewUrl));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownloadSingle = (banner: GeneratedBanner) => {
    const { width, height, label } = FORMAT_DIMENSIONS[banner.format];
    const fileName = `${bookSlug}_${label.toLowerCase()}_${width}x${height}.png`;
    saveAs(banner.blob, fileName);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    generatedBanners.forEach((banner) => {
      const { width, height, label } = FORMAT_DIMENSIONS[banner.format];
      const fileName = `${bookSlug}_${label.toLowerCase()}_${width}x${height}.png`;
      zip.file(fileName, banner.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${bookSlug}_banners.zip`);
  };

  const handleReset = () => {
    reset();
  };

  const handleRetry = () => {
    prevStep();
  };

  if (!bookData) return null;

  const bannerProps = {
    book: bookData,
    colorScheme,
    bannerType,
    presentation: presentationData,
    title: editedTitle,
    author: editedAuthor,
    annotation: editedAnnotation,
    qrUrl,
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hidden render area for generation */}
      <div className="absolute left-[-9999px] top-0">
        {selectedFormats.includes('square') && (
          <SquareBanner ref={squareRef} {...bannerProps} scale={1} />
        )}
        {selectedFormats.includes('vertical') && (
          <VerticalBanner ref={verticalRef} {...bannerProps} scale={1} />
        )}
      </div>

      <div className="text-center mb-8">
        {isGenerating ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-[#FF7E00] border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'PT Serif', serif" }}>
              Генерируем баннеры...
            </h1>
            <p className="text-gray-600 text-lg">
              Это займет несколько секунд
            </p>
          </>
        ) : error ? (
          <>
            <div className="flex justify-center mb-4 text-red-500">
              <AlertIcon size={48} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'PT Serif', serif" }}>
              Что-то пошло не так
            </h1>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" size="lg" onClick={handleRetry}>Назад к{'\u00A0'}редактированию</Button>
              <Button size="lg" onClick={handleReset}>Начать заново</Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircleIcon size={48} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'PT Serif', serif" }}>
              Баннеры готовы!
            </h1>
            <p className="text-gray-600 text-lg">
              Скачайте баннеры для{'\u00A0'}публикации в{'\u00A0'}соцсетях
            </p>
          </>
        )}
      </div>

      {!isGenerating && !error && (
        <>
          {/* Banner previews */}
          <div className={`grid gap-6 mb-8 ${generatedBanners.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'max-w-sm mx-auto'}`}>
            {generatedBanners.map((banner) => {
              const { width, height, label, description } = FORMAT_DIMENSIONS[banner.format];

              return (
                <div
                  key={banner.format}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center text-center"
                >
                  <div className={`rounded-xl p-3 mb-4 w-full flex justify-center ${colorScheme === 'white' ? 'bg-gray-100' : 'bg-white'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={banner.previewUrl}
                      alt={label}
                      className="w-full h-auto sm:w-auto sm:max-h-56 rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900">{label}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {width}×{height}{'\u00A0'}px · {description}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadSingle(banner)}
                    className="w-full"
                  >
                    Скачать PNG
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            {generatedBanners.length > 1 && (
              <Button size="lg" onClick={handleDownloadAll} className="w-full">
                <span className="flex items-center justify-center gap-2">
                  <ArchiveIcon size={20} />
                  Скачать все (ZIP)
                </span>
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={handleReset} className="w-full">
              <span className="flex items-center justify-center gap-2">
                <RefreshIcon size={20} />
                Создать новый баннер
              </span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
