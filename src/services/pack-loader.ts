import {
  OFFLINE_PACKS,
  QURAN_SOURCE,
  TAFSIR_SOURCES,
  TRANSLATION_SOURCES,
  TRANSLITERATION_SOURCE,
} from "@/data/sources/catalog";
import { idbGet, idbPut, STORES } from "@/lib/db";
import { HAFS_VERSE_COUNTS, TOTAL_SURAHS, TOTAL_VERSES } from "@/lib/verse-counts";
import type { VersePack } from "@/types/quran";

type StoredPack = VersePack & { id: string; storedAt?: string; bytes?: number };

const memory = new Map<string, VersePack>();

const PACK_FILES: Record<string, string> = {
  [QURAN_SOURCE.id]: QURAN_SOURCE.file,
  [TRANSLITERATION_SOURCE.id]: TRANSLITERATION_SOURCE.file,
  ...Object.fromEntries(TRANSLATION_SOURCES.map((item) => [item.id, item.file])),
  ...Object.fromEntries(TAFSIR_SOURCES.map((item) => [item.id, item.file])),
};

export function packFile(id: string): string {
  const mapped = PACK_FILES[id] ?? OFFLINE_PACKS.find((pack) => pack.id === id)?.file;
  if (!mapped) throw new Error(`Bilinmeyen veri paketi: ${id}`);
  return mapped;
}

export function assertPack(pack: VersePack) {
  if (pack.surahCount !== TOTAL_SURAHS) {
    throw new Error(`${pack.id}: sure sayısı ${pack.surahCount}, beklenen ${TOTAL_SURAHS}`);
  }
  if (pack.verseCount !== TOTAL_VERSES) {
    throw new Error(`${pack.id}: ayet sayısı ${pack.verseCount}, beklenen ${TOTAL_VERSES}`);
  }
  for (let i = 0; i < TOTAL_SURAHS; i += 1) {
    const expected = HAFS_VERSE_COUNTS[i + 1];
    const actual = pack.verses[i]?.length ?? 0;
    if (actual !== expected) {
      throw new Error(`${pack.id}: sure ${i + 1} ayet ${actual}, beklenen ${expected}`);
    }
  }
}

async function readStoredPack(id: string): Promise<VersePack | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const local = await idbGet<StoredPack>(STORES.packs, id);
    if (!local?.verses) return null;
    assertPack(local);
    return local;
  } catch {
    return null;
  }
}

async function storePack(id: string, pack: VersePack, bytes?: number) {
  if (typeof indexedDB === "undefined") return;
  try {
    await idbPut(STORES.packs, {
      ...pack,
      id,
      storedAt: new Date().toISOString(),
      bytes: bytes ?? 0,
    } satisfies StoredPack);
  } catch {
    // IndexedDB is a cache, not a hard requirement.
  }
}

export async function loadPack(id: string): Promise<VersePack> {
  const cached = memory.get(id);
  if (cached) return cached;

  const stored = await readStoredPack(id);
  if (stored) {
    memory.set(id, stored);
    return stored;
  }

  const response = await fetch(packFile(id));
  if (!response.ok) {
    throw new Error(`${id} paketi yüklenemedi.`);
  }
  const buffer = await response.arrayBuffer();
  const pack = JSON.parse(new TextDecoder().decode(buffer)) as VersePack;
  assertPack(pack);
  memory.set(id, pack);
  void storePack(id, pack, buffer.byteLength);
  return pack;
}

export async function loadQuran() {
  return loadPack(QURAN_SOURCE.id);
}

export function verseText(pack: VersePack, surah: number, ayah: number): string {
  return pack.verses[surah - 1]?.[ayah - 1] ?? "";
}

export function surahTexts(pack: VersePack, surah: number): string[] {
  return pack.verses[surah - 1] ?? [];
}
