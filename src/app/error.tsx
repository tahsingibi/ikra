"use client";

import Link from "next/link";
import { useOnline } from "@/hooks/use-online";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const online = useOnline();
  return (
    <div className="py-16">
      <h1 className="text-2xl font-semibold">Bir şeyler ters gitti</h1>
      <p className="mt-2 text-sm text-muted">
        {online
          ? error.message
          : "İnternet yok. Uygulama kabuğu yüklendiyse sureler, meal, tefsir, arama ve notlar çevrimdışı çalışır. Ses için bağlantı gerekir."}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-accent px-4 py-2 text-[var(--bg)]"
          onClick={reset}
        >
          Yeniden dene
        </button>
        <Link href="/" className="rounded-full bg-mute px-4 py-2 text-sm">
          Ana sayfa
        </Link>
      </div>
    </div>
  );
}
