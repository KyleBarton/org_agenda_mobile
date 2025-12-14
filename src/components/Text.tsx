import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { colors, typography } from '../theme';

interface TextProps extends RNTextProps {
    variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
    color?: string;
    weight?: keyof typeof typography.weights;
    align?: TextStyle['textAlign'];
}

export const Text: React.FC<TextProps> = ({
    children,
    style,
    variant = 'body',
    color = colors.text.primary,
    weight,
    align,
    ...props
}) => {
    const getVariantStyle = (): TextStyle => {
        switch (variant) {
            case 'display':
                return { fontSize: typography.sizes.display, lineHeight: typography.lineHeights.display, fontWeight: typography.weights.bold };
            case 'h1':
                return { fontSize: typography.sizes.xxl, lineHeight: typography.lineHeights.xxl, fontWeight: typography.weights.bold };
            case 'h2':
                return { fontSize: typography.sizes.xl, lineHeight: typography.lineHeights.xl, fontWeight: typography.weights.semibold };
            case 'h3':
                return { fontSize: typography.sizes.lg, lineHeight: typography.lineHeights.lg, fontWeight: typography.weights.semibold };
            case 'body':
                return { fontSize: typography.sizes.md, lineHeight: typography.lineHeights.md, fontWeight: typography.weights.regular };
            case 'caption':
                return { fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.sm, fontWeight: typography.weights.regular, color: colors.text.secondary };
            case 'label':
                return { fontSize: typography.sizes.xs, lineHeight: typography.lineHeights.xs, fontWeight: typography.weights.medium, textTransform: 'uppercase', letterSpacing: 1 };
            default:
                return {};
        }
    };

    const textStyle: TextStyle = {
        color,
        textAlign: align,
        fontFamily: typography.fonts.body,
        ...getVariantStyle(),
        ...(weight ? { fontWeight: typography.weights[weight] } : {}),
    };

    return (
        <RNText style={[textStyle, style]} {...props}>
            {children}
        </RNText>
    );
};
