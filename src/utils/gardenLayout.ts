/** Petit hash determinista perquè cada planta tingui sempre el mateix "caràcter" orgànic. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export interface PlantJitter {
  translateY: number;
  rotateDeg: number;
}

/** Petit desplaçament/gir per planta, estable per id, per trencar la graella perfecta. */
export function getPlantJitter(id: string): PlantJitter {
  const hash = hashString(id);
  const translateY = (hash % 11) - 5; // -5..5
  const rotateDeg = ((hash >> 4) % 7) - 3; // -3..3
  return { translateY, rotateDeg };
}

export function chunkIntoRows<T>(items: T[], columns: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  return rows;
}
