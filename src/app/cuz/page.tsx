import Link from "next/link";
import { juzPath } from "@/lib/paths";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cüzler",
  description: "Kur’an’ı 30 cüz halinde oku.",
  path: "/cuz",
});

export default function JuzIndexPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Cüzler</h1>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {Array.from({ length: 30 }, (_, index) => index + 1).map((juz) => (
          <Link
            key={juz}
            href={juzPath(juz)}
            className="rounded-2xl bg-mute px-3 py-4 text-center"
          >
            Cüz {juz}
          </Link>
        ))}
      </div>
    </div>
  );
}
