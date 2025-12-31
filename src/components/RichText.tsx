import { CheckSquare, Square } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';
import { Text } from './Text';

interface RichTextProps {
    content: string;
}

export const RichText: React.FC<RichTextProps> = ({ content }) => {
    if (!content) return null;

    const lines = content.split('\n');

    return (
        <View style={styles.container}>
            {lines.map((line, index) => {
                const trimmedLine = line.trim();

                // Checkbox: - [ ] or - [X]
                const checkboxMatch = trimmedLine.match(/^- \[( |X)\] (.*)/);
                if (checkboxMatch) {
                    const isChecked = checkboxMatch[1] === 'X';
                    const text = checkboxMatch[2];
                    return (
                        <View key={index} style={styles.listItem}>
                            {isChecked ? (
                                <CheckSquare size={18} color={colors.primary} style={styles.checkboxIcon} />
                            ) : (
                                <Square size={18} color={colors.text.tertiary} style={styles.checkboxIcon} />
                            )}
                            <Text variant="body" style={[styles.listText, isChecked && styles.checkedText]}>
                                {text}
                            </Text>
                        </View>
                    );
                }

                // Bullet list: - item
                const bulletMatch = trimmedLine.match(/^- (.*)/);
                if (bulletMatch) {
                    return (
                        <View key={index} style={styles.listItem}>
                            <View style={styles.bullet} />
                            <Text variant="body" style={styles.listText}>{bulletMatch[1]}</Text>
                        </View>
                    );
                }

                // Numbered list: 1. item
                const numberMatch = trimmedLine.match(/^(\d+)\. (.*)/);
                if (numberMatch) {
                    return (
                        <View key={index} style={styles.listItem}>
                            <Text variant="body" style={styles.number}>{numberMatch[1]}.</Text>
                            <Text variant="body" style={styles.listText}>{numberMatch[2]}</Text>
                        </View>
                    );
                }

                // Regular text
                return (
                    <Text key={index} variant="body" style={styles.text}>
                        {line}
                    </Text>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
    },
    text: {
        marginBottom: spacing.xs,
        lineHeight: 24,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 2,
        paddingLeft: spacing.xs,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.text.primary,
        marginTop: 9,
        marginRight: spacing.sm,
    },
    number: {
        marginRight: spacing.sm,
        fontWeight: 'bold',
        color: colors.text.primary,
        minWidth: 20,
        fontSize: 15,
        lineHeight: 24,
    },
    checkboxIcon: {
        marginTop: 3,
        marginRight: spacing.sm,
    },
    listText: {
        flex: 1,
        lineHeight: 24,
        fontSize: 15,
        fontStyle: 'italic',
    },
    checkedText: {
        textDecorationLine: 'line-through',
        color: colors.text.tertiary,
    },
});
