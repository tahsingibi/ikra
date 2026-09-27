import type {
  LayerSettings,
  ReadingMode,
  UserSettings,
} from "@/types/quran";

export const SETTINGS_KEY = "ikra.settings";
export const THEME_KEY = "ikra.theme";

export const DEFAULT_LAYERS: LayerSettings = {
  arabic: true,
  transliteration: true,
  translation: true,
  tafsir: false,
  verseNumber: true,
  wordByWord: false,
};

export const READING_MODE_LAYERS: Record<
  Exclude<ReadingMode, "custom">,
  LayerSettings
> = {
  classic: {
    ...DEFAULT_LAYERS,
    transliteration: false,
    tafsir: false,
  },
  detailed: {
    ...DEFAULT_LAYERS,
    tafsir: true,
  },
  arabic: {
    arabic: true,
    transliteration: false,
    translation: false,
    tafsir: false,
    verseNumber: true,
    wordByWord: false,
  },
};

export const DEFAULT_SETTINGS: UserSettings = {
  layers: DEFAULT_LAYERS,
  readingMode: "detailed",
  theme: "system",
  arabicFontSize: 30,
  translationFontSize: 17,
  lineHeight: 1.9,
  pageWidth: "readable",
  translationSourceId: "tr.diyanet",
  tafsirSourceId: "tr.mokhtasar",
  readingOrder: "mushaf",
  nuzulSourceId: "egyptian",
  reciterId: "ar.alafasy",
  playbackRate: 1,
  volume: 1,
  autoplayNext: true,
  repeatMode: "off",
  showDailyVerse: true,
  highContrast: false,
};

export function layersForMode(mode: ReadingMode, current?: LayerSettings) {
  if (mode === "custom") return current ?? DEFAULT_LAYERS;
  return { ...READING_MODE_LAYERS[mode] };
}

export function detectReadingMode(layers: LayerSettings): ReadingMode {
  const modes = ["classic", "detailed", "arabic"] as const;
  for (const mode of modes) {
    const preset = READING_MODE_LAYERS[mode];
    if (
      preset.arabic === layers.arabic &&
      preset.transliteration === layers.transliteration &&
      preset.translation === layers.translation &&
      preset.tafsir === layers.tafsir
    ) {
      return mode;
    }
  }
  return "custom";
}

export function applyTheme(theme: UserSettings["theme"]) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = theme === "dark" || theme === "oled" || (theme === "system" && prefersDark);
  root.classList.toggle("dark", dark);
  root.classList.toggle("oled", theme === "oled");
  root.classList.toggle("high-contrast", false);
  root.dataset.theme = theme;
  window.localStorage.setItem(THEME_KEY, theme);
}

export function readSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    const merged: UserSettings = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      layers: { ...DEFAULT_LAYERS, ...parsed.layers },
    };
    merged.readingMode = detectReadingMode(merged.layers);
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function writeSettings(settings: UserSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applyTheme(settings.theme);
  document.documentElement.classList.toggle("high-contrast", settings.highContrast);
  document.documentElement.style.setProperty(
    "--arabic-size",
    `${settings.arabicFontSize}px`,
  );
  document.documentElement.style.setProperty(
    "--translation-size",
    `${settings.translationFontSize}px`,
  );
  document.documentElement.style.setProperty(
    "--reading-leading",
    String(settings.lineHeight),
  );
}
