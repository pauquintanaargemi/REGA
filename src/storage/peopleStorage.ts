import AsyncStorage from '@react-native-async-storage/async-storage';
import { Person } from '../types/person';
import { mockPeople } from '../data/mockPeople';
import { todayISODate } from '../utils/plantStatus';

const PEOPLE_KEY = '@rega/people';

export async function loadPeople(): Promise<Person[]> {
  const raw = await AsyncStorage.getItem(PEOPLE_KEY);
  if (raw === null) {
    await AsyncStorage.setItem(PEOPLE_KEY, JSON.stringify(mockPeople));
    return mockPeople;
  }
  return JSON.parse(raw) as Person[];
}

export async function savePeople(people: Person[]): Promise<void> {
  await AsyncStorage.setItem(PEOPLE_KEY, JSON.stringify(people));
}

export async function addPerson(
  people: Person[],
  name: string,
  frequencyDays: number
): Promise<Person[]> {
  const newPerson: Person = {
    id: Date.now().toString(),
    name,
    frequencyDays,
    lastContactDate: todayISODate(),
  };
  const updated = [...people, newPerson];
  await savePeople(updated);
  return updated;
}

export async function markPersonContactedToday(
  people: Person[],
  id: string
): Promise<Person[]> {
  const today = todayISODate();
  const updated = people.map((p) =>
    p.id === id ? { ...p, lastContactDate: today } : p
  );
  await savePeople(updated);
  return updated;
}

export async function updatePerson(
  people: Person[],
  id: string,
  changes: { name: string; frequencyDays: number }
): Promise<Person[]> {
  const updated = people.map((p) => (p.id === id ? { ...p, ...changes } : p));
  await savePeople(updated);
  return updated;
}

export async function deletePerson(
  people: Person[],
  id: string
): Promise<Person[]> {
  const updated = people.filter((p) => p.id !== id);
  await savePeople(updated);
  return updated;
}
