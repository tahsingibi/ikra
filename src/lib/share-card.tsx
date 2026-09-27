import { getSurah } from "@/data/surahs";
import { SITE_URL } from "@/data/sources/catalog";

export type ShareRatio = "9-16" | "16-9" | "1-1";

export const SHARE_SIZES: Record<ShareRatio, { width: number; height: number }> = {
  "9-16": { width: 1080, height: 1920 },
  "16-9": { width: 1920, height: 1080 },
  "1-1": { width: 1080, height: 1080 },
};

function translationFontSize(text: string, ratio: ShareRatio): number {
  const len = text.length;
  if (ratio === "9-16") return len < 100 ? 48 : len < 200 ? 40 : len < 350 ? 34 : 28;
  if (ratio === "1-1") return len < 100 ? 44 : len < 200 ? 36 : len < 350 ? 30 : 26;
  return len < 100 ? 46 : len < 220 ? 36 : 30;
}

function arabicFontSize(text: string): number {
  return text.length < 100 ? 34 : 26;
}

function clipText(text: string, max: number): string {
  const clean = text.trim();
  return clean.length <= max ? clean : `${clean.slice(0, max).trim()}…`;
}

export function ShareCard({
  surah,
  ayah,
  arabic,
  translation,
  ratio,
}: {
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  ratio: ShareRatio;
}) {
  const meta = getSurah(surah);
  const landscape = ratio === "16-9";
  const surahLabel = `${meta?.name ?? "Sure"} · ${ayah}. Ayet`;
  const tSize = translationFontSize(translation, ratio);
  const aSize = arabicFontSize(arabic);
  const safeTr = clipText(translation, landscape ? 450 : ratio === "1-1" ? 400 : 560);
  const safeAr = clipText(arabic, 320);
  const displayUrl = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f0e6",
        color: "#1d1915",
        padding: landscape ? 44 : ratio === "1-1" ? 52 : 68,
        fontFamily: "IkraSans",
        position: "relative",
      }}
    >
      {/* Kur’an Tezhip Çift Çerçevesi (Dış Katman) */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: "3px solid #8e734c",
          borderRadius: 24,
          padding: 10,
          backgroundColor: "#fcfaf6",
          position: "relative",
        }}
      >
        {/* İç Çerçeve Katmanı */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: landscape ? "row" : "column",
            justifyContent: "space-between",
            border: "1.5px solid #d4c49f",
            borderRadius: 16,
            padding: landscape ? "44px 50px" : ratio === "1-1" ? "48px 54px" : "60px 64px",
            backgroundColor: "#ffffff",
            position: "relative",
          }}
        >
          {/* Mushaf Köşe Motifleri */}
          <div style={{ position: "absolute", top: 12, left: 12, width: 32, height: 32, borderTop: "3px solid #8e734c", borderLeft: "3px solid #8e734c", display: "flex" }} />
          <div style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderTop: "3px solid #8e734c", borderRight: "3px solid #8e734c", display: "flex" }} />
          <div style={{ position: "absolute", bottom: 12, left: 12, width: 32, height: 32, borderBottom: "3px solid #8e734c", borderLeft: "3px solid #8e734c", display: "flex" }} />
          <div style={{ position: "absolute", bottom: 12, right: 12, width: 32, height: 32, borderBottom: "3px solid #8e734c", borderRight: "3px solid #8e734c", display: "flex" }} />

          {!landscape ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", justifyContent: "space-between" }}>
              {/* Üst Kartuş / Başlık */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #ece4d4", paddingBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 5, color: "#224131" }}>İKRA</span>
                  <span style={{ fontSize: 14, color: "#8a7e72", letterSpacing: 2 }}>| MEAL</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "6px 14px", borderRadius: 999, border: "1px solid #e2d7c0", backgroundColor: "#faf7f0" }}>
                  <span style={{ fontSize: 16, color: "#4c3e2e", fontWeight: 600 }}>{surahLabel}</span>
                </div>
              </div>

              {/* Orta: Türkçe Meal & Arapça */}
              <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", padding: "28px 0" }}>
                <div style={{ display: "flex", fontSize: tSize, lineHeight: 1.58, fontWeight: 500, color: "#161310" }}>
                  “{safeTr}”
                </div>

                <div
                  style={{
                    display: "flex",
                    fontFamily: "IkraArabic",
                    fontSize: aSize,
                    lineHeight: 1.85,
                    color: "#54493c",
                    textAlign: "right",
                    direction: "rtl",
                    width: "100%",
                    justifyContent: "flex-end",
                    marginTop: 30,
                    paddingTop: 22,
                    borderTop: "1px dashed #ded4c0",
                  }}
                >
                  {safeAr}
                </div>
              </div>

              {/* Alt Bilgi & Web Adresi */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px solid #ece4d4", paddingTop: 20, fontSize: 15, color: "#7a6e60" }}>
                <span>{meta?.meaning ? `Anlamı: ${meta.meaning}` : "Kur’an-ı Kerim"}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: "#224131" }}>{displayUrl}</span>
                  <span style={{ color: "#a59782" }}>·</span>
                  <span style={{ color: "#8e734c" }}>ikra</span>
                </div>
              </div>
            </div>
          ) : (
            /* Yatay 16:9 Düzen */
            <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", width: "58%", justifyContent: "space-between", paddingRight: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: "#224131" }}>İKRA</span>
                  <span style={{ fontSize: 15, color: "#8a7e72", letterSpacing: 2 }}>| MEAL</span>
                </div>

                <div style={{ display: "flex", fontSize: tSize, lineHeight: 1.58, fontWeight: 500, color: "#161310", margin: "auto 0" }}>
                  “{safeTr}”
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: "#6e6255" }}>
                  <span style={{ fontWeight: 600 }}>{surahLabel}</span>
                  <span style={{ color: "#a59782" }}>·</span>
                  <span>{displayUrl}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", width: "42%", justifyContent: "space-between", borderLeft: "1.5px solid #ece4d4", paddingLeft: 40 }}>
                <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 18, color: "#7a6e60", fontWeight: 500 }}>
                  <span>{meta?.nameArabic}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    fontFamily: "IkraArabic",
                    fontSize: aSize,
                    lineHeight: 1.85,
                    color: "#54493c",
                    textAlign: "right",
                    direction: "rtl",
                    width: "100%",
                    justifyContent: "flex-end",
                    margin: "auto 0",
                  }}
                >
                  {safeAr}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 15, fontWeight: 600, color: "#224131", letterSpacing: 1 }}>
                  <span>{displayUrl}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
