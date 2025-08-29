import React from 'react';
import { usePlantContext } from '../contexts/PlantContext';
import { PlantForm } from '../components/PlantForm';
import { Plant } from '../types';

interface EditPlantScreenProps {
  navigation: any;
  route: any;
}

export function EditPlantScreen({ navigation, route }: EditPlantScreenProps) {
  const { dispatch } = usePlantContext();
  const { plant } = route.params;

  const handleSave = (plantData: Omit<Plant, 'id' | 'createdAt' | 'reminders'>) => {
    const updatedPlant: Plant = {
      ...plant,
      ...plantData,
    };

    dispatch({ type: 'UPDATE_PLANT', payload: updatedPlant });
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <PlantForm
      plant={plant}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
