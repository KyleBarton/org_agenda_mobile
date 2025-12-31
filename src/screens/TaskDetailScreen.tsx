import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { Calendar, ChevronDown, ChevronLeft, ChevronUp, Circle, Clock, Tag } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RichText } from '../components/RichText';
import { ScreenContainer } from '../components/ScreenContainer';
import { TaskCard } from '../components/TaskCard';
import { Text } from '../components/Text';
import { LogEntry, OrgTask } from '../mock/tasks';
import { colors, spacing } from '../theme';

type TaskDetailRouteProp = RouteProp<{
    params: { task: OrgTask };
}, 'params'>;

export const TaskDetailScreen = () => {
    const route = useRoute<TaskDetailRouteProp>();
    const navigation = useNavigation();
    const { task } = route.params;
    const [isLogbookExpanded, setIsLogbookExpanded] = useState(false);

    const getStateColor = (state: string) => {
        switch (state) {
            case 'IN': return colors.status.info;
            case 'NEXTACTION': return colors.status.warning;
            case 'WAITINGFOR': return colors.status.error;
            case 'SOMEDAYMAYBE': return colors.text.secondary;
            case 'DONE': return colors.status.success;
            default: return colors.text.primary;
        }
    };

    const renderLog = (log: LogEntry, index: number) => (
        <View key={index} style={styles.logEntry}>
            <View style={styles.logTimeline}>
                <View style={styles.logDot} />
                <View style={styles.logLine} />
            </View>
            <View style={styles.logContent}>
                <Text variant="caption" style={styles.logDate}>
                    {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                </Text>
                {log.type === 'STATE_CHANGE' && (
                    <Text variant="body" style={styles.logText}>
                        State changed from <Text style={{ fontWeight: 'bold' }}>{log.from}</Text> to <Text style={{ fontWeight: 'bold' }}>{log.to}</Text>
                    </Text>
                )}
                {log.type === 'NOTE' && (
                    <Text variant="body" style={styles.logText}>
                        Note added
                    </Text>
                )}
            </View>
        </View>
    );

    const renderChild = (child: OrgTask) => (
        <View key={child.id} style={styles.childTask}>
            <View style={styles.childHeader}>
                <Circle size={12} color={colors.text.secondary} style={{ marginTop: 4, marginRight: 8 }} />
                <Text variant="body">{child.title}</Text>
            </View>
            {child.children && child.children.length > 0 && (
                <View style={styles.nestedChildren}>
                    {child.children.map(renderChild)}
                </View>
            )}
        </View>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text.primary} />
                </TouchableOpacity>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.breadcrumbs}>
                    <TouchableOpacity onPress={() => (navigation as any).popToTop()}>
                        <Text variant="caption" style={styles.breadcrumbText}>Home</Text>
                    </TouchableOpacity>
                    {(route.params as any).breadcrumbs?.map((crumb: any, index: number) => {
                        const breadcrumbs = (route.params as any).breadcrumbs;
                        const popCount = breadcrumbs.length - index;

                        return (
                            <React.Fragment key={index}>
                                <Text variant="caption" style={styles.breadcrumbSeparator}> / </Text>
                                <TouchableOpacity onPress={() => (navigation as any).pop(popCount)}>
                                    <Text variant="caption" style={styles.breadcrumbText} numberOfLines={1}>
                                        {crumb.title.length > 15 ? crumb.title.substring(0, 15) + '...' : crumb.title}
                                    </Text>
                                </TouchableOpacity>
                            </React.Fragment>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.titleContainer}>
                    <Text variant="h2" style={styles.title}>{task.title}</Text>
                    {task.project && (
                        <Text variant="body" style={styles.project}>{task.project}</Text>
                    )}
                </View>

                <View style={styles.metaContainer}>
                    {task.state && (
                        <View style={[styles.stateBadge, { backgroundColor: getStateColor(task.state) + '20' }]}>
                            <Text variant="label" style={{ color: getStateColor(task.state) }}>{task.state}</Text>
                        </View>
                    )}
                    {task.tags && task.tags.map(tag => (
                        <View key={tag} style={styles.tagBadge}>
                            <Tag size={12} color={colors.text.secondary} style={{ marginRight: 4 }} />
                            <Text variant="caption" style={{ color: colors.text.secondary }}>{tag}</Text>
                        </View>
                    ))}
                </View>

                {(task.scheduled || task.deadline) && (
                    <View style={styles.datesContainer}>
                        {task.scheduled && (
                            <View style={styles.dateRow}>
                                <Calendar size={16} color={colors.status.success} style={{ marginRight: 8 }} />
                                <Text variant="body">Scheduled: {format(new Date(task.scheduled), 'MMM d, yyyy')}</Text>
                            </View>
                        )}
                        {task.deadline && (
                            <View style={styles.dateRow}>
                                <Clock size={16} color={colors.status.error} style={{ marginRight: 8 }} />
                                <Text variant="body">Deadline: {format(new Date(task.deadline), 'MMM d, yyyy')}</Text>
                            </View>
                        )}
                    </View>
                )}

                {task.body && (
                    <View style={styles.section}>
                        <RichText content={task.body} />
                    </View>
                )}

                {task.children && task.children.length > 0 && (
                    <View style={styles.section}>
                        <Text variant="label" style={styles.sectionTitle}>Headings</Text>
                        <View style={styles.childrenContainer}>
                            {task.children.map(child => (
                                <TaskCard
                                    key={child.id}
                                    task={child}
                                    onPress={() => (navigation as any).push('TaskDetail', {
                                        task: child,
                                        breadcrumbs: [...((route.params as any).breadcrumbs || []), { id: task.id, title: task.title }]
                                    })}
                                    showBody={true}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {task.logs && task.logs.length > 0 && (
                    <View style={styles.section}>
                        <TouchableOpacity
                            onPress={() => setIsLogbookExpanded(!isLogbookExpanded)}
                            style={styles.sectionHeader}
                        >
                            {isLogbookExpanded ? (
                                <ChevronUp size={16} color={colors.text.secondary} />
                            ) : (
                                <ChevronDown size={16} color={colors.text.secondary} />
                            )}
                            <Text variant="label" style={styles.sectionTitle}>Logbook</Text>
                        </TouchableOpacity>
                        {isLogbookExpanded && (
                            <View style={styles.logsContainer}>
                                {task.logs.map(renderLog)}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    breadcrumbs: {
        flex: 1,
    },
    breadcrumbText: {
        color: colors.text.secondary,
    },
    breadcrumbSeparator: {
        color: colors.text.tertiary,
        marginHorizontal: spacing.xs,
    },
    content: {
        padding: spacing.md,
        paddingBottom: spacing.xxl,
    },
    titleContainer: {
        marginBottom: spacing.md,
    },
    title: {
        marginBottom: spacing.xs,
    },
    project: {
        color: colors.text.tertiary,
        fontStyle: 'italic',
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    stateBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 16,
    },
    tagBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 16,
    },
    datesContainer: {
        backgroundColor: colors.background,
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.xs,
    },
    sectionTitle: {
        color: colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    childrenContainer: {
        paddingLeft: spacing.sm,
    },
    childTask: {
        marginBottom: spacing.sm,
    },
    childHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    nestedChildren: {
        paddingLeft: spacing.lg,
        marginTop: spacing.sm,
        borderLeftWidth: 1,
        borderLeftColor: colors.border,
    },
    logsContainer: {
        paddingLeft: spacing.sm,
    },
    logEntry: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    logTimeline: {
        alignItems: 'center',
        marginRight: spacing.md,
        width: 16,
    },
    logDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border,
        marginBottom: 4,
    },
    logLine: {
        width: 1,
        flex: 1,
        backgroundColor: colors.border,
    },
    logContent: {
        flex: 1,
        paddingBottom: spacing.sm,
    },
    logDate: {
        color: colors.text.tertiary,
        marginBottom: 2,
    },
    logText: {
        color: colors.text.secondary,
    },
    bodyText: {
        lineHeight: 24,
        color: colors.text.primary,
    },
});
