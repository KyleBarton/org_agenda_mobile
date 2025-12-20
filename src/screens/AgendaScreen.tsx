import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { PullToReveal } from '../components/PullToReveal';
import { ScreenContainer } from '../components/ScreenContainer';
import { TaskCard } from '../components/TaskCard';
import { Text } from '../components/Text';
import { mockTasks } from '../mock/tasks';
import { spacing } from '../theme';

type AgendaScreenRouteProp = RouteProp<{
    params: { filter?: 'IN' | 'NEXTACTION' | 'WAITINGFOR' };
}, 'params'>;

export const AgendaScreen = () => {
    const route = useRoute<AgendaScreenRouteProp>();
    const navigation = useNavigation();
    const filter = route.params?.filter;
    const isScrollAtTop = useSharedValue(true);

    // Filter tasks based on the route param
    const tasks = mockTasks.filter(t => {
        if (t.scheduled || t.deadline) return false;
        if (filter) return t.state === filter;
        return true;
    });

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
                    <Text variant="display">{getTitle()}</Text>
                    <Text variant="body" style={styles.date}>{format(new Date(), 'EEEE, MMMM do')}</Text>
                </View>

                <Animated.FlatList
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
        marginBottom: spacing.lg,
        marginTop: spacing.md,
        paddingHorizontal: spacing.md,
    },
    date: {
        opacity: 0.7,
        marginTop: spacing.xs,
    },
    listContent: {
        paddingBottom: spacing.xxl,
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
