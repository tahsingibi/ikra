"use client";

import Link from "next/link";
import { getSurah } from "@/data/surahs";
import { versePath } from "@/lib/paths";
import type { Verse } from "@/types/quran";

export function VerseRangeList({ verses }: { verses: Verse[] }) {
  return (
    <ul className="divide-y divide-line">
      {verses.map((verse) => {
        const surah = getSurah(verse.surah);
        return (
          <li key={verse.id}>
            <Link
              href={versePath(verse.surah, verse.ayah)}
              className="block py-4 hover:bg-mute/40"
            >
              <p className="text-sm text-muted">
                {surah?.name} {verse.ayah}
              </p>
              <p className="verse-arabic mt-2 text-xl" lang="ar" dir="rtl">
                {verse.text}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
