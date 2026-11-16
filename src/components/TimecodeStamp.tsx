import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../theme";

function formatTimecode(frame: number, fps: number): string {
  const totalSeconds = Math.max(0, Math.floor(frame / fps));
  const ff = Math.max(0, Math.floor(frame % fps));
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  return `00:${String(mm).padStart(2, "0")}:${String(ss).padStart(
    2,
    "0"
  )}:${String(ff).padStart(2, "0")}`;
}

export const TimecodeStamp: React.FC<{
  figLabel?: string;
  compact?: boolean;
  solidDark?: boolean;
}> = ({ figLabel, compact = false, solidDark = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shortFig =
    compact && figLabel ? figLabel.split("·")[0]?.trim() : figLabel;

  return (
    <div
      style={{
        position: "absolute",
        top: 86,
        right: THEME.layout.safeX,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: THEME.fonts.mono,
        fontWeight: THEME.fontWeights.mono,
        fontSize: THEME.typeScale.label,
        letterSpacing: THEME.tracking.monoNormal,
        color: solidDark ? THEME.colors.textPrimary : THEME.colors.textSecondary,
        backgroundColor: solidDark ? THEME.colors.ink : "rgba(10, 10, 11, 0.9)",
        border: `${THEME.layout.borderWidth}px solid ${
          solidDark ? THEME.colors.ink : THEME.colors.line
        }`,
        padding: "7px 12px",
        zIndex: 66,
      }}
    >
      {shortFig && (
        <>
          <span style={{ color: THEME.colors.textPrimary }}>{shortFig}</span>
          <span style={{ color: THEME.colors.line }}>·</span>
        </>
      )}
      <span>TC {formatTimecode(frame, fps)}</span>
    </div>
  );
};
