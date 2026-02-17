'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookData, BannerType, BannerFormat, ColorScheme, BookStyle, PresentationData } from './types';

interface BannerStore {
  // Step 1: URL
  bookUrl: string;
  setBookUrl: (url: string) => void;

  // Book data (from API)
  bookData: BookData | null;
  setBookData: (data: BookData | null) => void;

  // Editable fields
  editedTitle: string;
  editedAuthor: string;
  editedAnnotation: string;
  setEditedTitle: (title: string) => void;
  setEditedAuthor: (author: string) => void;
  setEditedAnnotation: (annotation: string) => void;

  // Step 2: Banner type
  bannerType: BannerType;
  setBannerType: (type: BannerType) => void;

  // Presentation data
  presentationData: PresentationData;
  setPresentationData: (data: Partial<PresentationData>) => void;

  // Step 3: Formats
  selectedFormats: BannerFormat[];
  toggleFormat: (format: BannerFormat) => void;

  // Step 4: Color scheme
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;

  // Book style (flat/3d)
  bookStyle: BookStyle;
  setBookStyle: (style: BookStyle) => void;

  // QR link (user-specified)
  qrUrl: string;
  setQrUrl: (url: string) => void;

  // Navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Reset
  reset: () => void;
}

const initialState = {
  bookUrl: '',
  bookData: null as BookData | null,
  editedTitle: '',
  editedAuthor: '',
  editedAnnotation: '',
  bannerType: 'book' as BannerType,
  presentationData: {
    exhibitionName: '',
    time: '',
    location: '',
    stand: '',
  },
  selectedFormats: ['square'] as BannerFormat[],
  colorScheme: 'white' as ColorScheme,
  bookStyle: 'flat' as BookStyle,
  qrUrl: '',
  currentStep: 1,
};

export const useBannerStore = create<BannerStore>()(
  persist(
    (set) => ({
      ...initialState,

      setBookUrl: (url) => set({ bookUrl: url }),

      setBookData: (data) => set({
        bookData: data,
        editedAnnotation: data?.annotation?.slice(0, 160) || '',
        qrUrl: data?.freeFragmentUrl || data?.bookUrl || '',
      }),

      setEditedTitle: (title) => set({ editedTitle: title }),
      setEditedAuthor: (author) => set({ editedAuthor: author }),
      setEditedAnnotation: (annotation) => set({ editedAnnotation: annotation.slice(0, 160) }),

      setBannerType: (type) => set({ bannerType: type }),

      setPresentationData: (data) => set((state) => ({
        presentationData: { ...state.presentationData, ...data },
      })),

      toggleFormat: (format) => set((state) => {
        const formats = state.selectedFormats.includes(format)
          ? state.selectedFormats.filter(f => f !== format)
          : [...state.selectedFormats, format];
        return { selectedFormats: formats };
      }),

      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      setBookStyle: (style) => set({ bookStyle: style }),

      qrUrl: '',
      setQrUrl: (url) => set({ qrUrl: url }),

      currentStep: 1,
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      reset: () => set(initialState),
    }),
    {
      name: 'ridero-banner-store',
    }
  )
);
