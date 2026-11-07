import React from "react";
import { staticFile, OffthreadVideo } from "remotion";
import { DeviceFrame } from "../components/DeviceFrame";
import { HeaderBadge } from "../components/HeaderBadge";

export const Scene7_KuisFlashcard: React.FC = () => {
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
        step="LANGKAH 04"
        title="Latihan Soal &amp; Flashcard Interaktif"
        subtitle="Uji pemahaman klinis mandiri dan active recall istilah medis Latin"
        badge="ACTIVE RECALL"
      />

      <DeviceFrame
        url="https://prima.med.id/latihan-materials"
        zoom={{
          startFrame: 30,
          endFrame: 580,
          scale: 1.15,
          originX: "50%",
          originY: "50%",
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/clip_07_kuis_flashcard.mp4")}
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
