import { useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlantStore } from '../../store/plants';

export default function PlantsScreen() {
  const router = useRouter();
  const plants = usePlantStore((s) => s.plants);
  const load = usePlantStore((s) => s.loadPlants);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/plant/${item.id}`)}>
            {item.photoUri ? <Image source={{ uri: item.photoUri }} style={styles.avatar} /> : null}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.cultureType === 'soil' ? 'Terre' : 'Hydroponie'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/plant/edit')}>
            <Text style={{ color: 'white', fontWeight: '700' }}>Ajouter une plante</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  avatar: { width: 56, height: 56, borderRadius: 12, marginRight: 12 },
  name: { fontSize: 18, fontWeight: '600' },
  meta: { color: '#666' },
  addBtn: {
    backgroundColor: '#0a7ea4',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
});

