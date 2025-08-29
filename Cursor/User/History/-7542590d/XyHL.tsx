import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Plant } from '../types';

interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const { width } = Dimensions.get('window');

export function PlantCard({ plant, onPress, onEdit, onDelete }: PlantCardProps) {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {plant.photo ? (
          <Image source={{ uri: plant.photo }} style={styles.image} />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: getTypeColor() }]}>
            <Ionicons name={getTypeIcon()} size={40} color="white" />
          </View>
        )}
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}>
          <Text style={styles.typeText}>
            {plant.type === 'hydroponic' ? 'Hydroponie' : 'Terre'}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {plant.name}
        </Text>
        <Text style={styles.needs} numberOfLines={2}>
          {plant.needs}
        </Text>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <Ionicons name="pencil" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Ionicons name="trash" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  needs: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
});
