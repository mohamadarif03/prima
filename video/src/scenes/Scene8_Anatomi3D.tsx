import React from "react";
import { staticFile, OffthreadVideo } from "remotion";
import { DeviceFrame } from "../components/DeviceFrame";
import { HeaderBadge } from "../components/HeaderBadge";

export const Scene8_Anatomi3D: React.FC = () => {
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
        step="LANGKAH 05"
        title="Visualisasi 3D WebGL Interaktif"
        subtitle="Rotasi bebas, zoom spasial, dan navigasi 6 regio tubuh dengan label Latin"
        badge="3D ANATOMY ATLAS"
      />

      <DeviceFrame
        url="https://prima.med.id/latihan"
        zoom={{
          startFrame: 40,
          endFrame: 760,
          scale: 1.14,
          originX: "55%",
          originY: "50%",
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/clip_08_anatomi3d.mp4")}
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
