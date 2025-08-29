import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { initNotifications } from '../lib/notifications-setup';

// Initialize notifications once at module load (guarded inside the function)
initNotifications();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="plant/[id]" options={{ title: 'Plant' }} />
      <Stack.Screen name="plant/edit" options={{ title: 'Edit plant' }} />
    </Stack>
  );
}

