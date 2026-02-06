'use client';

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
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
    bookStyle,
    presentationData,
    editedTitle,
    editedAuthor,
    editedAnnotation,
    reset,
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

  useEffect(() => {
    const generateBanners = async () => {
      if (!bookData) return;

      setIsGenerating(true);
      setError(null);

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const banners: GeneratedBanner[] = [];

      for (const format of selectedFormats) {
        const ref = refs[format];
        if (!ref.current) continue;

        try {
          const { width, height } = FORMAT_DIMENSIONS[format];

          const canvas = await html2canvas(ref.current, {
            width,
            height,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            logging: false,
          });

          const dataUrl = canvas.toDataURL('image/png');
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/png');
          });

          banners.push({
            format,
            blob,
            previewUrl: dataUrl,
          });
        } catch (err) {
          console.error(`Failed to generate ${format} banner:`, err);
          setError(`Ошибка при генерации баннера. Попробуйте ещё раз.`);
        }
      }

      setGeneratedBanners(banners);
      setIsGenerating(false);
    };

    generateBanners();
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

  if (!bookData) return null;

  const bannerProps = {
    book: bookData,
    colorScheme,
    bannerType,
    bookStyle,
    presentation: presentationData,
    title: editedTitle,
    author: editedAuthor,
    annotation: editedAnnotation,
    genre: bookData.genre,
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
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Генерируем баннеры...
            </h1>
            <p className="text-gray-600 text-lg">
              Это займёт несколько секунд
            </p>
          </>
        ) : error ? (
          <>
            <div className="flex justify-center mb-4 text-red-500">
              <AlertIcon size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Что-то пошло не так
            </h1>
            <p className="text-red-600 mb-6">{error}</p>
            <Button onClick={handleReset}>Попробовать снова</Button>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircleIcon size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Баннеры готовы!
            </h1>
            <p className="text-gray-600 text-lg">
              Скачайте баннеры для публикации в соцсетях
            </p>
          </>
        )}
      </div>

      {!isGenerating && !error && (
        <>
          {/* Banner previews */}
          <div className="grid gap-6 mb-8">
            {generatedBanners.map((banner) => {
              const { width, height, label, description } = FORMAT_DIMENSIONS[banner.format];

              return (
                <div
                  key={banner.format}
                  className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6"
                >
                  <div className="bg-gray-100 rounded-xl p-2 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={banner.previewUrl}
                      alt={label}
                      className="h-24 w-auto rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{label}</h3>
                    <p className="text-sm text-gray-500">
                      {width}×{height} px • {description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadSingle(banner)}
                  >
                    Скачать PNG
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Download all button */}
          {generatedBanners.length > 1 && (
            <div className="text-center mb-8">
              <Button size="lg" onClick={handleDownloadAll}>
                <span className="flex items-center gap-2">
                  <ArchiveIcon size={20} />
                  Скачать всё архивом (ZIP)
                </span>
              </Button>
            </div>
          )}

          {/* Create new button */}
          <div className="text-center">
            <Button variant="secondary" onClick={handleReset}>
              <span className="flex items-center gap-2">
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
