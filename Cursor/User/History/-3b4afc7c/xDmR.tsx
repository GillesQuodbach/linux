import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlantContext } from '../contexts/PlantContext';
import { PlantCard } from '../components/PlantCard';
import { Plant } from '../types';

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { state, dispatch } = usePlantContext();
  const [refreshing, setRefreshing] = useState(false);

  const handleAddPlant = () => {
    navigation.navigate('AddPlant');
  };

  const handlePlantPress = (plant: Plant) => {
    navigation.navigate('PlantDetail', { plantId: plant.id });
  };

  const handleEditPlant = (plant: Plant) => {
    navigation.navigate('EditPlant', { plant });
  };

  const handleDeletePlant = (plant: Plant) => {
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
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simuler un rafraîchissement
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderPlantCard = ({ item }: { item: Plant }) => (
    <PlantCard
      plant={item}
      onPress={() => handlePlantPress(item)}
      onEdit={() => handleEditPlant(item)}
      onDelete={() => handleDeletePlant(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="leaf-outline" size={80} color="#8d6e63" />
      <Text style={styles.emptyStateTitle}>Aucune plante</Text>
      <Text style={styles.emptyStateSubtitle}>
        Commencez par ajouter votre première plante
      </Text>
      <TouchableOpacity style={styles.addFirstPlantButton} onPress={handleAddPlant}>
        <Text style={styles.addFirstPlantButtonText}>Ajouter une plante</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Plantes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlant}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {state.plants.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={state.plants}
          renderItem={renderPlantCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#66bb6a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  addFirstPlantButton: {
    backgroundColor: '#66bb6a',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addFirstPlantButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
