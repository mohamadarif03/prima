import React from "react";
import { staticFile, OffthreadVideo } from "remotion";
import { DeviceFrame } from "../components/DeviceFrame";
import { HeaderBadge } from "../components/HeaderBadge";

export const Scene5_Perencana: React.FC = () => {
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
        step="LANGKAH 02"
        title="Rencana Belajar Adaptif Hasil AI"
        subtitle="Jadwal harian otomatis terdistribusi hingga hari H ujian"
        badge="PERENCANA BELAJAR"
      />

      <DeviceFrame
        url="https://prima.med.id/perencana"
        zoom={{
          startFrame: 40,
          endFrame: 360,
          scale: 1.12,
          originX: "40%",
          originY: "40%",
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/clip_05_perencana.mp4")}
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
