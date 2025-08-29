import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../../state/authStore';
import { Link } from '@react-navigation/native';

export default function LoginScreen() {
  const { setAuth, hydrate } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    hydrate();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.uid) setAuth(true, user.uid);
    });
    return unsub;
  }, []);

  const onLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), password);
      await setAuth(true, res.user.uid);
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={onLogin} color={colors.primaryDark} />
      <View style={{ height: 12 }} />
      <Link to={{ screen: 'Register' }} style={{ color: colors.primaryDark }}>Create an account</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 120, paddingHorizontal: 20, backgroundColor: colors.background },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, marginBottom: 20 },
  input: { backgroundColor: colors.card, borderRadius: 10, padding: 12, marginBottom: 10, color: colors.text },
});


