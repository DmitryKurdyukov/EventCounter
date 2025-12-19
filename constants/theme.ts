/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const primaryColor = '#0C66FE';
export const secondaryColorLight = 'rgba(0,0,0,0.03)';
export const secondaryColorDark = '#48484A';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 8, // minimum taps, spacing between icons
  sm: 12, // inside widgets, small buttons, icon-text
  md: 16, // standard padding (everywhere!)
  lg: 20, // between sections, between cards
  xl: 24, // under headings, large spaces
  xxl: 32, // side screen margins, large blocks
  xxxl: 40, // Liquid Glass panels, floating controls
} as const;

export const Radius = {
  xs: 12, // chips and small items — the new standard for Liquid Glass
  sm: 14, // inputs and segmented elements
  md: 18, // base radius 2025 — use it everywhere for cards/buttons!
  lg: 20, // avatars and middle blocks
  xl: 28, // floating elements (with Liquid Glass blur)
  xxl: 32, // Neural Glass style (for backgrounds and scenes)
  full: 9999, // circles
};
