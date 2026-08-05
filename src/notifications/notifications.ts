import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ReminderTime } from '../storage/settingsStorage';

const DAILY_REMINDER_IDENTIFIER = 'rega-daily-reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('daily-reminders', {
    name: 'Recordatoris diaris',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(time: ReminderTime): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    DAILY_REMINDER_IDENTIFIER
  ).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_IDENTIFIER,
    content: {
      title: 'Rega',
      body: 'Has parlat amb algú del teu jardí avui?',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: time.hour,
      minute: time.minute,
    },
  });
}

export async function setupDailyReminder(time: ReminderTime): Promise<void> {
  await ensureAndroidChannel();
  const granted = await requestNotificationPermissions();
  if (!granted) return;
  await scheduleDailyReminder(time);
}
