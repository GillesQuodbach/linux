import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { colors } from '../theme/colors';

export default function JournalScreen() {
  const [entry, setEntry] = useState('');
  const onSave = () => {
    // Placeholder: later save to Firestore
    setEntry('');
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
});


