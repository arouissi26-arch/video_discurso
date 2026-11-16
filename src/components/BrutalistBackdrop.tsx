import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { THEME } from "../theme";

interface CropMarksProps {
  color?: string;
  insetX?: number;
  insetY?: number;
  size?: number;
}

export const CropMarks: React.FC<CropMarksProps> = ({
  color = THEME.colors.textSecondary,
  insetX = THEME.layout.safeX - 24,
  insetY = THEME.layout.safeY - 34,
  size = THEME.layout.cropMarkSize,
}) => {
  const stroke = THEME.layout.borderWidth;
  const corners: Array<React.CSSProperties> = [
    {
      top: insetY,
      left: insetX,
      borderTop: `${stroke}px solid ${color}`,
      borderLeft: `${stroke}px solid ${color}`,
    },
    {
      top: insetY,
      right: insetX,
      borderTop: `${stroke}px solid ${color}`,
      borderRight: `${stroke}px solid ${color}`,
    },
    {
      bottom: insetY,
      left: insetX,
      borderBottom: `${stroke}px solid ${color}`,
      borderLeft: `${stroke}px solid ${color}`,
    },
    {
      bottom: insetY,
      right: insetX,
      borderBottom: `${stroke}px solid ${color}`,
      borderRight: `${stroke}px solid ${color}`,
    },
  ];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {corners.map((style, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            width: size,
            height: size,
            ...style,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

interface BrutalistGridProps {
  lineColor?: string;
  opacity?: number;
}

export const BrutalistGrid: React.FC<BrutalistGridProps> = ({
  lineColor = THEME.colors.line,
  opacity = THEME.texture.gridOpacity,
}) => {
  const { safeX, usableWidth, columns } = THEME.layout;
  const colStep = usableWidth / columns;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {/* Columnes verticals de la reixeta de 12 columnes */}
      {Array.from({ length: columns + 1 }).map((_, idx) => {
        const isMajor = idx === 0 || idx === 6 || idx === columns;
        return (
          <div
            key={`v-${idx}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: Math.round(safeX + idx * colStep),
              width: isMajor ? 2 : 1,
              backgroundColor: lineColor,
              opacity: isMajor ? 0.85 : 0.38,
            }}
          />
        );
      })}
      {/* Línies horitzontals de referència tècnica */}
      {[154, 540, 960, 1380, 1766].map((y, idx) => (
        <div
          key={`h-${idx}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: y,
            height: idx === 0 || idx === 4 ? 2 : 1,
            backgroundColor: lineColor,
            opacity: idx === 0 || idx === 4 ? 0.85 : 0.42,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const GRAIN_TILE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="2" seed="17" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="180" height="180" filter="url(#g)"/></svg>`
);

/**
 * Gra fi determinista basat en frame (opacitat <= 5%) per a acabat d'imprès/cinema.
 * Usa mosaic pre-rasteritzat de 180x180 desplaçat deterministament per multiplicar x3 la velocitat de render.
 */
export const FilmGrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const ox = (step * 73) % 180;
  const oy = (step * 137) % 180;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: THEME.texture.grainOpacity,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,${GRAIN_TILE_SVG}")`,
        backgroundRepeat: "repeat",
        backgroundPosition: `${ox}px ${oy}px`,
      }}
    />
  );
};

interface BrutalistBackdropProps {
  backgroundColor?: string;
  lineColor?: string;
  cropColor?: string;
  gridOpacity?: number;
  showCropMarks?: boolean;
}

export const BrutalistBackdrop: React.FC<BrutalistBackdropProps> = ({
  backgroundColor = THEME.colors.ink,
  lineColor = THEME.colors.line,
  cropColor = THEME.colors.textSecondary,
  gridOpacity = THEME.texture.gridOpacity,
  showCropMarks = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <BrutalistGrid lineColor={lineColor} opacity={gridOpacity} />
      {showCropMarks && <CropMarks color={cropColor} />}
    </AbsoluteFill>
  );
};
