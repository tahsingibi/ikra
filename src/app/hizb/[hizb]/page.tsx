import { notFound } from "next/navigation";
import { VerseRangeList } from "@/features/reader/verse-range-list";
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
      <VerseRangeList verses={verses} />
    </div>
  );
}
