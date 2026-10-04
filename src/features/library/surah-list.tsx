"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSurahsByOrder } from "@/data/surahs";
import { nuzulRank } from "@/data/nuzul";
import { surahPath } from "@/lib/paths";
import { turkishIncludes } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";
import type { ReadingOrder } from "@/types/quran";

export function SurahList({ order = "mushaf" }: { order?: ReadingOrder }) {
  const { settings, ready, update } = useSettings();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (settings.readingOrder === order) return;
    update({ readingOrder: order });
  }, [order, ready, settings.readingOrder, update]);

  const surahs = useMemo(() => {
    const list = getSurahsByOrder(order, settings.nuzulSourceId);
    if (!query.trim()) return list;
    return list.filter(
      (surah) =>
        turkishIncludes(surah.name, query) ||
        turkishIncludes(surah.slug, query) ||
        turkishIncludes(String(surah.number), query) ||
        surah.nameArabic.includes(query),
    );
  }, [order, query, settings.nuzulSourceId]);

  return (
    <div>
      <input
        className="mb-4 h-12 w-full rounded-2xl border border-line bg-elevated px-4"
        placeholder="Sure ara"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Sure ara"
      />
      <ul className="divide-y divide-line">
        {surahs.map((surah, index) => (
          <li key={surah.number}>
            <Link
              href={surahPath(surah.number)}
              className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-3 hover:bg-mute/50"
            >
              <span className="text-sm text-muted">
                {order === "nuzul" ? index + 1 : surah.number}
              </span>
              <span>
                <span className="block font-medium">{surah.name}</span>
                <span className="text-xs text-muted">
                  {surah.ayahCount} ayet · {surah.revelation === "meccan" ? "Mekkî" : "Medenî"} · nüzul {nuzulRank(surah.number, settings.nuzulSourceId)}
                </span>
              </span>
              <span className="font-arabic text-lg" lang="ar" dir="rtl">
                {surah.nameArabic}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
