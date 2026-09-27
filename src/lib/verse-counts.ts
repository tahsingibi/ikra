/** Canonical Hafs (Kufi) verse counts. Index 0 is unused; 1–114 are surah numbers. */
export const HAFS_VERSE_COUNTS = [
  0, 7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54,
  45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62,
  55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20,
  56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11,
  8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
] as const;

export const TOTAL_SURAHS = 114;
export const TOTAL_VERSES = 6236;
export const TOTAL_JUZ = 30;
export const TOTAL_PAGES = 604;
export const TOTAL_HIZB = 60;
export const TOTAL_HIZB_QUARTERS = 240;
export const BISMILLAH_AR = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
export const BISMILLAH_TR = "Bismillâhirrahmânirrahîm.";

export function shouldShowBismillah(surah: number): boolean {
  return surah !== 1 && surah !== 9;
}

export function verseCountOf(surah: number): number {
  if (surah < 1 || surah > TOTAL_SURAHS) return 0;
  return HAFS_VERSE_COUNTS[surah];
}

export function globalVerseOffset(surah: number): number {
  let offset = 0;
  for (let i = 1; i < surah; i += 1) offset += HAFS_VERSE_COUNTS[i];
  return offset;
}

export function toGlobalNumber(surah: number, ayah: number): number {
  return globalVerseOffset(surah) + ayah;
}

export function fromGlobalNumber(globalNumber: number): {
  surah: number;
  ayah: number;
} {
  if (globalNumber < 1 || globalNumber > TOTAL_VERSES) {
    throw new RangeError(`Invalid global verse number: ${globalNumber}`);
  }
  let remaining = globalNumber;
  for (let surah = 1; surah <= TOTAL_SURAHS; surah += 1) {
    const count = HAFS_VERSE_COUNTS[surah];
    if (remaining <= count) return { surah, ayah: remaining };
    remaining -= count;
  }
  throw new RangeError(`Invalid global verse number: ${globalNumber}`);
}
