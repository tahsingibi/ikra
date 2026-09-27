import { SearchPanel } from "@/features/search/search-panel";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ara",
  description: "Arapça, Türkçe okunuş, meal ve tefsir içinde ara.",
  path: "/ara",
});

export default function SearchPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Ara</h1>
      <SearchPanel />
    </div>
  );
}
