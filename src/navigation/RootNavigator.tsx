import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { GardenScreen } from '../screens/GardenScreen';
import { AddPersonScreen } from '../screens/AddPersonScreen';
import { useTheme } from '../theme/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useTheme();
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

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.cardBackground },
          headerTintColor: theme.textPrimary,
        }}
      >
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
