import "server-only";
import { loadQuranFromDisk } from "@/services/pack-loader.server";
import {
  dailyVerseIndex,
  dailyVerseRef,
  filterVersesFromPack,
  surahVersesFromPack,
  verseFromPack,
} from "@/services/verse-assemble";
import type { Verse } from "@/types/quran";
export type { ReaderVerse } from "@/types/quran";
export { dailyVerseIndex };

export async function getVerse(surah: number, ayah: number): Promise<Verse> {
  return verseFromPack(await loadQuranFromDisk(), surah, ayah);
}

export async function getSurahVerses(surah: number): Promise<Verse[]> {
  return surahVersesFromPack(await loadQuranFromDisk(), surah);
}

export async function getVersesByRange(
  predicate: (verse: Verse) => boolean,
): Promise<Verse[]> {
  return filterVersesFromPack(await loadQuranFromDisk(), predicate);
}

export async function getJuzVerses(juz: number): Promise<Verse[]> {
  return getVersesByRange((verse) => verse.juz === juz);
}

export async function getPageVerses(page: number): Promise<Verse[]> {
  return getVersesByRange((verse) => verse.page === page);
}

export async function getHizbVerses(hizb: number): Promise<Verse[]> {
  return getVersesByRange((verse) => verse.hizb === hizb);
}

export async function getDailyVerse(date = new Date()): Promise<Verse> {
  const { surah, ayah } = dailyVerseRef(date);
  return getVerse(surah, ayah);
}
