import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME, getAccentColors } from "../theme";
import type { ChapterChipSpec } from "../timeline";

interface ChapterChipProps {
  chip: ChapterChipSpec;
  elevated?: boolean;
}

export const ChapterChip: React.FC<ChapterChipProps> = ({
  chip,
  elevated = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = Math.round(chip.startSec * fps);
  const endFrame = Math.round(chip.endSec * fps);

  const enterProgress = interpolate(
    frame,
    [startFrame, startFrame + 12],
    [0, 1],
    {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const exitProgress = interpolate(
    frame,
    [endFrame - 9, endFrame],
    [0, 1],
    {
      easing: THEME.motion.exit,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const visibility = enterProgress * (1 - exitProgress);
  const translateY = (1 - visibility) * -28;
  const clipPct = (1 - visibility) * 100;
  const accent = getAccentColors(chip.accent);

  return (
    <div
      style={{
        position: "absolute",
        left: THEME.layout.safeX,
        top: elevated ? 86 : THEME.layout.safeY,
        zIndex: 70,
        clipPath: `inset(0% 0% ${clipPct.toFixed(1)}% 0%)`,
        transform: `translateY(${translateY.toFixed(1)}px)`,
        display: "flex",
        alignItems: "stretch",
        border: `${THEME.layout.borderWidth}px solid ${accent.bg}`,
        backgroundColor: THEME.colors.ink,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          backgroundColor: accent.bg,
          color: accent.textOnBlock,
          fontFamily: THEME.fonts.mono,
          fontWeight: THEME.fontWeights.mono,
          fontSize: THEME.typeScale.label,
          letterSpacing: THEME.tracking.monoNormal,
          padding: "7px 14px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chip.code}
      </div>
      <div
        style={{
          backgroundColor: THEME.colors.ink,
          color: THEME.colors.textPrimary,
          fontFamily: THEME.fonts.mono,
          fontWeight: THEME.fontWeights.mono,
          fontSize: THEME.typeScale.label,
          letterSpacing: THEME.tracking.monoWide,
          padding: "7px 16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chip.label}
      </div>
    </div>
  );
};
