"use client";

import { useSettings } from "@/hooks/use-settings";
import type { LayerSettings } from "@/types/quran";

const OPTIONS: Array<{ key: keyof LayerSettings; label: string }> = [
  { key: "arabic", label: "Arapça" },
  { key: "transliteration", label: "Türkçe okunuş" },
  { key: "translation", label: "Meal" },
  { key: "tafsir", label: "Tefsir" },
];

export function LayerToggles() {
  const { settings, setLayer, setMode } = useSettings();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Okuma katmanları">
        {OPTIONS.map((option) => (
          <label
            key={option.key}
            className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm"
          >
            <input
              type="checkbox"
              checked={settings.layers[option.key]}
              onChange={(event) => setLayer(option.key, event.target.checked)}
            />
            {option.label}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Hazır görünümler">
        {[
          { id: "classic", label: "Klasik" },
          { id: "detailed", label: "Detaylı" },
          { id: "arabic", label: "Sadece Arapça" },
        ].map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm ${
              settings.readingMode === mode.id ? "bg-accent text-[var(--bg)]" : "bg-mute"
            }`}
            onClick={() => setMode(mode.id as "classic" | "detailed" | "arabic")}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}
