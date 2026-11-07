import React from "react";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import "./index.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PrimaDemo"
        component={MainVideo}
        durationInFrames={6870}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
