import { Link } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>PlantApp</Text>
      <View style={styles.card}>
        <Text style={styles.h2}>Résumé</Text>
        <Text>Vue d'ensemble des tâches: arrosage, fertilisation, pH/EC.</Text>
        <Link href="/(tabs)/plants">Gérer les plantes</Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: '#e9f5ec', borderRadius: 12, padding: 16, marginVertical: 12 },
  h1: { fontSize: 28, fontWeight: '700' },
  h2: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
});

