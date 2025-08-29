export interface Plant {
  id: string;
  name: string;
  type: 'soil' | 'hydroponic';
  needs: string;
  photo?: string;
  createdAt: Date;
  lastWatered?: Date;
  lastFertilized?: Date;
  nextWatering?: Date;
  nextFertilizing?: Date;
  reminders: Reminder[];
}

export interface Fertilizer {
  id: string;
  plantId: string;
  type: string;
  quantity: number;
  unit: string;
  appliedAt: Date;
  notes?: string;
}

export interface HydroponicData {
  id: string;
  plantId: string;
  ph: number;
  ec: number;
  temperature: number;
  recordedAt: Date;
  notes?: string;
}

export interface Reminder {
  id: string;
  plantId: string;
  type: 'watering' | 'fertilizing' | 'ph_check' | 'ec_check';
  title: string;
  message: string;
  scheduledFor: Date;
  isActive: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
}

export interface NotificationSettings {
  watering: boolean;
  fertilizing: boolean;
  phCheck: boolean;
  ecCheck: boolean;
  sound: boolean;
  vibration: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  PlantDetail: { plantId: string };
  AddPlant: undefined;
  EditPlant: { plant: Plant };
  FertilizerHistory: { plantId: string };
  HydroponicData: { plantId: string };
  Settings: undefined;
};

export type TabParamList = {
  Plants: undefined;
  Fertilizers: undefined;
  Hydroponic: undefined;
  Settings: undefined;
};
