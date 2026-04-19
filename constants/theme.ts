/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1B8D4A';
const tintColorDark = '#8EE6B0';

export const Colors = {
  light: {
    text: '#0E2A1A',
    background: '#F3FAF5',
    tint: tintColorLight,
    icon: '#6B7B70',
    tabIconDefault: '#6B7B70',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    muted: '#DDEFE2',
    border: '#C8E4D2',
  },
  dark: {
    text: '#DDF7E8',
    background: '#0E1A13',
    tint: tintColorDark,
    icon: '#9CC7AD',
    tabIconDefault: '#9CC7AD',
    tabIconSelected: tintColorDark,
    card: '#16251D',
    muted: '#23392C',
    border: '#2E4A3A',
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
