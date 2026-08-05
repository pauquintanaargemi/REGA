import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Pressable } from 'react-native';
import { Person } from '../types/person';
import {
  getDaysSinceContact,
  getPlantStatus,
  PLANT_STATUS_COLOR,
  PLANT_STATUS_LABEL,
} from '../utils/plantStatus';
import { getPlantJitter } from '../utils/gardenLayout';
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
  const { translateY, rotateDeg } = getPlantJitter(person.id);

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
    <View style={styles.slot}>
      <Pressable
        style={styles.infoArea}
        onPress={() => onPressPerson(person.id)}
      >
        <Animated.View
          style={{
            transform: [
              { translateY },
              { rotate: `${rotateDeg}deg` },
              { scale },
            ],
          }}
        >
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
        <Text style={styles.buttonText}>💧 Marcar com a fet</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    slot: {
      flex: 1,
      alignItems: 'center',
    },
    infoArea: {
      alignItems: 'center',
    },
    name: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: 6,
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
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 20,
      marginTop: 10,
    },
    buttonText: {
      color: theme.accentSubtleText,
      fontWeight: '600',
      fontSize: 11,
      textAlign: 'center',
    },
  });
}
