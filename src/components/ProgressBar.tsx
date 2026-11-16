import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

/**
 * Barra de progrés superior de 3 px amb degradat lima -> vermell -> blau segons avanç
 * (únic degradat permès pel sistema de disseny).
 */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames - 1)));

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: THEME.layout.progressHeight + 1,
        backgroundColor: THEME.colors.ink,
        zIndex: 90,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: `${(progress * 100).toFixed(3)}%`,
          height: THEME.layout.progressHeight,
          backgroundImage: THEME.colors.progressGradient,
        }}
      />
    </div>
  );
};
