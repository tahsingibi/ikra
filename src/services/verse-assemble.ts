import { SURAHS } from "@/data/surahs";
import { verseId } from "@/lib/utils";
import {
  fromGlobalNumber,
  toGlobalNumber,
  TOTAL_VERSES,
  verseCountOf,
} from "@/lib/verse-counts";
import { verseText } from "@/services/pack-loader";
import type {
  ReaderVerse,
  Verse,
  VerseLocation,
  VerseMetaCell,
  VersePack,
} from "@/types/quran";

export function locationFromMeta(
  surah: number,
  ayah: number,
  cell?: VerseMetaCell,
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

export function verseFromPack(pack: VersePack, surah: number, ayah: number): Verse {
  const cell = pack.verseMeta?.[surah - 1]?.[ayah - 1];
  return {
    id: verseId(surah, ayah),
    text: verseText(pack, surah, ayah),
    ...locationFromMeta(surah, ayah, cell),
  };
}

export function surahVersesFromPack(pack: VersePack, surah: number): Verse[] {
  const count = verseCountOf(surah);
  const verses: Verse[] = [];
  for (let ayah = 1; ayah <= count; ayah += 1) {
    verses.push(verseFromPack(pack, surah, ayah));
  }
  return verses;
}

export function filterVersesFromPack(
  pack: VersePack,
  predicate: (verse: Verse) => boolean,
): Verse[] {
  const verses: Verse[] = [];
  for (const surah of SURAHS) {
    for (let ayah = 1; ayah <= surah.ayahCount; ayah += 1) {
      const verse = verseFromPack(pack, surah.number, ayah);
      if (predicate(verse)) verses.push(verse);
    }
  }
  return verses;
}

export function toReaderVerses(
  verses: Verse[],
  transliteration: string[],
  translation: string[],
  tafsir: string[],
): ReaderVerse[] {
  return verses.map((verse, index) => ({
    ...verse,
    transliteration: transliteration[index] ?? "",
    translation: translation[index] ?? "",
    tafsir: tafsir[index] ?? "",
  }));
}

export function dailyVerseIndex(date = new Date()): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start) / 86_400_000);
  return ((day - 1) % TOTAL_VERSES) + 1;
}

export function dailyVerseRef(date = new Date()): { surah: number; ayah: number } {
  return fromGlobalNumber(dailyVerseIndex(date));
}
