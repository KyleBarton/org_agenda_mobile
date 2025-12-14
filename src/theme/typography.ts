import { Platform } from 'react-native';

export const typography = {
    fonts: {
        // We'll use system fonts for now, but set up for custom fonts later
        display: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
        body: Platform.select({ ios: 'System', android: 'sans-serif' }),
        mono: Platform.select({ ios: 'Courier New', android: 'monospace' }),
    },
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 30,
        display: 42,
    },
    weights: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    lineHeights: {
        xs: 16,
        sm: 20,
        md: 24,
        lg: 28,
        xl: 28,
        xxl: 32,
        xxxl: 36,
        display: 48,
    }
} as const;
