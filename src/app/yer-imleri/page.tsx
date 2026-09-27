import { VerseCollection } from "@/features/library/verse-collection";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Yer imleri",
  path: "/yer-imleri",
});

export default function BookmarksPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold">Yer imleri</h1>
      <p className="mb-6 text-sm text-muted">
        Okurken kaydettiğin ayetler burada, çevrimdışı da durur.
      </p>
      <VerseCollection kind="bookmarks" />
    </div>
  );
}
