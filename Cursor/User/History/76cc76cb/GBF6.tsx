import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../state/authStore';
import { useProgress } from '../state/progressStore';

export default function SettingsScreen() {
  const { signOut, userId } = useAuth();
  const { hydrate, setDailySpend, dailySpend, setStartDate, startDateISO } = useProgress();
  const [spendInput, setSpendInput] = useState(String(dailySpend));
  const [dateInput, setDateInput] = useState(startDateISO.split('T')[0]);
  useEffect(() => {
    hydrate().then(() => {
      setSpendInput(String(dailySpend));
      setDateInput(startDateISO.split('T')[0]);
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={{ color: colors.muted, marginBottom: 8 }}>User: {userId ?? 'Anonymous'}</Text>
      <Text style={styles.label}>Daily alcohol spend (estimate)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={spendInput}
        onChangeText={setSpendInput}
        onEndEditing={() => setDailySpend(Number(spendInput) || 0)}
      />
      <Text style={styles.label}>Sobriety start date</Text>
      <TextInput
        style={styles.input}
        value={dateInput}
        onChangeText={setDateInput}
        onEndEditing={() => setStartDate(new Date(dateInput).toISOString())}
        placeholder="YYYY-MM-DD"
      />
      <Button title="Sign out" onPress={signOut} color={colors.warning} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 12 },
  label: { color: colors.muted, marginTop: 8 },
  input: { backgroundColor: colors.card, borderRadius: 10, padding: 12, marginBottom: 10, color: colors.text },
});


