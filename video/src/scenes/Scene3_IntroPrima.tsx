import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  OffthreadVideo,
  Img,
} from "remotion";
import { DeviceFrame } from "../components/DeviceFrame";
import { HeaderBadge } from "../components/HeaderBadge";

export const Scene3_IntroPrima: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Part 1: Logo and Brand Reveal (0 - 240 frames, 0s - 8s)
  // Part 2: Screen Demo of Landing Page (240 - 660 frames, 8s - 22s)

  const logoEnter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const appEnter = spring({
    frame: Math.max(0, frame - 230),
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#090d16",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* PART 1: LOGO & ACRONYM REVEAL (frame 0 - 250) */}
      {frame < 260 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "radial-gradient(circle at 50% 35%, #0284c7 0%, #090d16 75%)",
            opacity: frame > 230 ? interpolate(frame, [230, 255], [1, 0]) : 1,
            transform: `scale(${interpolate(logoEnter, [0, 1], [0.92, 1])})`,
          }}
        >
          {/* Logo Image */}
          <div
            style={{
              marginBottom: "28px",
              filter: "drop-shadow(0 15px 35px rgba(2, 132, 199, 0.45))",
            }}
          >
            <Img
              src={staticFile("logo.png")}
              style={{
                height: "120px",
                objectFit: "contain",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "4px",
              margin: "0 0 16px 0",
              textTransform: "uppercase",
            }}
          >
            PRIMA
          </h1>

          {/* Acronym Breakdown */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              fontSize: "20px",
              fontWeight: 700,
              color: "#e2e8f0",
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(10px)",
              padding: "12px 28px",
              borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            }}
          >
            <span style={{ color: "#38bdf8" }}>Pembelajaran</span>
            <span style={{ color: "#64748b" }}>•</span>
            <span style={{ color: "#38bdf8" }}>Responsif</span>
            <span style={{ color: "#64748b" }}>•</span>
            <span style={{ color: "#38bdf8" }}>Interaktif</span>
            <span style={{ color: "#64748b" }}>•</span>
            <span style={{ color: "#38bdf8" }}>Medis</span>
            <span style={{ color: "#64748b" }}>•</span>
            <span style={{ color: "#38bdf8" }}>Adaptif</span>
          </div>

          <p
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              marginTop: "24px",
              fontWeight: 500,
              maxWidth: "780px",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Platform web pendamping belajar untuk mahasiswa kedokteran Indonesia dengan bantuan AI cerdas dan visualisasi 3D anatomi.
          </p>
        </div>
      )}

      {/* PART 2: HERO SCREEN DEMO (frame >= 235) */}
      {frame >= 235 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            opacity: interpolate(appEnter, [0, 1], [0, 1]),
            transform: `scale(${interpolate(appEnter, [0, 1], [0.95, 1])})`,
          }}
        >
          <HeaderBadge
            step="IKHTISAR"
            title="Antarmuka Beranda &amp; Kurikulum PRIMA"
            subtitle="Desain modern, responsif, dan siap membimbing mahasiswa preklinik"
            badge="BERANDA RESMI"
          />

          <DeviceFrame url="https://prima.med.id">
            <OffthreadVideo
              src={staticFile("recordings/clip_03_hero.mp4")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              startFrom={0}
            />
          </DeviceFrame>
        </div>
      )}
    </div>
  );
};
