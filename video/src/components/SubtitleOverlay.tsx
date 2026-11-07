import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SUBTITLES, SubtitleItem } from "../data/subtitles";

export const SubtitleOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find active subtitle
  const activeSub = SUBTITLES.find(
    (s) => frame >= s.startFrame && frame <= s.endFrame
  );

  if (!activeSub) return null;

  // Spring animation when subtitle appears
  const localFrame = frame - activeSub.startFrame;
  const enterProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.6 },
  });

  const translateY = interpolate(enterProgress, [0, 1], [15, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 56,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
          backgroundColor: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
          borderRadius: "14px",
          padding: "12px 28px",
          maxWidth: "1400px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: "26px",
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: "0.2px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 2px 4px rgba(0,0,0,0.4)",
          }}
        >
          {activeSub.text}
        </span>
      </div>
    </div>
  );
};
