import React from "react";
import { Composition } from "remotion";
import {
  MainComposition,
  StandaloneIntro,
  StandaloneOutro,
  mainSchema,
} from "./MainComposition";
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./theme";
import { INTRO_FRAMES, OUTRO_FRAMES, TOTAL_DURATION_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  const defaultProps = {
    authorName: "",
    subjectName: "",
    courseName: "",
  };

  return (
    <>
      <Composition
        id="Main"
        component={MainComposition}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={mainSchema}
        defaultProps={defaultProps}
      />
      <Composition
        id="Intro"
        component={StandaloneIntro}
        durationInFrames={INTRO_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={mainSchema}
        defaultProps={defaultProps}
      />
      <Composition
        id="Outro"
        component={StandaloneOutro}
        durationInFrames={OUTRO_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={mainSchema}
        defaultProps={defaultProps}
      />
    </>
  );
};
