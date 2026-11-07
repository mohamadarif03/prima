import React from "react";
import { Audio, Series, staticFile } from "remotion";
import { SubtitleOverlay } from "./components/SubtitleOverlay";
import { Scene1_Background } from "./scenes/Scene1_Background";
import { Scene2_DataBurnout } from "./scenes/Scene2_DataBurnout";
import { Scene3_IntroPrima } from "./scenes/Scene3_IntroPrima";
import { Scene4_Onboarding } from "./scenes/Scene4_Onboarding";
import { Scene5_Perencana } from "./scenes/Scene5_Perencana";
import { Scene6_Materi } from "./scenes/Scene6_Materi";
import { Scene7_KuisFlashcard } from "./scenes/Scene7_KuisFlashcard";
import { Scene8_Anatomi3D } from "./scenes/Scene8_Anatomi3D";
import { Scene9_Outro } from "./scenes/Scene9_Outro";

export const MainVideo: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#090d16",
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      {/* Primary Voiceover Track */}
      <Audio src={staticFile("voiceover.MP3")} />

      {/* Visual Sequence */}
      <Series>
        {/* 1. Latar Belakang (Studi Kasus Rifqi) - 34.0s */}
        <Series.Sequence durationInFrames={1020}>
          <Scene1_Background />
        </Series.Sequence>

        {/* 2. Data Riset & Burnout Mahasiswa - 43.5s */}
        <Series.Sequence durationInFrames={1305}>
          <Scene2_DataBurnout />
        </Series.Sequence>

        {/* 3. Pengenalan PRIMA & Hero App - 22.0s */}
        <Series.Sequence durationInFrames={660}>
          <Scene3_IntroPrima />
        </Series.Sequence>

        {/* 4. Onboarding & Personalisasi - 18.5s */}
        <Series.Sequence durationInFrames={555}>
          <Scene4_Onboarding />
        </Series.Sequence>

        {/* 5. Rencana Belajar AI - 14.0s */}
        <Series.Sequence durationInFrames={420}>
          <Scene5_Perencana />
        </Series.Sequence>

        {/* 6. Unggah Materi & Rangkuman AI - 17.5s */}
        <Series.Sequence durationInFrames={525}>
          <Scene6_Materi />
        </Series.Sequence>

        {/* 7. Latihan Soal & Flashcard - 21.0s */}
        <Series.Sequence durationInFrames={630}>
          <Scene7_KuisFlashcard />
        </Series.Sequence>

        {/* 8. Visualisasi 3D WebGL Anatomi 6 Regio - 27.3s */}
        <Series.Sequence durationInFrames={819}>
          <Scene8_Anatomi3D />
        </Series.Sequence>

        {/* 9. Penutup, 4 Pilar & Tagline - 31.2s */}
        <Series.Sequence durationInFrames={936}>
          <Scene9_Outro />
        </Series.Sequence>
      </Series>

      {/* Synchronized Subtitles Across the Entire Video */}
      <SubtitleOverlay />
    </div>
  );
};
