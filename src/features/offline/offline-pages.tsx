"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NUZUL_SOURCES } from "@/data/nuzul";
import { getSurahBySlug } from "@/data/surahs";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { OfflineManager } from "@/features/offline/offline-manager";
import { ContinueCard } from "@/features/library/continue-card";
import { DailyVerse } from "@/features/library/daily-verse";
import { NotesList } from "@/features/library/notes-list";
import { SurahList } from "@/features/library/surah-list";
import { VerseCollection } from "@/features/library/verse-collection";
import { PlanCard } from "@/features/plans/plan-card";
import { ReaderView } from "@/features/reader/reader-view";
import { SurahHeading } from "@/features/reader/surah-heading";
import { VerseRangeList } from "@/features/reader/verse-range-list";
import { SearchPanel } from "@/features/search/search-panel";
import { SettingsForm } from "@/features/settings/settings-form";
import { useSettings } from "@/hooks/use-settings";
import type { AppRoute } from "@/lib/app-path";
import { hizbPath, juzPath, pagePath, surahPath } from "@/lib/paths";
import { verseCountOf } from "@/lib/verse-counts";
import {
  loadDailyReaderVerse,
  loadRangeVerses,
  loadReaderVerses,
} from "@/services/reader-data";
import type { ReaderVerse, Verse } from "@/types/quran";

function LoadingState({ label = "İçerik yükleniyor…" }: { label?: string }) {
  return <p className="text-sm text-muted">{label}</p>;
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="py-10">
      <h1 className="text-2xl font-semibold">Çevrimdışı içerik hazır değil</h1>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <Link href="/cevrimdisi" className="mt-6 inline-block text-accent">
        Çevrimdışı paketleri yönet
      </Link>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="py-16">
      <h1 className="text-2xl font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-2 text-muted">Aradığın sure veya ayet yok.</p>
      <Link href="/sureler" className="mt-6 inline-block text-accent">
        Surelere dön
      </Link>
    </div>
  );
}

function HomeOffline() {
  const { settings } = useSettings();
  const [verse, setVerse] = useState<ReaderVerse | null>(null);

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      void loadDailyReaderVerse(settings.translationSourceId, settings.tafsirSourceId)
        .then((item) => {
          if (!cancelled) setVerse(item);
        })
        .catch(() => {
          if (!cancelled) setVerse(null);
        });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [settings.tafsirSourceId, settings.translationSourceId]);

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
      {verse ? <DailyVerse verse={verse} /> : null}
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

function SurahsOffline() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold">Sureler</h1>
      <p className="mb-6 text-sm text-muted">Bir sureye dokun, hemen okumaya başla.</p>
      <SurahList order="mushaf" />
    </div>
  );
}

function NuzulOffline() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold">Nüzul sırasına göre Kur’an</h1>
      <p className="mb-4 max-w-2xl text-sm text-muted">
        Varsayılan sıra Mısır / Tanzil kronolojisidir. Ayarlardan Nöldeke sırasını da
        seçebilirsin.
      </p>
      <ul className="mb-6 grid gap-2 text-sm text-muted">
        {NUZUL_SOURCES.map((source) => (
          <li key={source.id}>
            <strong className="text-foreground">{source.name}:</strong> {source.description}
          </li>
        ))}
      </ul>
      <SurahList order="nuzul" />
    </div>
  );
}

function JuzIndexOffline() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Cüzler</h1>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {Array.from({ length: 30 }, (_, index) => index + 1).map((juz) => (
          <Link
            key={juz}
            href={juzPath(juz)}
            className="rounded-2xl bg-mute px-3 py-4 text-center"
          >
            Cüz {juz}
          </Link>
        ))}
      </div>
    </div>
  );
}

function PageIndexOffline() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Mushaf sayfaları</h1>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {Array.from({ length: 604 }, (_, index) => index + 1).map((page) => (
          <Link
            key={page}
            href={pagePath(page)}
            className="rounded-xl bg-mute px-2 py-2 text-center text-sm"
          >
            {page}
          </Link>
        ))}
      </div>
    </div>
  );
}

function RangeOffline({
  kind,
  value,
}: {
  kind: "juz" | "page" | "hizb";
  value: number;
}) {
  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const title =
    kind === "juz" ? `Cüz ${value}` : kind === "page" ? `Sayfa ${value}` : `Hizb ${value}`;

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      void loadRangeVerses(kind, value)
        .then((items) => {
          if (!cancelled) setVerses(items);
        })
        .catch(() => {
          if (!cancelled) setError("Bu bölüm çevrimdışı yüklenemedi.");
        });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [kind, value]);

  if (error) return <ErrorState message={error} />;
  if (!verses) return <LoadingState />;

  return (
    <div>
      {kind === "juz" ? (
        <Breadcrumb
          items={[
            { href: "/", label: "Kur’an" },
            { href: "/cuz", label: "Cüzler" },
            { label: title },
          ]}
        />
      ) : kind === "page" ? (
        <Breadcrumb items={[{ href: "/", label: "Kur’an" }, { label: title }]} />
      ) : null}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {kind === "page" ? (
          <div className="flex gap-2 text-sm">
            {value > 1 ? <Link href={pagePath(value - 1)}>← {value - 1}</Link> : null}
            {value < 604 ? <Link href={pagePath(value + 1)}>{value + 1} →</Link> : null}
          </div>
        ) : kind === "juz" ? (
          <div className="flex gap-2 text-sm">
            {value > 1 ? <Link href={juzPath(value - 1)}>← {value - 1}</Link> : null}
            {value < 30 ? <Link href={juzPath(value + 1)}>{value + 1} →</Link> : null}
          </div>
        ) : (
          <div className="flex gap-2 text-sm">
            {value > 1 ? <Link href={hizbPath(value - 1)}>← {value - 1}</Link> : null}
            {value < 60 ? <Link href={hizbPath(value + 1)}>{value + 1} →</Link> : null}
          </div>
        )}
      </div>
      <VerseRangeList verses={verses} />
    </div>
  );
}

