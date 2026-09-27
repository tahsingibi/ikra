import { OFFLINE_PACKS } from "@/data/sources/catalog";
import { idbDelete, idbGet, idbPut, STORES } from "@/lib/db";
import { loadPack, packFile } from "@/services/pack-loader";
import type { OfflinePackId, VersePack } from "@/types/quran";

type PackRecord = VersePack & { id: string; storedAt: string; bytes: number };

export async function isPackStored(id: string) {
  const record = await idbGet<PackRecord>(STORES.packs, id);
  return Boolean(record);
}

export async function storedPacks() {
  const ids = await Promise.all(
    OFFLINE_PACKS.map(async (pack) => ({
      id: pack.id,
      stored: await isPackStored(pack.id),
    })),
  );
  return ids;
}

export async function downloadPack(id: OfflinePackId) {
  const response = await fetch(packFile(id));
  if (!response.ok) {
    throw new Error("Paket indirilemedi. İnternet bağlantınızı kontrol edin.");
  }
  const buffer = await response.arrayBuffer();
  const pack = JSON.parse(new TextDecoder().decode(buffer)) as VersePack;
  await idbPut(STORES.packs, {
    ...pack,
    id,
    storedAt: new Date().toISOString(),
    bytes: buffer.byteLength,
  } satisfies PackRecord);
  return buffer.byteLength;
}

export async function removePack(id: OfflinePackId) {
  if (id === "quran-uthmani") {
    throw new Error("Arapça metin paketi silinemez.");
  }
  await idbDelete(STORES.packs, id);
}

export async function loadPackPreferringOffline(id: string) {
  const local = await idbGet<PackRecord>(STORES.packs, id);
  if (local) return local;
  const pack = await loadPack(id);
  return pack;
}

export async function ensureDefaultOfflinePacks() {
  const defaults: OfflinePackId[] = [
    "quran-uthmani",
    "tr.transliteration",
    "tr.diyanet",
  ];
  for (const id of defaults) {
    if (!(await isPackStored(id))) {
      try {
        await downloadPack(id);
      } catch {
        // First visit may still read from network cache / public files.
      }
    }
  }
}

export function estimateSelectedBytes(ids: string[]) {
  return OFFLINE_PACKS.filter((pack) => ids.includes(pack.id)).reduce(
    (sum, pack) => sum + pack.bytesEstimate,
    0,
  );
}
