import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedRef,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { colors, spacing } from '../theme';
import { Text } from './Text';

interface TagFilterPanelProps {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
    isVisible: boolean;
}

export const TagFilterPanel: React.FC<TagFilterPanelProps> = ({
    tags,
    selectedTag,
    onSelectTag,
    isVisible,
}) => {
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);
    const listRef = useAnimatedRef<Animated.View>();

    useEffect(() => {
        if (isVisible) {
            height.value = withTiming(200); // Estimate or measure? Let's try auto-height if possible, but for now fixed max or simple animation
            opacity.value = withTiming(1);
        } else {
            height.value = withTiming(0);
            opacity.value = withTiming(0);
        }
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value === 0 ? 0 : 'auto', // Simple visibility toggle for now, or animate height properly
            opacity: opacity.value,
            overflow: 'hidden',
            marginBottom: isVisible ? spacing.md : 0,
        };
    });

    // For a smoother height animation, we'd need to measure the content. 
    // For this POC, let's just toggle opacity and display, or use a layout animation.
    // Actually, let's just use a simple conditional render in the parent or a simple view here.

    if (!isVisible && !selectedTag) return null;

    return (
        <View style={styles.container}>
            {/* Active Filter Indicator (Always visible if filter is active and panel is closed? No, user said panel expands) 
                Let's follow the plan: Panel expands to show tags.
            */}

            {isVisible && (
                <View style={styles.panel}>
                    <TouchableOpacity
                        style={[
                            styles.chip,
                            selectedTag === null && styles.selectedChip,
                        ]}
                        onPress={() => onSelectTag(null)}
                    >
                        <Text
                            variant="caption"
                            style={[
                                styles.chipText,
                                selectedTag === null && styles.selectedChipText,
                            ]}
                        >
                            All
                        </Text>
                    </TouchableOpacity>

                    {tags.map((tag) => (
                        <TouchableOpacity
                            key={tag}
                            style={[
                                styles.chip,
                                selectedTag === tag && styles.selectedChip,
                            ]}
                            onPress={() =>
                                onSelectTag(selectedTag === tag ? null : tag)
                            }
                        >
                            <Text
                                variant="caption"
                                style={[
                                    styles.chipText,
                                    selectedTag === tag && styles.selectedChipText,
                                ]}
                            >
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 100,
    },
    panel: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        backgroundColor: colors.background,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 16,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.xs,
    },
    selectedChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        color: colors.text.primary,
        fontWeight: '600',
    },
    selectedChipText: {
        color: colors.primaryForeground,
    },
});
