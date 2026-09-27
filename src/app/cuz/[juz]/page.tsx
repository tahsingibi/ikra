import { notFound } from "next/navigation";
import Link from "next/link";
import { getSurah } from "@/data/surahs";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { versePath } from "@/lib/paths";
import { buildMetadata } from "@/lib/seo";
import { getJuzVerses } from "@/services/quran";

type Props = { params: Promise<{ juz: string }> };

export async function generateStaticParams() {
  return Array.from({ length: 30 }, (_, index) => ({ juz: String(index + 1) }));
}

export async function generateMetadata({ params }: Props) {
  const { juz } = await params;
  return buildMetadata({
    title: `Cüz ${juz}`,
    path: `/cuz/${juz}`,
  });
}

export default async function JuzPage({ params }: Props) {
  const juz = Number((await params).juz);
  if (!Number.isInteger(juz) || juz < 1 || juz > 30) notFound();
  const verses = await getJuzVerses(juz);
  return (
    <div>
      <Breadcrumb
        items={[
          { href: "/", label: "Kur’an" },
          { href: "/cuz", label: "Cüzler" },
          { label: `Cüz ${juz}` },
        ]}
      />
      <h1 className="mb-6 text-3xl font-semibold">Cüz {juz}</h1>
      <ul className="divide-y divide-line">
        {verses.map((verse) => {
          const surah = getSurah(verse.surah);
          return (
            <li key={verse.id}>
              <Link
                href={versePath(verse.surah, verse.ayah)}
                className="block py-4 hover:bg-mute/40"
              >
                <p className="text-sm text-muted">
                  {surah?.name} {verse.ayah}
                </p>
                <p className="verse-arabic mt-2 text-xl" lang="ar" dir="rtl">
                  {verse.text}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
