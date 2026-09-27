"use client";

import Link from "next/link";
import { useSettings } from "@/hooks/use-settings";
import { getTafsirSource, getTranslationSource } from "@/data/sources/catalog";

export function SourceIndicator() {
  const { settings } = useSettings();
  const currentTranslation = getTranslationSource(settings.translationSourceId);
  const currentTafsir = getTafsirSource(settings.tafsirSourceId);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-line/80 bg-mute/40 px-3.5 py-2.5 text-xs text-muted">
      <span className="font-medium text-[var(--fg)]">Aktif Kaynaklar:</span>
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1">
        <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">Meal</span>
        <strong className="font-medium text-[var(--fg)]">{currentTranslation.name}</strong>
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1">
        <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">Tefsir</span>
        <strong className="font-medium text-[var(--fg)]">{currentTafsir.name}</strong>
      </span>
      <Link
        href="/ayarlar"
        className="ml-auto inline-flex items-center gap-1 font-medium text-accent hover:underline"
        title="Meal veya tefsir kaynağını ayarlardan değiştirebilirsiniz"
      >
        <span>Değiştir</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
