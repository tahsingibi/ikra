import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/share/[surah]/[ayah]/[ratio]/route";

describe("Share Image Generation Route", () => {
  it("generates 1-1 image for Fatiha 1", async () => {
    const req = new Request("http://localhost:3000/api/share/1/1/1-1");
    const res = await GET(req, {
      params: Promise.resolve({ surah: "1", ayah: "1", ratio: "1-1" }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");

    const buffer = await res.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(1000);
  });

  it("generates 16-9 image for Bakara 255", async () => {
    const req = new Request("http://localhost:3000/api/share/2/255/16-9");
    const res = await GET(req, {
      params: Promise.resolve({ surah: "2", ayah: "255", ratio: "16-9" }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");

    const buffer = await res.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(1000);
  });

  it("returns 404 for invalid surah or ratio", async () => {
    const req = new Request("http://localhost:3000/api/share/999/1/1-1");
    const res = await GET(req, {
      params: Promise.resolve({ surah: "999", ayah: "1", ratio: "1-1" }),
    });
    expect(res.status).toBe(404);
  });
});
