export type PlantStatus = 'healthy' | 'wilting' | 'critical';

/** Retorna la data d'avui en format yyyy-mm-dd (hora local). */
export function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Dies transcorreguts entre lastContactDate (yyyy-mm-dd) i avui. */
export function getDaysSinceContact(lastContactDate: string): number {
  const [y, m, d] = lastContactDate.split('-').map(Number);
  const last = new Date(y, (m ?? 1) - 1, d ?? 1);
  const [ty, tm, td] = todayISODate().split('-').map(Number);
  const today = new Date(ty, tm - 1, td);
  const diffMs = today.getTime() - last.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

/** Data ISO (yyyy-mm-dd) de fa `days` dies. Útil per a dades d'exemple. */
export function daysAgoISODate(days: number): string {
  const now = new Date();
  now.setDate(now.getDate() - days);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * L'estat és relatiu a la freqüència de contacte que l'usuari ha triat
 * per a cada persona: sana fins arribar-hi, es marceix fins al doble,
 * es mor a partir d'aquí.
 */
export function getPlantStatus(
  daysSinceContact: number,
  frequencyDays: number
): PlantStatus {
  if (daysSinceContact <= frequencyDays) return 'healthy';
  if (daysSinceContact <= frequencyDays * 2) return 'wilting';
  return 'critical';
}

/** Com més gran, més urgent és retrobar-se amb aquesta persona. */
export function getUrgencyRatio(
  daysSinceContact: number,
  frequencyDays: number
): number {
  return daysSinceContact / frequencyDays;
}

export const PLANT_STATUS_COLOR: Record<PlantStatus, string> = {
  healthy: '#4CAF50',
  wilting: '#F5A623',
  critical: '#E53935',
};

export const PLANT_STATUS_EMOJI: Record<PlantStatus, string> = {
  healthy: '🌿',
  wilting: '🥀',
  critical: '🍂',
};

export const PLANT_STATUS_LABEL: Record<PlantStatus, string> = {
  healthy: 'Sana',
  wilting: 'Es marceix',
  critical: 'Es mor',
};
