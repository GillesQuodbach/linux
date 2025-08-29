import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantContext } from '../contexts/PlantContext';
import { Fertilizer } from '../types';

interface FertilizerHistoryScreenProps {
  navigation: any;
  route: any;
}

export function FertilizerHistoryScreen({ navigation, route }: FertilizerHistoryScreenProps) {
  const { plantId } = route.params;
  const { getPlantById, getFertilizersByPlantId, dispatch } = usePlantContext();
  const plant = getPlantById(plantId);
  const fertilizers = getFertilizersByPlantId(plantId);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [fertilizerType, setFertilizerType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('ml');
  const [notes, setNotes] = useState('');

  if (!plant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Plante non trouvée</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddFertilizer = () => {
    if (!fertilizerType.trim()) {
      Alert.alert('Erreur', 'Le type d\'engrais est requis');
      return;
    }

    if (!quantity.trim()) {
      Alert.alert('Erreur', 'La quantité est requise');
      return;
    }

    const newFertilizer: Fertilizer = {
      id: Date.now().toString(),
      plantId,
      type: fertilizerType.trim(),
      quantity: parseFloat(quantity),
      unit,
      appliedAt: new Date(),
      notes: notes.trim() || undefined,
    };

    dispatch({ type: 'ADD_FERTILIZER', payload: newFertilizer });
    
    // Réinitialiser le formulaire
    setFertilizerType('');
    setQuantity('');
    setUnit('ml');
    setNotes('');
    setModalVisible(false);
    
    Alert.alert('Succès', 'Engrais ajouté avec succès !');
  };

  const handleDeleteFertilizer = (fertilizer: Fertilizer) => {
    Alert.alert(
      'Supprimer l\'engrais',
      `Êtes-vous sûr de vouloir supprimer cet engrais ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // Ici on devrait avoir une action DELETE_FERTILIZER dans le contexte
            // Pour l'instant, on peut filtrer localement
            Alert.alert('Info', 'Fonctionnalité à implémenter');
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderFertilizerItem = ({ item }: { item: Fertilizer }) => (
    <View style={styles.fertilizerCard}>
      <View style={styles.fertilizerHeader}>
        <View style={styles.fertilizerInfo}>
          <Text style={styles.fertilizerType}>{item.type}</Text>
          <Text style={styles.fertilizerQuantity}>
            {item.quantity} {item.unit}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteFertilizer(item)}
        >
          <Ionicons name="trash" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.fertilizerDate}>
        Appliqué le {formatDate(item.appliedAt)}
      </Text>
      
      {item.notes && (
        <Text style={styles.fertilizerNotes}>{item.notes}</Text>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="leaf-outline" size={80} color="#66bb6a" />
      <Text style={styles.emptyStateTitle}>Aucun engrais</Text>
      <Text style={styles.emptyStateSubtitle}>
        Commencez par ajouter le premier engrais pour {plant.name}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.title}>Historique des engrais</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.plantType}>
          {plant.type === 'hydroponic' ? 'Hydroponie' : 'Terre'}
        </Text>
      </View>

      {fertilizers.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={fertilizers.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())}
          renderItem={renderFertilizerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal d'ajout d'engrais */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un engrais</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type d'engrais *</Text>
                <TextInput
                  style={styles.input}
                  value={fertilizerType}
                  onChangeText={setFertilizerType}
                  placeholder="Ex: NPK, Bio, etc."
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Quantité *</Text>
                  <TextInput
                    style={styles.input}
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Unité</Text>
                  <View style={styles.unitContainer}>
                    {['ml', 'g', 'cuillère'].map((unitOption) => (
                      <TouchableOpacity
                        key={unitOption}
                        style={[
                          styles.unitButton,
                          unit === unitOption && styles.unitButtonActive
                        ]}
                        onPress={() => setUnit(unitOption)}
                      >
                        <Text style={[
                          styles.unitButtonText,
                          unit === unitOption && styles.unitButtonTextActive
                        ]}>
                          {unitOption}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes (optionnel)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Ajouter des notes..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.saveButton} onPress={handleAddFertilizer}>
                  <Text style={styles.saveButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#66bb6a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantInfo: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  plantType: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  listContainer: {
    padding: 16,
  },
  fertilizerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fertilizerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fertilizerInfo: {
    flex: 1,
  },
  fertilizerType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  fertilizerQuantity: {
    fontSize: 16,
    color: '#66bb6a',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  fertilizerDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  fertilizerNotes: {
    fontSize: 14,
    color: '#2c3e50',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
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
  row: {
    flexDirection: 'row',
  },
  unitContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#66bb6a',
    borderColor: '#66bb6a',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  unitButtonTextActive: {
    color: 'white',
  },
  modalButtons: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
});
