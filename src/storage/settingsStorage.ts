import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReminderTime {
  hour: number;
  minute: number;
}

const REMINDER_TIME_KEY = '@rega/reminderTime';

export const DEFAULT_REMINDER_TIME: ReminderTime = { hour: 20, minute: 0 };

export async function loadReminderTime(): Promise<ReminderTime> {
  const raw = await AsyncStorage.getItem(REMINDER_TIME_KEY);
  if (raw === null) return DEFAULT_REMINDER_TIME;
  return JSON.parse(raw) as ReminderTime;
}

export async function saveReminderTime(time: ReminderTime): Promise<void> {
  await AsyncStorage.setItem(REMINDER_TIME_KEY, JSON.stringify(time));
}

const HAS_SEEN_WELCOME_KEY = '@rega/hasSeenWelcome';

export async function getHasSeenWelcome(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY);
  return raw === 'true';
}

export async function setHasSeenWelcome(): Promise<void> {
  await AsyncStorage.setItem(HAS_SEEN_WELCOME_KEY, 'true');
}
