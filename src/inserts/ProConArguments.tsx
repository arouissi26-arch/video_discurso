import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { CropMarks } from "../components/BrutalistBackdrop";
import { ModeBPanelFrame } from "../components/ModeBPanelFrame";
import { ModeCWipeStage } from "../components/ModeCWipeStage";
import { THEME } from "../theme";

/**
 * INSERCIÓ 9.1 — SALUT (Mode B):
 * Línia d'escaneig que recorre una silueta de radiografia toràcica + marcadors que s'il·luminen + "DIAGNÒSTIC RÀPID".
 */
export const Insert09aHealthXray: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // Escaneig vertical cíclic suau
  const scanNorm = (frame % 95) / 95;
  const scanY = 24 + scanNorm * 440;

  const markers = [
    { x: 200, y: 150, label: "RX · PULMÓ SUP.", onFrame: 22 },
    { x: 325, y: 245, label: "DETECCIÓ PRECOÇ", onFrame: 58 },
    { x: 225, y: 335, label: " FÀRMACS IA", onFrame: 115 },
  ];

  return (
    <ModeBPanelFrame
      accent="lime"
      code="A FAVOR 01/03"
      title="SALUT · DIAGNÒSTIC RÀPID"
      rightMeta="RX SCAN ACTIU"
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", gap: 24, height: "100%" }}>
        {/* Visor de radiografia esquemàtica amb línia d'escaneig lima */}
        <div
          style={{
            width: 500,
            height: "100%",
            border: `2px solid ${THEME.colors.line}`,
            backgroundColor: THEME.colors.ink,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg width={500} height={515} viewBox="0 0 500 515">
            {/* Columna vertebral i costelles esquemàtiques */}
            <line
              x1={250}
              y1={40}
              x2={250}
              y2={455}
              stroke={THEME.colors.textSecondary}
              strokeWidth={8}
              strokeDasharray="16 8"
            />
            {[95, 150, 205, 260, 315, 370].map((ry, idx) => {
              const span = 145 - idx * 8;
              return (
                <g key={ry}>
                  <path
                    d={`M 242 ${ry} C ${242 - span} ${ry - 12}, ${
                      242 - span
                    } ${ry + 36}, 210 ${ry + 42}`}
                    fill="none"
                    stroke={THEME.colors.textPrimary}
                    strokeWidth={4}
                    opacity={0.72}
                  />
                  <path
                    d={`M 258 ${ry} C ${258 + span} ${ry - 12}, ${
                      258 + span
                    } ${ry + 36}, 290 ${ry + 42}`}
                    fill="none"
                    stroke={THEME.colors.textPrimary}
                    strokeWidth={4}
                    opacity={0.72}
                  />
                </g>
              );
            })}

            {/* Marcadors diagnòstics que s'il·luminen en passar l'escàner */}
            {markers.map((m, idx) => {
              const lit = frame >= m.onFrame;
              return (
                <g key={idx} opacity={lit ? 1 : 0.2}>
                  <rect
                    x={m.x - 18}
                    y={m.y - 18}
                    width={36}
                    height={36}
                    fill="none"
                    stroke={lit ? THEME.colors.lime : THEME.colors.textSecondary}
                    strokeWidth={2.5}
                  />
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={5}
                    fill={lit ? THEME.colors.lime : THEME.colors.textSecondary}
                  />
                </g>
              );
            })}

            {/* Línia làser d'escaneig */}
            <line
              x1={0}
              y1={scanY}
              x2={500}
              y2={scanY}
              stroke={THEME.colors.lime}
              strokeWidth={3}
            />
          </svg>
        </div>

        {/* Columna dreta de mètriques clíniques */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              backgroundColor: THEME.colors.lime,
              color: THEME.colors.onAccentDark,
              padding: "16px 18px",
              fontFamily: THEME.fonts.mono,
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: THEME.tracking.monoWide,
            }}
          >
            DIAGNÒSTIC RÀPID
          </div>

          {[
            { num: "01", txt: "ANÀLISI RADIOGRAFIES", f: 10 },
            { num: "02", txt: "DETECCIÓ ANTICIPADA", f: 55 },
            { num: "03", txt: "RECERCA MEDICAMENTS", f: 115 },
          ].map((row) => {
            const on = frame >= row.f;
            return (
              <div
                key={row.num}
                style={{
                  border: `2px solid ${
                    on ? THEME.colors.lime : THEME.colors.line
                  }`,
                  backgroundColor: THEME.colors.ink,
                  padding: "18px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: 16,
                    color: on ? THEME.colors.lime : THEME.colors.textSecondary,
                  }}
                >
                  {`FASE ${row.num}`}
                </span>
                <span
                  style={{
                    fontFamily: THEME.fonts.display,
                    fontWeight: 800,
                    fontSize: 27,
                    letterSpacing: THEME.tracking.displayTight,
                    color: THEME.colors.textPrimary,
                  }}
                >
                  {row.txt}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 9.2 — EDUCACIÓ (Mode B):
 * Lliscadors que s'ajusten a ritmes diferents per alumne + rellotge que avança fins "NIT ABANS D'UN EXAMEN".
 */
export const Insert09bEducationRhythm: React.FC<{
  durationInFrames: number;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const sliders = [
    {
      label: "ALUMNE A · RITME VISUAL",
      target: 78,
      base: 32,
      delay: 4,
    },
    {
      label: "ALUMNE B · PAS A PAS",
      target: 46,
      base: 70,
      delay: 18,
    },
    {
      label: "ALUMNE C · REPÀS INTENSIU",
      target: 92,
      base: 48,
      delay: 32,
    },
  ];

  const examStart = Math.round(durationInFrames * 0.40);
  const examEnd = Math.round(durationInFrames * 0.70);
  const clockProgress = interpolate(frame, [examStart, examEnd], [0, 1], {
    easing: THEME.motion.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const totalMins = Math.round(16 * 60 + clockProgress * (7 * 60 + 45)); // 16:00 -> 23:45
  const hh = String(Math.floor(totalMins / 60) % 24).padStart(2, "0");
  const mm = String(totalMins % 60).padStart(2, "0");
  const isExamNight = frame >= Math.round(durationInFrames * 0.54);

  return (
    <ModeBPanelFrame
      accent="lime"
      code="A FAVOR 02/03"
      title="EDUCACIÓ PERSONALITZADA"
      rightMeta="24H DISPONIBLE"
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", gap: 22, height: "100%" }}>
        {/* Esquerra: 3 lliscadors de ritme adaptatiu */}
        <div
          style={{
            flex: 1.25,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {sliders.map((s) => {
            const pct = interpolate(
              frame,
              [s.delay, s.delay + 50],
              [s.base, s.target],
              {
                easing: THEME.motion.enter,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }
            );
            return (
              <div
                key={s.label}
                style={{
                  border: `2px solid ${THEME.colors.line}`,
                  backgroundColor: THEME.colors.ink,
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: THEME.fonts.mono,
                    fontSize: 17,
                    color: THEME.colors.textPrimary,
                    marginBottom: 14,
                  }}
                >
                  <span>{s.label}</span>
                  <span style={{ color: THEME.colors.lime }}>
                    {`${Math.round(pct)}%`}
                  </span>
                </div>
                <div
                  style={{
                    position: "relative",
                    height: 22,
                    backgroundColor: THEME.colors.graphite,
                    border: `2px solid ${THEME.colors.line}`,
                  }}
                >
                  <div
                    style={{
                      width: `${pct.toFixed(1)}%`,
                      height: "100%",
                      backgroundColor: THEME.colors.lime,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: -7,
                      left: `calc(${pct.toFixed(1)}% - 8px)`,
                      width: 16,
                      height: 32,
                      backgroundColor: THEME.colors.textPrimary,
                      border: `2px solid ${THEME.colors.onAccentDark}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dreta: Rellotge digital que arriba a "NIT ABANS D'UN EXAMEN" */}
        <div
          style={{
            flex: 0.95,
            border: `2px solid ${
              isExamNight ? THEME.colors.lime : THEME.colors.line
            }`,
            backgroundColor: THEME.colors.ink,
            padding: 22,
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
              letterSpacing: THEME.tracking.monoWide,
            }}
          >
            RESOLUCIÓ DE DUBTES
          </span>

          <div
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 94,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: isExamNight ? THEME.colors.lime : THEME.colors.textPrimary,
            }}
          >
            {`${hh}:${mm}`}
          </div>

          <div
            style={{
              backgroundColor: isExamNight
                ? THEME.colors.lime
                : THEME.colors.graphite,
              color: isExamNight
                ? THEME.colors.onAccentDark
                : THEME.colors.textSecondary,
              border: `2px solid ${
                isExamNight ? THEME.colors.lime : THEME.colors.line
              }`,
              padding: "12px 14px",
              fontFamily: THEME.fonts.mono,
              fontWeight: 500,
              fontSize: 18,
              lineHeight: 1.25,
              letterSpacing: THEME.tracking.monoNormal,
            }}
          >
            NIT ABANS D&apos;UN EXAMEN
          </div>
        </div>
      </div>
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 9.3 — VIDA QUOTIDIANA (Mode B):
 * Tres files (TRADUCTORS / MAPES / ASSISTENTS) amb icones de línia simples que es dibuixen.
 */
export const Insert09cDailyLifeRows: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  // Timestamps relatius a 120.96s: Traductors (25f), Mapes (165f), Assistents (245f -> comprimim stagger net dins 283f)
  const rows = [
    {
      title: "TRADUCTORS",
      sub: "IDIOMES EN TEMPS REAL",
      startF: 8,
    },
    {
      title: "MAPES",
      sub: "ESTALVI DE TEMPS I TRÀNSIT",
      startF: Math.round(durationInFrames * 0.34),
    },
    {
      title: "ASSISTENTS",
      sub: "ORGANITZACIÓ DIÀRIA",
      startF: Math.round(durationInFrames * 0.66),
    },
  ];

  return (
    <ModeBPanelFrame
      accent="lime"
      code="A FAVOR 03/03"
      title="VIDA QUOTIDIANA"
      rightMeta="EINES PRÀCTIQUES"
      durationInFrames={durationInFrames}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", gap: 14 }}>
        {rows.map((r, idx) => {
          const draw = interpolate(frame, [r.startF, r.startF + 28], [0, 1], {
            easing: THEME.motion.enter,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const active = frame >= r.startF;

          return (
            <div
              key={r.title}
              style={{
                height: 156,
                border: `2px solid ${
                  active ? THEME.colors.lime : THEME.colors.line
                }`,
                backgroundColor: THEME.colors.ink,
                padding: "0 26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: active ? 1 : 0.42,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: THEME.fonts.display,
                    fontWeight: 800,
                    fontSize: 44,
                    letterSpacing: THEME.tracking.displayTight,
                    color: active
                      ? THEME.colors.lime
                      : THEME.colors.textSecondary,
                  }}
                >
                  {r.title}
                </div>
                <div
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: 18,
                    color: THEME.colors.textPrimary,
                    marginTop: 4,
                  }}
                >
                  {r.sub}
                </div>
              </div>

              {/* Icones de línia simples (2.5px) que es dibuixen amb stroke-dashoffset */}
              <svg width={120} height={96} viewBox="0 0 120 96">
                {idx === 0 && (
                  <path
                    d="M 14 20 H 68 V 56 H 36 L 20 72 V 56 H 14 Z M 52 38 H 106 V 74 H 98 V 88 L 82 74 H 52 Z"
                    fill="none"
                    stroke={THEME.colors.lime}
                    strokeWidth={3}
                    strokeDasharray={420}
                    strokeDashoffset={(1 - draw) * 420}
                  />
                )}
                {idx === 1 && (
                  <path
                    d="M 16 76 L 44 22 L 76 64 L 104 18 M 90 18 H 104 V 32"
                    fill="none"
                    stroke={THEME.colors.lime}
                    strokeWidth={3.5}
                    strokeDasharray={300}
                    strokeDashoffset={(1 - draw) * 300}
                  />
                )}
                {idx === 2 && (
                  <path
                    d="M 20 18 H 100 V 80 H 20 Z M 20 36 H 100 M 42 54 L 54 66 L 80 44"
                    fill="none"
                    stroke={THEME.colors.lime}
                    strokeWidth={3}
                    strokeDasharray={420}
                    strokeDashoffset={(1 - draw) * 420}
                  />
                )}
              </svg>
            </div>
          );
        })}
      </div>
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 10.1 — FIABILITAT / DEEPFAKES (Mode E):
 * Pantalla partida "REAL" vs "FALS" amb glitch determinista i desplaçament RGB (ÚNIC ús del glitch al vídeo!)
 * + Segell "VERITAT?" que es ratlla quan diu "era veritat".
 */
export const Insert10aDeepfakesGlitch: React.FC<{
  durationInFrames: number;
  figLabel?: string;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 7], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [0, 1],
    {
      easing: THEME.motion.exit,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Glitch determinista amb random(seed) — actiu en ràfegues sobretot quan es pronuncia "DEEPFAKES" (~frame 115-195)
  const glitchBurst =
    random(`glitch-gate-${Math.floor(frame / 3)}`) > 0.42 ? 1 : 0;
  const rgbShift =
    glitchBurst * (random(`rgb-${frame}`) * 22 - 11);
  const sliceShift =
    glitchBurst * (random(`slice-${frame}`) * 36 - 18);

  // Segell "VERITAT?" entra a la segona meitat ("Abans pensàvem que... era veritat") i es ratlla!
  const stampStart = Math.round(durationInFrames * 0.44);
  const stampEnter = interpolate(frame, [stampStart, stampStart + 11], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strikeStart = Math.round(durationInFrames * 0.62);
  const strikeDraw = interpolate(frame, [strikeStart, strikeStart + 18], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        zIndex: 62,
        clipPath: `inset(0% ${((1 - enter) * 100).toFixed(1)}% 0% ${(
          exit * 100
        ).toFixed(1)}%)`,
        backgroundColor: THEME.colors.ink,
      }}
    >
      {/* MEITAT ESQUERRA: REAL */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "50%",
          backgroundColor: THEME.colors.graphite,
          borderRight: `4px solid ${THEME.colors.red}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: THEME.layout.safeX,
          paddingRight: 28,
        }}
      >
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: 20,
            color: THEME.colors.textSecondary,
            letterSpacing: THEME.tracking.monoWide,
            marginBottom: 14,
          }}
        >
          [ FONT ORIGINAL ]
        </span>
        <div
          style={{
            fontFamily: THEME.fonts.display,
            fontWeight: 800,
            fontSize: 138,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: THEME.colors.textPrimary,
          }}
        >
          REAL
        </div>
        <div
          style={{
            marginTop: 28,
            border: `2px solid ${THEME.colors.line}`,
            padding: "12px 16px",
            fontFamily: THEME.fonts.mono,
            fontSize: 18,
            color: THEME.colors.lime,
          }}
        >
          CAPTURA VERIFICADA
        </div>
      </div>

      {/* MEITAT DRETA: FALS / DEEPFAKES (amb desplaçament RGB i llesques glitch) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "50%",
          backgroundColor: THEME.colors.ink,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 36,
          paddingRight: THEME.layout.safeX,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: 20,
            color: THEME.colors.red,
            letterSpacing: THEME.tracking.monoWide,
            marginBottom: 14,
          }}
        >
          [ SÍNTESI · DEEPFAKE ]
        </span>

        {/* Capes cromàtiques desplaçades RGB */}
        <div style={{ position: "relative", height: 150 }}>
          <div
            style={{
              position: "absolute",
              left: rgbShift,
              top: -3,
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 138,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: THEME.colors.blue,
              opacity: 0.82,
            }}
          >
            FALS
          </div>
          <div
            style={{
              position: "absolute",
              left: -rgbShift,
              top: 3,
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 138,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: THEME.colors.lime,
              opacity: 0.72,
            }}
          >
            FALS
          </div>
          <div
            style={{
              position: "relative",
              transform: `translateX(${sliceShift.toFixed(1)}px)`,
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 138,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: THEME.colors.red,
            }}
          >
            FALS
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            backgroundColor: THEME.colors.red,
            color: THEME.colors.onAccentDark,
            padding: "12px 16px",
            fontFamily: THEME.fonts.mono,
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: THEME.tracking.monoWide,
            transform: `translateX(${(-sliceShift * 0.5).toFixed(1)}px)`,
          }}
        >
          DEEPFAKES · SINTÈTIC
        </div>

        {/* Barres de soroll digital horitzontal deterministes */}
        {glitchBurst > 0 &&
          [320, 690, 1080, 1340].map((y, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: y + random(`bar-y-${frame}-${idx}`) * 40,
                height: 6 + random(`bar-h-${frame}-${idx}`) * 14,
                backgroundColor:
                  idx % 2 === 0 ? THEME.colors.red : THEME.colors.blue,
                opacity: 0.65,
              }}
            />
          ))}
      </div>

      {/* Segell central "VERITAT?" que es ratlla en vermell */}
      {stampEnter > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 415,
            transform: `translate(-50%, -50%) scale(${(
              1.35 -
              0.35 * stampEnter
            ).toFixed(3)}) rotate(-5deg)`,
            backgroundColor: THEME.colors.ink,
            border: `5px solid ${THEME.colors.textPrimary}`,
            padding: "22px 46px",
            zIndex: 70,
          }}
        >
          <span
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 88,
              letterSpacing: "-0.03em",
              color: THEME.colors.textPrimary,
            }}
          >
            VERITAT?
          </span>

          {/* Ratllat vermell agressiu sobre VERITAT? */}
          <svg
            width={520}
            height={150}
            style={{
              position: "absolute",
              left: -20,
              top: -10,
              pointerEvents: "none",
            }}
          >
            <line
              x1={10}
              y1={135}
              x2={510}
              y2={15}
              stroke={THEME.colors.red}
              strokeWidth={14}
              strokeDasharray={540}
              strokeDashoffset={(1 - strikeDraw) * 540}
            />
            <line
              x1={10}
              y1={15}
              x2={510}
              y2={135}
              stroke={THEME.colors.red}
              strokeWidth={14}
              strokeDasharray={540}
              strokeDashoffset={(1 - strikeDraw) * 540}
            />
          </svg>
        </div>
      )}

      <CropMarks color={THEME.colors.red} />
    </AbsoluteFill>
  );
};

/**
 * INSERCIÓ 10.2 — PRIVACITAT (Mode B):
 * Fase 1: Punts de dades que surten del mòbil cap a una zona marcada amb "?".
 * Fase 2: Línies de text que es ratllen amb barres negres (efecte redactat) sobre "QUI MÉS HO SAP?".
 */
export const Insert10bPrivacyLeak: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const redactSwitch = Math.round(durationInFrames * 0.54);
  const redactPhase = frame >= redactSwitch;
  const redactProgress = interpolate(
    frame,
    [redactSwitch, redactSwitch + 30],
    [0, 1],
    {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <ModeBPanelFrame
      accent="red"
      code="EN CONTRA 02/03"
      title="PRIVACITAT · DADES PERSONALS"
      rightMeta={redactPhase ? " CONFIDENCIAL" : "FUGA DE DADES"}
      durationInFrames={durationInFrames}
    >
      {!redactPhase ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            border: `2px solid ${THEME.colors.line}`,
            backgroundColor: THEME.colors.ink,
          }}
        >
          <svg width={892} height={515} viewBox="0 0 892 515">
            {/* Mòbil esquemàtic a l'esquerra */}
            <rect
              x={72}
              y={105}
              width={156}
              height={305}
              fill={THEME.colors.graphite}
              stroke={THEME.colors.textPrimary}
              strokeWidth={3}
            />
            <line
              x1={125}
              y1={128}
              x2={175}
              y2={128}
              stroke={THEME.colors.textSecondary}
              strokeWidth={3}
            />
            <text
              x={150}
              y={265}
              textAnchor="middle"
              fill={THEME.colors.textPrimary}
              fontFamily="JetBrains Mono"
              fontSize={20}
            >
              MÒBIL
            </text>

            {/* Trajectòries i paquets de dades viatjant cap a "?" */}
            {[0, 1, 2, 3, 4].map((pIdx) => {
              const yStart = 165 + pIdx * 45;
              const t = ((frame * 0.022 + pIdx * 0.21) % 1);
              const px = 228 + t * 390;
              const py =
                yStart + (258 - yStart) * (t * t * (3 - 2 * t));
              return (
                <g key={pIdx}>
                  <line
                    x1={228}
                    y1={yStart}
                    x2={620}
                    y2={258}
                    stroke={THEME.colors.line}
                    strokeWidth={1.5}
                    strokeDasharray="6 6"
                  />
                  <rect
                    x={px - 9}
                    y={py - 9}
                    width={18}
                    height={18}
                    fill={THEME.colors.red}
                  />
                </g>
              );
            })}

            {/* Zona opaca amb gran "?" */}
            <rect
              x={620}
              y={95}
              width={210}
              height={325}
              fill={THEME.colors.graphite}
              stroke={THEME.colors.red}
              strokeWidth={3}
            />
            <text
              x={725}
              y={295}
              textAnchor="middle"
              fill={THEME.colors.red}
              fontFamily="Bricolage Grotesque"
              fontWeight={800}
              fontSize={140}
            >
              ?
            </text>
            <text
              x={725}
              y={388}
              textAnchor="middle"
              fill={THEME.colors.textSecondary}
              fontFamily="JetBrains Mono"
              fontSize={18}
            >
              TERCERS OPACS
            </text>
          </svg>
        </div>
      ) : (
        /* Fase 2: Línies de text que es ratllen amb barres negres sobre "QUI MÉS HO SAP?" */
        <div
          style={{
            height: "100%",
            backgroundColor: THEME.colors.red,
            padding: "28px 34px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "HISTORIAL MÈDIC · POLS BIOMÈTRIC",
              "UBICACIÓ DIÀRIA · CERQUES PRIVADES",
              "DESTINATARI DE LES DADES: DESCONEGUT",
            ].map((line, idx) => {
              const barW = interpolate(
                redactProgress,
                [idx * 0.2, 0.55 + idx * 0.2],
                [0, 100],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );
              return (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    padding: "10px 14px",
                    border: `2px solid ${THEME.colors.onAccentDark}`,
                    fontFamily: THEME.fonts.mono,
                    fontSize: 22,
                    color: THEME.colors.onAccentDark,
                  }}
                >
                  <span>{line}</span>
                  {/* Barra negra de censura / redactat */}
                  <div
                    style={{
                      position: "absolute",
                      left: 8,
                      top: 6,
                      bottom: 6,
                      width: `calc(${barW.toFixed(1)}% - 16px)`,
                      backgroundColor: THEME.colors.onAccentDark,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 88,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              color: THEME.colors.onAccentDark,
            }}
          >
            QUI MÉS HO SAP?
          </div>
        </div>
      )}
    </ModeBPanelFrame>
  );
};

/**
 * INSERCIÓ 10.3 — FEINA I ÚS ÈTIC (Mode C breu):
 * "COPIAR ≠ APRENDRE" en tipografia gegant, amb el signe ≠ vectorial com a focus central.
 */
export const Insert10cCopyNotLearn: React.FC<{
  durationInFrames: number;
  figLabel?: string;
}> = ({ durationInFrames, figLabel }) => {
  const frame = useCurrentFrame();

  const wordIn = interpolate(frame, [2, 13], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slashSlam = interpolate(frame, [12, 24], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ModeCWipeStage
      backgroundColor={THEME.colors.ink}
      figLabel={figLabel}
      harsh
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          position: "absolute",
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          top: 360,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.display,
            fontWeight: 800,
            fontSize: 152,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: THEME.colors.textSecondary,
            opacity: wordIn,
          }}
        >
          COPIAR
        </div>

        {/* Signe ≠ gegant protagonista dibuixat amb vectors d'alt contrast */}
        <div
          style={{
            width: 250,
            height: 250,
            backgroundColor: THEME.colors.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={180} height={180} viewBox="0 0 180 180">
            <line
              x1={24}
              y1={66}
              x2={156}
              y2={66}
              stroke={THEME.colors.onAccentDark}
              strokeWidth={20}
            />
            <line
              x1={24}
              y1={114}
              x2={156}
              y2={114}
              stroke={THEME.colors.onAccentDark}
              strokeWidth={20}
            />
            <line
              x1={134}
              y1={20}
              x2={46}
              y2={160}
              stroke={THEME.colors.lime}
              strokeWidth={22}
              strokeDasharray={180}
              strokeDashoffset={(1 - slashSlam) * 180}
            />
          </svg>
        </div>

        <div
          style={{
            fontFamily: THEME.fonts.display,
            fontWeight: 800,
            fontSize: 138,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            color: THEME.colors.lime,
            opacity: wordIn,
          }}
        >
          APRENDRE
        </div>
      </div>
    </ModeCWipeStage>
  );
};
