import React from "react";
import { staticFile, OffthreadVideo } from "remotion";
import { DeviceFrame } from "../components/DeviceFrame";
import { HeaderBadge } from "../components/HeaderBadge";

export const Scene4_Onboarding: React.FC = () => {
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
        step="LANGKAH 01"
        title="Pengaturan Awal &amp; Profil Belajar"
        subtitle="Personalisasi topik regio, target tanggal ujian, dan durasi belajar harian"
        badge="WIZARD ONBOARDING"
      />

      <DeviceFrame
        url="https://prima.med.id/onboarding"
        zoom={{
          startFrame: 60,
          endFrame: 460,
          scale: 1.15,
          originX: "center",
          originY: "45%",
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/clip_04_onboarding.mp4")}
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
