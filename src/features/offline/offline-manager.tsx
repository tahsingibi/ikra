"use client";

import { useEffect, useMemo, useState } from "react";
import { OFFLINE_PACKS } from "@/data/sources/catalog";
import { formatBytes } from "@/lib/utils";
import {
  downloadPack,
  estimateSelectedBytes,
  isPackStored,
  removePack,
} from "@/services/offline";
import type { OfflinePackId } from "@/types/quran";
import { Button } from "@/components/ui/button";

export function OfflineManager() {
  const [selected, setSelected] = useState<OfflinePackId[]>([
    "quran-uthmani",
    "tr.transliteration",
    "tr.diyanet",
  ]);
  const [stored, setStored] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    const entries = await Promise.all(
      OFFLINE_PACKS.map(async (pack) => [pack.id, await isPackStored(pack.id)] as const),
    );
    setStored(Object.fromEntries(entries));
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void refresh();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const total = useMemo(() => estimateSelectedBytes(selected), [selected]);

  return (
    <div className="grid max-w-xl gap-4">
      <p className="text-sm text-muted">
        Çevrimdışı kullanım için Kur’an verilerini indir. Ses dosyaları indirilmez; dinlemek için internet gerekir.
      </p>
      <ul className="grid gap-2">
        {OFFLINE_PACKS.map((pack) => (
          <li key={pack.id} className="flex items-center justify-between rounded-2xl border border-line px-3 py-3">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(pack.id)}
                disabled={pack.required}
                onChange={(event) => {
                  setSelected((current) =>
                    event.target.checked
                      ? [...current, pack.id]
                      : current.filter((id) => id !== pack.id),
                  );
                }}
              />
              <span>
                {pack.name}
                <span className="block text-xs text-muted">
                  {stored[pack.id] ? "İndirildi" : "İndirilmedi"} · {formatBytes(pack.bytesEstimate)}
                </span>
              </span>
            </label>
            {stored[pack.id] && !pack.required ? (
              <button
                type="button"
                className="text-xs text-warn"
                onClick={async () => {
                  await removePack(pack.id);
                  await refresh();
                }}
              >
                Sil
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="text-sm">Toplam tahmini: {formatBytes(total)}</p>
      <Button
        disabled={Boolean(busy)}
        onClick={async () => {
          try {
            setMessage(null);
            for (const id of selected) {
              setBusy(id);
              await downloadPack(id);
            }
            setMessage("Çevrimdışı içerik hazır.");
            await refresh();
          } catch (error) {
            setMessage(
              error instanceof Error
                ? error.message
                : "İndirme başarısız. İnternet bağlantısı yok.",
            );
          } finally {
            setBusy(null);
          }
        }}
      >
        {busy ? `İndiriliyor: ${busy}` : "Çevrimdışı içeriği indir"}
      </Button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </div>
  );
}
