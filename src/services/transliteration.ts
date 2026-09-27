import "server-only";
import { TRANSLITERATION_SOURCE } from "@/data/sources/catalog";
import { verseText } from "@/services/pack-loader";
import { loadPackFromDisk } from "@/services/pack-loader.server";

export async function getTransliteration(surah: number, ayah: number) {
  const pack = await loadPackFromDisk(TRANSLITERATION_SOURCE.id);
  return verseText(pack, surah, ayah);
}

export async function getSurahTransliteration(surah: number) {
  const pack = await loadPackFromDisk(TRANSLITERATION_SOURCE.id);
  return pack.verses[surah - 1] ?? [];
}
