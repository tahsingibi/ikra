import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { HAFS_VERSE_COUNTS, TOTAL_VERSES } from "../../src/lib/verse-counts";

describe("generated quran packs", () => {
  it("keeps uthmani text aligned to Hafs counts", () => {
    const file = path.join(process.cwd(), "public/data/quran-uthmani.json");
    const pack = JSON.parse(readFileSync(file, "utf8")) as {
      verseCount: number;
      verses: string[][];
    };
    expect(pack.verseCount).toBe(TOTAL_VERSES);
    expect(pack.verses).toHaveLength(114);
    pack.verses.forEach((verses, index) => {
      expect(verses.length).toBe(HAFS_VERSE_COUNTS[index + 1]);
    });
    expect(pack.verses[0][0]).toContain("بِسْمِ");
  });
});
