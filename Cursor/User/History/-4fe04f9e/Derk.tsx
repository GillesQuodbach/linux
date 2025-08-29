import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { usePlantStore } from '@/store/plants';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const plant = usePlantStore((s) => s.plants.find((p) => p.id === id));
  const load = usePlantStore((s) => s.loadPlants);

  useEffect(() => {
    load();
  }, [load]);

  if (!plant) {
    return (
      <View style={styles.center}> 
        <Text>Plante introuvable</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>{plant.name}</Text>
      <Text style={styles.meta}>Type: {plant.cultureType === 'soil' ? 'Terre' : 'Hydroponie'}</Text>
      {plant.cultureType === 'hydro' && plant.hydro ? (
        <View style={styles.card}>
          <Text style={styles.section}>Suivi Hydroponie</Text>
          <Text>pH actuel: {plant.hydro.ph}</Text>
          <Text>EC actuel: {plant.hydro.ec} mS/cm</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.section}>Courbe de croissance (exemple)</Text>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryLine data={[{x:1,y:10},{x:2,y:12},{x:3,y:15},{x:4,y:18}]} />
        </VictoryChart>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => router.push({ pathname: '/plant/edit', params: { id: plant.id } })}>
        <Text style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}>Modifier</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700' },
  meta: { color: '#666', marginBottom: 12 },
  section: { fontWeight: '600', fontSize: 16, marginBottom: 6 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginVertical: 12, elevation: 2 },
  btn: { backgroundColor: '#0a7ea4', padding: 14, borderRadius: 12, marginTop: 8 },
});

