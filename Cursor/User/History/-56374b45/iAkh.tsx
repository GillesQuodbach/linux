import { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { usePlantStore } from '@/store/plants';
import { evaluateHydroAlerts } from '@/lib/hydro';

export default function HydroScreen() {
  const plants = usePlantStore((s) => s.plants.filter((p) => p.cultureType === 'hydro'));
  const load = usePlantStore((s) => s.loadPlants);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 12 }}
      data={plants}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => {
        const alerts = evaluateHydroAlerts(item);
        return (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>pH: {item.hydro?.ph ?? '-'} | EC: {item.hydro?.ec ?? '-'} mS/cm</Text>
            {alerts.length > 0 ? (
              <View style={styles.alertBox}>
                {alerts.map((a) => (
                  <Text key={a} style={styles.alert}>• {a}</Text>
                ))}
              </View>
            ) : (
              <Text style={{ color: '#1b7f2a' }}>Paramètres OK</Text>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  alertBox: { backgroundColor: '#fff4f4', padding: 8, borderRadius: 8, marginTop: 8 },
  alert: { color: '#b00020' },
});

