import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface HeaderBadgeProps {
  step: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export const HeaderBadge: React.FC<HeaderBadgeProps> = ({
  step,
  title,
  subtitle,
  badge = "DEMO FITUR PRIMA",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [-15, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 22,
        left: 60,
        zIndex: 100,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          backgroundColor: "#0d6efd",
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "1px",
          textTransform: "uppercase",
          padding: "5px 12px",
          borderRadius: "6px",
          boxShadow: "0 4px 12px rgba(13, 110, 253, 0.35)",
        }}
      >
        {step}
      </div>

      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "6px 16px",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.2px",
          }}
        >
          {title}
        </span>
        {subtitle && (
          <>
            <span style={{ color: "#475569" }}>•</span>
            <span
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {subtitle}
            </span>
          </>
        )}
      </div>

      {badge && (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(8px)",
            color: "#38bdf8",
            fontSize: "10.5px",
            fontWeight: 700,
            letterSpacing: "1px",
            padding: "5px 10px",
            borderRadius: "6px",
            border: "1px solid rgba(56, 189, 248, 0.25)",
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};
