import { idbAll, idbDelete, idbGet, idbPut, STORES } from "@/lib/db";
import { deviceId, generateUUID, verseId } from "@/lib/utils";
import type {
  Bookmark,
  Favorite,
  Note,
  ReadingHistoryEntry,
  ReadingProgress,
  SyncOp,
} from "@/types/quran";

async function queueSync(op: Omit<SyncOp, "id">) {
  const record: SyncOp = { ...op, id: generateUUID() };
  await idbPut(STORES.sync, record);
}

export async function listBookmarks() {
  const items = await idbAll<Bookmark>(STORES.bookmarks);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function toggleBookmark(surah: number, ayah: number, label?: string) {
  const id = verseId(surah, ayah);
  const existing = await idbGet<Bookmark>(STORES.bookmarks, id);
  if (existing) {
    await idbDelete(STORES.bookmarks, id);
    await queueSync({
      entity: "bookmark",
      action: "delete",
      payload: { id },
      updatedAt: new Date().toISOString(),
    });
    return false;
  }
  const bookmark: Bookmark = {
    id,
    verseId: id,
    surah,
    ayah,
    createdAt: new Date().toISOString(),
    label,
  };
  await idbPut(STORES.bookmarks, bookmark);
  await queueSync({
    entity: "bookmark",
    action: "upsert",
    payload: bookmark,
    updatedAt: bookmark.createdAt,
  });
  return true;
}

export async function listFavorites() {
  const items = await idbAll<Favorite>(STORES.favorites);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function toggleFavorite(surah: number, ayah: number) {
  const id = verseId(surah, ayah);
  const existing = await idbGet<Favorite>(STORES.favorites, id);
  if (existing) {
    await idbDelete(STORES.favorites, id);
    await queueSync({
      entity: "favorite",
      action: "delete",
      payload: { id },
      updatedAt: new Date().toISOString(),
    });
    return false;
  }
  const favorite: Favorite = {
    id,
    verseId: id,
    surah,
    ayah,
    createdAt: new Date().toISOString(),
  };
  await idbPut(STORES.favorites, favorite);
  await queueSync({
    entity: "favorite",
    action: "upsert",
    payload: favorite,
    updatedAt: favorite.createdAt,
  });
  return true;
}

export async function listNotes() {
  const items = await idbAll<Note>(STORES.notes);
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getNote(surah: number, ayah: number) {
  return idbGet<Note>(STORES.notes, verseId(surah, ayah));
}

export async function saveNote(surah: number, ayah: number, body: string) {
  const id = verseId(surah, ayah);
  const existing = await idbGet<Note>(STORES.notes, id);
  const now = new Date().toISOString();
  if (!body.trim()) {
    if (existing) {
      await idbDelete(STORES.notes, id);
      await queueSync({
        entity: "note",
        action: "delete",
        payload: { id },
        updatedAt: now,
      });
    }
    return null;
  }
  const note: Note = {
    id,
    verseId: id,
    surah,
    ayah,
    body: body.trim(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await idbPut(STORES.notes, note);
  await queueSync({
    entity: "note",
    action: "upsert",
    payload: note,
    updatedAt: now,
  });
  return note;
}

export async function saveProgress(progress: Omit<ReadingProgress, "deviceId">) {
  const record: ReadingProgress = { ...progress, deviceId: deviceId() };
  await idbPut(STORES.progress, { id: "current", ...record });
  const history: ReadingHistoryEntry & { id: string } = {
    id: `surah-${record.surah}`,
    surah: record.surah,
    ayah: record.ayah,
    openedAt: record.updatedAt,
  };
  await idbPut(STORES.history, history);
  await queueSync({
    entity: "progress",
    action: "upsert",
    payload: record,
    updatedAt: record.updatedAt,
  });
  return record;
}

export async function getProgress() {
  return idbGet<ReadingProgress & { id: string }>(STORES.progress, "current");
}

export async function listHistory(limit = 8) {
  const items = await idbAll<ReadingHistoryEntry & { id: string }>(STORES.history);
  const seen = new Set<number>();
  const unique: Array<ReadingHistoryEntry & { id: string }> = [];
  for (const item of items.sort((a, b) => b.openedAt.localeCompare(a.openedAt))) {
    if (seen.has(item.surah)) continue;
    seen.add(item.surah);
    unique.push(item);
    if (unique.length >= limit) break;
  }
  return unique;
}

export async function pendingSyncOps() {
  return idbAll<SyncOp>(STORES.sync);
}
