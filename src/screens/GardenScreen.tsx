import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { PersonCard } from '../components/PersonCard';
import { ReminderSetting } from '../components/ReminderSetting';
import { Person } from '../types/person';
import { loadPeople, markPersonContactedToday } from '../storage/peopleStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Garden'>;

export function GardenScreen({ navigation }: Props) {
  const [people, setPeople] = useState<Person[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPeople().then(setPeople);
    }, [])
  );

  async function handleMarkDone(id: string) {
    const updated = await markPersonContactedToday(people, id);
    setPeople(updated);
  }

  function handlePressPerson(id: string) {
    navigation.navigate('AddPerson', { personId: id });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>El teu jardí</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPerson')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {Platform.OS !== 'web' && <ReminderSetting />}

      {people.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Encara no tens ningú al jardí. Afegeix la primera persona amb el
            botó +.
          </Text>
        </View>
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PersonCard
              person={item}
              onMarkDone={handleMarkDone}
              onPressPerson={handlePressPerson}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B1B1B',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 15,
  },
});
