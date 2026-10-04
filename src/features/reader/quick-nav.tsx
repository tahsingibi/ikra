"use client";

import Link from "next/link";
import { getSurahsByOrder } from "@/data/surahs";
import { nuzulRank } from "@/data/nuzul";
import { Dropdown } from "@/components/ui/dropdown";
import { surahPath } from "@/lib/paths";
import { useSettings } from "@/hooks/use-settings";
import type { Surah } from "@/types/quran";

export function QuickNav({
  current,
  currentAyah,
}: {
  current: Surah;
  currentAyah?: number;
}) {
  const { settings } = useSettings();
  const surahs = getSurahsByOrder(settings.readingOrder, settings.nuzulSourceId);
  const orderLabel =
    settings.readingOrder === "nuzul" ? "Nüzul sırası" : "Mushaf sırası";

  return (
    <Dropdown
      placement="fixed-bottom"
      width={320}
      trigger={
        <button
          type="button"
          className="min-h-11 px-3 py-2 text-sm font-medium outline-none"
          aria-haspopup="menu"
        >
          {currentAyah ? `${current.name} ${currentAyah}` : current.name}
        </button>
      }
    >
      <div className="mb-2 grid grid-cols-2 gap-1 text-sm">
        <Link className="rounded-xl px-3 py-2 hover:bg-mute" href="/sureler">
          Sureler
        </Link>
        <Link className="rounded-xl px-3 py-2 hover:bg-mute" href="/nuzul">
          Nüzul
        </Link>
        <Link className="rounded-xl px-3 py-2 hover:bg-mute" href="/cuz">
          Cüzler
        </Link>
        <Link className="rounded-xl px-3 py-2 hover:bg-mute" href="/ara">
          Ara
        </Link>
        <Link className="rounded-xl px-3 py-2 hover:bg-mute" href="/yer-imleri">
          Yer imleri
        </Link>
        <Link className="rounded-xl px-3 py-2 hover:bg-mute" href="/favoriler">
          Favoriler
        </Link>
        <Link className="rounded-xl px-3 py-2 hover:bg-mute" href="/ayarlar">
          Ayarlar
        </Link>
      </div>
      <p className="px-3 pb-1 text-xs text-muted">
        {current.name} · {current.ayahCount} ayet · {orderLabel}
      </p>
      <ul className="grid gap-0.5">
        {surahs.map((surah, index) => (
          <li key={surah.number}>
            <Link
              href={surahPath(surah.number)}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-mute"
            >
              <span>
                {settings.readingOrder === "nuzul" ? index + 1 : surah.number}{" "}
                {surah.name}
              </span>
              <span className="font-arabic text-muted">{surah.nameArabic}</span>
            </Link>
          </li>
        ))}
      </ul>
      {settings.readingOrder === "nuzul" ? (
        <p className="px-3 pt-2 text-[11px] text-muted">
          {current.name} nüzul {nuzulRank(current.number, settings.nuzulSourceId)}
        </p>
      ) : null}
    </Dropdown>
  );
}
