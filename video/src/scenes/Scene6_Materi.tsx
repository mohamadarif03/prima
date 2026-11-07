import React from "react";
import { staticFile, OffthreadVideo } from "remotion";
import { DeviceFrame } from "../components/DeviceFrame";
import { HeaderBadge } from "../components/HeaderBadge";

export const Scene6_Materi: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#090d16",
        position: "relative",
      }}
    >
      <HeaderBadge
        step="LANGKAH 03"
        title="Unggah Dokumen Kuliah &amp; Rangkuman AI"
        subtitle="Ekstraksi intisari otomatis per subtopik dengan peringatan periksa sumber utama"
        badge="MODUL MATERI AI"
      />

      <DeviceFrame
        url="https://prima.med.id/materi"
        zoom={{
          startFrame: 30,
          endFrame: 460,
          scale: 1.14,
          originX: "50%",
          originY: "35%",
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/clip_06_materi.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          startFrom={0}
        />
      </DeviceFrame>
    </div>
  );
};
