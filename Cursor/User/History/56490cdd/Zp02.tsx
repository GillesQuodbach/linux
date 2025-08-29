import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import { colors } from '../theme/colors';
import { getJournalLocal, saveJournalLocally, saveJournalRemote, JournalEntry } from '../services/journal';
import { useAuth } from '../state/authStore';

export default function JournalScreen() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    getJournalLocal().then(setEntries);
  }, []);

  const onSave = async () => {
    const record: Omit<JournalEntry, 'id'> = { text: entry, createdAt: Date.now() };
    await saveJournalLocally(record);
    if (userId) await saveJournalRemote(userId, entry);
    setEntry('');
    setEntries(await getJournalLocal());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal</Text>
      <Text style={styles.prompt}>How are you feeling today?</Text>
      <TextInput
        placeholder="Write your thoughts..."
        placeholderTextColor={colors.muted}
        value={entry}
        onChangeText={setEntry}
        multiline
        style={styles.input}
      />
      <Button title="Save" color={colors.primaryDark} onPress={onSave} />
      <FlatList
        style={{ marginTop: 16 }}
        data={entries}
        keyExtractor={(item) => String(item.createdAt)}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.entryDate}>{new Date(item.createdAt).toLocaleString()}</Text>
            <Text style={styles.entryText}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 12 },
  prompt: { color: colors.muted, marginBottom: 8 },
  input: {
    minHeight: 160,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    color: colors.text,
    marginBottom: 12,
  },
  entry: { backgroundColor: colors.card, borderRadius: 10, padding: 12, marginBottom: 10 },
  entryDate: { color: colors.muted, marginBottom: 6 },
  entryText: { color: colors.text },
});


