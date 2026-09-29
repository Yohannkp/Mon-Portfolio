import { ImageResponse } from "next/og"

/**
 * L'apercu qui s'affiche quand on colle le lien du portfolio (LinkedIn, messageries…).
 * Genere au build : rien a maintenir a la main.
 */
export const alt = "Yendi Yohann — MLOps & Machine Learning Engineering"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #07090c 0%, #0c1218 100%)",
          color: "#f3f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: "#4fc3f7",
              boxShadow: "0 0 32px 8px rgba(79,195,247,0.55)",
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: 4, color: "#4fc3f7", textTransform: "uppercase" }}>
            Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>Yendi Yohann</div>
          <div style={{ fontSize: 44, color: "#9aa5b1", lineHeight: 1.25 }}>
            MLOps &amp; Machine Learning Engineering
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#9aa5b1" }}>
          <div>Élève ingénieur Big Data &amp; IA · ECE Paris</div>
          <div style={{ color: "#4fc3f7" }}>Stage dès avril 2027</div>
        </div>
      </div>
    ),
    size,
  )
}
