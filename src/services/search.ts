import MiniSearch, { type SearchResult } from "minisearch";
import { SURAHS } from "@/data/surahs";
import { snippetAround, verseId } from "@/lib/utils";
import { loadPack } from "@/services/pack-loader";
import { TRANSLITERATION_SOURCE } from "@/data/sources/catalog";
import type { SearchFilters, SearchHit, VersePack } from "@/types/quran";

type IndexedDoc = {
  id: string;
  surah: number;
  ayah: number;
  arabic: string;
  transliteration: string;
  translation: string;
  tafsir: string;
  surahName: string;
  revelation: string;
  juz?: number;
};

const indexes = new Map<string, MiniSearch<IndexedDoc>>();
const docsCache = new Map<string, IndexedDoc[]>();

function indexKey(translationId: string, tafsirId: string) {
  return `${translationId}::${tafsirId}`;
}

async function buildDocs(
  translationId: string,
  tafsirId: string,
): Promise<IndexedDoc[]> {
  const cacheKey = indexKey(translationId, tafsirId);
  const cached = docsCache.get(cacheKey);
  if (cached) return cached;

  const [quran, transliteration, translation, tafsir] = await Promise.all([
    loadPack("quran-uthmani"),
    loadPack(TRANSLITERATION_SOURCE.id),
    loadPack(translationId),
    loadPack(tafsirId),
  ]);

  const docs: IndexedDoc[] = [];
  for (const surah of SURAHS) {
    for (let ayah = 1; ayah <= surah.ayahCount; ayah += 1) {
      const cell = (quran as VersePack).verseMeta?.[surah.number - 1]?.[ayah - 1];
      docs.push({
        id: verseId(surah.number, ayah),
        surah: surah.number,
        ayah,
        arabic: quran.verses[surah.number - 1][ayah - 1],
        transliteration: transliteration.verses[surah.number - 1][ayah - 1],
        translation: translation.verses[surah.number - 1][ayah - 1],
        tafsir: tafsir.verses[surah.number - 1][ayah - 1],
        surahName: `${surah.name} ${surah.nameArabic}`,
        revelation: surah.revelation,
        juz: cell?.j,
      });
    }
  }
  docsCache.set(cacheKey, docs);
  return docs;
}

async function getIndex(translationId: string, tafsirId: string) {
  const key = indexKey(translationId, tafsirId);
  const existing = indexes.get(key);
  if (existing) return existing;
  const docs = await buildDocs(translationId, tafsirId);
  const mini = new MiniSearch<IndexedDoc>({
    fields: ["arabic", "transliteration", "translation", "tafsir", "surahName"],
    storeFields: [
      "surah",
      "ayah",
      "arabic",
      "transliteration",
      "translation",
      "tafsir",
      "surahName",
      "revelation",
      "juz",
    ],
    searchOptions: {
      boost: {
        translation: 3,
        transliteration: 2,
        surahName: 4,
        tafsir: 1.4,
        arabic: 1.2,
      },
      prefix: true,
      fuzzy: 0.15,
    },
  });
  mini.addAll(docs);
  indexes.set(key, mini);
  return mini;
}

function fieldFromMatch(result: SearchResult, query: string): SearchHit["field"] {
  const terms = query.toLocaleLowerCase("tr-TR");
  const doc = result as SearchResult & IndexedDoc;
  if (doc.surahName?.toLocaleLowerCase("tr-TR").includes(terms)) return "surah";
  if (doc.translation?.toLocaleLowerCase("tr-TR").includes(terms)) return "translation";
  if (doc.transliteration?.toLocaleLowerCase("tr-TR").includes(terms)) {
    return "transliteration";
  }
  if (doc.tafsir?.toLocaleLowerCase("tr-TR").includes(terms)) return "tafsir";
  return "arabic";
}

export async function searchQuran(filters: SearchFilters): Promise<SearchHit[]> {
  const query = filters.query.trim();
  if (query.length < 2) return [];

  const translationId = filters.translationSourceId ?? "tr.diyanet";
  const tafsirId = filters.tafsirSourceId ?? "ar.jalalayn";
  const index = await getIndex(translationId, tafsirId);
  const results = index.search(query, { combineWith: "AND" });
  const hits: SearchHit[] = [];

  for (const result of results) {
    const doc = result as SearchResult & IndexedDoc;
    if (filters.surah && doc.surah !== filters.surah) continue;
    if (filters.juz && doc.juz !== filters.juz) continue;
    if (
      filters.revelation &&
      filters.revelation !== "all" &&
      doc.revelation !== filters.revelation
    ) {
      continue;
    }
    const field = fieldFromMatch(result, query);
    const sourceText =
      field === "translation"
        ? doc.translation
        : field === "transliteration"
          ? doc.transliteration
          : field === "tafsir"
            ? doc.tafsir
            : field === "surah"
              ? doc.surahName
              : doc.arabic;
    hits.push({
      verseId: `${doc.surah}:${doc.ayah}`,
      surah: doc.surah,
      ayah: doc.ayah,
      field,
      snippet: snippetAround(sourceText ?? "", query),
      arabic: doc.arabic,
      translation: doc.translation,
      transliteration: doc.transliteration,
      tafsir: doc.tafsir,
    });
    if (hits.length >= 40) break;
  }

  return hits;
}
