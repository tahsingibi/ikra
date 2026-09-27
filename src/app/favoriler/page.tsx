import { VerseCollection } from "@/features/library/verse-collection";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Favoriler",
  path: "/favoriler",
});

export default function FavoritesPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold">Favoriler</h1>
      <p className="mb-6 text-sm text-muted">
        Sevdiğin ayetlerin toplu listesi.
      </p>
      <VerseCollection kind="favorites" />
    </div>
  );
}
