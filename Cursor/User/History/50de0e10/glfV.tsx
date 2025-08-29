import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import { auth } from '../../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from '../../state/authStore';
import { Link } from '@react-navigation/native';

export default function RegisterScreen() {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onRegister = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name) await updateProfile(res.user, { displayName: name });
      await setAuth(true, res.user.uid);
    } catch (e: any) {
      Alert.alert('Registration failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Register" onPress={onRegister} color={colors.primaryDark} />
      <View style={{ height: 12 }} />
      <Link to={{ screen: 'Login' }} style={{ color: colors.primaryDark }}>I already have an account</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 100, paddingHorizontal: 20, backgroundColor: colors.background },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, marginBottom: 20 },
  input: { backgroundColor: colors.card, borderRadius: 10, padding: 12, marginBottom: 10, color: colors.text },
});


