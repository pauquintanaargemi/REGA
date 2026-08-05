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
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Pressable
        style={styles.infoRow}
        onPress={() => onPressPerson(person.id)}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <PlantIllustration status={status} size={40} />
        </Animated.View>

        <View style={styles.info}>
          <Text style={styles.name}>{person.name}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[styles.statusText, { color }]}>
              {PLANT_STATUS_LABEL[status]} · {daysLabel}
            </Text>
          </View>
        </View>
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
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 14,
      marginHorizontal: 16,
      marginVertical: 6,
      borderLeftWidth: 6,
      shadowColor: '#000',
      shadowOpacity: theme.scheme === 'dark' ? 0.3 : 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    infoRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    info: {
      flex: 1,
      marginLeft: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      fontSize: 13,
      fontWeight: '500',
    },
    button: {
      backgroundColor: theme.accentSubtleBackground,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 8,
      marginLeft: 8,
    },
    buttonText: {
      color: theme.accentSubtleText,
      fontWeight: '600',
      fontSize: 12,
      textAlign: 'center',
    },
  });
}
