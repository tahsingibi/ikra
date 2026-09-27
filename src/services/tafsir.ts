import "server-only";
import { getTafsirSource } from "@/data/sources/catalog";
import { verseText } from "@/services/pack-loader";
import { loadPackFromDisk } from "@/services/pack-loader.server";

export async function getTafsir(
  sourceId: string,
  surah: number,
  ayah: number,
): Promise<string> {
  const pack = await loadPackFromDisk(getTafsirSource(sourceId).id);
  return verseText(pack, surah, ayah);
}

export async function getSurahTafsir(sourceId: string, surah: number) {
  const pack = await loadPackFromDisk(getTafsirSource(sourceId).id);
  return pack.verses[surah - 1] ?? [];
}
