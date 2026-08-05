import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Person } from '../types/person';
import {
  getDaysSinceContact,
  getPlantStatus,
  PLANT_STATUS_COLOR,
  PLANT_STATUS_EMOJI,
  PLANT_STATUS_LABEL,
} from '../utils/plantStatus';

interface Props {
  person: Person;
  onMarkDone: (id: string) => void;
}

export function PersonCard({ person, onMarkDone }: Props) {
  const days = getDaysSinceContact(person.lastContactDate);
  const status = getPlantStatus(days);
  const color = PLANT_STATUS_COLOR[status];

  const daysLabel =
    days === 0 ? 'Avui' : days === 1 ? 'Fa 1 dia' : `Fa ${days} dies`;

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.emoji}>{PLANT_STATUS_EMOJI[status]}</Text>

      <View style={styles.info}>
        <Text style={styles.name}>{person.name}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[styles.statusText, { color }]}>
            {PLANT_STATUS_LABEL[status]} · {daysLabel}
          </Text>
        </View>
      </View>

      <Pressable style={styles.button} onPress={() => onMarkDone(person.id)}>
        <Text style={styles.buttonText}>Marcar com a fet</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
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
    backgroundColor: '#EEF6EE',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
});
