import * as Notifications from 'expo-notifications';
import { Plant } from '@/store/plants';

export async function scheduleWateringNotification(plant: Plant, date: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Arrosage - ${plant.name}`,
      body: 'Pensez à arroser votre plante aujourd\'hui',
      sound: null,
    },
    trigger: date,
  });
}

export async function scheduleFertilizerNotification(plant: Plant, date: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Fertilisation - ${plant.name}`,
      body: 'Appliquez l\'engrais prévu',
      sound: null,
    },
    trigger: date,
  });
}

export async function scheduleHydroCheckNotification(plant: Plant, date: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Hydro - ${plant.name}`,
      body: 'Vérifiez pH et EC de la solution',
      sound: null,
    },
    trigger: date,
  });
}

