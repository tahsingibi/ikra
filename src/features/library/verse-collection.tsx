"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSurah } from "@/data/surahs";
import { versePath } from "@/lib/paths";
import { loadPack } from "@/services/pack-loader";
import { listBookmarks, listFavorites, toggleBookmark, toggleFavorite } from "@/services/library";
import type { Bookmark, Favorite } from "@/types/quran";

type Item = Bookmark | Favorite;

export function VerseCollection({
  kind,
}: {
  kind: "bookmarks" | "favorites";
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [texts, setTexts] = useState<Record<string, { arabic: string; translation: string }>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      void (async () => {
        const list = kind === "bookmarks" ? await listBookmarks() : await listFavorites();
        const [quran, translation] = await Promise.all([
          loadPack("quran-uthmani"),
          loadPack("tr.diyanet"),
        ]);
        if (cancelled) return;
        const next: Record<string, { arabic: string; translation: string }> = {};
        for (const item of list) {
          next[item.id] = {
            arabic: quran.verses[item.surah - 1]?.[item.ayah - 1] ?? "",
            translation: translation.verses[item.surah - 1]?.[item.ayah - 1] ?? "",
          };
        }
        setItems(list);
        setTexts(next);
      })();
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [kind]);

  if (items.length === 0) {
    return (
      <p className="text-muted">
        {kind === "bookmarks" ? "Henüz yer işareti yok." : "Henüz favori ayet yok."}
      </p>
    );
  }

  return (
    <ul className="grid gap-4">
      {items.map((item) => {
        const surah = getSurah(item.surah);
        const text = texts[item.id];
        return (
          <li key={item.id} className="rounded-3xl border border-line p-4">
            <Link href={versePath(item.surah, item.ayah)} className="block">
              <p className="text-sm text-muted">
                {surah?.name} {item.ayah}
              </p>
              {text?.arabic ? (
                <p className="verse-arabic mt-3 text-2xl" lang="ar" dir="rtl">
                  {text.arabic}
                </p>
              ) : null}
              {text?.translation ? (
                <p className="mt-3 text-sm leading-7">{text.translation}</p>
              ) : null}
            </Link>
            <button
              type="button"
              className="mt-3 text-sm text-warn"
              onClick={async () => {
                if (kind === "bookmarks") await toggleBookmark(item.surah, item.ayah);
                else await toggleFavorite(item.surah, item.ayah);
                setItems((current) => current.filter((entry) => entry.id !== item.id));
              }}
            >
              Kaldır
            </button>
          </li>
        );
      })}
    </ul>
  );
}
