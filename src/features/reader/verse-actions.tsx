"use client";

import { useEffect, useState } from "react";
import { getSurah } from "@/data/surahs";
import { Dropdown } from "@/components/ui/dropdown";
import { versePath, verseUrl } from "@/lib/paths";
import { shareOrCopy } from "@/lib/utils";
import {
  getNote,
  saveNote,
  toggleBookmark,
  toggleFavorite,
} from "@/services/library";
import { useAudio } from "@/hooks/use-audio";
import type { ReaderVerse } from "@/types/quran";
import type { ShareRatio } from "@/lib/share-card";

const RATIOS: Array<{ id: ShareRatio; label: string }> = [
  { id: "16-9", label: "Yatay 16:9" },
  { id: "9-16", label: "Dikey 9/16" },
  { id: "1-1", label: "Kare 1/1" },
];

export function VerseActions({ verse }: { verse: ReaderVerse }) {
  const audio = useAudio();
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [busyRatio, setBusyRatio] = useState<ShareRatio | null>(null);
  const surah = getSurah(verse.surah);

  useEffect(() => {
    void getNote(verse.surah, verse.ayah).then((item) => setNote(item?.body ?? ""));
  }, [verse.ayah, verse.surah]);

  async function copyVerse() {
    const text = [
      `İKRA — ${surah?.name} ${verse.ayah}`,
      verse.text,
      verse.transliteration,
      verse.translation,
      verseUrl(verse.surah, verse.ayah),
    ]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setStatus("Kopyalandı");
  }

  async function shareVisual(ratio: ShareRatio) {
    const imageUrl = `/api/share/${verse.surah}/${verse.ayah}/${ratio}`;
    setBusyRatio(ratio);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Görsel üretilemedi: ${response.status}`);
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `ikra-${verse.surah}-${verse.ayah}-${ratio}.png`;
      link.click();
      URL.revokeObjectURL(href);
      setStatus("Görsel indirildi");
    } catch (error) {
      console.error("Görsel indirme hatası:", error);
      setStatus("Görsel paylaşılamadı");
    } finally {
      setBusyRatio(null);
    }
  }

  return (
    <div className="relative">
      <Dropdown
        align="end"
        width={300}
        trigger={
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-muted hover:bg-mute active:bg-mute/80"
            aria-haspopup="menu"
            aria-label="Ayet işlemleri"
          >
            •••
          </button>
        }
      >
        <button
          type="button"
          className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-mute"
          onClick={async () => {
            const on = await toggleBookmark(verse.surah, verse.ayah);
            setStatus(on ? "Yer işareti eklendi" : "Yer işareti kaldırıldı");
          }}
        >
          Yer işareti
        </button>
        <button
          type="button"
          className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-mute"
          onClick={async () => {
            const on = await toggleFavorite(verse.surah, verse.ayah);
            setStatus(on ? "Favorilere eklendi" : "Favorilerden çıkarıldı");
          }}
        >
          Favori
        </button>
        <button
          type="button"
          className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-mute"
          onClick={() => void copyVerse()}
        >
          Kopyala
        </button>
        <button
          type="button"
          className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-mute"
          onClick={() => {
            audio.playVerse(verse.surah, verse.ayah);
          }}
        >
          Dinle
        </button>
        <a className="block rounded-xl px-3 py-2 text-sm hover:bg-mute" href={versePath(verse.surah, verse.ayah)}>
          Ayeti aç
        </a>

        <section className="mt-2 border-t border-line px-1 pt-2">
          <p className="px-2 text-xs tracking-[0.16em] text-muted">Paylaş</p>
          <button
            type="button"
            className="mt-2 w-full rounded-xl bg-mute px-3 py-2 text-left text-sm"
            onClick={async () => {
              await shareOrCopy({
                title: `İKRA — ${surah?.name} ${verse.ayah}`,
                text: `${surah?.name} ${verse.ayah}\n\n${verse.text}\n\n${verse.translation}`,
                url: verseUrl(verse.surah, verse.ayah),
              });
              setStatus("Metin paylaşıldı");
            }}
          >
            Metin olarak paylaş
          </button>
          <p className="mt-3 px-2 text-xs text-muted">Görsel kart</p>
          <div className="mt-2 grid gap-1 px-1">
            {RATIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-mute"
                disabled={busyRatio === item.id}
                onClick={() => void shareVisual(item.id)}
              >
                {busyRatio === item.id ? `${item.label} · hazırlanıyor…` : item.label}
              </button>
            ))}
          </div>
        </section>

        <form
          className="mt-2 border-t border-line px-2 pt-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await saveNote(verse.surah, verse.ayah, note);
            setStatus("Not kaydedildi");
          }}
        >
          <label className="block text-xs text-muted" htmlFor={`note-${verse.id}`}>
            Not ekle
          </label>
          <textarea
            id={`note-${verse.id}`}
            className="mt-1 w-full rounded-xl border border-line bg-transparent p-2 text-sm"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button type="submit" className="mt-2 text-sm text-accent">
            Kaydet
          </button>
        </form>
        {status ? (
          <p className="px-2 py-1 text-xs text-muted" role="status">
            {status}
          </p>
        ) : null}
      </Dropdown>
    </div>
  );
}
