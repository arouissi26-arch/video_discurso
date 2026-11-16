import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ModeBPanelFrame } from "../components/ModeBPanelFrame";
import { ModeCWipeStage } from "../components/ModeCWipeStage";
import { THEME } from "../theme";

function buildEcgPath(
  width: number,
  midY: number,
  mode: "alert" | "anomaly" | "normal"
): string {
  // Genera una traça ECG neta i geomètrica en coordenades SVG
  const segments: string[] = [`M 0 ${midY}`];
  const cycles = mode === "anomaly" ? 5 : 4;
  const step = width / cycles;

  for (let i = 0; i < cycles; i++) {
    const x0 = i * step;
    const isSpike = mode === "alert" && i === cycles - 1;
    const shift =
      mode === "anomaly" && (i === 1 || i === 3) ? -step * 0.16 : 0;
    const base = x0 + shift;

    const pAmp = mode === "normal" ? 16 : 18;
    const rAmp = isSpike
      ? 168
      : mode === "anomaly" && i === 2
      ? 132
      : mode === "normal"
      ? 86
      : 92;
    const sAmp = isSpike ? 78 : 34;
    const tAmp = mode === "anomaly" && i === 2 ? -26 : 24;

    segments.push(
      `L ${(base + step * 0.16).toFixed(1)} ${midY}`,
      `L ${(base + step * 0.22).toFixed(1)} ${(midY - pAmp).toFixed(1)}`,
      `L ${(base + step * 0.28).toFixed(1)} ${midY}`,
      `L ${(base + step * 0.36).toFixed(1)} ${(midY + 14).toFixed(1)}`,
      `L ${(base + step * 0.42).toFixed(1)} ${(midY - rAmp).toFixed(1)}`,
      `L ${(base + step * 0.48).toFixed(1)} ${(midY + sAmp).toFixed(1)}`,
      `L ${(base + step * 0.55).toFixed(1)} ${midY}`,
      `L ${(base + step * 0.68).toFixed(1)} ${(midY - tAmp).toFixed(1)}`,
      `L ${(base + step * 0.78).toFixed(1)} ${midY}`,
      `L ${(x0 + step).toFixed(1)} ${midY}`
    );
  }
  return segments.join(" ");
}

/**
 * INSERCIÓ 1: "T'imagines un món on el mòbil sàpiga que estàs malalt abans que tu?"
 * Mode B: ECG que es dibuixa amb comptador de BPM pujant; al final pic + "!" en vermell.
 */
export const Insert01EcgAlert: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const drawProgress = interpolate(
    frame,
    [6, durationInFrames - 22],
    [0, 1],
    {
      easing: THEME.motion.inOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const bpm = Math.round(
    interpolate(
      frame,
      [0, durationInFrames * 0.55, durationInFrames - 18],
      [72, 98, 148],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  );

  const isAlert = frame >= durationInFrames - 42;
  const alertPop = interpolate(
    frame,
    [durationInFrames - 42, durationInFrames - 30],
    [0, 1],
    {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const svgW = 890;
  const svgH = 310;
  const pathD = buildEcgPath(svgW - 90, 185, "alert");
  const totalLen = 2400;

  return (
    <ModeBPanelFrame
      accent={isAlert ? "red" : "lime"}
      code="FIG. 01"
      title="DETECCIÓ PRECOÇ · BIOMETRIA"
      rightMeta={isAlert ? "ALERTA CRÍTICA" : "MONITOR ACTIU"}
      durationInFrames={durationInFrames}
    >
      {/* Capçalera amb comptador gegant de BPM i bloc d'alerta "!" */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: THEME.fontWeights.display,
              fontSize: 108,
              lineHeight: 0.88,
              letterSpacing: THEME.tracking.displayTight,
              color: isAlert ? THEME.colors.red : THEME.colors.lime,
            }}
          >
            {bpm}
          </span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontWeight: THEME.fontWeights.mono,
                fontSize: 24,
                color: THEME.colors.textPrimary,
                letterSpacing: THEME.tracking.monoWide,
              }}
            >
              BPM
            </span>
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontWeight: THEME.fontWeights.mono,
                fontSize: 18,
                color: THEME.colors.textSecondary,
              }}
            >
              FREQÜÈNCIA CARDÍACA
            </span>
          </div>
        </div>

        {/* Bloc "!" en vermell que irromp al pic final */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            transform: `scale(${(0.75 + 0.25 * alertPop).toFixed(3)})`,
            opacity: alertPop,
          }}
        >
          <div
            style={{
              border: `2px solid ${THEME.colors.red}`,
              padding: "10px 16px",
              backgroundColor: THEME.colors.ink,
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: 20,
              color: THEME.colors.red,
              letterSpacing: THEME.tracking.monoWide,
            }}
          >
            AVÍS PRECOÇ
          </div>
          <div
            style={{
              width: 84,
              height: 84,
              backgroundColor: THEME.colors.red,
              color: THEME.colors.onAccentDark,
              fontFamily: THEME.fonts.display,
              fontWeight: THEME.fontWeights.display,
              fontSize: 68,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            !
          </div>
        </div>
      </div>

      {/* Reixeta tècnica i línia ECG */}
      <div
        style={{
          position: "relative",
          border: `2px solid ${THEME.colors.line}`,
          backgroundColor: THEME.colors.ink,
          height: svgH,
        }}
      >
        <svg width={svgW} height={svgH}>
          {[62, 124, 185, 248].map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={svgW}
              y2={y}
              stroke={THEME.colors.line}
              strokeWidth={y === 185 ? 2 : 1}
              strokeDasharray={y === 185 ? "6 6" : undefined}
            />
          ))}
          {[140, 280, 420, 560, 700].map((x) => (
            <line
              key={x}
              x1={x}
              y1={0}
              x2={x}
              y2={svgH}
              stroke={THEME.colors.line}
              strokeWidth={1}
            />
          ))}
          <path
            d={pathD}
            fill="none"
            stroke={isAlert ? THEME.colors.red : THEME.colors.lime}
            strokeWidth={5}
            strokeLinejoin="miter"
            strokeMiterlimit={10}
            strokeDasharray={totalLen}
            strokeDashoffset={(1 - drawProgress) * totalLen}
          />
          {isAlert && (
            <circle
              cx={706}
              cy={22}
              r={10}
              fill={THEME.colors.red}
            />
          )}
        </svg>
      </div>
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 2: "Alguns rellotges intel·ligents ja detecten canvis en el pols..."
 * Continua l'ECG amb canvi subtil en el ritme i etiqueta mono: POLS · ANOMALIA.
 */
