import { SettingsForm } from "@/features/settings/settings-form";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Ayarlar",
  path: "/ayarlar",
});

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Ayarlar</h1>
      <SettingsForm />
      <p className="mt-10 text-sm">
        <Link href="/cevrimdisi" className="text-accent">
          Çevrimdışı içerik yönetimi
        </Link>
      </p>
    </div>
  );
}
