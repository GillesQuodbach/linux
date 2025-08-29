import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initNotifications } from '../lib/notifications-setup';

export default function RootLayout() {
  useEffect(() => {
    initNotifications();
  }, []);
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="plant/[id]" options={{ title: 'Plant' }} />
      <Stack.Screen name="plant/edit" options={{ title: 'Edit plant' }} />
    </Stack>
  );
}

