import React from 'react';
import { NavigationContainer, DefaultTheme, Theme as NavTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import ProgressScreen from '../screens/ProgressScreen';
import JournalScreen from '../screens/JournalScreen';
import MotivationScreen from '../screens/MotivationScreen';
import TipsScreen from '../screens/TipsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { useAuth } from '../state/authStore';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const navTheme: NavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    primary: colors.primary,
    border: colors.primary,
  },
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: 'transparent' },
        tabBarIcon: ({ color, size, focused, route }) => {
          const nameMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Progress: 'home',
            Journal: 'journal',
            Motivation: 'sparkles',
            Tips: 'bulb',
            Settings: 'settings',
          };
          const fallback: keyof typeof Ionicons.glyphMap = 'ellipse';
          const icon = nameMap[route.name] ?? fallback;
          return <Ionicons name={icon} color={color} size={size} />;
        },
      }}
    >
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Motivation" component={MotivationScreen} />
      <Tab.Screen name="Tips" component={TipsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <View />;
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Tabs" component={Tabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


