import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '../theme/colors';

const sampleQuotes = [
  'Every day is a new beginning.',
  'Take a deep breath and start again.',
  'You are stronger than your cravings.',
];

export default function MotivationScreen() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quote = sampleQuotes[quoteIndex % sampleQuotes.length];

  // Notifications temporarily disabled for Expo Go SDK 53
  const schedule = async () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motivation</Text>
      <View style={styles.card}>
        <Text style={styles.quote}>“{quote}”</Text>
      </View>
      <View style={{ height: 8 }} />
      <Button title="New quote" onPress={() => setQuoteIndex((i) => i + 1)} color={colors.primaryDark} />
      <View style={{ height: 8 }} />
      {/* Notifications disabled in Expo Go. Use a dev build to enable. */}
      <Button title="Schedule daily quote (use dev build)" onPress={schedule} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16 },
  quote: { fontSize: 18, color: colors.text },
});



