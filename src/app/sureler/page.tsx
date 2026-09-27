import { SurahList } from "@/features/library/surah-list";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sureler",
  description: "Kur’an surelerini mushaf sırasıyla oku.",
  path: "/sureler",
});

export default function SurahsPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold">Sureler</h1>
      <p className="mb-6 text-sm text-muted">
        Bir sureye dokun, hemen okumaya başla.
      </p>
      <SurahList order="mushaf" />
    </div>
  );
}
