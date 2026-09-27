import { OfflineManager } from "@/features/offline/offline-manager";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Çevrimdışı içerik",
  path: "/cevrimdisi",
});

export default function OfflinePage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Çevrimdışı içerik</h1>
      <OfflineManager />
    </div>
  );
}
