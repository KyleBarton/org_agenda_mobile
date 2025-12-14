import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Text } from '../components/Text';
import { addTask } from '../mock/tasks';
import { colors, spacing } from '../theme';

export const CaptureScreen = () => {
    const [text, setText] = useState('');
    const navigation = useNavigation();

    const handleSave = () => {
        if (!text.trim()) return;

        addTask({
            title: text.trim(),
            state: 'IN',
            tags: [],
            file: 'inbox.org',
            // No project
        });

        // Navigate back to Inbox
        // We need to type this properly in a real app, but for now:
        // @ts-ignore
        navigation.navigate('Main', { screen: 'Inbox', params: { filter: 'IN' } });
    };

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text variant="h3">Capture</Text>
                <TouchableOpacity onPress={handleSave} disabled={!text.trim()}>
                    <Text style={[styles.saveButton, !text.trim() && styles.disabled]}>Save</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <TextInput
                    style={styles.input}
                    placeholder="What's on your mind?"
                    placeholderTextColor={colors.text.tertiary}
                    multiline
                    autoFocus
                    value={text}
                    onChangeText={setText}
                    textAlignVertical="top"
                />
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
    },
    cancelButton: {
        color: colors.text.secondary,
        fontSize: 16,
    },
    saveButton: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flex: 1,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: colors.text.primary,
        padding: spacing.sm,
        textAlignVertical: 'top',
    },
});
