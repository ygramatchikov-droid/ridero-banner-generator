export interface BookData {
  title: string;
  author: string;
  coverUrl: string;
  annotation: string;
  genre: string;
  bookUrl: string;
  freeFragmentUrl: string;
}

export interface PresentationData {
  time: string;        // e.g. "14:30–15:00"
  location: string;    // e.g. "Москва, Гостиный двор"
  stand: string;       // e.g. "Стенд Е-19"
}

export type BannerType = 'book' | 'presentation';

export type BannerFormat = 'square' | 'vertical';

export type ColorScheme = 'yellow' | 'orange' | 'green' | 'lightblue' | 'blue' | 'gray' | 'white';

export type BookStyle = 'flat' | '3d' | '3d-hardcover';

export interface BannerConfig {
  type: BannerType;
  formats: BannerFormat[];
  colorScheme: ColorScheme;
  bookStyle: BookStyle;
  book: BookData;
  presentation?: PresentationData;
}

export const FORMAT_DIMENSIONS: Record<BannerFormat, { width: number; height: number; label: string; description: string }> = {
  square: { width: 1080, height: 1080, label: 'Квадратный', description: 'Лента VK, Telegram, TenChat' },
  vertical: { width: 1080, height: 1920, label: 'Вертикальный', description: 'Истории VK, TenChat' },
};

// Color schemes from Figma design
// All schemes use black text (#000000) and white Ridero logo
// Decorative wave vectors match the background color with lighter opacity
export const COLOR_SCHEMES: Record<ColorScheme, {
  name: string;
  bg: string;
  wave: string;      // Color for decorative wave vectors
  text: string;
  textSecondary: string;
  cardBg: string;    // QR/info card background (always white)
  logoVariant: 'dark' | 'white';  // Ridero logo variant
}> = {
  yellow: {
    name: 'Жёлтый',
    bg: '#FFD84D',
    wave: '#FFE57A',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.4)',
    cardBg: '#FFFFFF',
    logoVariant: 'dark',
  },
  orange: {
    name: 'Оранжевый',
    bg: '#FF7E00',
    wave: '#FF9933',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.4)',
    cardBg: '#FFFFFF',
    logoVariant: 'white',
  },
  green: {
    name: 'Зелёный',
    bg: '#B8E4C8',
    wave: '#D0EFDC',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.4)',
    cardBg: '#FFFFFF',
    logoVariant: 'dark',
  },
  lightblue: {
    name: 'Голубой',
    bg: '#B8D4E8',
    wave: '#D0E4F0',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.4)',
    cardBg: '#FFFFFF',
    logoVariant: 'dark',
  },
  blue: {
    name: 'Синий',
    bg: '#7BA3D0',
    wave: '#9BBDE0',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.4)',
    cardBg: '#FFFFFF',
    logoVariant: 'white',
  },
  gray: {
    name: 'Серый',
    bg: '#E5E5E5',
    wave: '#F0F0F0',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.4)',
    cardBg: '#FFFFFF',
    logoVariant: 'dark',
  },
  white: {
    name: 'Белый',
    bg: '#FFFFFF',
    wave: '#F5F5F5',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.4)',
    cardBg: '#FFFFFF',
    logoVariant: 'dark',
  },
};

// Typography from Figma (PT Sans & PT Serif)
export const TYPOGRAPHY = {
  // PT Serif Bold - for titles and time
  title: {
    fontFamily: "'PT Serif', Georgia, serif",
    fontWeight: 700,
  },
  // PT Sans Bold - for author name, headings
  heading: {
    fontFamily: "'PT Sans', 'Helvetica Neue', sans-serif",
    fontWeight: 700,
  },
  // PT Sans Regular - for body text, location, stand
  body: {
    fontFamily: "'PT Sans', 'Helvetica Neue', sans-serif",
    fontWeight: 400,
  },
  // PT Sans Italic - for genre
  italic: {
    fontFamily: "'PT Sans', 'Helvetica Neue', sans-serif",
    fontWeight: 400,
    fontStyle: 'italic' as const,
  },
};

// Shadow styles from Figma
export const SHADOWS = {
  bookCover: '2px 2px 48px rgba(70, 84, 91, 0.2)',
  bookCoverLarge: '8px 8px 48px rgba(70, 84, 91, 0.2)',
  card: '2px 2px 48px rgba(70, 84, 91, 0.2)',
  cardLarge: '8px 8px 48px rgba(70, 84, 91, 0.2)',
};

// Book cover gradient overlay (simulates 3D book effect)
export const BOOK_COVER_OVERLAY = {
  multiply: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(21,21,20,0.3) 3.87%, rgba(255,255,255,0.3) 6.63%, rgba(148,148,148,0.3) 9.39%, rgba(227,227,227,0.3) 56.91%, rgba(223,218,218,0.3) 94.48%, rgba(223,218,218,0.3) 97.79%, rgba(255,255,255,0.3) 100%)',
  lighten: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 3.87%, rgba(255,255,255,0.15) 6.63%, rgba(255,255,255,0) 9.39%, rgba(255,255,255,0) 56.91%, rgba(255,255,255,0) 94.48%, rgba(255,255,255,0.05) 97.79%, rgba(255,255,255,0) 100%)',
};
