import "server-only";
import { SURAHS } from "@/data/surahs";
import {
  fromGlobalNumber,
  toGlobalNumber,
  verseCountOf,
} from "@/lib/verse-counts";
import { verseId } from "@/lib/utils";
import { verseText } from "@/services/pack-loader";
import { loadQuranFromDisk } from "@/services/pack-loader.server";
import type { SajdaType, Verse, VerseLocation } from "@/types/quran";
export type { ReaderVerse } from "@/types/quran";

function locationFromMeta(
  surah: number,
  ayah: number,
  cell?: {
    g: number;
    j: number;
    p: number;
    h: number;
    m: number;
    r: number;
    s: SajdaType | null;
  },
): VerseLocation {
  const globalNumber = cell?.g ?? toGlobalNumber(surah, ayah);
  const hizbQuarter = cell?.h ?? 1;
  return {
    surah,
    ayah,
    globalNumber,
    juz: cell?.j ?? 1,
    page: cell?.p ?? 1,
    hizb: Math.max(1, Math.ceil(hizbQuarter / 4)),
    hizbQuarter,
    manzil: cell?.m ?? 1,
    ruku: cell?.r ?? 1,
    sajda: cell?.s ?? null,
  };
}

export async function getVerse(surah: number, ayah: number): Promise<Verse> {
  const pack = await loadQuranFromDisk();
  const cell = pack.verseMeta?.[surah - 1]?.[ayah - 1];
  return {
    id: verseId(surah, ayah),
    text: verseText(pack, surah, ayah),
    ...locationFromMeta(surah, ayah, cell),
  };
}

export async function getSurahVerses(surah: number): Promise<Verse[]> {
  const pack = await loadQuranFromDisk();
  const count = verseCountOf(surah);
  const verses: Verse[] = [];
  for (let ayah = 1; ayah <= count; ayah += 1) {
    const cell = pack.verseMeta?.[surah - 1]?.[ayah - 1];
    verses.push({
      id: verseId(surah, ayah),
      text: verseText(pack, surah, ayah),
      ...locationFromMeta(surah, ayah, cell),
    });
  }
  return verses;
}

export async function getVersesByRange(
  predicate: (verse: Verse) => boolean,
): Promise<Verse[]> {
  const pack = await loadQuranFromDisk();
  const verses: Verse[] = [];
  for (const surah of SURAHS) {
    for (let ayah = 1; ayah <= surah.ayahCount; ayah += 1) {
      const cell = pack.verseMeta?.[surah.number - 1]?.[ayah - 1];
      const verse: Verse = {
        id: verseId(surah.number, ayah),
        text: verseText(pack, surah.number, ayah),
        ...locationFromMeta(surah.number, ayah, cell),
      };
      if (predicate(verse)) verses.push(verse);
    }
  }
  return verses;
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

export function dailyVerseIndex(date = new Date()): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start) / 86_400_000);
  return ((day - 1) % 6236) + 1;
}

export async function getDailyVerse(date = new Date()): Promise<Verse> {
  const { surah, ayah } = fromGlobalNumber(dailyVerseIndex(date));
  return getVerse(surah, ayah);
}


