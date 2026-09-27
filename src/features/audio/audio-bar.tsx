"use client";

import { useEffect, useRef } from "react";
import { getSurah } from "@/data/surahs";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/use-audio";
import { useSettings } from "@/hooks/use-settings";

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AudioBar() {
  const audio = useAudio();
  const { settings, update } = useSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !audio.surah) {
      document.documentElement.style.setProperty("--player-h", "0px");
      return;
    }
    const apply = () => {
      document.documentElement.style.setProperty("--player-h", `${node.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty("--player-h", "0px");
    };
  }, [audio.surah]);

  if (!audio.surah || !audio.ayah) return null;
  const surah = getSurah(audio.surah);

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-elevated/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {surah?.name} {audio.ayah}
            </p>
            {audio.error ? (
              <p className="text-xs text-warn">{audio.error}</p>
            ) : (
              <p className="text-xs text-muted">
                {formatTime(audio.progress)} / {formatTime(audio.duration)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={audio.previous} aria-label="Önceki ayet">
              ‹
            </Button>
            <Button
              size="icon"
              onClick={audio.toggle}
              aria-label={audio.playing ? "Duraklat" : "Oynat"}
            >
              {audio.loading ? "…" : audio.playing ? "❚❚" : "▶"}
            </Button>
            <Button size="icon" variant="ghost" onClick={audio.next} aria-label="Sonraki ayet">
              ›
            </Button>
            <Button size="icon" variant="ghost" onClick={audio.close} aria-label="Oynatıcıyı kapat">
              ×
            </Button>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={audio.duration ? audio.progress / audio.duration : 0}
          onChange={(event) => audio.seek(Number(event.target.value))}
          aria-label="Ses ilerlemesi"
        />
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <button type="button" onClick={audio.replaySurah}>
            Sureyi baştan oynat
          </button>
          <label className="flex items-center gap-1">
            Hız
            <select
              className="relative z-10 rounded-md bg-mute px-1 py-0.5"
              value={settings.playbackRate}
              onChange={(event) => update({ playbackRate: Number(event.target.value) })}
            >
              {[0.75, 1, 1.25, 1.5].map((rate) => (
                <option key={rate} value={rate}>
                  {rate}x
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            Ses
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(event) => update({ volume: Number(event.target.value) })}
              aria-label="Ses seviyesi"
            />
          </label>
          <label className="flex items-center gap-1">
            Tekrar
            <select
              className="relative z-10 rounded-md bg-mute px-1 py-0.5"
              value={settings.repeatMode}
              onChange={(event) =>
                update({
                  repeatMode: event.target.value as typeof settings.repeatMode,
                })
              }
            >
              <option value="off">Kapalı</option>
              <option value="verse">Ayet</option>
              <option value="surah">Sure</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
