import { getTafsirSource, getTranslationSource } from "@/data/sources/catalog";
import { loadPack } from "@/services/pack-loader";
import {
  dailyVerseRef,
  filterVersesFromPack,
  surahVersesFromPack,
  toReaderVerses,
  verseFromPack,
} from "@/services/verse-assemble";
import type { ReaderVerse, Verse } from "@/types/quran";

async function loadLayerPacks(translationSourceId: string, tafsirSourceId: string) {
  const translationId = getTranslationSource(translationSourceId).id;
  const tafsirId = getTafsirSource(tafsirSourceId).id;
  const [quran, transliteration, translation, tafsir] = await Promise.all([
    loadPack("quran-uthmani"),
    loadPack("tr.transliteration"),
    loadPack(translationId),
    loadPack(tafsirId),
  ]);
  return { quran, transliteration, translation, tafsir };
}

export async function loadReaderVerses(
  surah: number,
  translationSourceId: string,
  tafsirSourceId: string,
): Promise<ReaderVerse[]> {
  const packs = await loadLayerPacks(translationSourceId, tafsirSourceId);
  const verses = surahVersesFromPack(packs.quran, surah);
  return toReaderVerses(
    verses,
    packs.transliteration.verses[surah - 1] ?? [],
    packs.translation.verses[surah - 1] ?? [],
    packs.tafsir.verses[surah - 1] ?? [],
  );
}

export async function loadReaderVerse(
  surah: number,
  ayah: number,
  translationSourceId: string,
  tafsirSourceId: string,
): Promise<ReaderVerse> {
  const verses = await loadReaderVerses(surah, translationSourceId, tafsirSourceId);
  const verse = verses[ayah - 1];
  if (!verse) throw new Error("Ayet bulunamadı.");
  return verse;
}

export async function loadDailyReaderVerse(
  translationSourceId: string,
  tafsirSourceId: string,
  date = new Date(),
): Promise<ReaderVerse> {
  const { surah, ayah } = dailyVerseRef(date);
  return loadReaderVerse(surah, ayah, translationSourceId, tafsirSourceId);
}

export async function loadRangeVerses(
  kind: "juz" | "page" | "hizb",
  value: number,
): Promise<Verse[]> {
  const quran = await loadPack("quran-uthmani");
  return filterVersesFromPack(quran, (verse) => verse[kind] === value);
}

export async function loadSingleVerse(surah: number, ayah: number): Promise<Verse> {
  const quran = await loadPack("quran-uthmani");
  return verseFromPack(quran, surah, ayah);
}
