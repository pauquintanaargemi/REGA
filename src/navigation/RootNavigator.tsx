import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { GardenScreen } from '../screens/GardenScreen';
import { AddPersonScreen } from '../screens/AddPersonScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { getHasSeenWelcome } from '../storage/settingsStorage';
import { useTheme } from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useTheme();
  const [initialRouteName, setInitialRouteName] =
    useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    getHasSeenWelcome().then((seen) =>
      setInitialRouteName(seen ? 'Garden' : 'Welcome')
    );
  }, []);
  const navigationTheme =
    theme.scheme === 'dark'
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: theme.background,
            card: theme.cardBackground,
            text: theme.textPrimary,
            border: theme.border,
            primary: theme.accent,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: theme.background,
            card: theme.cardBackground,
            text: theme.textPrimary,
            border: theme.border,
            primary: theme.accent,
          },
        };

  if (initialRouteName === null) {
    return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerStyle: { backgroundColor: theme.cardBackground },
          headerTintColor: theme.textPrimary,
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Garden"
          component={GardenScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPerson"
          component={AddPersonScreen}
          options={{ title: 'Afegir persona', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
