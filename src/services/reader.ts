import "server-only";
import { getTafsirSource, getTranslationSource } from "@/data/sources/catalog";
import { getSurahTafsir } from "@/services/tafsir";
import { getSurahTranslation } from "@/services/translation";
import { getSurahTransliteration } from "@/services/transliteration";
import { getSurahVerses } from "@/services/quran";
import type { ReaderVerse } from "@/types/quran";

export async function getReaderVerses(
  surah: number,
  translationSourceId: string,
  tafsirSourceId: string,
): Promise<ReaderVerse[]> {
  const translationId = getTranslationSource(translationSourceId).id;
  const tafsirId = getTafsirSource(tafsirSourceId).id;
  const [verses, transliteration, translation, tafsir] = await Promise.all([
    getSurahVerses(surah),
    getSurahTransliteration(surah),
    getSurahTranslation(translationId, surah),
    getSurahTafsir(tafsirId, surah),
  ]);

  return verses.map((verse, index) => ({
    ...verse,
    transliteration: transliteration[index] ?? "",
    translation: translation[index] ?? "",
    tafsir: tafsir[index] ?? "",
  }));
}

export async function getReaderVerse(
  surah: number,
  ayah: number,
  translationSourceId: string,
  tafsirSourceId: string,
): Promise<ReaderVerse> {
  const verses = await getReaderVerses(surah, translationSourceId, tafsirSourceId);
  const verse = verses[ayah - 1];
  if (!verse) throw new Error("Ayet bulunamadı.");
  return verse;
}
