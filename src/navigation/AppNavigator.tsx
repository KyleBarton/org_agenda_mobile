import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { Clock, Inbox, Layers } from 'lucide-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { AgendaScreen } from '../screens/AgendaScreen';
import { CaptureScreen } from '../screens/CaptureScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    borderTopWidth: 0,
                    backgroundColor: 'transparent',
                    height: 80,
                },
                tabBarBackground: () => (
                    <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />
                ),
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text.secondary,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                    fontWeight: '600',
                }
            }}
        >
            <Tab.Screen
                name="Inbox"
                component={AgendaScreen}
                initialParams={{ filter: 'IN' }}
                options={{
                    tabBarIcon: ({ color, size }) => <Inbox color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Actionables"
                component={AgendaScreen}
                initialParams={{ filter: 'NEXTACTION' }}
                options={{
                    tabBarIcon: ({ color, size }) => <Layers color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Waiting"
                component={AgendaScreen}
                initialParams={{ filter: 'WAITINGFOR' }}
                options={{
                    tabBarLabel: 'Waiting',
                    tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Capture" component={CaptureScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
