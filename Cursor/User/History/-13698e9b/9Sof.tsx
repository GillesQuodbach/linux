import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantContext } from '../contexts/PlantContext';
import { Plant } from '../types';

interface PlantDetailScreenProps {
  navigation: any;
  route: any;
}

export function PlantDetailScreen({ navigation, route }: PlantDetailScreenProps) {
  const { plantId } = route.params;
  const { getPlantById, dispatch } = usePlantContext();
  const plant = getPlantById(plantId);

  if (!plant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Plante non trouvée</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleWaterPlant = () => {
    dispatch({ type: 'WATER_PLANT', payload: { plantId: plant.id, date: new Date() } });
    Alert.alert('Succès', `${plant.name} a été arrosée !`);
  };

  const handleFertilizePlant = () => {
    dispatch({ type: 'FERTILIZE_PLANT', payload: { plantId: plant.id, date: new Date() } });
    Alert.alert('Succès', `${plant.name} a été fertilisée !`);
  };

  const handleEditPlant = () => {
    navigation.navigate('EditPlant', { plant });
  };

  const handleDeletePlant = () => {
    Alert.alert(
      'Supprimer la plante',
      `Êtes-vous sûr de vouloir supprimer "${plant.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'DELETE_PLANT', payload: plant.id });
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getStatusText = () => {
    if (!plant.lastWatered) {
      return 'Arroser maintenant';
    }
    
    const daysSinceWatering = Math.floor(
      (Date.now() - plant.lastWatered.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceWatering === 0) {
      return 'Arrosé aujourd\'hui';
    } else if (daysSinceWatering === 1) {
      return 'Arrosé hier';
    } else {
      return `Arroser dans ${Math.max(0, 3 - daysSinceWatering)} jours`;
    }
  };

  const getStatusColor = () => {
    if (!plant.lastWatered) return '#ff6b6b';
    
    const daysSinceWatering = Math.floor(
      (Date.now() - plant.lastWatered.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceWatering >= 3) return '#ff6b6b';
    if (daysSinceWatering >= 2) return '#ffa726';
    return '#66bb6a';
  };

  const getTypeIcon = () => {
    return plant.type === 'hydroponic' ? 'water' : 'leaf';
  };

  const getTypeColor = () => {
    return plant.type === 'hydroponic' ? '#42a5f5' : '#8d6e63';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec photo */}
        <View style={styles.header}>
          {plant.photo ? (
            <Image source={{ uri: plant.photo }} style={styles.plantImage} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: getTypeColor() }]}>
              <Ionicons name={getTypeIcon()} size={80} color="white" />
            </View>
          )}
          
          <View style={styles.headerInfo}>
            <Text style={styles.plantName}>{plant.name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}>
              <Text style={styles.typeText}>
                {plant.type === 'hydroponic' ? 'Hydroponie' : 'Terre'}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleWaterPlant}>
            <Ionicons name="water" size={24} color="#42a5f5" />
            <Text style={styles.actionButtonText}>Arroser</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleFertilizePlant}>
            <Ionicons name="leaf" size={24} color="#66bb6a" />
            <Text style={styles.actionButtonText}>Fertiliser</Text>
          </TouchableOpacity>
          
          {plant.type === 'hydroponic' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('HydroponicData', { plantId: plant.id })}
            >
              <Ionicons name="analytics" size={24} color="#ff9800" />
              <Text style={styles.actionButtonText}>pH/EC</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Statut */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statut</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
        </View>

        {/* Informations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Besoins :</Text>
              <Text style={styles.infoValue}>{plant.needs}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ajoutée le :</Text>
              <Text style={styles.infoValue}>{formatDate(plant.createdAt)}</Text>
            </View>
            
            {plant.lastWatered && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dernier arrosage :</Text>
                <Text style={styles.infoValue}>{formatDate(plant.lastWatered)}</Text>
              </View>
            )}
            
            {plant.lastFertilized && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dernière fertilisation :</Text>
                <Text style={styles.infoValue}>{formatDate(plant.lastFertilized)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Navigation vers les détails */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suivi détaillé</Text>
          
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => navigation.navigate('FertilizerHistory', { plantId: plant.id })}
          >
            <View style={styles.navCardContent}>
              <Ionicons name="leaf" size={24} color="#66bb6a" />
              <Text style={styles.navCardTitle}>Historique des engrais</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
          
          {plant.type === 'hydroponic' && (
            <TouchableOpacity 
              style={styles.navCard}
              onPress={() => navigation.navigate('HydroponicData', { plantId: plant.id })}
            >
              <View style={styles.navCardContent}>
                <Ionicons name="analytics" size={24} color="#42a5f5" />
                <Text style={styles.navCardTitle}>Données hydroponiques</Text>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Boutons d'action */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPlant}>
          <Ionicons name="pencil" size={20} color="white" />
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePlant}>
          <Ionicons name="trash" size={20} color="white" />
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  plantImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    alignItems: 'center',
  },
  plantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 80,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  navCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
  },
  navCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  navCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66bb6a',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
