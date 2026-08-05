import { Person } from '../types/person';
import { daysAgoISODate } from '../utils/plantStatus';

export const mockPeople: Person[] = [
  { id: '1', name: 'Mireia', frequencyDays: 7, lastContactDate: daysAgoISODate(1) },
  { id: '2', name: 'Jordi', frequencyDays: 14, lastContactDate: daysAgoISODate(4) },
  { id: '3', name: 'Àvia Roser', frequencyDays: 7, lastContactDate: daysAgoISODate(9) },
  { id: '4', name: 'Marc', frequencyDays: 30, lastContactDate: daysAgoISODate(12) },
  { id: '5', name: 'Núria', frequencyDays: 10, lastContactDate: daysAgoISODate(22) },
];
