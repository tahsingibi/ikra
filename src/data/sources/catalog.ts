import type {
  OfflinePack,
  Reciter,
  TafsirSource,
  TranslationSource,
} from "@/types/quran";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://ikra.sungur.dev";

export const GITHUB_REPO_URL =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL || "https://github.com/tahsingibi/ikra";

export const QURAN_SOURCE = {
  id: "quran-uthmani",
  name: "Mushaf (Uthmânî hattı)",
  author: "Tanzil Project",
  language: "ar",
  source: "AlQuran Cloud / Tanzil Uthmani",
  license: "Tanzil Public License — https://tanzil.net/docs/license",
  file: "/data/quran-uthmani.json",
} as const;

export const TRANSLATION_SOURCES: TranslationSource[] = [
  {
    id: "tr.diyanet",
    name: "Diyanet İşleri",
    author: "Diyanet İşleri Başkanlığı",
    description: "Günümüz Türkçesine yakın, yaygın kullanılan meal.",
    language: "tr",
    source: "https://alquran.cloud/edition/tr.diyanet",
    license: "Telif Diyanet İşleri Başkanlığı’na aittir. Ticari kullanım için izin gerekir.",
    file: "/data/translation-tr-diyanet.json",
  },
  {
    id: "tr.yazir",
    name: "Elmalılı Hamdi Yazır",
    author: "Elmalılı Muhammed Hamdi Yazır",
    description: "Klasik üsluplu, köklü Türkçe meal.",
    language: "tr",
    source: "https://alquran.cloud/edition/tr.yazir",
    license: "Müellif telifi geçerli olabilir. Ticari kullanım için izin kontrol edin.",
    file: "/data/translation-tr-yazir.json",
  },
  {
    id: "tr.vakfi",
    name: "Diyanet Vakfı",
    author: "Türkiye Diyanet Vakfı",
    description: "Diyanet Vakfı heyeti tarafından hazırlanan meal.",
    language: "tr",
    source: "https://alquran.cloud/edition/tr.vakfi",
    license: "Telif Türkiye Diyanet Vakfı’na aittir.",
    file: "/data/translation-tr-vakfi.json",
  },
];

export const TRANSLITERATION_SOURCE = {
  id: "tr.transliteration",
  name: "Türkçe okunuş",
  author: "Muhammet Abay",
  description: "Arapça metni takip ederek okumayı kolaylaştıran Türkçe çeviriyazı.",
  language: "tr",
  source: "https://alquran.cloud/edition/tr.transliteration",
  license: "Kaynak API aktarımı. Yeniden dağıtım koşullarını kontrol edin.",
  file: "/data/transliteration-tr-abay.json",
} as const;

export const TAFSIR_SOURCES: TafsirSource[] = [
  {
    id: "tr.mokhtasar",
    name: "Muhtasar Kur’an Tefsiri",
    author: "Tefsir Heyeti (Türkçe Tercüme)",
    description: "Ayet ayet kısa, açık ve anlaşılır Türkçe tefsir.",
    language: "tr",
    languageLabel: "Türkçe",
    source: "Muhtasar Tefsir API Derlemesi",
    license: "Açık kaynak İslami derleme.",
    file: "/data/tafsir-tr-mokhtasar.json",
  },
  {
    id: "tr.ibnkathir",
    name: "İbn Kesir Tefsiri",
    author: "Hafız İbn Kesir",
    description: "Klasik rivayet tefsirinin Türkçe tercümesi.",
    language: "tr",
    languageLabel: "Türkçe",
    source: "İbn Kesir Tercümesi",
    license: "Klasik eser tercümesi.",
    file: "/data/tafsir-tr-ibnkathir.json",
  },
  {
    id: "ar.jalalayn",
    name: "Celâleyn",
    author: "el-Mahallî & es-Süyûtî",
    description: "Klasik, ayet ayet kısa tefsir (Arapça).",
    language: "ar",
    languageLabel: "Arapça",
    source: "https://alquran.cloud/edition/ar.jalalayn",
    license: "Klasik eser (kamu malı metin), AlQuran Cloud.",
    file: "/data/tafsir-ar-jalalayn.json",
  },
  {
    id: "ar.muyassar",
    name: "el-Müyesser",
    author: "King Fahd Quran Complex",
    description: "Sadeleştirilmiş Arapça tefsir.",
    language: "ar",
    languageLabel: "Arapça",
    source: "https://alquran.cloud/edition/ar.muyassar",
    license: "King Fahd Complex yayını.",
    file: "/data/tafsir-ar-muyassar.json",
  },
];

