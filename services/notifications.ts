import { Alert } from 'react-native';

// expo-notifications does not work in Expo Go (SDK 53+) for Android.
// We simulate notifications with timed Alert dialogs for the demo.

let notificationTimers: ReturnType<typeof setTimeout>[] = [];

export async function requestNotificationPermission(): Promise<boolean> {
  return true; // Always granted in simulation
}

export async function scheduleDeliveryNotifications(
  orderId: string,
  productName: string,
  retailer: string
): Promise<boolean> {
  // Clear any existing timers
  cancelAllNotifications();

  // After 20 seconds: "Fast da"
  const t1 = setTimeout(() => {
    Alert.alert(
      `🚚 ${retailer} – Paket unterwegs`,
      `"${productName}" wird in Kürze zugestellt. Bitte halte dich bereit.`
    );
  }, 20000);

  // After 45 seconds: "Zugestellt"
  const t2 = setTimeout(() => {
    Alert.alert(
      `✅ Zugestellt!`,
      `"${productName}" wurde erfolgreich zugestellt. Guten Appetit! 🎉`
    );
  }, 45000);

  notificationTimers.push(t1, t2);
  return true;
}

export function cancelAllNotifications(): void {
  notificationTimers.forEach(clearTimeout);
  notificationTimers = [];
}
