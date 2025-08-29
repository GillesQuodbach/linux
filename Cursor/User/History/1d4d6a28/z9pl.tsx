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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantContext } from '../contexts/PlantContext';
import { HydroponicData } from '../types';

interface HydroponicDataScreenProps {
  navigation: any;
  route: any;
}

export function HydroponicDataScreen({ navigation, route }: HydroponicDataScreenProps) {
  const { plantId } = route.params;
  const { getPlantById, getHydroponicDataByPlantId, dispatch } = usePlantContext();
  const plant = getPlantById(plantId);
  const hydroponicData = getHydroponicDataByPlantId(plantId);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [ph, setPh] = useState('');
  const [ec, setEc] = useState('');
  const [temperature, setTemperature] = useState('');
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

  if (plant.type !== 'hydroponic') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Cette plante n'est pas en culture hydroponique</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddData = () => {
    if (!ph.trim() || !ec.trim() || !temperature.trim()) {
      Alert.alert('Erreur', 'Toutes les valeurs sont requises');
      return;
    }

    const phValue = parseFloat(ph);
    const ecValue = parseFloat(ec);
    const tempValue = parseFloat(temperature);

    if (isNaN(phValue) || isNaN(ecValue) || isNaN(tempValue)) {
      Alert.alert('Erreur', 'Veuillez entrer des valeurs numériques valides');
      return;
    }

    // Vérifier les plages recommandées
    const phWarnings = [];
    const ecWarnings = [];
    const tempWarnings = [];

    if (phValue < 5.5 || phValue > 6.5) {
      phWarnings.push(`pH ${phValue} hors de la plage recommandée (5.5-6.5)`);
    }

    if (ecValue < 1.0 || ecValue > 3.0) {
      ecWarnings.push(`EC ${ecValue} hors de la plage recommandée (1.0-3.0)`);
    }

    if (tempValue < 18 || tempValue > 25) {
      tempWarnings.push(`Température ${tempValue}°C hors de la plage recommandée (18-25°C)`);
    }

    const newData: HydroponicData = {
      id: Date.now().toString(),
      plantId,
      ph: phValue,
      ec: ecValue,
      temperature: tempValue,
      recordedAt: new Date(),
      notes: notes.trim() || undefined,
    };

    dispatch({ type: 'ADD_HYDROPONIC_DATA', payload: newData });
    
    // Réinitialiser le formulaire
    setPh('');
    setEc('');
    setTemperature('');
    setNotes('');
    setModalVisible(false);
    
    // Afficher les alertes si nécessaire
    const allWarnings = [...phWarnings, ...ecWarnings, ...tempWarnings];
    if (allWarnings.length > 0) {
      Alert.alert(
        'Attention - Valeurs hors plage',
        allWarnings.join('\n\n'),
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Succès', 'Données hydroponiques ajoutées !');
    }
  };

  const getPhStatus = (phValue: number) => {
    if (phValue >= 5.5 && phValue <= 6.5) return { color: '#66bb6a', status: 'Optimal' };
    if (phValue >= 5.0 && phValue <= 7.0) return { color: '#ffa726', status: 'Acceptable' };
    return { color: '#ff6b6b', status: 'Critique' };
  };

  const getEcStatus = (ecValue: number) => {
    if (ecValue >= 1.0 && ecValue <= 3.0) return { color: '#66bb6a', status: 'Optimal' };
    if (ecValue >= 0.5 && ecValue <= 4.0) return { color: '#ffa726', status: 'Acceptable' };
    return { color: '#ff6b6b', status: 'Critique' };
  };

  const getTempStatus = (tempValue: number) => {
    if (tempValue >= 18 && tempValue <= 25) return { color: '#66bb6a', status: 'Optimal' };
    if (tempValue >= 15 && tempValue <= 28) return { color: '#ffa726', status: 'Acceptable' };
    return { color: '#ff6b6b', status: 'Critique' };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDataItem = ({ item }: { item: HydroponicData }) => {
    const phStatus = getPhStatus(item.ph);
    const ecStatus = getEcStatus(item.ec);
    const tempStatus = getTempStatus(item.temperature);

    return (
      <View style={styles.dataCard}>
        <View style={styles.dataHeader}>
          <Text style={styles.dataDate}>{formatDate(item.recordedAt)}</Text>
        </View>
        
        <View style={styles.dataValues}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>pH</Text>
            <Text style={[styles.dataValue, { color: phStatus.color }]}>
              {item.ph.toFixed(1)}
            </Text>
            <Text style={[styles.dataStatus, { color: phStatus.color }]}>
              {phStatus.status}
            </Text>
          </View>
          
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>EC</Text>
            <Text style={[styles.dataValue, { color: ecStatus.color }]}>
              {item.ec.toFixed(1)}
            </Text>
            <Text style={[styles.dataStatus, { color: ecStatus.color }]}>
              {ecStatus.status}
            </Text>
          </View>
          
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Temp.</Text>
            <Text style={[styles.dataValue, { color: tempStatus.color }]}>
              {item.temperature.toFixed(1)}°C
            </Text>
            <Text style={[styles.dataStatus, { color: tempStatus.color }]}>
              {tempStatus.status}
            </Text>
          </View>
        </View>
        
        {item.notes && (
          <Text style={styles.dataNotes}>{item.notes}</Text>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="analytics-outline" size={80} color="#42a5f5" />
      <Text style={styles.emptyStateTitle}>Aucune donnée</Text>
      <Text style={styles.emptyStateSubtitle}>
        Commencez par enregistrer les premières mesures pour {plant.name}
      </Text>
    </View>
  );

  const renderSummary = () => {
    if (hydroponicData.length === 0) return null;

    const latestData = hydroponicData[0]; // Plus récent
    const phStatus = getPhStatus(latestData.ph);
    const ecStatus = getEcStatus(latestData.ec);
    const tempStatus = getTempStatus(latestData.temperature);

    return (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Dernière mesure</Text>
        <View style={styles.summaryValues}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>pH</Text>
            <Text style={[styles.summaryValue, { color: phStatus.color }]}>
              {latestData.ph.toFixed(1)}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>EC</Text>
            <Text style={[styles.summaryValue, { color: ecStatus.color }]}>
              {latestData.ec.toFixed(1)}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Temp.</Text>
            <Text style={[styles.summaryValue, { color: tempStatus.color }]}>
              {latestData.temperature.toFixed(1)}°C
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.title}>Données hydroponiques</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.plantType}>Culture hydroponique</Text>
      </View>

      {renderSummary()}

      {hydroponicData.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={hydroponicData.sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())}
          renderItem={renderDataItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal d'ajout de données */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelles mesures</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>pH *</Text>
                <TextInput
                  style={styles.input}
                  value={ph}
                  onChangeText={setPh}
                  placeholder="5.5 - 6.5 (optimal)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                <Text style={styles.hint}>Plage recommandée : 5.5 - 6.5</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EC (Conductivité) *</Text>
                <TextInput
                  style={styles.input}
                  value={ec}
                  onChangeText={setEc}
                  placeholder="1.0 - 3.0 (optimal)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                <Text style={styles.hint}>Plage recommandée : 1.0 - 3.0 mS/cm</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Température (°C) *</Text>
                <TextInput
                  style={styles.input}
                  value={temperature}
                  onChangeText={setTemperature}
                  placeholder="18 - 25 (optimal)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                <Text style={styles.hint}>Plage recommandée : 18 - 25°C</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes (optionnel)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Observations, ajustements..."
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
                
                <TouchableOpacity style={styles.saveButton} onPress={handleAddData}>
                  <Text style={styles.saveButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    backgroundColor: '#42a5f5',
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
    color: '#42a5f5',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  summaryValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  dataCard: {
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
  dataHeader: {
    marginBottom: 12,
  },
  dataDate: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  dataValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dataItem: {
    alignItems: 'center',
    flex: 1,
  },
  dataLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dataStatus: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dataNotes: {
    fontSize: 14,
    color: '#2c3e50',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
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
  hint: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    fontStyle: 'italic',
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
    backgroundColor: '#42a5f5',
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
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
