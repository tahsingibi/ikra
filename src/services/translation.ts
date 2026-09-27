import "server-only";
import { verseText } from "@/services/pack-loader";
import { loadPackFromDisk } from "@/services/pack-loader.server";
import { getTranslationSource } from "@/data/sources/catalog";

export async function getTranslation(
  sourceId: string,
  surah: number,
  ayah: number,
): Promise<string> {
  const pack = await loadPackFromDisk(getTranslationSource(sourceId).id);
  return verseText(pack, surah, ayah);
}

export async function getSurahTranslation(sourceId: string, surah: number) {
  const pack = await loadPackFromDisk(getTranslationSource(sourceId).id);
  return pack.verses[surah - 1] ?? [];
}