export const Insert02PulseAnomaly: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const drawProgress = interpolate(
    frame,
    [0, durationInFrames - 25],
    [0.15, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const svgW = 620;
  const svgH = 380;
  const pathD = buildEcgPath(svgW - 24, 200, "anomaly");
  const totalLen = 2200;

  return (
    <ModeBPanelFrame
      accent="lime"
      code="FIG. 02"
      title="POLS · ANOMALIA"
      rightMeta="SENSOR ÒPTIC · IA"
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          display: "flex",
          gap: 22,
          height: "100%",
          alignItems: "stretch",
        }}
      >
        {/* Esfera esquemàtica de rellotge intel·ligent */}
        <div
          style={{
            width: 250,
            border: `2px solid ${THEME.colors.line}`,
            backgroundColor: THEME.colors.ink,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: THEME.fonts.mono,
              fontSize: 18,
              color: THEME.colors.textSecondary,
              letterSpacing: THEME.tracking.monoWide,
            }}
          >
            WEARABLE // RX
          </div>

          {/* Esfera quadrada brutalista del sensor */}
          <div
            style={{
              width: 150,
              height: 150,
              alignSelf: "center",
              border: `3px solid ${THEME.colors.lime}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 17,
                color: THEME.colors.textSecondary,
              }}
            >
              INTERVAL RR
            </span>
            <span
              style={{
                fontFamily: THEME.fonts.display,
                fontWeight: 800,
                fontSize: 44,
                color: THEME.colors.red,
                letterSpacing: "-0.03em",
              }}
            >
              Δ +38%
            </span>
          </div>

          <div
            style={{
              backgroundColor: THEME.colors.red,
              color: THEME.colors.onAccentDark,
              fontFamily: THEME.fonts.mono,
              fontWeight: 500,
              fontSize: 18,
              padding: "8px 10px",
              textAlign: "center",
              letterSpacing: THEME.tracking.monoWide,
            }}
          >
            POLS · ANOMALIA
          </div>
        </div>

        {/* Traça d'arrítmia amb zona marcada */}
        <div
          style={{
            flex: 1,
            border: `2px solid ${THEME.colors.line}`,
            backgroundColor: THEME.colors.ink,
            position: "relative",
          }}
        >
          {/* Franja d'anomalia en el ritme */}
          <div
            style={{
              position: "absolute",
              left: 225,
              top: 0,
              bottom: 0,
              width: 145,
              backgroundColor: "rgba(255, 59, 31, 0.14)",
              borderLeft: `2px solid ${THEME.colors.red}`,
              borderRight: `2px solid ${THEME.colors.red}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 233,
              top: 12,
              fontFamily: THEME.fonts.mono,
              fontSize: 16,
              color: THEME.colors.red,
              letterSpacing: THEME.tracking.monoNormal,
            }}
          >
            CANVI DE RITME
          </div>

          <svg width={svgW} height={svgH}>
            {[100, 200, 300].map((y) => (
              <line
                key={y}
                x1={0}
                y1={y}
                x2={svgW}
                y2={y}
                stroke={THEME.colors.line}
                strokeWidth={1}
              />
            ))}
            <path
              d={pathD}
              fill="none"
              stroke={THEME.colors.lime}
              strokeWidth={4.5}
              strokeDasharray={totalLen}
              strokeDashoffset={(1 - drawProgress) * totalLen}
            />
          </svg>
        </div>
      </div>
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 11a (Mode B): Callback "Tornem al principi..." — l'ECG reapareix estabilitzant-se.
 */
export const Insert11aEcgCallbackPanel: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const drawProgress = interpolate(frame, [0, durationInFrames - 15], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bpm = Math.round(
    interpolate(frame, [0, 45], [112, 72], {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const svgW = 890;
  const svgH = 290;
  const pathD = buildEcgPath(svgW - 40, 155, "normal");

  return (
    <ModeBPanelFrame
      accent="blue"
      code="FIG. 16"
      title="TORNEM AL PRINCIPI · CERCLE TANCAT"
      rightMeta="RITME NORMAL · 72 BPM"
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 96,
              lineHeight: 0.9,
              letterSpacing: THEME.tracking.displayTight,
              color: THEME.colors.lime,
            }}
          >
            {bpm}
          </span>
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontSize: 22,
              color: THEME.colors.textPrimary,
              letterSpacing: THEME.tracking.monoWide,
            }}
          >
            BPM · POLS ESTABLE
          </span>
        </div>
        <div
          style={{
            border: `2px solid ${THEME.colors.blue}`,
            padding: "8px 14px",
            fontFamily: THEME.fonts.mono,
            fontSize: 18,
            color: THEME.colors.blueText,
          }}
        >
          CALLBACK → FIG. 01
        </div>
      </div>

      <div
        style={{
          border: `2px solid ${THEME.colors.line}`,
          backgroundColor: THEME.colors.ink,
          height: svgH,
        }}
      >
        <svg width={svgW} height={svgH}>
          {[75, 155, 235].map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={svgW}
              y2={y}
              stroke={THEME.colors.line}
              strokeWidth={1}
            />
          ))}
          <path
            d={pathD}
            fill="none"
            stroke={THEME.colors.lime}
            strokeWidth={4.5}
            strokeDasharray={2200}
            strokeDashoffset={(1 - drawProgress) * 2200}
          />
        </svg>
      </div>
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 11b (Mode C): Pont gràfic a pantalla completa ("Ara ja no sembla tan estrany, oi?")
 * Tanca el cercle visual del pols normal i dissimula al 100% la unió clip_1 -> clip_2.
 */
