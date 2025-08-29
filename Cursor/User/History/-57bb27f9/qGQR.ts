import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Plant, Reminder } from '../types';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Demander les permissions
    registerForPushNotificationsAsync();

    // Écouter les notifications reçues
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
    });

    // Écouter les réponses aux notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Réponse à la notification:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permissions de notification refusées');
        return;
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
    }
  };

  const scheduleWateringReminder = async (plant: Plant, daysFromNow: number = 1) => {
    try {
      const trigger = new Date();
      trigger.setDate(trigger.getDate() + daysFromNow);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Arrosage nécessaire',
          body: `Il est temps d'arroser ${plant.name}`,
          data: { plantId: plant.id, type: 'watering' },
        },
        trigger,
      });
    } catch (error) {
      console.error('Erreur lors de la planification du rappel d\'arrosage:', error);
    }
  };

  const scheduleFertilizingReminder = async (plant: Plant, daysFromNow: number = 7) => {
    try {
      const trigger = new Date();
      trigger.setDate(trigger.getDate() + daysFromNow);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Engrais nécessaire',
          body: `Il est temps de fertiliser ${plant.name}`,
          data: { plantId: plant.id, type: 'fertilizing' },
        },
        trigger,
      });
    } catch (error) {
      console.error('Erreur lors de la planification du rappel d\'engrais:', error);
    }
  };

  const scheduleHydroponicCheckReminder = async (plant: Plant, daysFromNow: number = 2) => {
    try {
      const trigger = new Date();
      trigger.setDate(trigger.getDate() + daysFromNow);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Vérification hydroponique',
          body: `Vérifiez le pH et l'EC de ${plant.name}`,
          data: { plantId: plant.id, type: 'hydroponic_check' },
        },
        trigger,
      });
    } catch (error) {
      console.error('Erreur lors de la planification du rappel hydroponique:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erreur lors de l\'annulation des notifications:', error);
    }
  };

  const cancelNotificationsForPlant = async (plantId: string) => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const plantNotifications = scheduledNotifications.filter(
        notification => notification.content.data?.plantId === plantId
      );
      
      for (const notification of plantNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation des notifications de la plante:', error);
    }
  };

  return {
    scheduleWateringReminder,
    scheduleFertilizingReminder,
    scheduleHydroponicCheckReminder,
    cancelAllNotifications,
    cancelNotificationsForPlant,
  };
}
