import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Clock, Inbox, Layers } from 'lucide-react-native';
import React from 'react';
import { OrgTask } from '../mock/tasks';
import { AgendaScreen } from '../screens/AgendaScreen';
import { CaptureScreen } from '../screens/CaptureScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
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

                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    backgroundColor: colors.background,
                    height: 80,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 8,
                },
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

export type RootStackParamList = {
    Agenda: undefined;
    TaskDetail: {
        task: OrgTask;
        breadcrumbs?: { id: string; title: string }[];
    };
};

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Capture" component={CaptureScreen} />
                <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ presentation: 'card', headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
