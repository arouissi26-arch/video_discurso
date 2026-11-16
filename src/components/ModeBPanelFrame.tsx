import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME, getAccentColors, type AccentRole } from "../theme";

interface ModeBPanelFrameProps {
  accent: AccentRole;
  code: string;
  title: string;
  rightMeta?: string;
  durationInFrames: number;
  children: React.ReactNode;
}

/**
 * Contenidor superior (Mode B en 9:16 vertical: 950 x 616 px dins safe area)
 * amb capçalera tècnica mono, vora de 2 px i entrada/sortida per màscara vertical.
 */
export const ModeBPanelFrame: React.FC<ModeBPanelFrameProps> = ({
  accent,
  code,
  title,
  rightMeta,
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const colors = getAccentColors(accent);

  const enterT = interpolate(frame, [0, 12], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitT = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    {
      easing: THEME.motion.exit,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const t = enterT * exitT;
  const insetBottom = (1 - t) * 100;

  return (
    <div
      style={{
        position: "absolute",
        left: THEME.layout.safeX,
        top: THEME.layout.modeB.graphicTop,
        width: THEME.layout.usableWidth,
        height: THEME.layout.modeB.graphicHeight,
        backgroundColor: THEME.colors.graphite,
        border: `${THEME.layout.borderWidth}px solid ${colors.bg}`,
        boxSizing: "border-box",
        clipPath: `inset(0% 0% ${insetBottom.toFixed(1)}% 0%)`,
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* Barra superior tècnica */}
      <div
        style={{
          height: 48,
          borderBottom: `${THEME.layout.borderWidth}px solid ${THEME.colors.line}`,
          backgroundColor: THEME.colors.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              backgroundColor: colors.bg,
              color: colors.textOnBlock,
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: 18,
              padding: "3px 9px",
              letterSpacing: THEME.tracking.monoNormal,
            }}
          >
            {code}
          </span>
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: 20,
              letterSpacing: THEME.tracking.monoWide,
              color: THEME.colors.textPrimary,
            }}
          >
            {title}
          </span>
        </div>
        {rightMeta && (
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: 18,
              letterSpacing: THEME.tracking.monoNormal,
              color: colors.textOnDark,
            }}
          >
            {rightMeta}
          </span>
        )}
      </div>

      {/* Contingut vectorial de l'infogràfic */}
      <div
        style={{
          position: "relative",
          flex: 1,
          padding: "22px 26px",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
