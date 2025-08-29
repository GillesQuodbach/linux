import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usePlantStore, PlantInput } from '@/store/plants';

export default function EditPlantScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const plant = usePlantStore((s) => s.plants.find((p) => p.id === id));
  const add = usePlantStore((s) => s.addPlant);
  const update = usePlantStore((s) => s.updatePlant);
  const remove = usePlantStore((s) => s.removePlant);
  const [name, setName] = useState(plant?.name ?? '');
  const [cultureType, setCultureType] = useState<'soil' | 'hydro'>(plant?.cultureType ?? 'soil');
  const [photoUri, setPhotoUri] = useState<string | undefined>(plant?.photoUri);
  const [ph, setPh] = useState(String(plant?.hydro?.ph ?? 6));
  const [ec, setEc] = useState(String(plant?.hydro?.ec ?? 1.2));

  useEffect(() => {
    // prefill on id change
    if (plant) {
      setName(plant.name);
      setCultureType(plant.cultureType);
      setPhotoUri(plant.photoUri);
      setPh(String(plant.hydro?.ph ?? 6));
      setEc(String(plant.hydro?.ec ?? 1.2));
    }
  }, [id]);

  async function chooseImage() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled) setPhotoUri(res.assets[0]?.uri);
  }

  async function onSave() {
    const input: PlantInput = {
      name,
      cultureType,
      photoUri,
      hydro: cultureType === 'hydro' ? { ph: Number(ph), ec: Number(ec) } : undefined,
    };
    if (plant) await update(plant.id, input);
    else await add(input);
    router.replace('/(tabs)/plants');
  }

  async function onDelete() {
    if (plant) {
      await remove(plant.id);
      router.replace('/(tabs)/plants');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nom" value={name} onChangeText={setName} style={styles.input} />
      <View style={styles.row}>
        <Text>Hydroponie</Text>
        <Switch value={cultureType === 'hydro'} onValueChange={(v) => setCultureType(v ? 'hydro' : 'soil')} />
      </View>
      {cultureType === 'hydro' && (
        <View style={styles.rowInputs}>
          <TextInput placeholder="pH" keyboardType="numeric" value={ph} onChangeText={setPh} style={[styles.input, { flex: 1, marginRight: 8 }]} />
          <TextInput placeholder="EC (mS/cm)" keyboardType="numeric" value={ec} onChangeText={setEc} style={[styles.input, { flex: 1, marginLeft: 8 }]} />
        </View>
      )}
      <TouchableOpacity style={styles.btnSecondary} onPress={chooseImage}>
        <Text>Sélectionner une photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onSave}>
        <Text style={styles.btnText}>Enregistrer</Text>
      </TouchableOpacity>
      {plant && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#b00020' }]} onPress={onDelete}>
          <Text style={styles.btnText}>Supprimer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  input: { backgroundColor: 'white', borderRadius: 10, padding: 12, marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
  rowInputs: { flexDirection: 'row', alignItems: 'center' },
  btn: { backgroundColor: '#0a7ea4', padding: 14, borderRadius: 12, marginTop: 8, alignItems: 'center' },
  btnSecondary: { backgroundColor: '#eee', padding: 12, borderRadius: 10, marginVertical: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '700' },
});

