import Link from "next/link";
import { pagePath } from "@/lib/paths";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mushaf sayfaları",
  path: "/sayfa",
});

export default function PagesIndex() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Mushaf sayfaları</h1>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {Array.from({ length: 604 }, (_, index) => index + 1).map((page) => (
          <Link
            key={page}
            href={pagePath(page)}
            className="rounded-xl bg-mute px-2 py-2 text-center text-sm"
          >
            {page}
          </Link>
        ))}
      </div>
    </div>
  );
}
