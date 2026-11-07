import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Scene1_Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 0 - 360 (0s - 12s) - Accepted at FK UB
  // Phase 2: 360 - 660 (12s - 22s) - Slides & anatomical terms piling up
  // Phase 3: 660 - 1020 (22s - 34s) - Overwhelmed & fatigued

  const enterStudent = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // Terms appearing in Phase 2
  const terms = [
    { text: "M. Sternocleidomastoideus", top: "18%", left: "12%", delay: 380 },
    { text: "Foramen Lacerum", top: "28%", left: "76%", delay: 410 },
    { text: "Arteria Carotis Interna", top: "45%", left: "8%", delay: 440 },
    { text: "Plexus Brachialis", top: "68%", left: "14%", delay: 470 },
    { text: "Sulcus Centralis Rolandi", top: "22%", left: "68%", delay: 500 },
    { text: "Os Sphenoidale & Os Ethmoidale", top: "58%", left: "75%", delay: 530 },
    { text: "Nervus Glossopharyngeus (CN IX)", top: "78%", left: "70%", delay: 560 },
    { text: "Fossa Pterygopalatina", top: "36%", left: "22%", delay: 590 },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#090d16",
        backgroundImage:
          frame > 660
            ? "radial-gradient(circle at 50% 40%, #1e1b4b 0%, #030712 90%)"
            : "radial-gradient(circle at 50% 30%, #0c4a6e 0%, #021a36 80%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "background-image 1s ease",
      }}
    >
      {/* Background Decorative Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Top Tag */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(8px)",
          padding: "8px 20px",
          borderRadius: "9999px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#38bdf8" }} />
        <span style={{ color: "#93c5fd", fontSize: "14px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase" }}>
          Studi Kasus Mahasiswa Kedokteran
        </span>
      </div>

      {/* Main Center Stage */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          maxWidth: "1000px",
          transform: `scale(${interpolate(enterStudent, [0, 1], [0.92, 1])})`,
          opacity: enterStudent,
        }}
      >
        {/* Student Avatar / Illustration Badge */}
        <div
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            backgroundColor: frame > 660 ? "#312e81" : "#0284c7",
            border: "4px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 14px 0",
            letterSpacing: "-0.5px",
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {frame < 360 ? "Kenalkan, ini Rifqi" : frame < 660 ? "Tantangan Dimulai..." : "Kewalahan & Tanpa Strategi"}
        </h1>

        <p
          style={{
            fontSize: "26px",
            color: "#94a3b8",
            margin: "0 0 36px 0",
            fontWeight: 500,
          }}
        >
          Mahasiswa Fakultas Kedokteran — Universitas Brawijaya
        </p>

        {/* Phase 1: Acceptance Letter Card */}
        {frame < 400 && (
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "#0f172a",
              padding: "24px 36px",
              borderRadius: "16px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
              border: "2px solid #38bdf8",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              maxWidth: "720px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "#e0f2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0284c7",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#0284c7", letterSpacing: "0.8px" }}>
                PENGUMUMAN SELEKSI MANDIRI / SNBP 2026
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginTop: "4px" }}>
                Selamat! Diterima di Pendidikan Dokter FK UB
              </div>
              <div style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
                Semangat tinggi memasuki perkuliahan preklinik semester awal
              </div>
            </div>
          </div>
        )}

        {/* Phase 2 & 3: Stacks of books & slides alert */}
        {frame >= 400 && (
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                padding: "18px 28px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <span style={{ fontSize: "28px" }}>📚</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#f87171", fontSize: "13px", fontWeight: 700 }}>BEBAN MATERI BESAR</div>
                <div style={{ color: "#ffffff", fontSize: "17px", fontWeight: 600 }}>Ratusan Slide & Buku Anatomi</div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                padding: "18px 28px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <span style={{ fontSize: "28px" }}>⚠️</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#fbbf24", fontSize: "13px", fontWeight: 700 }}>KELELAHAN PREKLINIK</div>
                <div style={{ color: "#ffffff", fontSize: "17px", fontWeight: 600 }}>Cepat Lelah Setiap Membuka Buku</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Anatomical Terms (Phase 2 & 3) */}
      {frame >= 380 &&
        terms.map((term, idx) => {
          if (frame < term.delay) return null;
          const pop = spring({
            frame: frame - term.delay,
            fps,
            config: { damping: 12, stiffness: 140 },
          });
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: term.top,
                left: term.left,
                transform: `scale(${pop})`,
                opacity: interpolate(pop, [0, 1], [0, 0.9]),
                backgroundColor: "rgba(15, 23, 42, 0.82)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                color: "#e2e8f0",
                fontSize: "15px",
                fontWeight: 600,
                padding: "8px 18px",
                borderRadius: "8px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                pointerEvents: "none",
                fontFamily: "monospace",
              }}
            >
              {term.text}
            </div>
          );
        })}
    </div>
  );
};
