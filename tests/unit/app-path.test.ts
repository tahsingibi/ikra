import { describe, expect, it } from "vitest";
import { offlineRedirectPath, parseAppPath } from "../../src/lib/app-path";

describe("parseAppPath", () => {
  it("maps the main library routes", () => {
    expect(parseAppPath("/")).toEqual({ name: "home" });
    expect(parseAppPath("/sureler/")).toEqual({ name: "surahs" });
    expect(parseAppPath("/nuzul")).toEqual({ name: "nuzul" });
    expect(parseAppPath("/cuz")).toEqual({ name: "juzIndex" });
    expect(parseAppPath("/sayfa")).toEqual({ name: "pageIndex" });
    expect(parseAppPath("/ara")).toEqual({ name: "search" });
    expect(parseAppPath("/ayarlar")).toEqual({ name: "settings" });
    expect(parseAppPath("/cevrimdisi")).toEqual({ name: "offline" });
    expect(parseAppPath("/notlar")).toEqual({ name: "notes" });
    expect(parseAppPath("/favoriler")).toEqual({ name: "favorites" });
    expect(parseAppPath("/yer-imleri")).toEqual({ name: "bookmarks" });
    expect(parseAppPath("/plan")).toEqual({ name: "plan" });
  });

  it("maps mushaf ranges and reader urls", () => {
    expect(parseAppPath("/cuz/5")).toEqual({ name: "juz", juz: 5 });
    expect(parseAppPath("/sayfa/604")).toEqual({ name: "page", page: 604 });
    expect(parseAppPath("/hizb/12")).toEqual({ name: "hizb", hizb: 12 });
    expect(parseAppPath("/sure/fatiha")).toEqual({ name: "surah", slug: "fatiha" });
    expect(parseAppPath("/sure/fatiha/ayet/7")).toEqual({
      name: "surah",
      slug: "fatiha",
      ayah: 7,
    });
    expect(parseAppPath("/2/255")).toEqual({ name: "surah", slug: "2", ayah: 255 });
  });

  it("rejects out of range identifiers", () => {
    expect(parseAppPath("/cuz/31")).toEqual({ name: "notfound" });
    expect(parseAppPath("/sayfa/0")).toEqual({ name: "notfound" });
    expect(parseAppPath("/hizb/61")).toEqual({ name: "notfound" });
    expect(parseAppPath("/bilinmeyen")).toEqual({ name: "notfound" });
  });

  it("strips query and hash before parsing", () => {
    expect(parseAppPath("/sure/bakara?from=home#ayet-5")).toEqual({
      name: "surah",
      slug: "bakara",
    });
  });

  it("builds the service worker fallback url", () => {
    expect(offlineRedirectPath("/sure/fatiha")).toBe("/?offline=%2Fsure%2Ffatiha");
  });
});
