import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { SHARE_SIZES, ShareCard, type ShareRatio } from "@/lib/share-card";
import { loadPackFromDisk } from "@/services/pack-loader.server";
import { verseCountOf } from "@/lib/verse-counts";

export const runtime = "nodejs";

const RATIOS = new Set<ShareRatio>(["9-16", "16-9", "1-1"]);

function loadLocalFont(filename: string): Buffer | null {
  try {
    const fullPath = path.join(process.cwd(), "public", "fonts", filename);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath);
    }
  } catch (error) {
    console.error(`Font okuma hatası (${filename}):`, error);
  }
  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ surah: string; ayah: string; ratio: string }> },
) {
  try {
    const { surah: surahParam, ayah: ayahParam, ratio: ratioParam } = await context.params;
    const surah = Number(surahParam);
    const ayah = Number(ayahParam);
    const ratio = ratioParam as ShareRatio;

    if (!Number.isInteger(surah) || !Number.isInteger(ayah) || !RATIOS.has(ratio)) {
      return new Response("Geçersiz paylaşım adresi", { status: 404 });
    }
    if (surah < 1 || surah > 114 || ayah < 1 || ayah > verseCountOf(surah)) {
      return new Response("Ayet bulunamadı", { status: 404 });
    }

    const [quran, translation] = await Promise.all([
      loadPackFromDisk("quran-uthmani"),
      loadPackFromDisk("tr.diyanet"),
    ]);

    const arabic = quran.verses[surah - 1]?.[ayah - 1] ?? "";
    const meal = translation.verses[surah - 1]?.[ayah - 1] ?? "";
    const size = SHARE_SIZES[ratio];

    const arabicFont =
      loadLocalFont("IBMPlexSansArabic-Regular.ttf") ??
      loadLocalFont("Almarai-Regular.ttf");
    const sansFont = loadLocalFont("Geist-Regular.ttf");

    const fonts = [];
    if (arabicFont) {
      fonts.push({
        name: "IkraArabic",
        data: arabicFont,
        style: "normal" as const,
        weight: 400 as const,
      });
    }
    if (sansFont) {
      fonts.push({
        name: "IkraSans",
        data: sansFont,
        style: "normal" as const,
        weight: 500 as const,
      });
    }

    return new ImageResponse(
      (
        <ShareCard
          surah={surah}
          ayah={ayah}
          arabic={arabic}
          translation={meal}
          ratio={ratio}
        />
      ),
      {
        ...size,
        ...(fonts.length > 0 ? { fonts } : {}),
      },
    );
  } catch (error) {
    console.error("Görsel üretim hatası:", error);
    return new Response("Görsel oluşturulamadı", { status: 500 });
  }
}
