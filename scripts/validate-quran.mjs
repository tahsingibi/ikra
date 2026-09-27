#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "public", "data");

const HAFS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111,
  110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45,
  83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55,
  78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56,
  40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8,
  8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

const FILES = [
  "quran-uthmani.json",
  "transliteration-tr-abay.json",
  "translation-tr-diyanet.json",
  "translation-tr-yazir.json",
  "translation-tr-vakfi.json",
  "tafsir-tr-mokhtasar.json",
  "tafsir-tr-ibnkathir.json",
  "tafsir-ar-jalalayn.json",
  "tafsir-ar-muyassar.json",
];

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

const packs = {};
for (const file of FILES) {
  const pack = JSON.parse(await readFile(path.join(DATA, file), "utf8"));
  packs[file] = pack;
  if (pack.surahCount !== 114) fail(`${file}: surahCount ${pack.surahCount}`);
  if (pack.verseCount !== 6236) fail(`${file}: verseCount ${pack.verseCount}`);
  if (pack.verses.length !== 114) fail(`${file}: verses.length ${pack.verses.length}`);
  pack.verses.forEach((list, index) => {
    if (list.length !== HAFS[index]) {
      fail(`${file}: surah ${index + 1} has ${list.length}, expected ${HAFS[index]}`);
    }
    list.forEach((text, ayah) => {
      if (!text || !String(text).trim()) {
        fail(`${file}: empty verse ${index + 1}:${ayah + 1}`);
      }
    });
  });
}

const quran = packs["quran-uthmani.json"];
const seen = new Set();
quran.verseMeta.forEach((surah, sIndex) => {
  surah.forEach((cell, aIndex) => {
    if (seen.has(cell.g)) fail(`duplicate global verse ${cell.g}`);
    seen.add(cell.g);
    if (cell.j < 1 || cell.j > 30) fail(`bad juz at ${sIndex + 1}:${aIndex + 1}`);
    if (cell.p < 1 || cell.p > 604) fail(`bad page at ${sIndex + 1}:${aIndex + 1}`);
  });
});
if (seen.size !== 6236) fail(`global numbers ${seen.size}`);

if (quran.verses[0][0].includes("بِسْمِ")) {
  console.log("Arabic 1:1 contains Bismillah as expected.");
} else {
  fail("Arabic 1:1 missing Bismillah");
}

if (!process.exitCode) {
  console.log("Quran data validation passed.");
  console.log("114 surahs, 6236 verses, no duplicates, translations and tafsirs aligned.");
}
