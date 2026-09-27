"use client";

import Link from "next/link";
import { SURAHS } from "@/data/surahs";
import { Dropdown } from "@/components/ui/dropdown";
import { surahPath } from "@/lib/paths";
import type { Surah } from "@/types/quran";

export function QuickNav({
  current,
}: {
  current: Surah;
}) {
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
          {current.name}
        </button>
      }
    >
      <div className="mb-2 grid grid-cols-2 gap-1 text-sm">
        <Link className="rounded-xl px-3 py-2 hover:bg-mute" href="/sureler">
          Sureler
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
        {current.name} · {current.ayahCount} ayet
      </p>
      <ul className="grid gap-0.5">
        {SURAHS.map((surah) => (
          <li key={surah.number}>
            <Link
              href={surahPath(surah.number)}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-mute"
            >
              <span>
                {surah.number} {surah.name}
              </span>
              <span className="font-arabic text-muted">{surah.nameArabic}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}
