"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSurah } from "@/data/surahs";
import { versePath } from "@/lib/paths";
import { getProgress, listHistory } from "@/services/library";
import type { ReadingHistoryEntry, ReadingProgress } from "@/types/quran";

export function ContinueCard() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([]);

  useEffect(() => {
    void getProgress().then((item) => setProgress(item ?? null));
    void listHistory().then(setHistory);
  }, []);

  const surah = progress ? getSurah(progress.surah) : undefined;

  return (
    <section className="grid gap-4">
      {progress && surah ? (
        <Link
          href={versePath(progress.surah, progress.ayah)}
          className="block rounded-3xl border border-line bg-elevated p-5"
        >
          <p className="text-xs tracking-[0.18em] text-muted">Okumaya devam et</p>
          <h2 className="mt-2 text-2xl font-semibold">{surah.name}</h2>
          <p className="text-muted">{progress.ayah}. ayet</p>
        </Link>
      ) : (
        <Link href="/sureler" className="block rounded-3xl border border-line bg-elevated p-5">
          <p className="text-xs tracking-[0.18em] text-muted">Kur’an’a başla</p>
          <h2 className="mt-2 text-2xl font-semibold">Bir sure seç</h2>
        </Link>
      )}
      {history.length > 0 ? (
        <div>
          <h2 className="mb-2 text-sm text-muted">Son okudukların</h2>
          <ul className="grid gap-1">
            {history.map((item) => {
              const itemSurah = getSurah(item.surah);
              return (
                <li key={item.surah}>
                  <Link
                    href={versePath(item.surah, item.ayah)}
                    className="flex justify-between rounded-xl px-1 py-2 text-sm hover:bg-mute"
                  >
                    <span>
                      {itemSurah?.name} {item.ayah}
                    </span>
                    <span className="text-muted">
                      {new Date(item.openedAt).toLocaleDateString("tr-TR")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
