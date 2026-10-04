import { describe, expect, it } from "vitest";
import {
  dailyVerseIndex,
  locationFromMeta,
  toReaderVerses,
  verseFromPack,
} from "../../src/services/verse-assemble";
import type { VersePack } from "../../src/types/quran";

const pack = {
  id: "quran-uthmani",
  type: "quran",
  name: "test",
  author: "test",
  language: "ar",
  direction: "rtl",
  source: "test",
  license: "test",
  surahCount: 114,
  verseCount: 6236,
  verses: [["ٱلْحَمْدُ", "رَبِّ"]],
  verseMeta: [
    [
      { g: 1, j: 1, p: 1, h: 1, m: 1, r: 1, s: null },
      { g: 2, j: 1, p: 1, h: 2, m: 1, r: 1, s: "recommended" },
    ],
  ],
} satisfies Pick<
  VersePack,
  | "id"
  | "type"
  | "name"
  | "author"
  | "language"
  | "direction"
  | "source"
  | "license"
  | "surahCount"
  | "verseCount"
  | "verses"
  | "verseMeta"
> as VersePack;

describe("verse assembly", () => {
  it("builds location and hizb from pack metadata", () => {
    const first = verseFromPack(pack, 1, 1);
    const second = verseFromPack(pack, 1, 2);

    expect(first).toMatchObject({
      id: "1:1",
      text: "ٱلْحَمْدُ",
      juz: 1,
      page: 1,
      hizb: 1,
      hizbQuarter: 1,
    });
    expect(second.hizbQuarter).toBe(2);
    expect(second.sajda).toBe("recommended");
    expect(
      locationFromMeta(1, 1, undefined).globalNumber,
    ).toBe(1);
  });

  it("attaches translation layers by index", () => {
    const verses = [verseFromPack(pack, 1, 1)];
    const [reader] = toReaderVerses(verses, ["elhamdu"], ["Hamd"], ["Tefsir"]);
    expect(reader).toMatchObject({
      transliteration: "elhamdu",
      translation: "Hamd",
      tafsir: "Tefsir",
    });
  });

  it("keeps the daily verse inside the hafs range", () => {
    expect(dailyVerseIndex(new Date("2026-01-01T00:00:00Z"))).toBeGreaterThan(0);
    expect(dailyVerseIndex(new Date("2026-01-01T00:00:00Z"))).toBeLessThanOrEqual(6236);
  });
});
