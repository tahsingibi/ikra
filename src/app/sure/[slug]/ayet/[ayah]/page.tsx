import { notFound } from "next/navigation";
import { SURAHS, getSurahBySlug } from "@/data/surahs";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SurahHeading } from "@/features/reader/surah-heading";
import { ReaderView } from "@/features/reader/reader-view";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { buildMetadata, verseTitle } from "@/lib/seo";
import { surahPath, versePath } from "@/lib/paths";
import { getReaderVerses } from "@/services/reader";
import { verseCountOf } from "@/lib/verse-counts";

type Props = {
  params: Promise<{ slug: string; ayah: string }>;
};

export async function generateStaticParams() {
  return SURAHS.flatMap((surah) =>
    Array.from({ length: Math.min(3, surah.ayahCount) }, (_, index) => ({
      slug: surah.slug,
      ayah: String(index + 1),
    })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug, ayah } = await params;
  const surah = getSurahBySlug(slug);
  const ayahNumber = Number(ayah);
  if (!surah || !ayahNumber) return {};
  return buildMetadata({
    title: verseTitle(surah.number, ayahNumber),
    description: `${surah.name} suresi ${ayahNumber}. ayet. Arapça metin, Türkçe okunuş, meal ve tefsir.`,
    path: versePath(surah.number, ayahNumber),
  });
}

export default async function VersePage({ params }: Props) {
  const { slug, ayah } = await params;
  const surah = getSurahBySlug(slug);
  const ayahNumber = Number(ayah);
  if (!surah || !Number.isInteger(ayahNumber) || ayahNumber < 1) notFound();
  if (ayahNumber > verseCountOf(surah.number)) notFound();
  const verses = await getReaderVerses(
    surah.number,
    DEFAULT_SETTINGS.translationSourceId,
    DEFAULT_SETTINGS.tafsirSourceId,
  );

  return (
    <div>
      <Breadcrumb
        items={[
          { href: "/", label: "Kur’an" },
          { href: surahPath(surah.number), label: surah.name },
          { label: String(ayahNumber) },
        ]}
      />
      <SurahHeading surah={surah} actions={false} />
      <ReaderView surah={surah} verses={verses} initialAyah={ayahNumber} />
    </div>
  );
}
