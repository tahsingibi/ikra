import { describe, expect, it } from "vitest";
import {
  HAFS_VERSE_COUNTS,
  TOTAL_SURAHS,
  TOTAL_VERSES,
  fromGlobalNumber,
  toGlobalNumber,
  verseCountOf,
} from "../../src/lib/verse-counts";
import { EGYPTIAN_NUZUL_ORDER, NOLDEKE_NUZUL_ORDER } from "../../src/data/nuzul";
import { SURAHS, getSurahBySlug } from "../../src/data/surahs";
import { verseId, parseVerseId } from "../../src/lib/utils";

describe("Hafs verse counts", () => {
  it("has 114 surahs and 6236 verses", () => {
    expect(TOTAL_SURAHS).toBe(114);
    expect(TOTAL_VERSES).toBe(6236);
    expect(
      HAFS_VERSE_COUNTS.slice(1).reduce((sum: number, n) => sum + n, 0),
    ).toBe(6236);
  });

  it("maps global numbers without gaps", () => {
    expect(toGlobalNumber(1, 1)).toBe(1);
    expect(toGlobalNumber(2, 1)).toBe(8);
    expect(fromGlobalNumber(1)).toEqual({ surah: 1, ayah: 1 });
    expect(fromGlobalNumber(6236)).toEqual({ surah: 114, ayah: 6 });
    expect(verseCountOf(2)).toBe(286);
  });
});

describe("nuzul orders", () => {
  it("contains each surah once", () => {
    for (const order of [EGYPTIAN_NUZUL_ORDER, NOLDEKE_NUZUL_ORDER]) {
      expect(order).toHaveLength(114);
      expect(new Set(order).size).toBe(114);
    }
  });
});

describe("surah catalog", () => {
  it("resolves slugs and numbers", () => {
    expect(SURAHS).toHaveLength(114);
    expect(getSurahBySlug("fatiha")?.number).toBe(1);
    expect(getSurahBySlug("2")?.slug).toBe("bakara");
    expect(verseId(2, 255)).toBe("2:255");
    expect(parseVerseId("2:255")).toEqual({ surah: 2, ayah: 255 });
  });
});
