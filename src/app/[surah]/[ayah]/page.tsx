import { notFound, permanentRedirect } from "next/navigation";
import { getSurah } from "@/data/surahs";
import { versePath } from "@/lib/paths";
import { buildMetadata, verseTitle } from "@/lib/seo";
import { verseCountOf } from "@/lib/verse-counts";

type Props = {
  params: Promise<{ surah: string; ayah: string }>;
};

function parse(params: { surah: string; ayah: string }) {
  const surah = Number(params.surah);
  const ayah = Number(params.ayah);
  if (!Number.isInteger(surah) || !Number.isInteger(ayah)) return null;
  if (surah < 1 || surah > 114) return null;
  if (ayah < 1 || ayah > verseCountOf(surah)) return null;
  return { surah, ayah };
}

export async function generateMetadata({ params }: Props) {
  const parsed = parse(await params);
  if (!parsed) return {};
  const surah = getSurah(parsed.surah);
  return buildMetadata({
    title: verseTitle(parsed.surah, parsed.ayah),
    description: `${surah?.name} suresi ${parsed.ayah}. ayet.`,
    path: `/${parsed.surah}/${parsed.ayah}`,
  });
}

export default async function ShortVersePage({ params }: Props) {
  const parsed = parse(await params);
  if (!parsed) notFound();
  permanentRedirect(versePath(parsed.surah, parsed.ayah) as never);
}