function SurahOffline({ slug, ayah }: { slug: string; ayah?: number }) {
  const surah = getSurahBySlug(slug);
  const { settings } = useSettings();
  const [verses, setVerses] = useState<ReaderVerse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surah) return;
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      void loadReaderVerses(
        surah.number,
        settings.translationSourceId,
        settings.tafsirSourceId,
      )
        .then((items) => {
          if (!cancelled) setVerses(items);
        })
        .catch(() => {
          if (!cancelled) {
            setError(
              "Sure metni çevrimdışı yüklenemedi. Veri paketlerini indirip tekrar dene.",
            );
          }
        });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [settings.tafsirSourceId, settings.translationSourceId, surah]);

  if (!surah) return <NotFoundState />;
  if (ayah && (ayah < 1 || ayah > verseCountOf(surah.number))) return <NotFoundState />;
  if (error) return <ErrorState message={error} />;
  if (!verses) return <LoadingState label={`${surah.name} yükleniyor…`} />;

  const crumbs = [
    { href: "/" as const, label: "Kur’an" },
    { href: "/sureler" as const, label: "Sureler" },
    ayah
      ? { href: surahPath(surah.number), label: surah.name }
      : { label: surah.name },
    ...(ayah ? [{ label: String(ayah) }] : []),
  ];

  return (
    <div>
      <Breadcrumb items={crumbs} />
      <SurahHeading surah={surah} actions={false} />
      <ReaderView surah={surah} verses={verses} initialAyah={ayah} />
    </div>
  );
}

export function OfflinePages({ route }: { route: AppRoute }) {
  switch (route.name) {
    case "home":
      return <HomeOffline />;
    case "surahs":
      return <SurahsOffline />;
    case "nuzul":
      return <NuzulOffline />;
    case "juzIndex":
      return <JuzIndexOffline />;
    case "juz":
      return <RangeOffline key={`juz-${route.juz}`} kind="juz" value={route.juz} />;
    case "pageIndex":
      return <PageIndexOffline />;
    case "page":
      return <RangeOffline key={`page-${route.page}`} kind="page" value={route.page} />;
    case "hizb":
      return <RangeOffline key={`hizb-${route.hizb}`} kind="hizb" value={route.hizb} />;
    case "search":
      return (
        <div>
          <h1 className="mb-6 text-3xl font-semibold">Ara</h1>
          <SearchPanel />
        </div>
      );
    case "settings":
      return (
        <div>
          <h1 className="mb-6 text-3xl font-semibold">Ayarlar</h1>
          <SettingsForm />
          <p className="mt-10 text-sm">
            <Link href="/cevrimdisi" className="text-accent">
              Çevrimdışı içerik yönetimi
            </Link>
          </p>
        </div>
      );
    case "offline":
      return (
        <div>
          <h1 className="mb-6 text-3xl font-semibold">Çevrimdışı içerik</h1>
          <OfflineManager />
        </div>
      );
    case "notes":
      return (
        <div>
          <h1 className="mb-6 text-3xl font-semibold">Notlar</h1>
          <NotesList />
        </div>
      );
    case "favorites":
      return (
        <div>
          <h1 className="mb-2 text-3xl font-semibold">Favoriler</h1>
          <p className="mb-6 text-sm text-muted">Sevdiğin ayetlerin toplu listesi.</p>
          <VerseCollection kind="favorites" />
        </div>
      );
    case "bookmarks":
      return (
        <div>
          <h1 className="mb-2 text-3xl font-semibold">Yer imleri</h1>
          <p className="mb-6 text-sm text-muted">
            Okurken kaydettiğin ayetler burada, çevrimdışı da durur.
          </p>
          <VerseCollection kind="bookmarks" />
        </div>
      );
    case "plan":
      return (
        <div className="max-w-xl">
          <h1 className="mb-6 text-3xl font-semibold">Okuma planı</h1>
          <PlanCard />
        </div>
      );
    case "surah":
      return (
        <SurahOffline
          key={`${route.slug}-${route.ayah ?? "all"}`}
          slug={route.slug}
          ayah={route.ayah}
        />
      );
    default:
      return <NotFoundState />;
  }
}
