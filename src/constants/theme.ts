/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#121212',
    background: '#F8F7F2',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#B8F23E',
    textSecondary: '#6B6D66',
    primary: '#B8F23E',
    primaryForeground: '#121212',
    darkAnchor: '#121212',
    border: '#ECE9DF',
    card: '#FFFFFF',
    // Functional category badges for JobHub
    tagPurple: '#635BFF',
    tagYellow: '#F5C242',
    tagCoral: '#FF6B57',
    tagLime: '#B8F23E',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0E0F10',
    backgroundElement: '#1A1C1E',
    backgroundSelected: '#B8F23E',
    textSecondary: '#9E9E98',
    primary: '#B8F23E',
    primaryForeground: '#121212',
    darkAnchor: '#000000',
    border: '#26282B',
    card: '#1A1C1E',
    tagPurple: '#7B74FF',
    tagYellow: '#FCD34D',
    tagCoral: '#FF8A78',
    tagLime: '#B8F23E',
  },
} as const;

export const Radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
