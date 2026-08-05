import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { GardenScreen } from '../screens/GardenScreen';
import { AddPersonScreen } from '../screens/AddPersonScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