export const Insert11bEcgCallbackBridge: React.FC<{
  durationInFrames: number;
  figLabel?: string;
}> = ({ durationInFrames, figLabel }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [4, durationInFrames - 18], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textIn = interpolate(frame, [6, 20], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pathD = buildEcgPath(910, 175, "normal");

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
          top: 290,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              backgroundColor: THEME.colors.blue,
              color: THEME.colors.textPrimary,
              fontFamily: THEME.fonts.mono,
              fontSize: THEME.typeScale.label,
              padding: "6px 14px",
              letterSpacing: THEME.tracking.monoWide,
            }}
          >
            04 · CLOENDA
          </span>
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontSize: THEME.typeScale.label,
              color: THEME.colors.lime,
              letterSpacing: THEME.tracking.monoWide,
            }}
          >
            72 BPM · RITME NORMAL
          </span>
        </div>

        {/* Titular gran */}
        <div
          style={{
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 92,
              lineHeight: 0.92,
              letterSpacing: THEME.tracking.displayTight,
              color: THEME.colors.textPrimary,
              transform: `translateY(${((1 - textIn) * 60).toFixed(1)}px)`,
              opacity: textIn,
            }}
          >
            ARA JA NO SEMBLA
            <br />
            <span
              style={{
                fontFamily: THEME.fonts.editorial,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 108,
                color: THEME.colors.lime,
              }}
            >
              tan estrany, oi?
            </span>
          </div>
        </div>

        {/* Caixa d'ECG estable tancant el cercle */}
        <div
          style={{
            border: `2px solid ${THEME.colors.lime}`,
            backgroundColor: THEME.colors.graphite,
            height: 350,
            position: "relative",
          }}
        >
          <svg width={946} height={350}>
            {[85, 175, 265].map((y) => (
              <line
                key={y}
                x1={0}
                y1={y}
                x2={946}
                y2={y}
                stroke={THEME.colors.line}
                strokeWidth={1}
              />
            ))}
            <path
              d={pathD}
              transform="translate(18, 0)"
              fill="none"
              stroke={THEME.colors.lime}
              strokeWidth={6}
              strokeDasharray={2400}
              strokeDashoffset={(1 - draw) * 2400}
            />
          </svg>
        </div>
      </div>
    </ModeCWipeStage>
  );
};
