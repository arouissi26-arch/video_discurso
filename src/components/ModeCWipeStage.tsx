import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../theme";
import { BrutalistBackdrop } from "./BrutalistBackdrop";

export const ModeCWipeStage: React.FC<{
  durationInFrames: number;
  backgroundColor?: string;
  lineColor?: string;
  cropColor?: string;
  figLabel?: string;
  onLightBlock?: boolean;
  harsh?: boolean;
  direction?: string;
  children: React.ReactNode;
}> = ({
  durationInFrames,
  backgroundColor = THEME.colors.ink,
  lineColor = THEME.colors.line,
  cropColor = THEME.colors.textSecondary,
  harsh = false,
  children,
}) => {
  const frame = useCurrentFrame();
  const wipeLen = harsh ? 5 : 8;

  const enterPct = interpolate(frame, [0, wipeLen], [100, 0], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitPct = interpolate(
    frame,
    [durationInFrames - wipeLen, durationInFrames],
    [0, 100],
    {
      easing: THEME.motion.exit,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const clipPath =
    frame < durationInFrames / 2
      ? `inset(0% ${enterPct.toFixed(2)}% 0% 0%)`
      : `inset(0% 0% 0% ${exitPct.toFixed(2)}%)`;

  return (
    <AbsoluteFill
      style={{
        clipPath,
        backgroundColor,
        zIndex: 48,
      }}
    >
      <BrutalistBackdrop
        backgroundColor={backgroundColor}
        lineColor={lineColor}
        cropColor={cropColor}
        showCropMarks
      />
      {children}
    </AbsoluteFill>
  );
};
