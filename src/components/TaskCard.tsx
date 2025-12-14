import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { OrgTask } from '../mock/tasks';
import { borderRadius, colors, spacing } from '../theme';
import { Text } from './Text';

interface TaskCardProps {
    task: OrgTask;
    onPress?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
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

    const getStateLabel = (state: string) => {
        switch (state) {
            case 'IN': return 'Inbox';
            case 'NEXTACTION': return 'Next Action';
            case 'WAITINGFOR': return 'Waiting';
            case 'SOMEDAYMAYBE': return 'Someday/Maybe';
            case 'DONE': return 'Done';
            default: return state;
        }
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.wrapper}>
            <BlurView intensity={20} tint="light" style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.stateContainer}>
                        <Text variant="label" style={{ color: getStateColor(task.state) }}>
                            {getStateLabel(task.state)}
                        </Text>
                    </View>
                    <Text variant="caption" style={styles.file}>{task.file}</Text>
                </View>

                <Text variant="body" weight="medium" style={styles.title}>{task.title}</Text>

                <View style={styles.footer}>
                    <View style={styles.tags}>
                        {task.tags.map(tag => (
                            <View key={tag} style={styles.tag}>
                                <Text variant="caption" style={styles.tagText}>:{tag}:</Text>
                            </View>
                        ))}
                    </View>
                    <Text variant="caption" style={styles.project}>{task.project || 'Misc'}</Text>
                </View>
            </BlurView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    container: {
        padding: spacing.md,
        backgroundColor: 'rgba(255,255,255,0.5)', // More opaque for light theme
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    stateContainer: {
        flexDirection: 'row',
    },
    title: {
        marginBottom: spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tags: {
        flexDirection: 'row',
    },
    tag: {
        marginRight: spacing.xs,
    },
    tagText: {
        color: colors.primary,
    },
    file: {
        opacity: 0.7,
    },
    project: {
        fontStyle: 'italic',
        color: colors.text.tertiary,
    },
});
