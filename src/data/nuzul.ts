export type NuzulSourceId = "egyptian" | "noldeke";

export type NuzulSource = {
  id: NuzulSourceId;
  name: string;
  description: string;
  source: string;
  /** Surah numbers from first revealed to last revealed. */
  order: number[];
};

/**
 * Egyptian / Tanzil chronological order.
 * Widely used in mushaf nüzul tables and Tanzil metadata (`order` field).
 */
export const EGYPTIAN_NUZUL_ORDER = [
  96, 68, 73, 74, 1, 111, 81, 87, 92, 89, 93, 94, 103, 100, 108, 102, 107, 109,
  105, 113, 114, 112, 53, 80, 97, 91, 85, 95, 106, 101, 75, 104, 77, 50, 90, 86,
  54, 38, 7, 72, 36, 25, 35, 19, 20, 56, 26, 27, 28, 17, 10, 11, 12, 15, 6, 37,
  31, 34, 39, 40, 41, 42, 43, 44, 45, 46, 51, 88, 18, 16, 71, 14, 21, 23, 32, 52,
  67, 69, 70, 78, 79, 82, 84, 30, 29, 83, 2, 8, 3, 33, 60, 4, 99, 57, 47, 13, 55,
  76, 65, 98, 59, 24, 22, 63, 58, 49, 66, 64, 61, 62, 48, 5, 9, 110,
] as const;

/**
 * Nöldeke–Schwally chronology (Meccan I–III + Medinan).
 * Scholarly reconstruction; differs from Egyptian traditional tables.
 * Source: Nöldeke, Geschichte des Qorāns.
 */
export const NOLDEKE_NUZUL_ORDER = [
  96, 74, 111, 106, 108, 104, 107, 102, 105, 92, 90, 94, 93, 97, 86, 91, 80, 68,
  87, 95, 103, 85, 73, 101, 99, 82, 81, 53, 84, 100, 79, 77, 78, 88, 89, 75, 83,
  69, 51, 52, 56, 70, 55, 112, 109, 113, 114, 1, 54, 37, 71, 76, 44, 50, 20, 26,
  15, 19, 38, 36, 43, 72, 67, 23, 21, 25, 17, 27, 18, 32, 41, 45, 16, 30, 11, 14,
  12, 40, 28, 39, 29, 31, 42, 10, 34, 35, 7, 46, 6, 13, 2, 98, 64, 62, 8, 47, 3,
  61, 57, 4, 65, 59, 33, 63, 24, 58, 22, 48, 66, 60, 110, 49, 9, 5,
] as const;

export const NUZUL_SOURCES: NuzulSource[] = [
  {
    id: "egyptian",
    name: "Mısır / Tanzil sırası",
    description:
      "Geleneksel Mısır kronolojisi. Tanzil ve birçok mushaf nüzul tablosunun dayandığı sıra.",
    source: "Tanzil Project metadata (Egyptian standard)",
    order: [...EGYPTIAN_NUZUL_ORDER],
  },
  {
    id: "noldeke",
    name: "Nöldeke sırası",
    description:
      "Theodor Nöldeke’nin Mekke I–III ve Medine dönemlerine ayırdığı akademik kronoloji.",
    source: "Nöldeke, Geschichte des Qorāns",
    order: [...NOLDEKE_NUZUL_ORDER],
  },
];

export const DEFAULT_NUZUL_SOURCE: NuzulSourceId = "egyptian";

export function getNuzulSource(id: NuzulSourceId = DEFAULT_NUZUL_SOURCE) {
  return NUZUL_SOURCES.find((item) => item.id === id) ?? NUZUL_SOURCES[0];
}

export function nuzulRank(
  surah: number,
  sourceId: NuzulSourceId = DEFAULT_NUZUL_SOURCE,
): number {
  const index = getNuzulSource(sourceId).order.indexOf(surah);
  return index === -1 ? 0 : index + 1;
}
