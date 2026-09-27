import { NUZUL_SOURCES } from "@/data/nuzul";
import { SurahList } from "@/features/library/surah-list";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Nüzul sırası",
  description: "Kur’an’ı ilk inen sureden son inene doğru oku.",
  path: "/nuzul",
});

export default function NuzulPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold">Nüzul sırasına göre Kur’an</h1>
      <p className="mb-4 max-w-2xl text-sm text-muted">
        Varsayılan sıra Mısır / Tanzil kronolojisidir. Ayarlardan Nöldeke sırasını da seçebilirsin.
      </p>
      <ul className="mb-6 grid gap-2 text-sm text-muted">
        {NUZUL_SOURCES.map((source) => (
          <li key={source.id}>
            <strong className="text-foreground">{source.name}:</strong> {source.description}
          </li>
        ))}
      </ul>
      <SurahList order="nuzul" />
    </div>
  );
}
