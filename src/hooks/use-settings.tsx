"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_SETTINGS,
  applyTheme,
  detectReadingMode,
  layersForMode,
  readSettings,
  writeSettings,
} from "@/lib/settings";
import type { LayerSettings, ReadingMode, UserSettings } from "@/types/quran";

type SettingsContextValue = {
  settings: UserSettings;
  ready: boolean;
  update: (patch: Partial<UserSettings>) => void;
  setLayer: (key: keyof LayerSettings, value: boolean) => void;
  setMode: (mode: ReadingMode) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(readSettings().theme);
    media.addEventListener("change", onChange);
    const frame = window.requestAnimationFrame(() => {
      const loaded = readSettings();
      setSettings(loaded);
      writeSettings(loaded);
      setReady(true);
    });
    return () => {
      media.removeEventListener("change", onChange);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const persist = useCallback((next: UserSettings) => {
    const normalized = {
      ...next,
      readingMode: detectReadingMode(next.layers),
    };
    setSettings(normalized);
    writeSettings(normalized);
  }, []);

  const update = useCallback(
    (patch: Partial<UserSettings>) => {
      persist({ ...settings, ...patch });
    },
    [persist, settings],
  );

  const setLayer = useCallback(
    (key: keyof LayerSettings, value: boolean) => {
      persist({
        ...settings,
        layers: { ...settings.layers, [key]: value },
      });
    },
    [persist, settings],
  );

  const setMode = useCallback(
    (mode: ReadingMode) => {
      persist({
        ...settings,
        readingMode: mode,
        layers: layersForMode(mode, settings.layers),
      });
    },
    [persist, settings],
  );

  const value = useMemo(
    () => ({ settings, ready, update, setLayer, setMode }),
    [ready, setLayer, setMode, settings, update],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings SettingsProvider dışında kullanıldı.");
  return context;
}
