import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#121212',
    textSecondary: '#5A5D54',
    textMuted: '#8A8D84',
    background: '#F4F6F0',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#B8F23E',
    primary: '#B8F23E',
    primaryForeground: '#121212',
    darkAnchor: '#121212',
    border: '#E2E6DC',
    card: '#FFFFFF',
    cardMuted: '#EDF1E7',
    tagBackground: '#EAEFE2',
    tagText: '#121212',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#A0A49B',
    textMuted: '#71756D',
    background: '#0F100E',
    backgroundElement: '#181A16',
    backgroundSelected: '#B8F23E',
    primary: '#B8F23E',
    primaryForeground: '#121212',
    darkAnchor: '#000000',
    border: '#242821',
    card: '#181A16',
    cardMuted: '#20241D',
    tagBackground: '#242A1D',
    tagText: '#B8F23E',
  },
} as const;

export const Radius = {
  xs: 6,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 28,
  eight: 32,
  nine: 36,
  ten: 40,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'Georgia',
    rounded: 'system-ui',
    mono: 'Menlo',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, Cambria, 'Times New Roman', Times, serif",
    rounded: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', monospace",
  },
});
