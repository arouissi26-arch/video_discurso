import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ModeBPanelFrame } from "../components/ModeBPanelFrame";
import { ModeCWipeStage } from "../components/ModeCWipeStage";
import { THEME } from "../theme";

/**
 * INSERCIÓ 3 (Mode C): "Però, què és exactament la IA?"
 * Pregunta gegant "QUÈ ÉS LA IA?" en bloc blau amb wipe d'entrada i sortida.
 */
export const Insert03WhatIsAi: React.FC<{
  durationInFrames: number;
  figLabel?: string;
}> = ({ durationInFrames, figLabel }) => {
  const frame = useCurrentFrame();
  const row1 = interpolate(frame, [4, 16], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const row2 = interpolate(frame, [10, 22], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ModeCWipeStage
      backgroundColor={THEME.colors.blue}
      lineColor="rgba(244, 245, 247, 0.24)"
      cropColor={THEME.colors.textPrimary}
      figLabel={figLabel}
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          position: "absolute",
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          top: 470,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            backgroundColor: THEME.colors.ink,
            color: THEME.colors.lime,
            fontFamily: THEME.fonts.mono,
            fontSize: THEME.typeScale.label,
            padding: "8px 16px",
            letterSpacing: THEME.tracking.monoWide,
          }}
        >
          01 · DEFINICIÓ TÈCNICA
        </div>

        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 176,
              lineHeight: 0.88,
              letterSpacing: THEME.tracking.displayTight,
              color: THEME.colors.textPrimary,
              transform: `translateY(${((1 - row1) * 110).toFixed(1)}%)`,
            }}
          >
            QUÈ ÉS
          </div>
        </div>

        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 212,
              lineHeight: 0.88,
              letterSpacing: THEME.tracking.displayTight,
              color: THEME.colors.lime,
              transform: `translateY(${((1 - row2) * 110).toFixed(1)}%)`,
            }}
          >
            LA IA?
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            borderTop: `2px solid ${THEME.colors.textPrimary}`,
            paddingTop: 20,
            fontFamily: THEME.fonts.mono,
            fontSize: 24,
            color: THEME.colors.textPrimary,
            letterSpacing: THEME.tracking.monoNormal,
          }}
        >
          DADES → PATRONS → PREDICCIONS
        </div>
      </div>
    </ModeCWipeStage>
  );
};

/**
 * INSERCIÓ 4 (Mode B): "reconèixer una cara, entendre el que diem, recomanar-nos una sèrie"
 * 3 files numerades (01, 02, 03) que entren en stagger al ritme de la veu.
 */
