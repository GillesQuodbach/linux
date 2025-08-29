import React from 'react';
import { usePlantContext } from '../contexts/PlantContext';
import { PlantForm } from '../components/PlantForm';
import { Plant } from '../types';

interface AddPlantScreenProps {
  navigation: any;
}

export function AddPlantScreen({ navigation }: AddPlantScreenProps) {
  const { dispatch } = usePlantContext();

  const handleSave = (plantData: Omit<Plant, 'id' | 'createdAt' | 'reminders'>) => {
    const newPlant: Plant = {
      ...plantData,
      id: Date.now().toString(),
      createdAt: new Date(),
      reminders: [],
    };

    dispatch({ type: 'ADD_PLANT', payload: newPlant });
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <PlantForm
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
