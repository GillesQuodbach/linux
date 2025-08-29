import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlants } from '../context/PlantContext';
import { colors } from '../constants/colors';

export default function FertilizerScreen({ route, navigation }) {
  const { plantId } = route.params;
  const { getPlantById, addFertilizerRecord, fertilizers, getFertilizerById } = usePlants();
  
  const plant = getPlantById(plantId);
  
  const [formData, setFormData] = useState({
    fertilizerId: '',
    customType: '',
    quantity: '',
    notes: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [showFertilizerSelector, setShowFertilizerSelector] = useState(false);
  const [useCustomFertilizer, setUseCustomFertilizer] = useState(false);

  if (!plant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Plante non trouvée</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = () => {
    const selectedFertilizer = formData.fertilizerId ? getFertilizerById(formData.fertilizerId) : null;
    const fertilizerType = useCustomFertilizer ? formData.customType : selectedFertilizer?.name;
    
    if (!fertilizerType?.trim() || !formData.quantity.trim()) {
      Alert.alert('Erreur', 'Veuillez sélectionner un engrais et remplir la quantité');
      return;
    }

    const recordData = {
      type: fertilizerType,
      fertilizerId: formData.fertilizerId || null,
      npkData: selectedFertilizer ? {
        nitrogen: selectedFertilizer.npk.nitrogen,
        phosphorus: selectedFertilizer.npk.phosphorus,
        potassium: selectedFertilizer.npk.potassium,
      } : null,
      quantity: formData.quantity,
      notes: formData.notes,
    };

    addFertilizerRecord(plantId, recordData);
    
    Alert.alert('Succès', 'Engrais enregistré !');
    setFormData({ fertilizerId: '', customType: '', quantity: '', notes: '' });
    setUseCustomFertilizer(false);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderFertilizerRecord = ({ item }) => {
    const selectedFertilizer = item.fertilizerId ? getFertilizerById(item.fertilizerId) : null;
    
    return (
      <View style={styles.recordCard}>
        <View style={styles.recordHeader}>
          <Text style={styles.recordType}>{item.type}</Text>
          <Text style={styles.recordDate}>{formatDate(item.date)}</Text>
        </View>
        
        {item.npkData && (
          <View style={styles.npkInfo}>
            <Text style={styles.npkLabel}>NPK: </Text>
            <Text style={styles.npkValues}>
              {item.npkData.nitrogen}-{item.npkData.phosphorus}-{item.npkData.potassium}
            </Text>
          </View>
        )}
        
        <Text style={styles.recordQuantity}>Quantité: {item.quantity}</Text>
        {item.notes && (
          <Text style={styles.recordNotes}>{item.notes}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Plant Info Header */}
          <View style={styles.header}>
            <Text style={styles.plantName}>{plant.name}</Text>
            <Text style={styles.sectionSubtitle}>Gestion des engrais</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(!showForm)}
            >
              <Ionicons 
                name={showForm ? "remove" : "add"} 
                size={24} 
                color={colors.white} 
              />
              <Text style={styles.addButtonText}>
                {showForm ? 'Annuler' : 'Ajouter un engrais'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate('FertilizerManagement')}
            >
              <Ionicons name="settings" size={20} color={colors.primary} />
              <Text style={styles.manageButtonText}>Gérer les engrais</Text>
            </TouchableOpacity>
          </View>

          {/* Add Fertilizer Form */}
          {showForm && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Nouvel engrais</Text>
              
              {/* Fertilizer Type Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Type d'engrais *</Text>
                <View style={styles.fertilizerTypeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      !useCustomFertilizer && styles.typeOptionSelected
                    ]}
                    onPress={() => setUseCustomFertilizer(false)}
                  >
                    <Text style={[
                      styles.typeOptionText,
                      !useCustomFertilizer && styles.typeOptionTextSelected
                    ]}>Engrais enregistré</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      useCustomFertilizer && styles.typeOptionSelected
                    ]}
                    onPress={() => setUseCustomFertilizer(true)}
                  >
                    <Text style={[
                      styles.typeOptionText,
                      useCustomFertilizer && styles.typeOptionTextSelected
                    ]}>Engrais personnalisé</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Fertilizer Selection */}
              {!useCustomFertilizer ? (
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.fertilizerSelector}
                    onPress={() => setShowFertilizerSelector(true)}
                  >
                    <Text style={[
                      styles.fertilizerSelectorText,
                      !formData.fertilizerId && styles.fertilizerSelectorPlaceholder
                    ]}>
                      {formData.fertilizerId 
                        ? getFertilizerById(formData.fertilizerId)?.name 
                        : 'Sélectionner un engrais'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.gray} />
                  </TouchableOpacity>
                  
                  {formData.fertilizerId && (
                    <View style={styles.selectedFertilizerInfo}>
                      {(() => {
                        const selected = getFertilizerById(formData.fertilizerId);
                        return selected ? (
                          <Text style={styles.npkPreview}>
                            NPK: {selected.npk.nitrogen}-{selected.npk.phosphorus}-{selected.npk.potassium}
                          </Text>
                        ) : null;
                      })()} 
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={formData.customType}
                    onChangeText={(value) => setFormData(prev => ({ ...prev, customType: value }))}
                    placeholder="Ex: NPK 10-10-10, Engrais liquide..."
                    placeholderTextColor={colors.gray}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Quantité *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.quantity}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, quantity: value }))}
                  placeholder="Ex: 5ml, 1 cuillère, 2g..."
                  placeholderTextColor={colors.gray}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, notes: value }))}
                  placeholder="Observations, conditions d'application..."
                  placeholderTextColor={colors.gray}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Fertilizer History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historique des engrais</Text>
            
            {plant.fertilizerHistory && plant.fertilizerHistory.length > 0 ? (
              <FlatList
                data={plant.fertilizerHistory.slice().reverse()}
                renderItem={renderFertilizerRecord}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="leaf-outline" size={48} color={colors.gray} />
                <Text style={styles.emptyStateText}>
                  Aucun engrais enregistré pour cette plante
                </Text>
              </View>
            )}
          </View>

          {/* Quick Stats */}
          {plant.fertilizerHistory && plant.fertilizerHistory.length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Statistiques</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {plant.fertilizerHistory.length}
                  </Text>
                  <Text style={styles.statLabel}>Applications</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {plant.lastFertilized 
                      ? Math.ceil((new Date() - new Date(plant.lastFertilized)) / (1000 * 60 * 60 * 24))
                      : 'N/A'
                    }
                  </Text>
                  <Text style={styles.statLabel}>Jours depuis</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>
                    {plant.nextFertilizerDate
                      ? Math.ceil((new Date(plant.nextFertilizerDate) - new Date()) / (1000 * 60 * 60 * 24))
                      : 'N/A'
                    }
                  </Text>
                  <Text style={styles.statLabel}>Jours restants</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fertilizer Selector Modal */}
      <Modal
        visible={showFertilizerSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowFertilizerSelector(false)}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Sélectionner un engrais</Text>
            <View style={styles.modalCloseButton} />
          </View>

          <ScrollView style={styles.modalContent}>
            {fertilizers && fertilizers.length > 0 ? (
              fertilizers.map((fertilizer) => (
                <TouchableOpacity
                  key={fertilizer.id}
                  style={[
                    styles.fertilizerOption,
                    formData.fertilizerId === fertilizer.id && styles.fertilizerOptionSelected
                  ]}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, fertilizerId: fertilizer.id }));
                    setShowFertilizerSelector(false);
                  }}
                >
                  <View style={styles.fertilizerOptionInfo}>
                    <Text style={styles.fertilizerOptionName}>{fertilizer.name}</Text>
                    {fertilizer.brand && (
                      <Text style={styles.fertilizerOptionBrand}>{fertilizer.brand}</Text>
                    )}
                    <Text style={styles.fertilizerOptionNPK}>
                      NPK: {fertilizer.npk.nitrogen}-{fertilizer.npk.phosphorus}-{fertilizer.npk.potassium}
                    </Text>
                  </View>
                  {formData.fertilizerId === fertilizer.id && (
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyFertilizerState}>
                <Ionicons name="leaf-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyFertilizerText}>
                  Aucun engrais enregistré.{"\n"}
                  Créez d'abord vos engrais dans la section "Gérer les engrais".
                </Text>
                <TouchableOpacity
                  style={styles.createFertilizerButton}
                  onPress={() => {
                    setShowFertilizerSelector(false);
                    navigation.navigate('FertilizerManagement');
                  }}
                >
                  <Text style={styles.createFertilizerButtonText}>Créer un engrais</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
  },
  header: {
    marginBottom: 24,
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  recordCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  recordDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recordQuantity: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  recordNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  manageButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  fertilizerTypeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  typeOptionTextSelected: {
    color: colors.white,
  },
  fertilizerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.white,
  },
  fertilizerSelectorText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  fertilizerSelectorPlaceholder: {
    color: colors.gray,
  },
  selectedFertilizerInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 6,
  },
  npkPreview: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  npkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  npkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  npkValues: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalCloseButton: {
    padding: 4,
    width: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  fertilizerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fertilizerOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  fertilizerOptionInfo: {
    flex: 1,
  },
  fertilizerOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  fertilizerOptionBrand: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  fertilizerOptionNPK: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyFertilizerState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginTop: 32,
  },
  emptyFertilizerText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  createFertilizerButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFertilizerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
