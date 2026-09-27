import type { Metadata } from "next";
import { getSurah } from "@/data/surahs";
import { SITE_URL } from "@/data/sources/catalog";

export const siteName = "İKRA";

export const defaultDescription =
  "Kur’an okumak, anlamak ve nüzul sırasını takip etmek için modern, çevrimdışı öncelikli okuma uygulaması.";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function verseTitle(surah: number, ayah: number) {
  const meta = getSurah(surah);
  return `${meta?.name ?? surah} Suresi ${ayah}. Ayet`;
}

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title === siteName ? siteName : `${title} — ${siteName}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "tr_TR",
      url,
      siteName,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
