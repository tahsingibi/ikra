import { ImageResponse } from "next/og";

export const alt = "İKRA — Oku.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#f3eee6",
          color: "#1b1713",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 12 }}>İKRA</div>
        <div style={{ fontSize: 88, fontWeight: 600, marginTop: 16 }}>Oku.</div>
        <div style={{ fontSize: 28, marginTop: 24, color: "#6d655b" }}>
          Arapça · Türkçe okunuş · Meal · Tefsir
        </div>
      </div>
    ),
    size,
  );
}
