export type AppRoute =
  | { name: "home" }
  | { name: "surahs" }
  | { name: "nuzul" }
  | { name: "juzIndex" }
  | { name: "juz"; juz: number }
  | { name: "pageIndex" }
  | { name: "page"; page: number }
  | { name: "hizb"; hizb: number }
  | { name: "search" }
  | { name: "settings" }
  | { name: "offline" }
  | { name: "notes" }
  | { name: "favorites" }
  | { name: "bookmarks" }
  | { name: "plan" }
  | { name: "surah"; slug: string; ayah?: number }
  | { name: "notfound" };

export function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function parseAppPath(pathname: string): AppRoute {
  const path = normalizePathname(pathname.split("?")[0]?.split("#")[0] ?? "/");
  if (path === "/") return { name: "home" };
  if (path === "/sureler") return { name: "surahs" };
  if (path === "/nuzul") return { name: "nuzul" };
  if (path === "/cuz") return { name: "juzIndex" };
  if (path === "/sayfa") return { name: "pageIndex" };
  if (path === "/ara") return { name: "search" };
  if (path === "/ayarlar") return { name: "settings" };
  if (path === "/cevrimdisi") return { name: "offline" };
  if (path === "/notlar") return { name: "notes" };
  if (path === "/favoriler") return { name: "favorites" };
  if (path === "/yer-imleri") return { name: "bookmarks" };
  if (path === "/plan") return { name: "plan" };

  const juz = path.match(/^\/cuz\/(\d+)$/);
  if (juz) {
    const value = Number(juz[1]);
    if (Number.isInteger(value) && value >= 1 && value <= 30) {
      return { name: "juz", juz: value };
    }
    return { name: "notfound" };
  }

  const page = path.match(/^\/sayfa\/(\d+)$/);
  if (page) {
    const value = Number(page[1]);
    if (Number.isInteger(value) && value >= 1 && value <= 604) {
      return { name: "page", page: value };
    }
    return { name: "notfound" };
  }

  const hizb = path.match(/^\/hizb\/(\d+)$/);
  if (hizb) {
    const value = Number(hizb[1]);
    if (Number.isInteger(value) && value >= 1 && value <= 60) {
      return { name: "hizb", hizb: value };
    }
    return { name: "notfound" };
  }

  const verse = path.match(/^\/sure\/([^/]+)\/ayet\/(\d+)$/);
  if (verse) {
    const ayah = Number(verse[2]);
    if (!Number.isInteger(ayah) || ayah < 1) return { name: "notfound" };
    return { name: "surah", slug: decodeURIComponent(verse[1]), ayah };
  }

  const surah = path.match(/^\/sure\/([^/]+)$/);
  if (surah) {
    return { name: "surah", slug: decodeURIComponent(surah[1]) };
  }

  const shortVerse = path.match(/^\/(\d+)\/(\d+)$/);
  if (shortVerse) {
    const surahNumber = Number(shortVerse[1]);
    const ayah = Number(shortVerse[2]);
    if (
      Number.isInteger(surahNumber) &&
      Number.isInteger(ayah) &&
      surahNumber >= 1 &&
      surahNumber <= 114 &&
      ayah >= 1
    ) {
      return { name: "surah", slug: String(surahNumber), ayah };
    }
    return { name: "notfound" };
  }

  return { name: "notfound" };
}

export function offlineRedirectPath(pathname: string, search = ""): string {
  const target = `${normalizePathname(pathname)}${search}`;
  return `/?offline=${encodeURIComponent(target)}`;
}
