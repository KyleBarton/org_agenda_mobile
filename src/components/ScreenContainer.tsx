import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { GradientBackground } from './GradientBackground';

interface ScreenContainerProps extends SafeAreaViewProps {
    children: React.ReactNode;
    contentContainerStyle?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    style,
    contentContainerStyle,
    ...props
}) => {
    return (
        <GradientBackground>
            <SafeAreaView style={[styles.safeArea, style]} {...props}>
                <View style={[styles.content, contentContainerStyle]}>
                    {children}
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
