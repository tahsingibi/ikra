export type RevelationPlace = "meccan" | "medinan";
export type ReadingOrder = "mushaf" | "nuzul";
export type SajdaType = "recommended" | "obligatory";

export type VerseId = `${number}:${number}`;

export type Surah = {
  number: number;
  slug: string;
  name: string;
  nameArabic: string;
  transliteratedName: string;
  englishName: string;
  meaning: string;
  ayahCount: number;
  revelation: RevelationPlace;
  nuzulOrder: number;
  about: string;
};

export type VerseLocation = {
  surah: number;
  ayah: number;
  globalNumber: number;
  juz: number;
  page: number;
  hizb: number;
  hizbQuarter: number;
  manzil: number;
  ruku: number;
  sajda: SajdaType | null;
};

export type Verse = VerseLocation & {
  id: VerseId;
  text: string;
};

export type ReaderVerse = Verse & {
  transliteration: string;
  translation: string;
  tafsir: string;
};

export type VersePack = {
  id: string;
  type: "quran" | "translation" | "transliteration" | "tafsir";
  name: string;
  author: string;
  language: string;
  direction: "rtl" | "ltr";
  source: string;
  license: string;
  downloadedAt?: string;
  surahCount: number;
  verseCount: number;
  verses: string[][];
  verseMeta?: VerseMetaCell[][];
};

export type VerseMetaCell = {
  g: number;
  j: number;
  p: number;
  h: number;
  m: number;
  r: number;
  s: SajdaType | null;
};

export type TranslationSource = {
  id: string;
  name: string;
  author: string;
  description: string;
  language: string;
  source: string;
  license: string;
  file: string;
};

export type TafsirSource = TranslationSource & {
  languageLabel: string;
};

export type Reciter = {
  id: string;
  name: string;
  language: string;
  style: string;
  bitrate: number;
  audioBaseUrl: string;
};

export type WordAnalysis = {
  verseId: VerseId;
  position: number;
  arabic: string;
  translation?: string;
  root?: string;
  partOfSpeech?: string;
};

export type Bookmark = {
  id: string;
  verseId?: string;
  surah: number;
  ayah: number;
  createdAt: string;
  label?: string;
};
export type BookmarkItem = Bookmark;

export type Favorite = {
  id: string;
  verseId?: string;
  surah: number;
  ayah: number;
  createdAt: string;
};
export type FavoriteItem = Favorite;

export type Note = {
  id: string;
  verseId?: string;
  surah: number;
  ayah: number;
  body: string;
  createdAt: string;
  updatedAt: string;
};
export type NoteItem = Note;

export type ReadingHistoryEntry = {
  id: string;
  surah: number;
  ayah: number;
  openedAt: string;
};

export type ReadingProgress = {
  surah: number;
  ayah: number;
  order: ReadingOrder;
  updatedAt: string;
  deviceId?: string;
};

export type AudioState = {
  surah: number;
  ayah: number;
  playing: boolean;
  duration: number;
  currentTime: number;
  reciterId: string;
  playbackRate: number;
  volume: number;
  autoplayNext: boolean;
  repeatMode: "off" | "verse" | "surah";
};

export type ReadingPlanId =
  | "page-1"
  | "page-5"
  | "page-10"
  | "khatm-30"
  | "nuzul"
  | "one-page"
  | "five-pages"
  | "ten-pages"
  | "thirty-days";

export type ReadingPlan = {
  id: ReadingPlanId;
  title: string;
  description: string;
  unit: "page" | "surah";
  dailyTarget: number;
  totalUnits: number;
};

export type ReadingPlanState = {
  planId: ReadingPlanId;
  startedAt: string;
  completedUnits: number;
  lastCompletedAt?: string;
};
export type UserPlanProgress = ReadingPlanState;

export type OfflinePackId =
  | "quran-uthmani"
  | "tr.transliteration"
  | "tr.diyanet"
  | "tr.yazir"
  | "tr.vakfi"
  | "tr.mokhtasar"
  | "tr.ibnkathir"
  | "ar.jalalayn"
  | "ar.muyassar";

export type OfflinePack = {
  id: OfflinePackId;
  name: string;
  description: string;
  required?: boolean;
  bytesEstimate: number;
  file: string;
};

export type ThemePreference = "light" | "dark" | "oled" | "system";

export type ReadingMode = "classic" | "detailed" | "arabic" | "custom";

export type LayerSettings = {
  arabic: boolean;
  transliteration: boolean;
  translation: boolean;
  tafsir: boolean;
  verseNumber: boolean;
  wordByWord: boolean;
};

export type UserSettings = {
  layers: LayerSettings;
  readingMode: ReadingMode;
  theme: ThemePreference;
  arabicFontSize: number;
  translationFontSize: number;
  lineHeight: number;
  pageWidth: "narrow" | "readable" | "wide";
  translationSourceId: string;
  tafsirSourceId: string;
  readingOrder: ReadingOrder;
  nuzulSourceId: "egyptian" | "noldeke";
  reciterId: string;
  playbackRate: number;
  volume: number;
  autoplayNext: boolean;
  repeatMode: "off" | "verse" | "surah";
  showDailyVerse: boolean;
  highContrast: boolean;
};

export type SearchHit = {
  verseId: VerseId;
  surah: number;
  ayah: number;
  field: "arabic" | "translation" | "transliteration" | "tafsir" | "surah";
  snippet: string;
  arabic: string;
  translation?: string;
  transliteration?: string;
  tafsir?: string;
};

export type SearchFilters = {
  query: string;
  surah?: number;
  juz?: number;
  revelation?: RevelationPlace | "all";
  order?: ReadingOrder;
  translationSourceId?: string;
  tafsirSourceId?: string;
};

export type SyncOp = {
  id: string;
  entity: "bookmark" | "favorite" | "note" | "progress" | "settings" | "plan";
  action: "upsert" | "delete";
  payload: unknown;
  updatedAt: string;
};

export type IdentityProvider = "google" | "apple" | "email";

export type UserAccount = {
  id: string;
  provider?: IdentityProvider;
  displayName?: string;
  email?: string;
};

export type DataManifestPack = {
  id: string;
  type: VersePack["type"];
  file: string;
  name: string;
  author: string;
  language: string;
  direction?: "rtl" | "ltr";
  license: string;
  verseCount?: number;
};
