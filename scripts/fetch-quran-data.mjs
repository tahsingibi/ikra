#!/usr/bin/env node
/**
 * Downloads open Quran datasets from AlQuran Cloud and spa5k tafsir API
 * and writes compact JSON packs into public/data.
 *
 * Usage:
 *   node scripts/fetch-quran-data.mjs
 *   node scripts/fetch-quran-data.mjs --force
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "data");
const FORCE = process.argv.includes("--force");
const API = "https://api.alquran.cloud/v1";

const EDITIONS = [
  {
    id: "quran-uthmani",
    type: "quran",
    filename: "quran-uthmani.json",
    name: "Mushaf (Uthmânî hattı)",
    author: "Tanzil Project",
    language: "ar",
    direction: "rtl",
    source: "https://alquran.cloud (Tanzil Uthmani)",
    license: "Tanzil Public License — https://tanzil.net/docs/license",
  },
  {
    id: "tr.transliteration",
    type: "transliteration",
    filename: "transliteration-tr-abay.json",
    name: "Türkçe okunuş",
    author: "Muhammet Abay",
    language: "tr",
    direction: "ltr",
    source: "https://alquran.cloud edition tr.transliteration",
    license:
      "Kaynak API üzerinden sağlanır. Yeniden dağıtım ve ticari kullanım için müellif/kaynak koşullarını kontrol edin.",
  },
  {
    id: "tr.diyanet",
    type: "translation",
    filename: "translation-tr-diyanet.json",
    name: "Diyanet İşleri Meali",
    author: "Diyanet İşleri Başkanlığı",
    language: "tr",
    direction: "ltr",
    source: "https://alquran.cloud edition tr.diyanet",
    license:
      "Telif durumu Diyanet İşleri Başkanlığı’na aittir. Uygulama metni API’den indirir; ticari kullanım için izin gerekir.",
  },
  {
    id: "tr.yazir",
    type: "translation",
    filename: "translation-tr-yazir.json",
    name: "Elmalılı Hamdi Yazır Meali",
    author: "Elmalılı Muhammed Hamdi Yazır",
    language: "tr",
    direction: "ltr",
    source: "https://alquran.cloud edition tr.yazir",
    license:
      "Müellif telifi / varis hakları geçerli olabilir. Ticari kullanım için izin kontrol edilmelidir.",
  },
  {
    id: "tr.vakfi",
    type: "translation",
    filename: "translation-tr-vakfi.json",
    name: "Diyanet Vakfı Meali",
    author: "Türkiye Diyanet Vakfı",
    language: "tr",
    direction: "ltr",
    source: "https://alquran.cloud edition tr.vakfi",
    license:
      "Telif Türkiye Diyanet Vakfı’na aittir. Ticari kullanım için izin kontrol edilmelidir.",
  },
  {
    id: "ar.jalalayn",
    type: "tafsir",
    filename: "tafsir-ar-jalalayn.json",
    name: "Tefsîru’l-Celâleyn",
    author: "Celâleddîn el-Mahallî & Celâleddîn es-Süyûtî",
    language: "ar",
    direction: "rtl",
    source: "https://alquran.cloud edition ar.jalalayn",
    license:
      "Klasik eser (kamu malı metin). Bu dijital aktarım AlQuran Cloud üzerinden alınır.",
  },
  {
    id: "ar.muyassar",
    type: "tafsir",
    filename: "tafsir-ar-muyassar.json",
    name: "et-Tefsîr el-Müyesser",
    author: "King Fahd Quran Complex",
    language: "ar",
    direction: "rtl",
    source: "https://alquran.cloud edition ar.muyassar",
    license:
      "King Fahd Complex yayını. Yeniden dağıtım koşulları kaynak kurumdan teyit edilmelidir.",
  },
];

const GITHUB_TAFSIRS = [
  {
    id: "tr.mokhtasar",
    type: "tafsir",
    filename: "tafsir-tr-mokhtasar.json",
    name: "Muhtasar Kur’an Tefsiri",
    author: "Tefsir Heyeti (Türkçe Tercüme)",
    language: "tr",
    direction: "ltr",
    repoFolder: "turkish-mokhtasar",
    source: "Tefsir API / Muhtasar Tercümesi",
    license: "Açık kaynak derleme.",
  },
  {
    id: "tr.ibnkathir",
    type: "tafsir",
    filename: "tafsir-tr-ibnkathir.json",
    name: "İbn Kesir Tefsiri",
    author: "Hafız İbn Kesir",
    language: "tr",
    direction: "ltr",
    repoFolder: "tr-tafsir-ibne-kathir",
    source: "Tefsir API / İbn Kesir Tercümesi",
    license: "Klasik eser tercümesi.",
  },
];

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function fetchJson(url, attempts = 4) {
  let lastError;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120_000);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      const wait = i * 1500;
      console.warn(`  retry ${i}/${attempts} for ${url}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }
  throw lastError;
}

function stripBom(text) {
  return String(text || "")
    .replace(/^\uFEFF/, "")
    .replace(/<\/?[^>]+>/g, "")
    .trim();
}

function compactEdition(editionMeta, payload) {
  const surahs = payload?.data?.surahs;
  if (!Array.isArray(surahs) || surahs.length !== 114) {
    throw new Error(`Unexpected surah count for ${editionMeta.id}`);
  }

  const verses = surahs.map((surah) =>
    surah.ayahs.map((ayah) => stripBom(ayah.text)),
  );

  const verseMeta = surahs.map((surah) =>
    surah.ayahs.map((ayah) => ({
      g: ayah.number,
      j: ayah.juz,
      p: ayah.page,
      h: ayah.hizbQuarter,
      m: ayah.manzil,
      r: ayah.ruku,
      s: ayah.sajda
        ? typeof ayah.sajda === "object"
          ? ayah.sajda.obligatory
            ? "obligatory"
            : "recommended"
          : "recommended"
        : null,
    })),
  );

  return {
    id: editionMeta.id,
    type: editionMeta.type,
    name: editionMeta.name,
    author: editionMeta.author,
    language: editionMeta.language,
    direction: editionMeta.direction,
    source: editionMeta.source,
    license: editionMeta.license,
    downloadedAt: new Date().toISOString(),
    surahCount: verses.length,
    verseCount: verses.reduce((sum, list) => sum + list.length, 0),
    verses,
    ...(editionMeta.type === "quran" ? { verseMeta } : {}),
  };
}

async function writeJson(file, data) {
  await writeFile(file, `${JSON.stringify(data)}\n`, "utf8");
}

async function fetchGithubTafsir(def) {
  const file = path.join(OUT_DIR, def.filename);
  if (!FORCE && (await exists(file))) {
    console.log(`skip ${def.id} (exists)`);
    return;
  }
  console.log(`fetch ${def.id} from spa5k (${def.repoFolder})`);
  const verses = [];
  for (let s = 1; s <= 114; s += 1) {
    const url = `https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/${def.repoFolder}/${s}.json`;
    const list = await fetchJson(url);
    list.sort((a, b) => a.ayah - b.ayah);
    verses.push(list.map((item) => stripBom(item.text)));
  }
  const pack = {
    id: def.id,
    type: def.type,
    name: def.name,
    author: def.author,
    language: def.language,
    direction: def.direction,
    source: def.source,
    license: def.license,
    downloadedAt: new Date().toISOString(),
    surahCount: verses.length,
    verseCount: verses.reduce((sum, l) => sum + l.length, 0),
    verses,
  };
  await writeJson(file, pack);
  console.log(`  wrote ${def.filename} (${pack.verseCount} verses)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = {
    generatedAt: new Date().toISOString(),
    api: API,
    packs: [],
  };

  for (const edition of EDITIONS) {
    const file = path.join(OUT_DIR, edition.filename);
    if (!FORCE && (await exists(file))) {
      console.log(`skip ${edition.id} (exists)`);
      manifest.packs.push({
        id: edition.id,
        type: edition.type,
        file: `/data/${edition.filename}`,
        name: edition.name,
        author: edition.author,
        language: edition.language,
        license: edition.license,
      });
      continue;
    }

    console.log(`fetch ${edition.id}`);
    const payload = await fetchJson(`${API}/quran/${edition.id}`);
    const compact = compactEdition(edition, payload);
    await writeJson(file, compact);
    console.log(
      `  wrote ${edition.filename} (${compact.verseCount} verses, ${(Buffer.byteLength(JSON.stringify(compact)) / 1024 / 1024).toFixed(2)} MB)`,
    );
    manifest.packs.push({
      id: compact.id,
      type: compact.type,
      file: `/data/${edition.filename}`,
      name: compact.name,
      author: compact.author,
      language: compact.language,
      direction: compact.direction,
      license: compact.license,
      verseCount: compact.verseCount,
    });
  }

  for (const tafsirDef of GITHUB_TAFSIRS) {
    await fetchGithubTafsir(tafsirDef);
    manifest.packs.push({
      id: tafsirDef.id,
      type: tafsirDef.type,
      file: `/data/${tafsirDef.filename}`,
      name: tafsirDef.name,
      author: tafsirDef.author,
      language: tafsirDef.language,
      direction: tafsirDef.direction,
      license: tafsirDef.license,
    });
  }

  await writeJson(path.join(OUT_DIR, "manifest.json"), manifest);
  console.log("done");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
