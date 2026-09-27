import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "İKRA",
    short_name: "İKRA",
    description: "Kur’an okuma, meal, tefsir ve nüzul sırası.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3eee6",
    theme_color: "#3f5a48",
    lang: "tr",
    dir: "ltr",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
