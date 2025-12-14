import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme';

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" backgroundColor={colors.background} />
            <AppNavigator />
        </SafeAreaProvider>
    );
}
