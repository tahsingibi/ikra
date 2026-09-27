const DB_NAME = "ikra";
const DB_VERSION = 1;

export const STORES = {
  packs: "packs",
  bookmarks: "bookmarks",
  favorites: "favorites",
  notes: "notes",
  progress: "progress",
  history: "history",
  plans: "plans",
  sync: "sync",
  meta: "meta",
} as const;

type StoreName = (typeof STORES)[keyof typeof STORES];

let opening: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB desteklenmiyor."));
  }
  if (opening) return opening;
  opening = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const store of Object.values(STORES)) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id" });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB açılamadı."));
  });
  return opening;
}

function req<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbPut<T extends { id: string }>(
  store: StoreName,
  value: T,
): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(store, "readwrite");
  await req(tx.objectStore(store).put(value));
}

export async function idbGet<T>(
  store: StoreName,
  id: string,
): Promise<T | undefined> {
  const db = await openDb();
  const tx = db.transaction(store, "readonly");
  return (await req(tx.objectStore(store).get(id))) as T | undefined;
}

export async function idbDelete(store: StoreName, id: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(store, "readwrite");
  await req(tx.objectStore(store).delete(id));
}

export async function idbAll<T>(store: StoreName): Promise<T[]> {
  const db = await openDb();
  const tx = db.transaction(store, "readonly");
  return (await req(tx.objectStore(store).getAll())) as T[];
}

export async function idbClear(store: StoreName): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(store, "readwrite");
  await req(tx.objectStore(store).clear());
}
