import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../theme";

interface MarqueeStripProps {
  text?: string;
  top?: number;
  bottom?: number;
  speedPxPerFrame?: number;
  borderColor?: string;
  textColor?: string;
  backgroundColor?: string;
}

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({
  text = "OPORTUNITAT — AMENAÇA — ",
  top,
  bottom,
  speedPxPerFrame = 1.6,
  borderColor = THEME.colors.line,
  textColor = THEME.colors.textSecondary,
  backgroundColor = THEME.colors.graphite,
}) => {
  const frame = useCurrentFrame();
  // Amplada aproximada d'un bloc repetit per desplaçament continu determinista
  const unitWidth = 960;
  const offset = -((frame * speedPxPerFrame) % unitWidth);
  const repeated = Array.from({ length: 8 })
    .map(() => text)
    .join("");

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...(top !== undefined ? { top } : {}),
        ...(bottom !== undefined ? { bottom } : {}),
        height: 46,
        overflow: "hidden",
        backgroundColor,
        borderTop: `${THEME.layout.borderWidth}px solid ${borderColor}`,
        borderBottom: `${THEME.layout.borderWidth}px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          transform: `translateX(${offset.toFixed(1)}px)`,
          fontFamily: THEME.fonts.mono,
          fontWeight: THEME.fontWeights.mono,
          fontSize: THEME.typeScale.label - 1,
          letterSpacing: THEME.tracking.monoWide,
          color: textColor,
        }}
      >
        {repeated}
      </div>
    </div>
  );
};
