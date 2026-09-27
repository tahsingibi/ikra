"use client";

import { getTafsirSource, getTranslationSource } from "@/data/sources/catalog";
import { VerseActions } from "@/features/reader/verse-actions";
import { useAudio } from "@/hooks/use-audio";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/utils";
import type { ReaderVerse } from "@/types/quran";

export function VerseCard({
  verse,
  id,
}: {
  verse: ReaderVerse;
  id?: string;
}) {
  const { settings } = useSettings();
  const audio = useAudio();
  const active = audio.surah === verse.surah && audio.ayah === verse.ayah;
  const translation = getTranslationSource(settings.translationSourceId);
  const tafsir = getTafsirSource(settings.tafsirSourceId);

  return (
    <article
      id={id}
      data-ayah={verse.ayah}
      className={cn(
        "scroll-mt-24 rounded-3xl border border-transparent px-1 py-5",
        active && "border-accent bg-accent-soft/60",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        {settings.layers.verseNumber ? (
          <p className="text-xs tracking-[0.2em] text-muted">{String(verse.ayah).padStart(3, "0")}</p>
        ) : (
          <span />
        )}
        <VerseActions verse={verse} />
      </div>
      {settings.layers.arabic ? (
        <p className="verse-arabic text-pretty" lang="ar" dir="rtl">
          {verse.text}
        </p>
      ) : null}
      {settings.layers.transliteration && verse.transliteration ? (
        <p className="mt-3 text-[1.02rem] leading-8 text-muted italic">
          {verse.transliteration}
        </p>
      ) : null}
      {settings.layers.translation && verse.translation ? (
        <p className="verse-translation mt-3 text-pretty">
          <span className="sr-only">{translation.name}: </span>
          {verse.translation}
        </p>
      ) : null}
      {settings.layers.tafsir && verse.tafsir ? (
        <section className="mt-4 rounded-2xl bg-mute/70 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            Tefsir · {tafsir.name}
            {tafsir.language !== "tr" ? ` · ${tafsir.languageLabel}` : ""}
          </p>
          <p
            className={cn(
              "mt-2 text-sm leading-7",
              tafsir.language === "ar" && "font-arabic text-right text-base",
            )}
            lang={tafsir.language}
            dir={tafsir.language === "ar" ? "rtl" : "ltr"}
          >
            {verse.tafsir}
          </p>
        </section>
      ) : null}
    </article>
  );
}
