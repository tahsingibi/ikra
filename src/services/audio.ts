import { getReciter } from "@/data/sources/catalog";
import { toGlobalNumber } from "@/lib/verse-counts";

export function verseAudioUrl(
  reciterId: string,
  surah: number,
  ayah: number,
): string {
  const reciter = getReciter(reciterId);
  return `${reciter.audioBaseUrl}/${toGlobalNumber(surah, ayah)}.mp3`;
}

export function isProbablyOfflineError(error: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  return error instanceof DOMException && error.name === "NotSupportedError";
}
