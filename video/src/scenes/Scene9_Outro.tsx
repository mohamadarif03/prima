import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img } from "remotion";

export const Scene9_Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1: 4 Pillars of Success (frame 0 - 420, 0s - 14s)
  // Part 2: Positioning & Ethical Statement (frame 420 - 780, 14s - 26s)
  // Part 3: Final Logo & Tagline (frame 780 - 936, 26s - 31.2s)

  const enterPillars = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const enterPositioning = spring({
    frame: Math.max(0, frame - 420),
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const enterFinalLogo = spring({
    frame: Math.max(0, frame - 770),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const pillars = [
    { icon: "📅", title: "Rencana Belajar Jelas", desc: "Jadwal harian otomatis terdistribusi sesuai waktu dan tanggal ujian." },
    { icon: "📄", title: "Materi Terangkum", desc: "Ringkasan intisari kuliah per subtopik yang siap dipelajari." },
    { icon: "🎯", title: "Latihan & Flashcard", desc: "Active recall instan untuk menguji pemahaman dan istilah Latin." },
    { icon: "🧬", title: "Anatomi 3D Nyata", desc: "Visualisasi spasial 6 regio tubuh dengan WebGL interaktif." },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#090d16",
        backgroundImage: "radial-gradient(circle at 50% 35%, #0284c7 0%, #090d16 75%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Decorative Grid */}
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

      {/* PART 1: 4 PILLARS (frame 0 - 430) */}
      {frame < 430 && (
        <div
          style={{
            width: "1400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 10,
            transform: `scale(${interpolate(enterPillars, [0, 1], [0.94, 1])})`,
            opacity: enterPillars,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
              fontSize: "14px",
              fontWeight: 800,
              padding: "6px 18px",
              borderRadius: "9999px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Nilai Tambah PRIMA
          </div>

          <h2
            style={{
              fontSize: "52px",
              fontWeight: 900,
              color: "#ffffff",
              margin: "0 0 44px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Belajar Lebih Tenang, Terarah, dan Efektif
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
              width: "100%",
            }}
          >
            {pillars.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.85)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "16px",
                  padding: "32px 24px",
                  textAlign: "left",
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.35)",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{item.icon}</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "14.5px", color: "#94a3b8", lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PART 2: POSITIONING & ETHICAL STATEMENT (frame 430 - 770) */}
      {frame >= 430 && frame < 770 && (
        <div
          style={{
            maxWidth: "1050px",
            textAlign: "center",
            zIndex: 10,
            transform: `scale(${interpolate(enterPositioning, [0, 1], [0.94, 1])})`,
            opacity: enterPositioning,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              borderRadius: "20px",
              padding: "48px 56px",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🤝</div>
            <h2
              style={{
                fontSize: "38px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.4,
                margin: "0 0 24px 0",
              }}
            >
              "PRIMA tidak menggantikan dosen, buku, atau praktikum..."
            </h2>
            <p
              style={{
                fontSize: "22px",
                color: "#cbd5e1",
                lineHeight: 1.6,
                margin: "0",
                fontWeight: 500,
              }}
            >
              Melainkan hadir sebagai teman belajar adaptif yang membantu mahasiswa kedokteran mengorganisir waktu, menyerap materi berbobot tinggi, dan meraih hasil ujian optimal tanpa burnout.
            </p>
          </div>
        </div>
      )}

      {/* PART 3: FINAL GRAND LOGO & TAGLINE (frame >= 770) */}
      {frame >= 770 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 10,
            transform: `scale(${interpolate(enterFinalLogo, [0, 1], [0.92, 1])})`,
            opacity: enterFinalLogo,
          }}
        >
          <div
            style={{
              filter: "drop-shadow(0 20px 45px rgba(2, 132, 199, 0.5))",
              marginBottom: "28px",
            }}
          >
            <Img
              src={staticFile("logo.png")}
              style={{
                height: "140px",
                objectFit: "contain",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "4px",
              margin: "0 0 16px 0",
              textTransform: "uppercase",
            }}
          >
            PRIMA
          </h1>

          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#38bdf8",
              letterSpacing: "0.5px",
              marginBottom: "36px",
            }}
          >
            Belajar Kedokteran Lebih Terarah
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "10px 24px",
              borderRadius: "9999px",
              color: "#94a3b8",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <span>Karya Lomba Software Development</span>
            <span style={{ color: "#475569" }}>•</span>
            <span>Invofest 2026</span>
          </div>
        </div>
      )}
    </div>
  );
};
