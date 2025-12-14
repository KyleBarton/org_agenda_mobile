import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB } from '../components/FAB';
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

    // Filter tasks based on the route param
    const tasks = mockTasks.filter(t => {
        // Basic filter: no scheduled/deadline (as per previous request)
        if (t.scheduled || t.deadline) return false;

        // Status filter
        if (filter) {
            return t.state === filter;
        }

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

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text variant="display">{getTitle()}</Text>
                <Text variant="body" style={styles.date}>{format(new Date(), 'EEEE, MMMM do')}</Text>
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TaskCard task={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text variant="body" style={styles.emptyText}>No tasks found.</Text>
                    </View>
                }
            />
            <FAB onPress={() => navigation.navigate('Capture' as never)} />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: spacing.lg,
        marginTop: spacing.md,
    },
    date: {
        opacity: 0.7,
        marginTop: spacing.xs,
    },
    listContent: {
        paddingBottom: spacing.xxl,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        opacity: 0.5,
    }
});
