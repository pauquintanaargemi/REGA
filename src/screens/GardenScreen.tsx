import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { PersonCard } from '../components/PersonCard';
import { ReminderSetting } from '../components/ReminderSetting';
import { Person } from '../types/person';
import { loadPeople, markPersonContactedToday } from '../storage/peopleStorage';
import {
  getDaysSinceContact,
  getPlantStatus,
  getUrgencyRatio,
  PlantStatus,
} from '../utils/plantStatus';
import { Theme, useTheme } from '../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Garden'>;

export function GardenScreen({ navigation }: Props) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [people, setPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState('');
  const [justMarkedId, setJustMarkedId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadPeople().then(setPeople);
    }, [])
  );

  async function handleMarkDone(id: string) {
    const updated = await markPersonContactedToday(people, id);
    setPeople(updated);
    setJustMarkedId(id);
    setTimeout(() => setJustMarkedId(null), 600);
  }

  function handlePressPerson(id: string) {
    navigation.navigate('AddPerson', { personId: id });
  }

  const sortedPeople = useMemo(() => {
    return [...people].sort((a, b) => {
      const urgencyA = getUrgencyRatio(
        getDaysSinceContact(a.lastContactDate),
        a.frequencyDays
      );
      const urgencyB = getUrgencyRatio(
        getDaysSinceContact(b.lastContactDate),
        b.frequencyDays
      );
      return urgencyB - urgencyA;
    });
  }, [people]);

  const visiblePeople = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return sortedPeople;
    return sortedPeople.filter((p) =>
      p.name.toLowerCase().includes(normalizedQuery)
    );
  }, [sortedPeople, query]);

  const counts = useMemo(() => {
    const result: Record<PlantStatus, number> = {
      healthy: 0,
      wilting: 0,
      critical: 0,
    };
    for (const p of people) {
      const status = getPlantStatus(
        getDaysSinceContact(p.lastContactDate),
        p.frequencyDays
      );
      result[status] += 1;
    }
    return result;
  }, [people]);

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

      {people.length > 0 && (
        <Text style={styles.summary}>
          🌿 {counts.healthy} sanes · 🥀 {counts.wilting} es marceixen · 🍂{' '}
          {counts.critical} es moren
        </Text>
      )}

      {Platform.OS !== 'web' && <ReminderSetting />}

      {people.length > 0 && (
        <TextInput
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          placeholder="Cerca per nom…"
          placeholderTextColor={theme.textSecondary}
        />
      )}

      {people.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Encara no tens ningú al jardí. Afegeix la primera persona amb el
            botó +.
          </Text>
        </View>
      ) : visiblePeople.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Cap persona coincideix amb "{query}".
          </Text>
        </View>
      ) : (
        <FlatList
          data={visiblePeople}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PersonCard
              person={item}
              onMarkDone={handleMarkDone}
              onPressPerson={handlePressPerson}
              justMarked={item.id === justMarkedId}
            />
          )}
        />
      )}
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      color: theme.textPrimary,
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontSize: 22,
      lineHeight: 24,
      fontWeight: '600',
    },
    summary: {
      fontSize: 13,
      color: theme.textSecondary,
      marginHorizontal: 20,
      marginBottom: 8,
    },
    search: {
      backgroundColor: theme.cardBackground,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginHorizontal: 20,
      marginBottom: 8,
      color: theme.textPrimary,
      fontSize: 14,
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
      color: theme.textSecondary,
      fontSize: 15,
    },
  });
}