export const RECITERS: Reciter[] = [
  {
    id: "ar.alafasy",
    name: "Mişari Raşid el-Afasi",
    language: "ar",
    style: "Hafs",
    bitrate: 128,
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy",
  },
  {
    id: "ar.husary",
    name: "Mahmud Halil el-Husari",
    language: "ar",
    style: "Hafs / mücevved",
    bitrate: 128,
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary",
  },
  {
    id: "ar.abdulbasitmurattal",
    name: "Abdülbasit Abdüssamed (murattal)",
    language: "ar",
    style: "Hafs / murattal",
    bitrate: 128,
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal",
  },
  {
    id: "ar.minshawimujawwad",
    name: "Muhammed Sıddık el-Minşavi",
    language: "ar",
    style: "Hafs / mücevved",
    bitrate: 128,
    audioBaseUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawimujawwad",
  },
];

export const OFFLINE_PACKS: OfflinePack[] = [
  {
    id: "quran-uthmani",
    name: "Kur’an Arapça metni",
    description: "Uthmânî hat, ayet bazlı.",
    required: true,
    bytesEstimate: 900_000,
    file: QURAN_SOURCE.file,
  },
  {
    id: "tr.transliteration",
    name: "Türkçe okunuş",
    description: "Muhammet Abay çeviriyazısı.",
    bytesEstimate: 800_000,
    file: TRANSLITERATION_SOURCE.file,
  },
  {
    id: "tr.diyanet",
    name: "Diyanet Meali",
    description: "Varsayılan Türkçe meal.",
    bytesEstimate: 1_100_000,
    file: "/data/translation-tr-diyanet.json",
  },
  {
    id: "tr.yazir",
    name: "Elmalılı Meali",
    description: "Elmalılı Hamdi Yazır.",
    bytesEstimate: 1_400_000,
    file: "/data/translation-tr-yazir.json",
  },
  {
    id: "tr.vakfi",
    name: "Diyanet Vakfı Meali",
    description: "Türkiye Diyanet Vakfı.",
    bytesEstimate: 1_200_000,
    file: "/data/translation-tr-vakfi.json",
  },
  {
    id: "tr.mokhtasar",
    name: "Muhtasar Tefsir (Türkçe)",
    description: "Türkçe kısa ve anlaşılır tefsir.",
    bytesEstimate: 1_800_000,
    file: "/data/tafsir-tr-mokhtasar.json",
  },
  {
    id: "tr.ibnkathir",
    name: "İbn Kesir Tefsiri (Türkçe)",
    description: "Klasik tefsir Türkçe tercümesi.",
    bytesEstimate: 800_000,
    file: "/data/tafsir-tr-ibnkathir.json",
  },
  {
    id: "ar.jalalayn",
    name: "Celâleyn Tefsiri (Arapça)",
    description: "Klasik Arapça tefsir.",
    bytesEstimate: 2_400_000,
    file: "/data/tafsir-ar-jalalayn.json",
  },
  {
    id: "ar.muyassar",
    name: "el-Müyesser Tefsiri (Arapça)",
    description: "Sade Arapça tefsir.",
    bytesEstimate: 1_800_000,
    file: "/data/tafsir-ar-muyassar.json",
  },
];

export function getTranslationSource(id: string) {
  return TRANSLATION_SOURCES.find((item) => item.id === id) ?? TRANSLATION_SOURCES[0];
}

export function getTafsirSource(id: string) {
  return TAFSIR_SOURCES.find((item) => item.id === id) ?? TAFSIR_SOURCES[0];
}

export function getReciter(id: string) {
  return RECITERS.find((item) => item.id === id) ?? RECITERS[0];
}

export function getOfflinePack(id: string) {
  return OFFLINE_PACKS.find((item) => item.id === id);
}
