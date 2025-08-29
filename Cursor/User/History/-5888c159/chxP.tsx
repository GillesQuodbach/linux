import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Plant } from '../types';

interface PlantFormProps {
  plant?: Plant;
  onSave: (plant: Omit<Plant, 'id' | 'createdAt' | 'reminders'>) => void;
  onCancel: () => void;
}

export function PlantForm({ plant, onSave, onCancel }: PlantFormProps) {
  const [name, setName] = useState(plant?.name || '');
  const [type, setType] = useState<'soil' | 'hydroponic'>(plant?.type || 'soil');
  const [needs, setNeeds] = useState(plant?.needs || '');
  const [photo, setPhoto] = useState<string | undefined>(plant?.photo);

  const isEditing = !!plant;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de prendre une photo');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom de la plante est requis');
      return;
    }

    if (!needs.trim()) {
      Alert.alert('Erreur', 'Les besoins de la plante sont requis');
      return;
    }

    onSave({
      name: name.trim(),
      type,
      needs: needs.trim(),
      photo,
    });
  };

  const showImageOptions = () => {
    Alert.alert(
      'Sélectionner une image',
      'Choisissez une option',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Appareil photo', onPress: takePhoto },
        { text: 'Galerie', onPress: pickImage },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? 'Modifier la plante' : 'Ajouter une plante'}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Photo */}
        <View style={styles.photoSection}>
          <Text style={styles.label}>Photo de la plante</Text>
          <TouchableOpacity style={styles.photoContainer} onPress={showImageOptions}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={40} color="#8d6e63" />
                <Text style={styles.photoPlaceholderText}>Ajouter une photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Nom */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom de la plante *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Monstera, Ficus..."
            placeholderTextColor="#999"
          />
        </View>

        {/* Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type de culture *</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'soil' && styles.typeButtonActive,
                { borderColor: '#8d6e63' }
              ]}
              onPress={() => setType('soil')}
            >
              <Ionicons name="leaf" size={24} color={type === 'soil' ? 'white' : '#8d6e63'} />
              <Text style={[
                styles.typeButtonText,
                type === 'soil' && styles.typeButtonTextActive
              ]}>
                Terre
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'hydroponic' && styles.typeButtonActive,
                { borderColor: '#42a5f5' }
              ]}
              onPress={() => setType('hydroponic')}
            >
              <Ionicons name="water" size={24} color={type === 'hydroponic' ? 'white' : '#42a5f5'} />
              <Text style={[
                styles.typeButtonText,
                type === 'hydroponic' && styles.typeButtonTextActive
              ]}>
                Hydroponie
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Besoins */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Besoins spécifiques *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={needs}
            onChangeText={setNeeds}
            placeholder="Ex: Lumière indirecte, arrosage modéré..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Boutons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Modifier' : 'Ajouter'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  photoSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#8d6e63',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    color: '#8d6e63',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  textArea: {
    height: 80,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: 'white',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: type === 'soil' ? '#8d6e63' : '#42a5f5',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#66bb6a',
  },
  saveButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
