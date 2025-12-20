import * as Haptics from 'expo-haptics';
import { Check, Plus } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { colors, spacing } from '../theme';

interface PullToRevealProps {
    children: ReactNode;
    onTrigger: () => void;
    isScrollAtTop: SharedValue<boolean>;
}

const TRIGGER_DISTANCE = 120;
const AnimatedPlus = Animated.createAnimatedComponent(Plus);

export const PullToReveal: React.FC<PullToRevealProps> = ({ children, onTrigger, isScrollAtTop }) => {
    const translationY = useSharedValue(0);
    const isDragging = useSharedValue(false);
    const hasTriggered = useSharedValue(false);

    const pan = Gesture.Pan()
        .onUpdate((event) => {
            // Only allow pulling down if we are at the top
            if (isScrollAtTop.value && event.translationY > 0) {
                translationY.value = event.translationY * 0.6; // Damping
                isDragging.value = true;

                if (translationY.value > TRIGGER_DISTANCE && !hasTriggered.value) {
                    hasTriggered.value = true;
                    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
                } else if (translationY.value < TRIGGER_DISTANCE && hasTriggered.value) {
                    hasTriggered.value = false;
                }
            }
        })
        .onEnd(() => {
            isDragging.value = false;
            if (translationY.value > TRIGGER_DISTANCE) {
                runOnJS(onTrigger)();
            }
            translationY.value = withSpring(0, { damping: 15, stiffness: 100 });
            hasTriggered.value = false;
        })
        .simultaneousWithExternalGesture(
            { current: null } as any
        );

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translationY.value }],
        };
    });

    const iconContainerStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translationY.value,
            [0, TRIGGER_DISTANCE * 0.5, TRIGGER_DISTANCE],
            [0, 0.5, 1],
            Extrapolate.CLAMP
        );
        const scale = interpolate(
            translationY.value,
            [0, TRIGGER_DISTANCE],
            [0.5, 1.2],
            Extrapolate.CLAMP
        );
        const translateX = interpolate(
            translationY.value,
            [0, TRIGGER_DISTANCE],
            [-20, 0],
            Extrapolate.CLAMP
        );
        return {
            opacity,
            transform: [{ scale }, { translateX }],
        };
    });

    const greenIconStyle = useAnimatedStyle(() => {
        // Sudden transition
        const opacity = interpolate(
            translationY.value,
            [TRIGGER_DISTANCE - 10, TRIGGER_DISTANCE], // Sharp transition at the end
            [0, 1],
            Extrapolate.CLAMP
        );
        const scale = interpolate(
            translationY.value,
            [TRIGGER_DISTANCE - 10, TRIGGER_DISTANCE],
            [0.5, 1], // Pop effect
            Extrapolate.CLAMP
        );
        return {
            opacity,
            transform: [{ scale }]
        };
    });

    const greyIconStyle = useAnimatedStyle(() => {
        // Sudden transition
        const opacity = interpolate(
            translationY.value,
            [TRIGGER_DISTANCE - 10, TRIGGER_DISTANCE],
            [1, 0],
            Extrapolate.CLAMP
        );
        return { opacity };
    });

    // Horizontal fill animation
    const fillStyle = useAnimatedStyle(() => {
        const width = interpolate(
            translationY.value,
            [0, TRIGGER_DISTANCE],
            [0, 100],
            Extrapolate.CLAMP
        );

        return {
            width: `${width}%`,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.drawer}>
                {/* Background Fill */}
                <Animated.View style={[styles.fill, fillStyle]} />

                <Animated.View style={[styles.drawerContent, iconContainerStyle]}>
                    <Animated.View style={[StyleSheet.absoluteFillObject, greyIconStyle]}>
                        <Plus size={32} color={colors.text.secondary} strokeWidth={3} />
                    </Animated.View>
                    <Animated.View style={greenIconStyle}>
                        <Check size={32} color={colors.status.success} strokeWidth={4} />
                    </Animated.View>
                </Animated.View>
            </View>

            <GestureDetector gesture={pan}>
                <Animated.View style={[styles.content, animatedStyle]}>
                    {children}
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    drawer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        paddingTop: spacing.xl + spacing.lg, // Push text down a bit more
        zIndex: 0,
        backgroundColor: colors.background, // Base background
    },
    fill: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.primary + '15', // Light primary fill
        // If we want a solid contrast, maybe we use a stronger color?
        // User said "more in contrast".
        // Let's try a solid light grey for base, and a solid primary for fill?
        // Or just the fill on top of the base.
    },
    drawerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
    },
    content: {
        flex: 1,
        backgroundColor: colors.background,
        zIndex: 1,
    },
});
