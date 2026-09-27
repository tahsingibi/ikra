"use client";

import { useEffect, useMemo, useState } from "react";
import { BISMILLAH_AR, BISMILLAH_TR, shouldShowBismillah } from "@/lib/verse-counts";
import { adjacentSurahs } from "@/data/surahs";
import { LayerToggles } from "@/features/reader/layer-toggles";
import { VerseCard } from "@/features/reader/verse-card";
import { ReaderBottomNav } from "@/features/reader/reader-bottom-nav";
import { useAudio } from "@/hooks/use-audio";
import { useSettings } from "@/hooks/use-settings";
import { versePath } from "@/lib/paths";
import { saveProgress } from "@/services/library";
import { loadPack } from "@/services/pack-loader";
import type { ReaderVerse, Surah } from "@/types/quran";

const PAGE_SIZE = 24;

export function ReaderView({
  surah,
  verses,
  initialAyah,
}: {
  surah: Surah;
  verses: ReaderVerse[];
  initialAyah?: number;
}) {
  const { settings } = useSettings();
  const audio = useAudio();
  const [activeVerses, setActiveVerses] = useState<ReaderVerse[]>(verses);
  const [visibleCount, setVisibleCount] = useState(() => {
    if (!initialAyah) return Math.min(PAGE_SIZE, verses.length);
    return Math.min(verses.length, Math.max(PAGE_SIZE, initialAyah + 4));
  });

  const neighbors = adjacentSurahs(
    surah.number,
    settings.readingOrder,
    settings.nuzulSourceId,
  );

  useEffect(() => {
    let cancelled = false;
    async function syncDynamicPacks() {
      try {
        const [transPack, tafsirPack] = await Promise.all([
          loadPack(settings.translationSourceId),
          loadPack(settings.tafsirSourceId),
        ]);
        if (cancelled) return;
        const transList = transPack.verses[surah.number - 1] ?? [];
        const tafsirList = tafsirPack.verses[surah.number - 1] ?? [];
        setActiveVerses((current) =>
          current.map((v, idx) => ({
            ...v,
            translation: transList[idx] ?? v.translation,
            tafsir: tafsirList[idx] ?? v.tafsir,
          })),
        );
      } catch (err) {
        console.error("Meal/tefsir paketi yüklenemedi:", err);
      }
    }
    void syncDynamicPacks();
    return () => {
      cancelled = true;
    };
  }, [settings.translationSourceId, settings.tafsirSourceId, surah.number]);

  const revealed = Math.max(
    visibleCount,
    audio.surah === surah.number && audio.ayah ? audio.ayah + 3 : 0,
  );
  const visible = useMemo(
    () => activeVerses.slice(0, Math.min(activeVerses.length, revealed)),
    [revealed, activeVerses],
  );

  useEffect(() => {
    const ayah = initialAyah ?? 1;
    void saveProgress({
      surah: surah.number,
      ayah,
      order: settings.readingOrder,
      updatedAt: new Date().toISOString(),
    });
  }, [initialAyah, settings.readingOrder, surah.number]);

  useEffect(() => {
    if (!initialAyah) return;
    const node = document.getElementById(`ayet-${initialAyah}`);
    node?.scrollIntoView({ block: "center" });
  }, [initialAyah]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        audio.toggle();
      }
      if (event.key === "ArrowRight" || event.key === "j") {
        audio.next();
      }
      if (event.key === "ArrowLeft" || event.key === "k") {
        audio.previous();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [audio]);

  useEffect(() => {
    if (!audio.ayah || audio.surah !== surah.number) return;
    const node = document.getElementById(`ayet-${audio.ayah}`);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [audio.ayah, audio.surah, surah.number]);

  const widthClass =
    settings.pageWidth === "narrow"
      ? "max-w-xl"
      : settings.pageWidth === "wide"
        ? "max-w-3xl"
        : "max-w-2xl";

  return (
    <div className={`mx-auto ${widthClass}`}>
      <LayerToggles />
      {shouldShowBismillah(surah.number) ? (
        <div className="my-8 text-center">
          <p className="verse-arabic text-2xl" lang="ar" dir="rtl">
            {BISMILLAH_AR}
          </p>
          {settings.layers.transliteration ? (
            <p className="mt-2 text-muted italic">{BISMILLAH_TR}</p>
          ) : null}
        </div>
      ) : null}
      <div className="divide-y divide-line/70">
        {visible.map((verse) => (
          <VerseCard key={verse.id} verse={verse} id={`ayet-${verse.ayah}`} />
        ))}
      </div>
      {visibleCount < activeVerses.length ? (
        <div className="py-6 text-center">
          <button
            type="button"
            className="rounded-full bg-mute px-4 py-2 text-sm"
            onClick={() =>
              setVisibleCount((count) => Math.min(activeVerses.length, count + PAGE_SIZE))
            }
          >
            Sonraki ayetleri göster ({visibleCount}/{activeVerses.length})
          </button>
        </div>
      ) : null}
      <ReaderBottomNav
        surah={surah}
        neighbors={neighbors}
      />
      {initialAyah ? (
        <p className="sr-only">
          Kısayol: {versePath(surah.number, initialAyah)}
        </p>
      ) : null}
    </div>
  );
}
