"use client";

import Link from "next/link";
import { getSurah } from "@/data/surahs";
import { versePath } from "@/lib/paths";
import { useSettings } from "@/hooks/use-settings";
import type { ReaderVerse } from "@/types/quran";

export function DailyVerse({ verse }: { verse: ReaderVerse }) {
  const { settings } = useSettings();
  if (!settings.showDailyVerse) return null;
  const surah = getSurah(verse.surah);
  return (
    <section className="rounded-3xl bg-mute/60 p-5">
      <p className="text-xs tracking-[0.18em] text-muted">Günün ayeti</p>
      <h2 className="mt-2 text-lg font-medium">
        {surah?.name} {verse.ayah}
      </h2>
      <p className="verse-arabic mt-4 text-2xl" lang="ar" dir="rtl">
        {verse.text}
      </p>
      <p className="mt-3 text-sm leading-7">{verse.translation}</p>
      <Link className="mt-4 inline-block text-sm text-accent" href={versePath(verse.surah, verse.ayah)}>
        Ayeti aç
      </Link>
    </section>
  );
}
