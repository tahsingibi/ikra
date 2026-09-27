import Link from "next/link";
import { nuzulRank } from "@/data/nuzul";
import { surahPath } from "@/lib/paths";
import { SourceIndicator } from "@/features/reader/source-indicator";
import type { Surah } from "@/types/quran";

export function SurahHeading({
  surah,
  actions = true,
}: {
  surah: Surah;
  actions?: boolean;
}) {
  return (
    <header className="mb-8">
      <p className="text-xs tracking-[0.22em] text-muted">
        {String(surah.number).padStart(3, "0")} · {surah.revelation === "meccan" ? "Mekkî" : "Medenî"}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{surah.name}</h1>
      <p className="mt-1 font-arabic text-2xl" lang="ar" dir="rtl">
        {surah.nameArabic}
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{surah.about}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted">Ayet</dt>
          <dd>{surah.ayahCount}</dd>
        </div>
        <div>
          <dt className="text-muted">Nüzul</dt>
          <dd>{nuzulRank(surah.number)}</dd>
        </div>
        <div>
          <dt className="text-muted">Mushaf</dt>
          <dd>{surah.number}</dd>
        </div>
        <div>
          <dt className="text-muted">Anlam</dt>
          <dd>{surah.meaning}</dd>
        </div>
      </dl>

      <SourceIndicator />

      {actions ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={surahPath(surah.number)}
            className="inline-flex h-11 items-center rounded-full bg-accent px-4 text-sm text-[var(--bg)]"
          >
            Oku
          </Link>
        </div>
      ) : null}
    </header>
  );
}
