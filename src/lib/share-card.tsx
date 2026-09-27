import { getSurah } from "@/data/surahs";

export type ShareRatio = "9-16" | "16-9" | "1-1";

export const SHARE_SIZES: Record<ShareRatio, { width: number; height: number }> = {
  "9-16": { width: 1080, height: 1920 },
  "16-9": { width: 1920, height: 1080 },
  "1-1": { width: 1080, height: 1080 },
};

function translationFontSize(text: string, ratio: ShareRatio): number {
  const len = text.length;
  if (ratio === "9-16") {
    if (len < 100) return 50;
    if (len < 200) return 42;
    if (len < 350) return 35;
    return 30;
  }
  if (ratio === "1-1") {
    if (len < 100) return 46;
    if (len < 200) return 38;
    if (len < 350) return 32;
    return 28;
  }
  // 16-9
  if (len < 100) return 48;
  if (len < 220) return 38;
  return 32;
}

function arabicFontSize(text: string, ratio: ShareRatio): number {
  const len = text.length;
  if (ratio === "9-16") return len < 100 ? 36 : 28;
  if (ratio === "1-1") return len < 100 ? 34 : 26;
  return len < 100 ? 36 : 28;
}

function clipText(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
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
  const surahLabel = `${meta?.name ?? "Sure"} Suresi · ${ayah}. Ayet`;
  const tSize = translationFontSize(translation, ratio);
  const aSize = arabicFontSize(arabic, ratio);
  const safeTranslation = clipText(translation, landscape ? 450 : ratio === "1-1" ? 420 : 600);
  const safeArabic = clipText(arabic, 350);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f6f0",
        color: "#1d1915",
        padding: landscape ? 72 : ratio === "1-1" ? 80 : 96,
        fontFamily: "IkraSans",
        position: "relative",
      }}
    >
      {/* İç çerçeve */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: landscape ? "row" : "column",
          justifyContent: "space-between",
          border: "1px solid #dfd5c6",
          borderRadius: 24,
          padding: landscape ? 56 : ratio === "1-1" ? 64 : 72,
          backgroundColor: "#ffffff",
          boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
        }}
      >
        {!landscape ? (
          /* Dikey ve Kare Düzen */
          <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", justifyContent: "space-between" }}>
            {/* Üst Logo ve Sure Başlığı */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ebe4d8", paddingBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 6, color: "#224131" }}>İKRA</span>
                <span style={{ fontSize: 16, color: "#8a7e72", letterSpacing: 2 }}>| MEAL</span>
              </div>
              <span style={{ fontSize: 18, color: "#6e6255", fontWeight: 500 }}>{surahLabel}</span>
            </div>

            {/* Orta: Vurgulu Türkçe Meal */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", padding: "40px 0" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: tSize,
                  lineHeight: 1.55,
                  fontWeight: 500,
                  color: "#181411",
                }}
              >
                “{safeTranslation}”
              </div>

              {/* Altında Zarif Arapça Metin */}
              <div
                style={{
                  display: "flex",
                  fontFamily: "IkraArabic",
                  fontSize: aSize,
                  lineHeight: 1.8,
                  color: "#6b6054",
                  textAlign: "right",
                  direction: "rtl",
                  width: "100%",
                  justifyContent: "flex-end",
                  marginTop: 36,
                  paddingTop: 24,
                  borderTop: "1px dashed #e7dfd3",
                }}
              >
                {safeArabic}
              </div>
            </div>

            {/* Alt Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #ebe4d8", paddingTop: 24, fontSize: 16, color: "#8a7e72" }}>
              <span>{meta?.meaning ? `Anlamı: ${meta.meaning}` : "Kur’an-ı Kerim"}</span>
              <span style={{ fontWeight: 600, color: "#224131", letterSpacing: 1 }}>ikra · Oku.</span>
            </div>
          </div>
        ) : (
          /* Yatay 16:9 Düzen */
          <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "space-between" }}>
            {/* Sol: Türkçe Meal ve Künye */}
            <div style={{ display: "flex", flexDirection: "column", width: "58%", justifyContent: "space-between", paddingRight: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 6, color: "#224131" }}>İKRA</span>
                <span style={{ fontSize: 18, color: "#8a7e72", letterSpacing: 2 }}>| MEAL</span>
              </div>

              <div style={{ display: "flex", fontSize: tSize, lineHeight: 1.55, fontWeight: 500, color: "#181411", margin: "auto 0" }}>
                “{safeTranslation}”
              </div>

              <div style={{ display: "flex", fontSize: 18, color: "#6e6255" }}>
                <span>{surahLabel}</span>
              </div>
            </div>

            {/* Sağ: Arapça Metin ve Alt Bilgi */}
            <div style={{ display: "flex", flexDirection: "column", width: "42%", justifyContent: "space-between", borderLeft: "1px solid #ebe4d8", paddingLeft: 48 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 18, color: "#8a7e72" }}>
                <span>{meta?.nameArabic}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  fontFamily: "IkraArabic",
                  fontSize: aSize,
                  lineHeight: 1.8,
                  color: "#544b41",
                  textAlign: "right",
                  direction: "rtl",
                  width: "100%",
                  justifyContent: "flex-end",
                  margin: "auto 0",
                }}
              >
                {safeArabic}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", fontSize: 16, fontWeight: 600, color: "#224131", letterSpacing: 1 }}>
                <span>ikra · Oku.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
