import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { VerseRangeList } from "@/features/reader/verse-range-list";
import { pagePath } from "@/lib/paths";
import { buildMetadata } from "@/lib/seo";
import { getPageVerses } from "@/services/quran";

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  return buildMetadata({
    title: `Sayfa ${page}`,
    path: `/sayfa/${page}`,
  });
}

export default async function MushafPage({ params }: Props) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 1 || page > 604) notFound();
  const verses = await getPageVerses(page);
  return (
    <div>
      <Breadcrumb
        items={[
          { href: "/", label: "Kur’an" },
          { label: `Sayfa ${page}` },
        ]}
      />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Sayfa {page}</h1>
        <div className="flex gap-2 text-sm">
          {page > 1 ? <Link href={pagePath(page - 1)}>← {page - 1}</Link> : null}
          {page < 604 ? <Link href={pagePath(page + 1)}>{page + 1} →</Link> : null}
        </div>
      </div>
      <VerseRangeList verses={verses} />
    </div>
  );
}
