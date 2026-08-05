import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { setupDailyReminder } from './src/notifications/notifications';
import { loadReminderTime } from './src/storage/settingsStorage';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    loadReminderTime().then(setupDailyReminder);
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
