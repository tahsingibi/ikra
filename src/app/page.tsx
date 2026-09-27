import Link from "next/link";
import { ContinueCard } from "@/features/library/continue-card";
import { DailyVerse } from "@/features/library/daily-verse";
import { PlanCard } from "@/features/plans/plan-card";
import { getDailyVerse } from "@/services/quran";
import { getReaderVerse } from "@/services/reader";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "İKRA",
  path: "/",
});

export default async function HomePage() {
  const daily = await getDailyVerse();
  const verse = await getReaderVerse(daily.surah, daily.ayah, "tr.diyanet", "ar.jalalayn");

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <section className="pt-6">
        <p className="text-xs tracking-[0.28em] text-muted">İKRA</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">Oku.</h1>
        <p className="mt-4 max-w-md text-muted">
          Arapça, Türkçe okunuş, meal ve tefsir. Mushaf veya nüzul sırasıyla, çevrimdışı.
        </p>
      </section>
      <ContinueCard />
      <DailyVerse verse={verse} />
      <section className="grid gap-3 sm:grid-cols-3">
        <Link className="rounded-3xl bg-mute px-4 py-5" href="/sureler">
          Sureler
        </Link>
        <Link className="rounded-3xl bg-mute px-4 py-5" href="/cuz">
          Cüzler
        </Link>
        <Link className="rounded-3xl bg-mute px-4 py-5" href="/nuzul">
          Nüzul sırası
        </Link>
      </section>
      <PlanCard />
    </div>
  );
}
