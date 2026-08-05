import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Pressable } from 'react-native';
import { Person } from '../types/person';
import {
  getDaysSinceContact,
  getPlantStatus,
  PLANT_STATUS_COLOR,
  PLANT_STATUS_LABEL,
} from '../utils/plantStatus';
import { PlantIllustration } from './PlantIllustration';
import { Theme, useTheme } from '../theme/theme';

interface Props {
  person: Person;
  onMarkDone: (id: string) => void;
  onPressPerson: (id: string) => void;
  justMarked?: boolean;
}

export function PersonCard({
  person,
  onMarkDone,
  onPressPerson,
  justMarked,
}: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const scale = useRef(new Animated.Value(1)).current;

  const days = getDaysSinceContact(person.lastContactDate);
  const status = getPlantStatus(days, person.frequencyDays);
  const color = PLANT_STATUS_COLOR[status];

  const daysLabel =
    days === 0 ? 'Avui' : days === 1 ? 'Fa 1 dia' : `Fa ${days} dies`;

  useEffect(() => {
    if (!justMarked) return;
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [justMarked, scale]);

  return (
    <View style={[styles.card, { borderColor: color }]}>
      <Pressable
        style={styles.infoArea}
        onPress={() => onPressPerson(person.id)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <PlantIllustration status={status} size={56} />
        </Animated.View>

        <Text style={styles.name} numberOfLines={1}>
          {person.name}
        </Text>

        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.statusText, { color }]} numberOfLines={1}>
            {PLANT_STATUS_LABEL[status]}
          </Text>
        </View>
        <Text style={styles.daysText}>{daysLabel}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => onMarkDone(person.id)}>
        <Text style={styles.buttonText}>Marcar com a fet</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.cardBackground,
      borderRadius: 14,
      borderWidth: 2,
      padding: 12,
      shadowColor: '#000',
      shadowOpacity: theme.scheme === 'dark' ? 0.3 : 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    infoArea: {
      alignItems: 'center',
    },
    name: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: 8,
      maxWidth: '100%',
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      maxWidth: '100%',
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      marginRight: 5,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    daysText: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 2,
    },
    button: {
      backgroundColor: theme.accentSubtleBackground,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 10,
    },
    buttonText: {
      color: theme.accentSubtleText,
      fontWeight: '600',
      fontSize: 12,
      textAlign: 'center',
    },
  });
}
