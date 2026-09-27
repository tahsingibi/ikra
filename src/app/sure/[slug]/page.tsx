import { notFound } from "next/navigation";
import { SURAHS, getSurahBySlug } from "@/data/surahs";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SurahHeading } from "@/features/reader/surah-heading";
import { ReaderView } from "@/features/reader/reader-view";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { surahPath } from "@/lib/paths";
import { getReaderVerses } from "@/services/reader";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SURAHS.flatMap((surah) => [
    { slug: surah.slug },
    { slug: String(surah.number) },
  ]);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const surah = getSurahBySlug(slug);
  if (!surah) return {};
  return buildMetadata({
    title: `${surah.name} Suresi`,
    description: `${surah.name} (${surah.nameArabic}) · ${surah.ayahCount} ayet · ${surah.about}`,
    path: surahPath(surah.number),
  });
}

export default async function SurahPage({ params }: Props) {
  const { slug } = await params;
  const surah = getSurahBySlug(slug);
  if (!surah) notFound();
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
          { href: "/sureler", label: "Sureler" },
          { label: surah.name },
        ]}
      />
      <SurahHeading surah={surah} actions={false} />
      <ReaderView surah={surah} verses={verses} />
    </div>
  );
}
