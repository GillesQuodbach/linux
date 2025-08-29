import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Plant, Fertilizer, HydroponicData, Reminder } from '../types';

interface PlantState {
  plants: Plant[];
  fertilizers: Fertilizer[];
  hydroponicData: HydroponicData[];
  reminders: Reminder[];
}

type PlantAction =
  | { type: 'ADD_PLANT'; payload: Plant }
  | { type: 'UPDATE_PLANT'; payload: Plant }
  | { type: 'DELETE_PLANT'; payload: string }
  | { type: 'ADD_FERTILIZER'; payload: Fertilizer }
  | { type: 'ADD_HYDROPONIC_DATA'; payload: HydroponicData }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'WATER_PLANT'; payload: { plantId: string; date: Date } }
  | { type: 'FERTILIZE_PLANT'; payload: { plantId: string; date: Date } };

const initialState: PlantState = {
  plants: [],
  fertilizers: [],
  hydroponicData: [],
  reminders: [],
};

function plantReducer(state: PlantState, action: PlantAction): PlantState {
  switch (action.type) {
    case 'ADD_PLANT':
      return {
        ...state,
        plants: [...state.plants, action.payload],
      };
    
    case 'UPDATE_PLANT':
      return {
        ...state,
        plants: state.plants.map(plant =>
          plant.id === action.payload.id ? action.payload : plant
        ),
      };
    
    case 'DELETE_PLANT':
      return {
        ...state,
        plants: state.plants.filter(plant => plant.id !== action.payload),
        fertilizers: state.fertilizers.filter(fertilizer => fertilizer.plantId !== action.payload),
        hydroponicData: state.hydroponicData.filter(data => data.plantId !== action.payload),
        reminders: state.reminders.filter(reminder => reminder.plantId !== action.payload),
      };
    
    case 'ADD_FERTILIZER':
      return {
        ...state,
        fertilizers: [...state.fertilizers, action.payload],
      };
    
    case 'ADD_HYDROPONIC_DATA':
      return {
        ...state,
        hydroponicData: [...state.hydroponicData, action.payload],
      };
    
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [...state.reminders, action.payload],
      };
    
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id ? action.payload : reminder
        ),
      };
    
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload),
      };
    
    case 'WATER_PLANT':
      return {
        ...state,
        plants: state.plants.map(plant =>
          plant.id === action.payload.plantId
            ? { ...plant, lastWatered: action.payload.date }
            : plant
        ),
      };
    
    case 'FERTILIZE_PLANT':
      return {
        ...state,
        plants: state.plants.map(plant =>
          plant.id === action.payload.plantId
            ? { ...plant, lastFertilized: action.payload.date }
            : plant
        ),
      };
    
    default:
      return state;
  }
}

interface PlantContextType {
  state: PlantState;
  dispatch: React.Dispatch<PlantAction>;
  getPlantById: (id: string) => Plant | undefined;
  getFertilizersByPlantId: (plantId: string) => Fertilizer[];
  getHydroponicDataByPlantId: (plantId: string) => HydroponicData[];
  getRemindersByPlantId: (plantId: string) => Reminder[];
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export function PlantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(plantReducer, initialState);

  const getPlantById = (id: string) => {
    return state.plants.find(plant => plant.id === id);
  };

  const getFertilizersByPlantId = (plantId: string) => {
    return state.fertilizers.filter(fertilizer => fertilizer.plantId === plantId);
  };

  const getHydroponicDataByPlantId = (plantId: string) => {
    return state.hydroponicData.filter(data => data.plantId === plantId);
  };

  const getRemindersByPlantId = (plantId: string) => {
    return state.reminders.filter(reminder => reminder.plantId === plantId);
  };

  const value: PlantContextType = {
    state,
    dispatch,
    getPlantById,
    getFertilizersByPlantId,
    getHydroponicDataByPlantId,
    getRemindersByPlantId,
  };

  return (
    <PlantContext.Provider value={value}>
      {children}
    </PlantContext.Provider>
  );
}

export function usePlantContext() {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlantContext must be used within a PlantProvider');
  }
  return context;
}
