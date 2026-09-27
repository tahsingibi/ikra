import { notFound } from "next/navigation";
import Link from "next/link";
import { getSurah } from "@/data/surahs";
import { versePath } from "@/lib/paths";
import { buildMetadata } from "@/lib/seo";
import { getHizbVerses } from "@/services/quran";

type Props = { params: Promise<{ hizb: string }> };

export async function generateMetadata({ params }: Props) {
  const { hizb } = await params;
  return buildMetadata({ title: `Hizb ${hizb}`, path: `/hizb/${hizb}` });
}

export default async function HizbPage({ params }: Props) {
  const hizb = Number((await params).hizb);
  if (!Number.isInteger(hizb) || hizb < 1 || hizb > 60) notFound();
  const verses = await getHizbVerses(hizb);
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Hizb {hizb}</h1>
      <ul className="divide-y divide-line">
        {verses.map((verse) => (
          <li key={verse.id} className="py-4">
            <Link href={versePath(verse.surah, verse.ayah)}>
              <p className="text-sm text-muted">
                {getSurah(verse.surah)?.name} {verse.ayah}
              </p>
              <p className="verse-arabic mt-2 text-xl" lang="ar" dir="rtl">
                {verse.text}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
