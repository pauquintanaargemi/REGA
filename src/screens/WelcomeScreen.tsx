import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { PlantIllustration } from '../components/PlantIllustration';
import { setHasSeenWelcome } from '../storage/settingsStorage';
import { Theme, useTheme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  async function handleEnter() {
    await setHasSeenWelcome();
    navigation.replace('Garden');
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <PlantIllustration status="healthy" size={96} />
        <Text style={styles.title}>Rega</Text>
        <Text style={styles.slogan}>Rega les relacions que importen.</Text>
        <Text style={styles.description}>
          Cada persona que estimes és una planta al teu jardí. Parla-hi de
          tant en tant perquè no es marceixi.
        </Text>
      </View>

      <Pressable style={styles.button} onPress={handleEnter}>
        <Text style={styles.buttonText}>Entrar al jardí</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'space-between',
      paddingHorizontal: 32,
      paddingVertical: 60,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 40,
      fontWeight: '800',
      color: theme.textPrimary,
      marginTop: 16,
    },
    slogan: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.accent,
      marginTop: 8,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 16,
      lineHeight: 20,
    },
    button: {
      backgroundColor: theme.accent,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
  });
}
