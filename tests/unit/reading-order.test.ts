import { describe, expect, it } from "vitest";
import {
  adjacentSurahs,
  adjacentVerses,
  formatVerseRef,
  getSurahsByOrder,
} from "../../src/data/surahs";

describe("reading order navigation", () => {
  it("lists mushaf then nuzul surahs separately", () => {
    const mushaf = getSurahsByOrder("mushaf");
    const nuzul = getSurahsByOrder("nuzul", "egyptian");

    expect(mushaf[0]?.number).toBe(1);
    expect(mushaf.at(-1)?.number).toBe(114);
    expect(nuzul[0]?.number).toBe(96);
    expect(nuzul.at(-1)?.number).toBe(110);
  });

  it("uses mushaf neighbors for compiled reading", () => {
    expect(adjacentSurahs(1, "mushaf").next?.number).toBe(2);
    expect(adjacentSurahs(2, "mushaf").previous?.number).toBe(1);
    expect(adjacentSurahs(114, "mushaf").next).toBeUndefined();

    expect(adjacentVerses(1, 7, "mushaf")).toEqual({
      previous: { surah: 1, ayah: 6 },
      next: { surah: 2, ayah: 1 },
    });
    expect(adjacentVerses(96, 19, "mushaf").next).toEqual({
      surah: 97,
      ayah: 1,
    });
  });

  it("uses egyptian nuzul neighbors for chronological reading", () => {
    expect(adjacentSurahs(96, "nuzul", "egyptian").previous).toBeUndefined();
    expect(adjacentSurahs(96, "nuzul", "egyptian").next?.number).toBe(68);
    expect(adjacentSurahs(1, "nuzul", "egyptian").previous?.number).toBe(74);
    expect(adjacentSurahs(1, "nuzul", "egyptian").next?.number).toBe(111);
    expect(adjacentSurahs(110, "nuzul", "egyptian").next).toBeUndefined();

    expect(adjacentVerses(96, 1, "nuzul", "egyptian").previous).toBeUndefined();
    expect(adjacentVerses(96, 19, "nuzul", "egyptian")).toEqual({
      previous: { surah: 96, ayah: 18 },
      next: { surah: 68, ayah: 1 },
    });
    expect(adjacentVerses(68, 1, "nuzul", "egyptian").previous).toEqual({
      surah: 96,
      ayah: 19,
    });
    expect(formatVerseRef(68, 1)).toBe("Kalem 1");
  });
});
