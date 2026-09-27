"use client";

import { useOnline } from "@/hooks/use-online";

export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div
      role="status"
      className="border-b border-line bg-accent-soft px-4 py-2 text-center text-sm"
    >
      İnternet bağlantısı yok. Metin, meal, notlar ve kayıtlı içerikler çevrimdışı çalışır. Ses için bağlantı gerekir.
    </div>
  );
}
