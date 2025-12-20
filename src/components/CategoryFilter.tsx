import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Text } from './Text';

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <TouchableOpacity
                    style={[
                        styles.chip,
                        selectedCategory === null && styles.selectedChip,
                    ]}
                    onPress={() => onSelectCategory(null)}
                >
                    <Text
                        variant="caption"
                        style={[
                            styles.chipText,
                            selectedCategory === null && styles.selectedChipText,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>

                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.chip,
                            selectedCategory === category && styles.selectedChip,
                        ]}
                        onPress={() =>
                            onSelectCategory(selectedCategory === category ? null : category)
                        }
                    >
                        <Text
                            variant="caption"
                            style={[
                                styles.chipText,
                                selectedCategory === category && styles.selectedChipText,
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 16,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
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
