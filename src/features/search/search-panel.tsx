"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { SURAHS, getSurah } from "@/data/surahs";
import {
  TAFSIR_SOURCES,
  TRANSLATION_SOURCES,
} from "@/data/sources/catalog";
import { versePath } from "@/lib/paths";
import { useSettings } from "@/hooks/use-settings";
import { searchQuran } from "@/services/search";
import type { SearchHit, SearchFilters } from "@/types/quran";

export function SearchPanel({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const { settings } = useSettings();
  const [query, setQuery] = useState(initialQuery);
  const [surah, setSurah] = useState<number | "all">("all");
  const [juz, setJuz] = useState<number | "all">("all");
  const [revelation, setRevelation] = useState<"all" | "meccan" | "medinan">("all");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filters = useMemo<SearchFilters>(
    () => ({
      query,
      surah: surah === "all" ? undefined : surah,
      juz: juz === "all" ? undefined : juz,
      revelation,
      translationSourceId: settings.translationSourceId,
      tafsirSourceId: settings.tafsirSourceId,
    }),
    [juz, query, revelation, settings.tafsirSourceId, settings.translationSourceId, surah],
  );

  function runSearch() {
    startTransition(async () => {
      try {
        setError(null);
        setHits(await searchQuran(filters));
      } catch {
        setError("Arama yapılamadı. Veriler henüz hazır olmayabilir.");
      }
    });
  }

  return (
    <div className="grid gap-6">
      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          runSearch();
        }}
      >
        <label className="text-sm" htmlFor="q">
          Ara
        </label>
        <input
          id="q"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="sabır, elhamd, Bakara 255…"
          className="h-12 rounded-2xl border border-line bg-elevated px-4"
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <select
            className="h-11 rounded-2xl border border-line bg-transparent px-3 text-sm"
            value={surah}
            onChange={(event) =>
              setSurah(event.target.value === "all" ? "all" : Number(event.target.value))
            }
          >
            <option value="all">Tüm sureler</option>
            {SURAHS.map((item) => (
              <option key={item.number} value={item.number}>
                {item.number}. {item.name}
              </option>
            ))}
          </select>
          <select
            className="h-11 rounded-2xl border border-line bg-transparent px-3 text-sm"
            value={juz}
            onChange={(event) =>
              setJuz(event.target.value === "all" ? "all" : Number(event.target.value))
            }
          >
            <option value="all">Tüm cüzler</option>
            {Array.from({ length: 30 }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>
                Cüz {value}
              </option>
            ))}
          </select>
          <select
            className="h-11 rounded-2xl border border-line bg-transparent px-3 text-sm"
            value={revelation}
            onChange={(event) =>
              setRevelation(event.target.value as typeof revelation)
            }
          >
            <option value="all">Mekkî / Medenî</option>
            <option value="meccan">Mekkî</option>
            <option value="medinan">Medenî</option>
          </select>
          <button type="submit" className="h-11 rounded-2xl bg-accent text-[var(--bg)]">
            {pending ? "Aranıyor…" : "Bul"}
          </button>
        </div>
        <p className="text-xs text-muted">
          Meal: {TRANSLATION_SOURCES.find((item) => item.id === settings.translationSourceId)?.name}
          {" · "}
          Tefsir: {TAFSIR_SOURCES.find((item) => item.id === settings.tafsirSourceId)?.name}
        </p>
      </form>
      {error ? <p className="text-sm text-warn">{error}</p> : null}
      <ul className="grid gap-4">
        {hits.map((hit) => {
          const surahMeta = getSurah(hit.surah);
          return (
            <li key={hit.verseId} className="rounded-3xl border border-line p-4">
              <Link href={versePath(hit.surah, hit.ayah)} className="block">
                <p className="text-sm text-muted">
                  {surahMeta?.name} {hit.ayah} · {hit.field}
                </p>
                <p className="verse-arabic mt-3 text-xl" lang="ar" dir="rtl">
                  {hit.arabic}
                </p>
                {hit.translation ? (
                  <p className="mt-2 text-sm leading-7">{hit.translation}</p>
                ) : null}
                <p className="mt-2 text-sm text-muted">{hit.snippet}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
