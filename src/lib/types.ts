export interface BookData {
  title: string;
  author: string;
  coverUrl: string;
  annotation: string;
  bookUrl: string;
  freeFragmentUrl: string;
}

export interface PresentationData {
  exhibitionName: string; // e.g. "Презентация моей книги на Non/fiction!"
  time: string;           // e.g. "14:30–15:00"
  location: string;       // e.g. "Москва, Гостиный двор"
  stand: string;          // e.g. "Стенд Е-19"
}

export type BannerType = 'book' | 'presentation';

export type BannerFormat = 'square' | 'vertical';

export type ColorScheme = 'white' | 'dark' | 'lightblue' | 'yellow' | 'mint' | 'pink';

export type BookStyle = 'flat' | '3d-hardcover';

export const FORMAT_DIMENSIONS: Record<BannerFormat, { width: number; height: number; label: string; description: string }> = {
  square: { width: 1080, height: 1080, label: 'Квадратный', description: 'Лента VK, Telegram, TenChat' },
  vertical: { width: 1080, height: 1920, label: 'Вертикальный', description: 'Истории VK, TenChat' },
};

// Color schemes from Nonfik Spring 2026 design
// Most schemes use black text and dark logo, except dark theme uses white text and white logo
export const COLOR_SCHEMES: Record<ColorScheme, {
  name: string;
  bg: string;
  wave: string;      // Color for decorative wave vectors
  text: string;
  textSecondary: string;
  cardBg: string;    // QR/info card background (always white)
  logoVariant: 'dark' | 'white';  // Rideró logo variant
}> = {
  white: {
    name: 'Белый',
    bg: '#FFFFFF',
    wave: '#FBEAD7',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.6)',
    cardBg: '#FFFFFF',
    logoVariant: 'dark',
  },
  dark: {
    name: 'Темный',
    bg: '#212936',
    wave: 'rgba(255,255,255,0.1)',
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.6)',
    cardBg: '#FFFFFF',
    logoVariant: 'white',
  },
  lightblue: {
    name: 'Голубой',
    bg: '#C5DFFF',
    wave: '#B0D4FF',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.6)',
    cardBg: '#FFFFFF',
    logoVariant: 'dark',
  },
  yellow: {
    name: 'Желтый',
    bg: '#FCF4CB',
    wave: '#F7E0BD',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.6)',
    cardBg: '#FFFFFF',
    logoVariant: 'dark',
  },
  mint: {
    name: 'Мятный',
    bg: '#C8F2D8',
    wave: '#B0E9C6',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.6)',
    cardBg: '#FFFFFF',
    logoVariant: 'dark',
  },
  pink: {
    name: 'Розовый',
    bg: '#FFD6EB',
    wave: '#FFC0E0',
    text: '#000000',
    textSecondary: 'rgba(0,0,0,0.6)',
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
  // PT Sans Bold — for exhibition name, headings on banners
  bold: {
    fontFamily: "'PT Sans', 'Helvetica Neue', sans-serif",
    fontWeight: 700,
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
