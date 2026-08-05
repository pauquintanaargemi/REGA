export interface Person {
  id: string;
  name: string;
  /** Freqüència desitjada de contacte, en dies. */
  frequencyDays: number;
  /** Data ISO (yyyy-mm-dd) de l'últim contacte registrat. */
  lastContactDate: string;
  /** Notes lliures (aniversari, idees de regal, etc.). */
  notes?: string;
}
