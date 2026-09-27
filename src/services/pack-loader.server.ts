import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { VersePack } from "@/types/quran";
import { assertPack, packFile } from "@/services/pack-loader";

const memory = new Map<string, VersePack>();

export async function loadPackFromDisk(id: string): Promise<VersePack> {
  const cached = memory.get(id);
  if (cached) return cached;
  const relative = packFile(id).replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relative);
  const raw = await readFile(filePath, "utf8");
  const pack = JSON.parse(raw) as VersePack;
  assertPack(pack);
  memory.set(id, pack);
  return pack;
}

export async function loadQuranFromDisk() {
  return loadPackFromDisk("quran-uthmani");
}
