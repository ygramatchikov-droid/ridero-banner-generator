'use client';

import { create } from 'zustand';
import { BookData, BannerType, BannerFormat, ColorScheme, BookStyle, PresentationData } from './types';

interface BannerStore {
  // Step 1: URL
  bookUrl: string;
  setBookUrl: (url: string) => void;

  // Book data (from API/mock)
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
  bookData: null,
  editedTitle: '',
  editedAuthor: '',
  editedAnnotation: '',
  bannerType: 'book' as BannerType,
  presentationData: { time: '', location: '', stand: '' },
  selectedFormats: ['square'] as BannerFormat[],
  colorScheme: 'yellow' as ColorScheme,
  bookStyle: '3d' as BookStyle,
  currentStep: 1,
};

export const useBannerStore = create<BannerStore>((set, get) => ({
  ...initialState,

  setBookUrl: (url) => set({ bookUrl: url }),

  setBookData: (data) => set({
    bookData: data,
    editedTitle: data?.title || '',
    editedAuthor: data?.author || '',
    editedAnnotation: data?.annotation || '',
  }),

  setEditedTitle: (title) => set({ editedTitle: title }),
  setEditedAuthor: (author) => set({ editedAuthor: author }),
  setEditedAnnotation: (annotation) => set({ editedAnnotation: annotation.slice(0, 200) }),

  setBannerType: (type) => set({ bannerType: type }),

  setPresentationData: (data) => set((state) => ({
    presentationData: { ...state.presentationData, ...data },
  })),

  toggleFormat: (format) => set((state) => {
    const formats = state.selectedFormats.includes(format)
      ? state.selectedFormats.filter(f => f !== format)
      : [...state.selectedFormats, format];
    return { selectedFormats: formats.length > 0 ? formats : [format] };
  }),

  setColorScheme: (scheme) => set({ colorScheme: scheme }),

  setBookStyle: (style) => set({ bookStyle: style }),

  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  reset: () => set(initialState),
}));
