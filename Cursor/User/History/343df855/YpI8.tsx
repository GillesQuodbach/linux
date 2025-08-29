import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { useProgress } from '../state/progressStore';

export default function ProgressScreen() {
  const { hydrate, daysSober, moneySaved } = useProgress();
  useEffect(() => {
    hydrate();
  }, []);
  const soberDays = daysSober();
  const weekData = [
    { day: 'M', value: 1 },
    { day: 'T', value: 1 },
    { day: 'W', value: 1 },
    { day: 'T', value: 1 },
    { day: 'F', value: 1 },
    { day: 'S', value: 1 },
    { day: 'S', value: 1 },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stop Drinking</Text>
      <View style={styles.cardLarge}>
        <Text style={styles.daysText}>{soberDays} DAYS SOBER</Text>
      </View>
      <Text style={styles.section}>PROGRESS</Text>
      <View style={styles.row}>
        <View style={[styles.card, { backgroundColor: colors.accent }]}>
          <Text style={styles.cardNumber}>{soberDays}</Text>
          <Text style={styles.cardLabel}>Past week</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.accent2 }]}>
          <Text style={styles.cardNumber}>${moneySaved()}</Text>
          <Text style={styles.cardLabel}>Money saved</Text>
        </View>
      </View>
      <VictoryChart theme={VictoryTheme.material} domainPadding={{ x: 12 }}>
        <VictoryBar data={weekData} x="day" y="value" style={{ data: { fill: colors.primary } }} />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: colors.background },
  title: { fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 16 },
  cardLarge: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  daysText: { fontSize: 28, color: colors.primaryDark, fontWeight: '700' },
  section: { color: colors.muted, fontWeight: '800', marginTop: 8, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, borderRadius: 16, padding: 16 },
  cardNumber: { fontSize: 22, fontWeight: '800', color: colors.surface },
  cardLabel: { fontSize: 14, color: colors.surface, marginTop: 8 },
});