export const Insert04ThreeTasks: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // Timestamps relatius a l'inici del beat (29.44s):
  // 01 cara: frame 0 | 02 diem: ~frame 52 (1.75s) | 03 sèrie: ~frame 108 (3.6s)
  const items = [
    {
      num: "01",
      label: "RECONÈIXER UNA CARA",
      sub: "VISIÓ · PUNTS BIOMÈTRICS",
      startF: 2,
    },
    {
      num: "02",
      label: "ENTENDRE EL QUE DIEM",
      sub: "VEU → TEXT ESTRUCTURAT",
      startF: 50,
    },
    {
      num: "03",
      label: "RECOMANAR UNA SÈRIE",
      sub: "PREFERÈNCIES · FILTRATGE",
      startF: 106,
    },
  ];

  return (
    <ModeBPanelFrame
      accent="blue"
      code="FIG. 04"
      title="CAPACITATS DE LA IA"
      rightMeta="03 TASQUES"
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        {items.map((item, idx) => {
          const enter = interpolate(
            frame,
            [item.startF, item.startF + 14],
            [0, 1],
            {
              easing: THEME.motion.enter,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );
          const isCurrent =
            frame >= item.startF &&
            (idx === items.length - 1 || frame < items[idx + 1].startF);

          return (
            <div
              key={item.num}
              style={{
                height: 158,
                border: `2px solid ${
                  isCurrent ? THEME.colors.lime : THEME.colors.line
                }`,
                backgroundColor: THEME.colors.ink,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 22px",
                opacity: enter,
                transform: `translateX(${((1 - enter) * -36).toFixed(1)}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    width: 66,
                    height: 66,
                    backgroundColor: isCurrent
                      ? THEME.colors.lime
                      : THEME.colors.blue,
                    color: isCurrent
                      ? THEME.colors.onAccentDark
                      : THEME.colors.textPrimary,
                    fontFamily: THEME.fonts.mono,
                    fontWeight: 500,
                    fontSize: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.num}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: THEME.fonts.display,
                      fontWeight: 800,
                      fontSize: 36,
                      letterSpacing: THEME.tracking.displayTight,
                      color: THEME.colors.textPrimary,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: THEME.fonts.mono,
                      fontSize: 17,
                      color: THEME.colors.textSecondary,
                      marginTop: 4,
                    }}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>

              {/* Gràfic vectorial específic de cada fila */}
              <div style={{ width: 190, height: 118, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {idx === 0 && (
                  <svg width={130} height={112} viewBox="0 0 130 112">
                    {/* Marc de reconeixement i rostre esquemàtic */}
                    <path
                      d="M12 28 V12 H28 M102 12 H118 V28 M118 84 V100 H102 M28 100 H12 V84"
                      fill="none"
                      stroke={THEME.colors.lime}
                      strokeWidth={2.5}
                    />
                    <rect
                      x={38}
                      y={22}
                      width={54}
                      height={68}
                      fill="none"
                      stroke={THEME.colors.textPrimary}
                      strokeWidth={2}
                    />
                    {[
                      [52, 44],
                      [78, 44],
                      [65, 58],
                      [53, 74],
                      [77, 74],
                    ].map(([cx, cy], pIdx) => (
                      <circle
                        key={pIdx}
                        cx={cx}
                        cy={cy}
                        r={3.5}
                        fill={THEME.colors.lime}
                      />
                    ))}
                    <line
                      x1={53}
                      y1={74}
                      x2={77}
                      y2={74}
                      stroke={THEME.colors.lime}
                      strokeWidth={2}
                    />
                  </svg>
                )}

                {idx === 1 && (
                  <svg width={180} height={96} viewBox="0 0 180 96">
                    {/* Ona d'àudio que es converteix en línies de text */}
                    {[12, 24, 36, 48, 60].map((x, bIdx) => {
                      const h =
                        16 +
                        Math.abs(Math.sin((frame + bIdx * 9) * 0.22)) * 48;
                      return (
                        <rect
                          key={bIdx}
                          x={x}
                          y={48 - h / 2}
                          width={6}
                          height={h}
                          fill={THEME.colors.blueText}
                        />
                      );
                    })}
                    <line
                      x1={76}
                      y1={48}
                      x2={98}
                      y2={48}
                      stroke={THEME.colors.lime}
                      strokeWidth={2}
                    />
                    <rect
                      x={106}
                      y={26}
                      width={64}
                      height={8}
                      fill={THEME.colors.textPrimary}
                    />
                    <rect
                      x={106}
                      y={44}
                      width={50}
                      height={8}
                      fill={THEME.colors.lime}
                    />
                    <rect
                      x={106}
                      y={62}
                      width={58}
                      height={8}
                      fill={THEME.colors.textSecondary}
                    />
                  </svg>
                )}

                {idx === 2 && (
                  <svg width={170} height={104} viewBox="0 0 170 104">
                    {/* Targetes que es barregen horitzontalment */}
                    {[0, 1, 2].map((cIdx) => {
                      const shift =
                        Math.sin((frame - item.startF) * 0.14 + cIdx * 2.1) *
                        24;
                      const isFront = cIdx === 1;
                      return (
                        <rect
                          key={cIdx}
                          x={58 + shift}
                          y={16 + cIdx * 6}
                          width={54}
                          height={68}
                          fill={
                            isFront ? THEME.colors.lime : THEME.colors.graphite
                          }
                          stroke={
                            isFront
                              ? THEME.colors.onAccentDark
                              : THEME.colors.textPrimary
                          }
                          strokeWidth={2}
                        />
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 5 (Mode B): "Per reconèixer un gat... milers de fotos"
 * Reixeta de fitxes abstractes que s'omple ràpid amb caixes de detecció + comptador d'exemples -> GAT.
 */
export const Insert05CatPatterns: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const totalTiles = 10; // 5 x 2
  const targetIdx = 7;
  const lockFrame = Math.round(durationInFrames * 0.62);
  const isLocked = frame >= lockFrame;

  const examplesCount = Math.round(
    interpolate(frame, [4, lockFrame], [12, 4800], {
      easing: THEME.motion.inOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const scanIdx = isLocked ? targetIdx : Math.floor(frame / 4) % totalTiles;

  return (
    <ModeBPanelFrame
      accent="lime"
      code="FIG. 05"
      title="APRENENTATGE · PATRONS"
      rightMeta={`${examplesCount.toLocaleString("ca-ES")} EXEMPLES`}
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 18 }}>
        {/* Capçalera amb comptador gran */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span
              style={{
                fontFamily: THEME.fonts.display,
                fontWeight: 800,
                fontSize: 72,
                lineHeight: 0.9,
                letterSpacing: THEME.tracking.displayTight,
                color: THEME.colors.lime,
              }}
            >
              {examplesCount.toLocaleString("ca-ES")}
            </span>
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 22,
                color: THEME.colors.textSecondary,
                letterSpacing: THEME.tracking.monoWide,
              }}
            >
              FOTOS ANALITZADES
            </span>
          </div>

          <div
            style={{
              backgroundColor: isLocked
                ? THEME.colors.lime
                : THEME.colors.ink,
              color: isLocked
                ? THEME.colors.onAccentDark
                : THEME.colors.textSecondary,
              border: `2px solid ${
                isLocked ? THEME.colors.lime : THEME.colors.line
              }`,
              fontFamily: THEME.fonts.mono,
              fontWeight: 500,
              fontSize: 20,
              padding: "8px 16px",
              letterSpacing: THEME.tracking.monoWide,
            }}
          >
            {isLocked ? "CLASSIFICAT: GAT [99.4%]" : "CERCANT TRETS..."}
          </div>
        </div>

        {/* Reixeta 5 x 2 de fitxes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 12,
            flex: 1,
          }}
        >
          {Array.from({ length: totalTiles }).map((_, idx) => {
            const tileAppear = interpolate(
              frame,
              [idx * 3, idx * 3 + 8],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );
            const isTarget = idx === targetIdx && isLocked;
            const isScanned = idx === scanIdx;

            return (
              <div
                key={idx}
                style={{
                  position: "relative",
                  backgroundColor: isTarget
                    ? THEME.colors.lime
                    : THEME.colors.ink,
                  border: `2px solid ${
                    isTarget || isScanned
                      ? THEME.colors.lime
                      : THEME.colors.line
                  }`,
                  opacity: tileAppear,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Silueta geomètrica: gat a la fitxa objectiu o formes abstractes a la resta */}
                <svg width={84} height={74} viewBox="0 0 84 74">
                  {idx === targetIdx ? (
                    <path
                      d="M18 58 V16 L32 30 H52 L66 16 V58 Z"
                      fill="none"
                      stroke={
                        isTarget
                          ? THEME.colors.onAccentDark
                          : THEME.colors.textPrimary
                      }
                      strokeWidth={3}
                    />
                  ) : idx % 3 === 0 ? (
                    <circle
                      cx={42}
                      cy={38}
                      r={20}
                      fill="none"
                      stroke={THEME.colors.textSecondary}
                      strokeWidth={2}
                    />
                  ) : idx % 3 === 1 ? (
                    <rect
                      x={22}
                      y={18}
                      width={40}
                      height={40}
                      fill="none"
                      stroke={THEME.colors.textSecondary}
                      strokeWidth={2}
                    />
                  ) : (
                    <polygon
                      points="42,16 66,58 18,58"
                      fill="none"
                      stroke={THEME.colors.textSecondary}
                      strokeWidth={2}
                    />
                  )}
                </svg>

                {isTarget && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      backgroundColor: THEME.colors.onAccentDark,
                      color: THEME.colors.lime,
                      fontFamily: THEME.fonts.mono,
                      fontSize: 17,
                      padding: "2px 10px",
                      letterSpacing: THEME.tracking.monoWide,
                    }}
                  >
                    GAT
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 6 (Mode B): "desbloquegem el mòbil amb la cara, Spotify, GPS"
 * Tres etiquetes en mono que s'encenen en lima una a una (CARA / MÚSICA / CAMÍ) + línia de ruta GPS.
 */
export const Insert06DailyTrio: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const musicF = Math.round(durationInFrames * 0.34);
  const gpsF = Math.round(durationInFrames * 0.62);
  const badges = [
    { label: "CARA", meta: "FACE ID", onFrame: 3 },
    { label: "MÚSICA", meta: "SPOTIFY", onFrame: musicF },
    { label: "CAMÍ", meta: "GPS RÀPID", onFrame: gpsF },
  ];

  const routeDraw = interpolate(
    frame,
    [gpsF, Math.max(gpsF + 14, durationInFrames - 10)],
    [0, 1],
    {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <ModeBPanelFrame
      accent="lime"
      code="FIG. 06"
      title="IA QUOTIDIANA INVISIBLE"
      rightMeta="03 SISTEMES ACTIUS"
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
        {/* Tres etiquetes mono que s'encenen en lima una a una */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {badges.map((b, idx) => {
            const active = frame >= b.onFrame;
            return (
              <div
                key={b.label}
                style={{
                  border: `2px solid ${
                    active ? THEME.colors.lime : THEME.colors.line
                  }`,
                  backgroundColor: active
                    ? THEME.colors.lime
                    : THEME.colors.ink,
                  color: active
                    ? THEME.colors.onAccentDark
                    : THEME.colors.textSecondary,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: 16,
                    opacity: 0.8,
                  }}
                >
                  {`0${idx + 1} · ${b.meta}`}
                </span>
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontWeight: 500,
                    fontSize: 34,
                    letterSpacing: THEME.tracking.monoWide,
                  }}
                >
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mapa esquemàtic amb línia de ruta GPS que es dibuixa */}
        <div
          style={{
            flex: 1,
            border: `2px solid ${THEME.colors.line}`,
            backgroundColor: THEME.colors.ink,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg width={892} height={355} viewBox="0 0 892 355">
            {/* Trama urbana ortogonal */}
            {[150, 310, 470, 630, 770].map((x) => (
              <line
                key={`vx-${x}`}
                x1={x}
                y1={0}
                x2={x}
                y2={355}
                stroke={THEME.colors.line}
                strokeWidth={2}
              />
            ))}
            {[90, 180, 270].map((y) => (
              <line
                key={`hy-${y}`}
                x1={0}
                y1={y}
                x2={892}
                y2={y}
                stroke={THEME.colors.line}
                strokeWidth={2}
              />
            ))}

            {/* Ruta lenta descartada en gris */}
            <path
              d="M 85 270 L 310 270 L 310 90 L 630 90 L 810 90"
              fill="none"
              stroke={THEME.colors.textSecondary}
              strokeWidth={2}
              strokeDasharray="8 8"
              opacity={0.45}
            />

            {/* Ruta òptima en lima que es dibuixa */}
            <path
              d="M 85 270 L 150 270 L 150 180 L 470 180 L 470 90 L 810 90"
              fill="none"
              stroke={THEME.colors.lime}
              strokeWidth={7}
              strokeDasharray={1150}
              strokeDashoffset={(1 - routeDraw) * 1150}
            />

            {/* Nodes Origen A i Destí B */}
            <rect
              x={67}
              y={252}
              width={36}
              height={36}
              fill={THEME.colors.blue}
            />
            <text
              x={85}
              y={277}
              textAnchor="middle"
              fill={THEME.colors.textPrimary}
              fontFamily="JetBrains Mono"
              fontSize={20}
            >
              A
            </text>

            <rect
              x={792}
              y={72}
              width={36}
              height={36}
              fill={routeDraw > 0.85 ? THEME.colors.lime : THEME.colors.graphite}
              stroke={THEME.colors.lime}
              strokeWidth={2}
            />
            <text
              x={810}
              y={97}
              textAnchor="middle"
              fill={
                routeDraw > 0.85
                  ? THEME.colors.onAccentDark
                  : THEME.colors.lime
              }
              fontFamily="JetBrains Mono"
              fontSize={20}
            >
              B
            </text>
          </svg>

          <div
            style={{
              position: "absolute",
              bottom: 14,
              right: 16,
              backgroundColor: THEME.colors.graphite,
              border: `2px solid ${THEME.colors.line}`,
              padding: "6px 12px",
              fontFamily: THEME.fonts.mono,
              fontSize: 17,
              color: routeDraw > 0.1 ? THEME.colors.lime : THEME.colors.textSecondary,
            }}
          >
            {routeDraw > 0.1 ? "RUTA MÉS RÀPIDA CALCULADA" : "ESPERANT SENYAL GPS"}
          </div>
        </div>
      </div>
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 7a (Mode C): AlphaFold — número gegant "2024" amb comptador + traç que es plega com una proteïna
 * i a sota "PREMI NOBEL DE QUÍMICA · ALPHAFOLD · GOOGLE DEEPMIND" en mono.
 */
export const Insert07aAlphaFoldFull: React.FC<{
  durationInFrames: number;
  figLabel?: string;
}> = ({ durationInFrames, figLabel }) => {
  const frame = useCurrentFrame();
  const year = Math.round(
    interpolate(frame, [0, 26], [2018, 2024], {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const fold = interpolate(frame, [6, durationInFrames - 12], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Traç vectorial que es plega en estructura 3D d'hèlix/plec de proteïna
  const proteinPath =
    "M 90 220 C 170 40, 250 320, 330 130 C 410 -20, 470 340, 560 150 C 640 20, 720 300, 830 120";

  return (
    <ModeCWipeStage
      backgroundColor={THEME.colors.ink}
      figLabel={figLabel}
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          position: "absolute",
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          top: 280,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.display,
            fontWeight: 800,
            fontSize: 256,
            lineHeight: 0.84,
            letterSpacing: "-0.05em",
            color: THEME.colors.lime,
          }}
        >
          {year}
        </div>

        {/* Traç plegat d'estructura proteica */}
        <div
          style={{
            border: `2px solid ${THEME.colors.blue}`,
            backgroundColor: THEME.colors.graphite,
            height: 360,
            position: "relative",
          }}
        >
          <svg width={946} height={360} viewBox="0 0 946 360">
            <path
              d={proteinPath}
              fill="none"
              stroke={THEME.colors.blue}
              strokeWidth={14}
              strokeDasharray={1500}
              strokeDashoffset={(1 - fold) * 1500}
            />
            <path
              d={proteinPath}
              fill="none"
              stroke={THEME.colors.lime}
              strokeWidth={4}
              strokeDasharray={1500}
              strokeDashoffset={(1 - fold) * 1500}
            />
            {[
              [90, 220],
              [330, 130],
              [560, 150],
              [830, 120],
            ].map(([cx, cy], idx) => (
              <rect
                key={idx}
                x={cx - 9}
                y={cy - 9}
                width={18}
                height={18}
                fill={THEME.colors.textPrimary}
                opacity={fold > idx * 0.25 ? 1 : 0}
              />
            ))}
          </svg>
        </div>

        <div
          style={{
            borderTop: `2px solid ${THEME.colors.line}`,
            paddingTop: 18,
            fontFamily: THEME.fonts.mono,
            fontWeight: 500,
            fontSize: 24,
            lineHeight: 1.4,
            letterSpacing: THEME.tracking.monoWide,
            color: THEME.colors.textPrimary,
          }}
        >
          PREMI NOBEL DE QUÍMICA ·{" "}
          <span style={{ color: THEME.colors.lime }}>ALPHAFOLD</span> · GOOGLE
          DEEPMIND
        </div>
      </div>
    </ModeCWipeStage>
  );
};

/**
 * INSERCIÓ 7b (Mode B): AlphaFold comparador visual d'escala temporal ("podia costar anys" -> IA).
 */
export const Insert07bAlphaFoldPanel: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  // "una feina que als científics els podia costar anys" arrenca a ~5.9s dins aquest beat (frame ~175)
  const compareIn = interpolate(frame, [20, 90], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yearsHighlight = frame >= 165;

  return (
    <ModeBPanelFrame
      accent="lime"
      code="FIG. 07B"
      title="ALPHAFOLD · PLEGAMENT DE PROTEÏNES"
      rightMeta="GOOGLE DEEPMIND"
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        {/* Comparador visual d'escala temporal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Barra Mètode Tradicional: ANYS */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: THEME.fonts.mono,
                fontSize: 20,
                color: THEME.colors.textSecondary,
                marginBottom: 8,
              }}
            >
              <span>LABORATORI TRADICIONAL</span>
              <span style={{ color: THEME.colors.red }}>ESCALA: ANYS</span>
            </div>
            <div
              style={{
                height: 62,
                border: `2px solid ${THEME.colors.line}`,
                backgroundColor: THEME.colors.ink,
                padding: 6,
              }}
            >
              <div
                style={{
                  width: `${(compareIn * 100).toFixed(1)}%`,
                  height: "100%",
                  backgroundColor: yearsHighlight
                    ? THEME.colors.red
                    : THEME.colors.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 16,
                  fontFamily: THEME.fonts.display,
                  fontWeight: 800,
                  fontSize: 30,
                  color: THEME.colors.onAccentDark,
                }}
              >
                ANYS D&apos;EXPERIMENTACIÓ
              </div>
            </div>
          </div>

          {/* Barra AlphaFold IA */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: THEME.fonts.mono,
                fontSize: 20,
                color: THEME.colors.lime,
                marginBottom: 8,
              }}
            >
              <span>PREDICCIÓ ALPHAFOLD (IA)</span>
              <span>ACCELERACIÓ RADICAL</span>
            </div>
            <div
              style={{
                height: 62,
                border: `2px solid ${THEME.colors.lime}`,
                backgroundColor: THEME.colors.ink,
                padding: 6,
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  width: `${(compareIn * 9).toFixed(1)}%`,
                  minWidth: 44,
                  height: "100%",
                  backgroundColor: THEME.colors.lime,
                }}
              />
              <span
                style={{
                  fontFamily: THEME.fonts.display,
                  fontWeight: 800,
                  fontSize: 34,
                  color: THEME.colors.lime,
                  letterSpacing: THEME.tracking.displayTight,
                }}
              >
                ANYS → FRACCIÓ DE TEMPS
              </span>
            </div>
          </div>
        </div>

        {/* Esquema geomètric inferior de plegament 3D + fitxes de síntesi */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "stretch",
            height: 152,
          }}
        >
          <div
            style={{
              flex: 1.35,
              border: `2px solid ${THEME.colors.line}`,
              backgroundColor: THEME.colors.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={490} height={124} viewBox="0 0 490 124">
              <polyline
                points="28,88 94,32 162,92 238,26 312,86 386,36 458,76"
                fill="none"
                stroke={THEME.colors.blue}
                strokeWidth={5}
              />
              <polyline
                points="28,88 94,32 162,92 238,26 312,86 386,36 458,76"
                fill="none"
                stroke={THEME.colors.lime}
                strokeWidth={2.5}
                strokeDasharray={620}
                strokeDashoffset={(1 - compareIn) * 620}
              />
              {[
                [28, 88],
                [94, 32],
                [162, 92],
                [238, 26],
                [312, 86],
                [386, 36],
                [458, 76],
              ].map(([x, y], idx) => (
                <rect
                  key={idx}
                  x={x - 6}
                  y={y - 6}
                  width={12}
                  height={12}
                  fill={
                    idx % 2 === 0 ? THEME.colors.lime : THEME.colors.textPrimary
                  }
                />
              ))}
            </svg>
          </div>
          <div
            style={{
              flex: 1,
              border: `2px solid ${THEME.colors.line}`,
              backgroundColor: THEME.colors.ink,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 18,
                color: THEME.colors.textSecondary,
              }}
            >
              PROBLEMA RESOLT
            </span>
            <span
              style={{
                fontFamily: THEME.fonts.display,
                fontWeight: 800,
                fontSize: 30,
                lineHeight: 1.0,
                color: THEME.colors.textPrimary,
              }}
            >
              ESTRUCTURA 3D DE PROTEÏNES
            </span>
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 18,
                color: THEME.colors.blueText,
              }}
            >
              PREMI NOBEL QUÍMICA · 2024
            </span>
          </div>
        </div>
      </div>
    </ModeBPanelFrame>
  );
};
