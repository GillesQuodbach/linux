import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const tips = [
  { title: 'Set a reminder', text: 'Schedule daily reminders to check in with yourself.' },
  { title: 'Avoid triggers', text: 'Identify places or situations that lead to cravings.' },
  { title: 'Plan alternatives', text: 'Have a calming tea, go for a walk, or call a friend.' },
];

export default function TipsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tips</Text>
      {tips.map((t) => (
        <View key={t.title} style={styles.card}>
          <Text style={styles.cardTitle}>{t.title}</Text>
          <Text style={styles.cardText}>{t.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 12 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 10 },
  cardTitle: { fontSize: 16, color: colors.primaryDark, fontWeight: '700' },
  cardText: { color: colors.text, marginTop: 6 },
});


