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
  frequencyDays: number,
  notes?: string,
  phoneNumber?: string
): Promise<Person[]> {
  const newPerson: Person = {
    id: Date.now().toString(),
    name,
    frequencyDays,
    lastContactDate: todayISODate(),
    notes: notes || undefined,
    phoneNumber: phoneNumber || undefined,
  };
  const updated = [...people, newPerson];
  await savePeople(updated);
  return updated;
}

export async function setPersonLastContactDate(
  people: Person[],
  id: string,
  date: string
): Promise<Person[]> {
  const updated = people.map((p) =>
    p.id === id ? { ...p, lastContactDate: date } : p
  );
  await savePeople(updated);
  return updated;
}

export async function markPersonContactedToday(
  people: Person[],
  id: string
): Promise<Person[]> {
  return setPersonLastContactDate(people, id, todayISODate());
}

export async function updatePerson(
  people: Person[],
  id: string,
  changes: {
    name: string;
    frequencyDays: number;
    notes?: string;
    phoneNumber?: string;
  }
): Promise<Person[]> {
  const updated = people.map((p) =>
    p.id === id
      ? {
          ...p,
          ...changes,
          notes: changes.notes || undefined,
          phoneNumber: changes.phoneNumber || undefined,
        }
      : p
  );
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
