export type SourceAdapter = {
  id: string;
  name: string;
  baseUrl: string;
  quranEdition: string;
  translationEditions: string[];
  transliterationEdition: string;
  tafsirEditions: string[];
  audioCdn: string;
};

export const alQuranCloudAdapter: SourceAdapter = {
  id: "alquran-cloud",
  name: "AlQuran Cloud",
  baseUrl: "https://api.alquran.cloud/v1",
  quranEdition: "quran-uthmani",
  translationEditions: ["tr.diyanet", "tr.yazir", "tr.vakfi"],
  transliterationEdition: "tr.transliteration",
  tafsirEditions: ["ar.jalalayn", "ar.muyassar"],
  audioCdn: "https://cdn.islamic.network/quran/audio/128",
};

export const activeQuranSource = alQuranCloudAdapter;
