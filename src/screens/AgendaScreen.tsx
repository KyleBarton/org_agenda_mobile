import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { Filter, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { PullToReveal } from '../components/PullToReveal';
import { ScreenContainer } from '../components/ScreenContainer';
import { TagFilterPanel } from '../components/TagFilterPanel';
import { TaskCard } from '../components/TaskCard';
import { Text } from '../components/Text';
import { mockTasks } from '../mock/tasks';
import { colors, spacing } from '../theme';

type AgendaScreenRouteProp = RouteProp<{
    params: { filter?: 'IN' | 'NEXTACTION' | 'WAITINGFOR' };
}, 'params'>;

export const AgendaScreen = () => {
    const route = useRoute<AgendaScreenRouteProp>();
    const navigation = useNavigation();
    const filter = route.params?.filter;
    const isScrollAtTop = useSharedValue(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [recentTags, setRecentTags] = useState<string[]>([]);

    // Filter tasks based on the route param
    const baseTasks = mockTasks.filter(t => {
        if (t.scheduled || t.deadline) return false;
        if (filter) return t.state === filter;
        return true;
    });

    // Extract unique categories (tags) from baseTasks
    const categories = useMemo(() => {
        const uniqueCategories = new Set<string>();
        baseTasks.forEach(task => {
            if (task.tags) {
                task.tags.forEach(tag => uniqueCategories.add(tag));
            }
        });
        return Array.from(uniqueCategories).sort();
    }, [baseTasks]);

    // Sort categories: Recent ones first, then alphabetical
    const sortedCategories = useMemo(() => {
        const recent = recentTags.filter(tag => categories.includes(tag));
        const others = categories.filter(tag => !recent.includes(tag));
        return [...recent, ...others];
    }, [categories, recentTags]);

    // Apply category filter
    const tasks = useMemo(() => {
        if (!selectedCategory) return baseTasks;
        return baseTasks.filter(t => t.tags && t.tags.includes(selectedCategory));
    }, [baseTasks, selectedCategory]);

    const flatListRef = useAnimatedRef<any>();

    // ... existing code ...

    const handleSelectTag = (tag: string | null) => {
        setSelectedCategory(tag);
        if (tag) {
            setRecentTags(prev => {
                const newRecent = prev.filter(t => t !== tag);
                return [tag, ...newRecent].slice(0, 5); // Keep top 5
            });
            setIsFilterVisible(false); // Auto-close panel
        }
        // Scroll to top when filter changes
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    // ... existing code ...



    const getTitle = () => {
        switch (filter) {
            case 'IN': return 'Inbox';
            case 'NEXTACTION': return 'Actionables';
            case 'WAITINGFOR': return 'Waiting';
            default: return 'Tasks';
        }
    };

    const onTrigger = () => {
        navigation.navigate('Capture' as never);
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            isScrollAtTop.value = event.contentOffset.y <= 0;
        },
    });

    return (
        <ScreenContainer>
            <PullToReveal onTrigger={onTrigger} isScrollAtTop={isScrollAtTop}>
                <View style={styles.header}>
                    <View>
                        <Text variant="display">{getTitle()}</Text>
                        <Text variant="body" style={styles.date}>{format(new Date(), 'EEEE, MMMM do')}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setIsFilterVisible(!isFilterVisible)}
                        style={[styles.filterButton, (isFilterVisible || selectedCategory) && styles.filterButtonActive]}
                    >
                        <Filter
                            color={(isFilterVisible || selectedCategory) ? colors.primary : colors.text.primary}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>

                {/* Active Filter Chip */}
                {selectedCategory && (
                    <View style={styles.activeFilterContainer}>
                        <TouchableOpacity
                            style={styles.activeFilterChip}
                            onPress={() => setSelectedCategory(null)}
                        >
                            <Text variant="caption" style={styles.activeFilterText}>{selectedCategory}</Text>
                            <X size={14} color={colors.primaryForeground} style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>
                )}

                <TagFilterPanel
                    tags={sortedCategories}
                    selectedTag={selectedCategory}
                    onSelectTag={handleSelectTag}
                    isVisible={isFilterVisible}
                />

                <Animated.FlatList
                    ref={flatListRef}
                    style={{ flex: 1 }}
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TaskCard task={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text variant="body" style={styles.emptyText}>No tasks found.</Text>
                            <Text variant="caption" style={{ marginTop: spacing.sm, opacity: 0.5 }}>Pull down to capture</Text>
                        </View>
                    }
                />
            </PullToReveal>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: spacing.sm, // Reduced margin to fit chip
        marginTop: spacing.md,
        paddingHorizontal: spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    date: {
        opacity: 0.7,
        marginTop: spacing.xs,
    },
    filterButton: {
        padding: spacing.sm,
        borderRadius: 8,
        backgroundColor: colors.background,
    },
    filterButtonActive: {
        backgroundColor: colors.primary + '15', // Light primary background
    },
    activeFilterContainer: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        flexDirection: 'row',
    },
    activeFilterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 16,
    },
    activeFilterText: {
        color: colors.primaryForeground,
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: spacing.xxl + 80, // Add space for bottom tab bar
        paddingHorizontal: spacing.md,
        minHeight: '100%',
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        opacity: 0.5,
    }
});
