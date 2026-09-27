"use client";

import {
  RECITERS,
  TAFSIR_SOURCES,
  TRANSLATION_SOURCES,
} from "@/data/sources/catalog";
import { NUZUL_SOURCES } from "@/data/nuzul";
import { LayerToggles } from "@/features/reader/layer-toggles";
import { useSettings } from "@/hooks/use-settings";
import { clamp } from "@/lib/utils";

export function SettingsForm() {
  const { settings, update } = useSettings();

  return (
    <div className="grid max-w-2xl gap-10">
      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Okuma</h2>
        <LayerToggles />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.layers.verseNumber}
            onChange={(event) =>
              update({
                layers: { ...settings.layers, verseNumber: event.target.checked },
              })
            }
          />
          Ayet numarası
        </label>
        <p className="text-sm text-muted">
          Kelime kelime görünüm bu sürümde kapalı; veri modeli ileride kök, tür ve konum bilgisi için hazır.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Görünüm</h2>
        <div className="flex flex-wrap gap-2">
          {(["system", "light", "dark", "oled"] as const).map((theme) => (
            <button
              key={theme}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm ${
                settings.theme === theme ? "bg-accent text-[var(--bg)]" : "bg-mute"
              }`}
              onClick={() => update({ theme })}
            >
              {theme === "system"
                ? "Sistem"
                : theme === "light"
                  ? "Açık"
                  : theme === "dark"
                    ? "Koyu"
                    : "OLED siyah"}
            </button>
          ))}
        </div>
        <label className="text-sm">
          Arapça yazı boyutu {settings.arabicFontSize}px
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-mute px-3 py-1"
              onClick={() =>
                update({ arabicFontSize: clamp(settings.arabicFontSize - 2, 18, 48) })
              }
            >
              −
            </button>
            <input
              type="range"
              min={18}
              max={48}
              value={settings.arabicFontSize}
              onChange={(event) =>
                update({ arabicFontSize: Number(event.target.value) })
              }
            />
            <button
              type="button"
              className="rounded-full bg-mute px-3 py-1"
              onClick={() =>
                update({ arabicFontSize: clamp(settings.arabicFontSize + 2, 18, 48) })
              }
            >
              +
            </button>
          </div>
        </label>
        <label className="text-sm">
          Meal yazı boyutu {settings.translationFontSize}px
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-mute px-3 py-1"
              onClick={() =>
                update({
                  translationFontSize: clamp(settings.translationFontSize - 1, 14, 28),
                })
              }
            >
              −
            </button>
            <input
              type="range"
              min={14}
              max={28}
              value={settings.translationFontSize}
              onChange={(event) =>
                update({ translationFontSize: Number(event.target.value) })
              }
            />
            <button
              type="button"
              className="rounded-full bg-mute px-3 py-1"
              onClick={() =>
                update({
                  translationFontSize: clamp(settings.translationFontSize + 1, 14, 28),
                })
              }
            >
              +
            </button>
          </div>
        </label>
        <label className="text-sm">
          Satır yüksekliği {settings.lineHeight.toFixed(1)}
          <input
            className="mt-1 block w-full"
            type="range"
            min={1.4}
            max={2.4}
            step={0.1}
            value={settings.lineHeight}
            onChange={(event) => update({ lineHeight: Number(event.target.value) })}
          />
        </label>
        <div className="flex gap-2">
          {(["narrow", "readable", "wide"] as const).map((width) => (
            <button
              key={width}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm ${
                settings.pageWidth === width ? "bg-accent text-[var(--bg)]" : "bg-mute"
              }`}
              onClick={() => update({ pageWidth: width })}
            >
              {width === "narrow" ? "Dar" : width === "wide" ? "Geniş" : "Okuma"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(event) => update({ highContrast: event.target.checked })}
          />
          Yüksek kontrast
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.showDailyVerse}
            onChange={(event) => update({ showDailyVerse: event.target.checked })}
          />
          Günün ayetini göster
        </label>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Meal</h2>
        <select
          className="h-11 rounded-2xl border border-line bg-transparent px-3"
          value={settings.translationSourceId}
          onChange={(event) => update({ translationSourceId: event.target.value })}
        >
          {TRANSLATION_SOURCES.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Tefsir</h2>
        <select
          className="h-11 rounded-2xl border border-line bg-transparent px-3"
          value={settings.tafsirSourceId}
          onChange={(event) => update({ tafsirSourceId: event.target.value })}
        >
          {TAFSIR_SOURCES.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name} ({source.languageLabel})
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Okuma sırası</h2>
        <div className="flex gap-2">
          {(["mushaf", "nuzul"] as const).map((order) => (
            <button
              key={order}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm ${
                settings.readingOrder === order ? "bg-accent text-[var(--bg)]" : "bg-mute"
              }`}
              onClick={() => update({ readingOrder: order })}
            >
              {order === "mushaf" ? "Mushaf sırası" : "Nüzul sırası"}
            </button>
          ))}
        </div>
        <select
          className="h-11 rounded-2xl border border-line bg-transparent px-3"
          value={settings.nuzulSourceId}
          onChange={(event) =>
            update({ nuzulSourceId: event.target.value as "egyptian" | "noldeke" })
          }
        >
          {NUZUL_SOURCES.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Ses</h2>
        <select
          className="h-11 rounded-2xl border border-line bg-transparent px-3"
          value={settings.reciterId}
          onChange={(event) => update({ reciterId: event.target.value })}
        >
          {RECITERS.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.autoplayNext}
            onChange={(event) => update({ autoplayNext: event.target.checked })}
          />
          Otomatik sonraki ayet
        </label>
      </section>
    </div>
  );
}
