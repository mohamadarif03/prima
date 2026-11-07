import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface DeviceFrameProps {
  children: React.ReactNode;
  url?: string;
  zoom?: {
    startFrame: number;
    endFrame: number;
    scale: number;
    originX?: string;
    originY?: string;
  };
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  url = "https://prima.med.id",
  zoom,
}) => {
  const frame = useCurrentFrame();

  let scale = 1;
  let originX = "center";
  let originY = "center";

  if (zoom) {
    originX = zoom.originX || "center";
    originY = zoom.originY || "center";
    const zoomDuration = 25; // frames to ease in/out
    if (frame < zoom.startFrame) {
      scale = 1;
    } else if (frame >= zoom.startFrame && frame < zoom.startFrame + zoomDuration) {
      scale = interpolate(
        frame,
        [zoom.startFrame, zoom.startFrame + zoomDuration],
        [1, zoom.scale],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    } else if (frame >= zoom.startFrame + zoomDuration && frame <= zoom.endFrame - zoomDuration) {
      scale = zoom.scale;
    } else if (frame > zoom.endFrame - zoomDuration && frame <= zoom.endFrame) {
      scale = interpolate(
        frame,
        [zoom.endFrame - zoomDuration, zoom.endFrame],
        [zoom.scale, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    } else {
      scale = 1;
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "#070b13",
        backgroundImage: "radial-gradient(circle at 50% 20%, #1e293b 0%, #070b13 75%)",
        padding: "0 60px 48px 60px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Laptop Window Container */}
      <div
        style={{
          width: "1800px",
          height: "940px",
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Browser Top Navigation Bar */}
        <div
          style={{
            height: "40px",
            backgroundColor: "#f1f5f9",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: "16px",
            userSelect: "none",
            zIndex: 10,
          }}
        >
          {/* Traffic Lights */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", backgroundColor: "#eab308" }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
          </div>

          {/* URL Bar */}
          <div
            style={{
              flex: 1,
              maxWidth: "600px",
              margin: "0 auto",
              height: "26px",
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#334155",
              fontFamily: "monospace",
              fontWeight: 500,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{url}</span>
          </div>

          {/* PRIMA Brand Pill in Nav */}
          <div
            style={{
              fontSize: "11.5px",
              fontWeight: 800,
              color: "#0d6efd",
              letterSpacing: "0.8px",
            }}
          >
            PRIMA 2026
          </div>
        </div>

        {/* Browser Viewport with Inner Scale Zoom */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#f8fafc",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: `${originX} ${originY}`,
              transform: `scale(${scale})`,
              transition: "transform 0.05s linear",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
