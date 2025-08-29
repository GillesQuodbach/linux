import * as Notifications from 'expo-notifications';

let initialized = false;

export async function initNotifications() {
  if (initialized) return;
  initialized = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
  try {
    await Notifications.requestPermissionsAsync();
  } catch (e) {
    // ignore
  }
}

