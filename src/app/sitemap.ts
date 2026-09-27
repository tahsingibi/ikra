import type { MetadataRoute } from "next";
import { SURAHS } from "@/data/surahs";
import { SITE_URL } from "@/data/sources/catalog";
import { surahPath, versePath } from "@/lib/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/sureler", "/nuzul", "/cuz", "/ara", "/sayfa"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    }),
  );

  const surahRoutes = SURAHS.map((surah) => ({
    url: `${SITE_URL}${surahPath(surah.number)}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const verseRoutes = SURAHS.flatMap((surah) =>
    Array.from({ length: surah.ayahCount }, (_, index) => ({
      url: `${SITE_URL}${versePath(surah.number, index + 1)}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  );

  return [...staticRoutes, ...surahRoutes, ...verseRoutes];
}
