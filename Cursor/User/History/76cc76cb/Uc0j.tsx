import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../state/authStore';

export default function SettingsScreen() {
  const { signOut, userId } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={{ color: colors.muted, marginBottom: 8 }}>User: {userId ?? 'Anonymous'}</Text>
      <Button title="Sign out" onPress={signOut} color={colors.warning} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 12 },
});


