import type { Route } from "next";
import { getSurah } from "@/data/surahs";
import { SITE_URL } from "@/data/sources/catalog";

export function surahPath(surah: number | string): Route {
  if (typeof surah === "number") {
    const meta = getSurah(surah);
    return `/sure/${meta?.slug ?? surah}` as Route;
  }
  return `/sure/${surah}` as Route;
}

export function versePath(surah: number, ayah: number): Route {
  const meta = getSurah(surah);
  return `/sure/${meta?.slug ?? surah}/ayet/${ayah}` as Route;
}

export function shortVersePath(surah: number, ayah: number): Route {
  return `/${surah}/${ayah}` as Route;
}

export function verseUrl(surah: number, ayah: number) {
  return `${SITE_URL}${shortVersePath(surah, ayah)}`;
}

export function juzPath(juz: number): Route {
  return `/cuz/${juz}` as Route;
}

export function pagePath(page: number): Route {
  return `/sayfa/${page}` as Route;
}

export function hizbPath(hizb: number): Route {
  return `/hizb/${hizb}` as Route;
}
