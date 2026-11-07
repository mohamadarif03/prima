import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Scene2_DataBurnout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1: Counter 0 -> 35.5% (frame 0 - 360)
  // Part 2: Medical Journal Study (frame 360 - 780)
  // Part 3: Spaced Repetition & Active Recall (frame 780 - 1305)

  // Animated counter for 35.5%
  const countProgress = interpolate(frame, [20, 140], [0, 35.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const enterJournal = spring({
    frame: Math.max(0, frame - 360),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const enterStrategies = spring({
    frame: Math.max(0, frame - 780),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#090d16",
        backgroundImage: "radial-gradient(circle at 50% 30%, #1e1b4b 0%, #030712 85%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Background Subtle Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Top Header Tag */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          padding: "6px 20px",
          borderRadius: "9999px",
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
        <span style={{ color: "#fca5a5", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
          Fakta &amp; Riset Pendidikan Kedokteran
        </span>
      </div>

      {/* Persistent Academic Citation Header Bar */}
      <div
        style={{
          position: "absolute",
          top: "84px",
          display: "flex",
          gap: "14px",
          color: "#94a3b8",
          fontSize: "12px",
          fontWeight: 500,
          fontFamily: "monospace",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "4px 14px",
          borderRadius: "6px",
        }}
      >
        <span>Sumber: Nasution &amp; Isnayanti (2025)</span>
        <span style={{ color: "#475569" }}>•</span>
        <span>Govindasamy &amp; Govindasamy (2026)</span>
        <span style={{ color: "#475569" }}>•</span>
        <span>Cihan University (2024)</span>
      </div>

      {/* STAGE CONTAINER */}
      <div
        style={{
          width: "1400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* PART 1: BIG STAT COUNTER 35.5% (frame 0 - 360) */}
        {frame < 380 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "140px",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-4px",
                background: "linear-gradient(135deg, #f87171 0%, #fb923c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 10px 30px rgba(239, 68, 68, 0.3))",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {countProgress.toFixed(1)}%
            </div>

            <div
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#ffffff",
                marginTop: "16px",
                maxWidth: "800px",
              }}
            >
              Mahasiswa Kedokteran Mengalami Burnout
            </div>

            {/* Respondent Pill */}
            <div
              style={{
                marginTop: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "12px 28px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                color: "#cbd5e1",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              <span>📊 <strong>947</strong> Mahasiswa Kedokteran</span>
              <span style={{ color: "#64748b" }}>•</span>
              <span>🏛️ <strong>27</strong> Universitas di Indonesia</span>
            </div>
          </div>
        )}

        {/* PART 2: JOURNAL FINDING (frame 380 - 780) */}
        {frame >= 380 && frame < 780 && (
          <div
            style={{
              transform: `scale(${interpolate(enterJournal, [0, 1], [0.92, 1])})`,
              opacity: enterJournal,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: "1100px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(148, 163, 184, 0.25)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                borderRadius: "20px",
                padding: "44px 56px",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span
                  style={{
                    backgroundColor: "#0284c7",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 800,
                    padding: "4px 12px",
                    borderRadius: "6px",
                  }}
                >
                  STUDI TAHUN 2026
                </span>
                <span style={{ color: "#94a3b8", fontSize: "16px", fontWeight: 600 }}>
                  Research and Development in Medical Education
                </span>
              </div>

              <h2
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#ffffff",
                  lineHeight: 1.3,
                  margin: "0 0 20px 0",
                }}
              >
                "Beban belajar anatomi yang berat berkaitan langsung dengan peningkatan stres, kelelahan fisik-mental, dan penurunan kepuasan belajar mahasiswa."
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  marginTop: "28px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingTop: "24px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#f87171", fontSize: "16px", fontWeight: 600 }}>
                  <span>⚠️</span> Stres &amp; Tekanan Hafalan
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fb923c", fontSize: "16px", fontWeight: 600 }}>
                  <span>📉</span> Penurunan Kepuasan Belajar
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#38bdf8", fontSize: "16px", fontWeight: 600 }}>
                  <span>🧠</span> Kebutuhan Metode Adaptif
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PART 3: EVIDENCE-BASED SOLUTIONS (frame >= 780) */}
        {frame >= 780 && (
          <div
            style={{
              transform: `scale(${interpolate(enterStrategies, [0, 1], [0.92, 1])})`,
              opacity: enterStrategies,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: "1200px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#38bdf8", marginBottom: "8px", letterSpacing: "1px" }}>
              SOLUSI ILMIAH PENDIDIKAN KEDOKTERAN
            </div>
            <h2 style={{ fontSize: "44px", fontWeight: 800, color: "#ffffff", margin: "0 0 36px 0" }}>
              Strategi Belajar yang Terbukti Efektif
            </h2>

            <div style={{ display: "flex", gap: "32px", width: "100%" }}>
              {/* Spaced Repetition Card */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "rgba(15, 23, 42, 0.85)",
                  border: "1px solid rgba(56, 189, 248, 0.4)",
                  padding: "36px",
                  borderRadius: "16px",
                  textAlign: "left",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>⏳</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                  Spaced Repetition
                </div>
                <div style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.5 }}>
                  Pengulangan berkala sebelum memori pudar, menjaga ingatan jangka panjang nomenklatur medis tanpa sistem kebut semalam.
                </div>
              </div>

              {/* Active Recall Card */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "rgba(15, 23, 42, 0.85)",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  padding: "36px",
                  borderRadius: "16px",
                  textAlign: "left",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>🎯</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", marginBottom: "8px" }}>
                  Active Recall
                </div>
                <div style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.5 }}>
                  Menguji pemahaman secara aktif lewat latihan soal klinis dan flashcard interaktif, bukan sekadar membaca pasif.
                </div>
              </div>
            </div>

            {/* Gap Statement */}
            <div
              style={{
                marginTop: "32px",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
                fontSize: "17px",
                fontWeight: 600,
                padding: "12px 28px",
                borderRadius: "10px",
              }}
            >
              Masalahnya: Mahasiswa tidak memiliki platform terintegrasi yang membantu mereka belajar lebih terarah.
            </div>
          </div>
        )}
      </div>


    </div>
  );
};
