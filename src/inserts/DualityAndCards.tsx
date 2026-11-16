import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CropMarks } from "../components/BrutalistBackdrop";
import { ModeCWipeStage } from "../components/ModeCWipeStage";
import { THEME } from "../theme";

/**
 * INSERCIÓ 8 (Mode E + C): "la intel·ligència artificial és una OPORTUNITAT o una AMENAÇA?"
 * El moment més potent de la primera part: pantalla partida en 9:16 on LIMA i VERMELL
 * es barallen físicament l'espai amb un wipe agressiu al ritme exacte de les dues paraules.
 */
export const Insert08CentralDuality: React.FC<{
  durationInFrames: number;
  figLabel?: string;
}> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Entrada i sortida de tota l'escena partida
  const enter = interpolate(frame, [0, 9], [0, 1], {
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

  // Beat empieza en 83.44s:
  // "OPORTUNITAT" suena en ~85.55s (frame ~63) -> lima empuja al 68%
  // "AMENAÇA?" suena en ~86.65s (frame ~95) -> rojo contraataca empujando al 68%
  const limeSharePct = interpolate(
    frame,
    [0, 46, 56, 76, 88, durationInFrames],
    [50, 50, 70, 68, 32, 48],
    {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const splitY = Math.round((THEME.layout.height * limeSharePct) / 100);

  return (
    <AbsoluteFill
      style={{
        zIndex: 62,
        clipPath: `inset(0% ${((1 - enter) * 100).toFixed(1)}% 0% ${(
          exit * 100
        ).toFixed(1)}%)`,
      }}
    >
      {/* MEITAT SUPERIOR: OPORTUNITAT (BLOC LIMA, TEXT NEGRE BRUTALISTA) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: splitY,
          backgroundColor: THEME.colors.lime,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `0 ${THEME.layout.safeX}px`,
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.mono,
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: THEME.tracking.monoWide,
            color: THEME.colors.onAccentDark,
            marginBottom: 14,
          }}
        >
          [ + CARA A · POTENCIAL ]
        </div>
        <div
          style={{
            fontFamily: THEME.fonts.display,
            fontWeight: 800,
            fontSize: 124,
            lineHeight: 0.88,
            letterSpacing: "-0.045em",
            color: THEME.colors.onAccentDark,
          }}
        >
          OPORTU-
          <br />
          NITAT
        </div>
      </div>

      {/* MEITAT INFERIOR: AMENAÇA? (BLOC VERMELL SENYAL, INSTRUMENT SERIF CURSIVA) */}
      <div
        style={{
          position: "absolute",
          top: splitY,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: THEME.colors.red,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: `54px ${THEME.layout.safeX}px 0 ${THEME.layout.safeX}px`,
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.mono,
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: THEME.tracking.monoWide,
            color: THEME.colors.onAccentDark,
            marginBottom: 10,
          }}
        >
          [ − CARA B · RISC ]
        </div>
        <div
          style={{
            fontFamily: THEME.fonts.editorial,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 168,
            lineHeight: 0.86,
            color: THEME.colors.onAccentDark,
          }}
        >
          amenaça?
        </div>
      </div>

      {/* Franja divisòria de xoc de 8 px tinta + medalla central "VS / O" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: splitY - 4,
          height: 8,
          backgroundColor: THEME.colors.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: THEME.colors.ink,
            color: THEME.colors.textPrimary,
            border: `2px solid ${THEME.colors.textPrimary}`,
            fontFamily: THEME.fonts.mono,
            fontSize: 24,
            padding: "6px 22px",
            letterSpacing: THEME.tracking.monoWide,
          }}
        >
          O BÉ
        </div>
      </div>

      <CropMarks color={THEME.colors.onAccentDark} />
    </AbsoluteFill>
  );
};

interface SectionCardProps {
  stance: "pro" | "con";
  indexLabel: string; // "01/03"
  topic: string; // "SALUT"
  durationInFrames: number;
  figLabel?: string;
}

/**
 * Targetes de secció a pantalla completa (1.4 - 1.5 s):
 * - A FAVOR: entrada fluida en bloc LIMA (#C6FF3D) amb text negre #0A0A0B.
 * - EN CONTRA: tall BRUSC per wipe VERMELL (#FF3B1F) que contrasta amb el suau lima.
 */
export const SectionCard: React.FC<SectionCardProps> = ({
  stance,
  indexLabel,
  topic,
  durationInFrames,
  figLabel,
}) => {
  const frame = useCurrentFrame();
  const isPro = stance === "pro";
  const bg = isPro ? THEME.colors.lime : THEME.colors.red;

  const titleIn = interpolate(frame, [2, isPro ? 13 : 7], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ModeCWipeStage
      backgroundColor={bg}
      lineColor="rgba(10, 10, 11, 0.22)"
      cropColor={THEME.colors.onAccentDark}
      figLabel={figLabel}
      onLightBlock
      harsh={!isPro}
      direction={isPro ? "vertical" : "horizontal"}
      durationInFrames={durationInFrames}
    >
      <div
        style={{
          position: "absolute",
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          top: 430,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Numeració gran en mono */}
        <div
          style={{
            alignSelf: "flex-start",
            backgroundColor: THEME.colors.onAccentDark,
            color: bg,
            fontFamily: THEME.fonts.mono,
            fontWeight: 500,
            fontSize: 30,
            padding: "10px 20px",
            letterSpacing: THEME.tracking.monoWide,
          }}
        >
          {`${indexLabel} · ${topic}`}
        </div>

        {/* Rètol gegant A FAVOR / EN CONTRA */}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: isPro ? 176 : 158,
              lineHeight: 0.86,
              letterSpacing: "-0.045em",
              color: THEME.colors.onAccentDark,
              transform: `translateY(${((1 - titleIn) * 100).toFixed(1)}%)`,
            }}
          >
            {isPro ? (
              <>
                A
                <br />
                FAVOR
              </>
            ) : (
              <>
                EN
                <br />
                CONTRA
              </>
            )}
          </div>
        </div>

        {/* Subtítol del tema actual */}
        <div
          style={{
            borderTop: `4px solid ${THEME.colors.onAccentDark}`,
            paddingTop: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: 800,
              fontSize: 66,
              letterSpacing: THEME.tracking.displayTight,
              color: THEME.colors.onAccentDark,
            }}
          >
            {topic}
          </span>
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontWeight: 500,
              fontSize: 28,
              color: THEME.colors.onAccentDark,
            }}
          >
            {indexLabel}
          </span>
        </div>
      </div>
    </ModeCWipeStage>
  );
};

/**
 * Mode E amb orador visible al centre: "Per tant, els beneficis són enormes, però els riscos també."
 */
export const BalanceDualityOverlay: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 9, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const vis = enter * exit;
  const risksActive = frame >= Math.round(durationInFrames * 0.44);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 55, opacity: vis }}>
      {/* Franja superior LIMA: BENEFICIS ENORMES */}
      <div
        style={{
          position: "absolute",
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          top: THEME.layout.safeY,
          height: 290,
          backgroundColor: THEME.colors.lime,
          border: `2px solid ${THEME.colors.onAccentDark}`,
          padding: "24px 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: `translateY(${((1 - enter) * -40).toFixed(1)}px)`,
        }}
      >
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: 20,
            color: THEME.colors.onAccentDark,
            letterSpacing: THEME.tracking.monoWide,
          }}
        >
          + BALANÇ POSITIU
        </span>
        <span
          style={{
            fontFamily: THEME.fonts.display,
            fontWeight: 800,
            fontSize: 82,
            lineHeight: 0.9,
            letterSpacing: THEME.tracking.displayTight,
            color: THEME.colors.onAccentDark,
          }}
        >
          BENEFICIS ENORMES
        </span>
      </div>

      {/* Franja inferior sota l'orador: RISCOS TAMBÉ */}
      {risksActive && (
        <div
          style={{
            position: "absolute",
            left: THEME.layout.safeX,
            right: THEME.layout.safeX,
            top: 1365,
            height: 165,
            backgroundColor: THEME.colors.red,
            padding: "18px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: THEME.fonts.editorial,
              fontStyle: "italic",
              fontSize: 78,
              color: THEME.colors.onAccentDark,
              lineHeight: 0.9,
            }}
          >
            però riscos també
          </span>
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontSize: 22,
              color: THEME.colors.onAccentDark,
              border: `2px solid ${THEME.colors.onAccentDark}`,
              padding: "6px 14px",
            }}
          >
            NORMES + ÈTICA
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/**
 * INSERCIÓ 12 (Mode C de ~1.5 s per frase): "SENTIT CRÍTIC" i "NOSALTRES"
 * Tipografia massiva en blau clar #8C97FF sobre tinta.
 */
export const Insert12FinalKeyword: React.FC<{
  variant: "critical" | "us";
  durationInFrames: number;
  figLabel?: string;
}> = ({ variant, durationInFrames, figLabel }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [2, 12], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
          top: 500,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            border: `2px solid ${THEME.colors.blue}`,
            backgroundColor: THEME.colors.blue,
            color: THEME.colors.textPrimary,
            fontFamily: THEME.fonts.mono,
            fontSize: 20,
            padding: "6px 14px",
            letterSpacing: THEME.tracking.monoWide,
          }}
        >
          {variant === "critical"
            ? "NI POR · NI CONFIANÇA CEGA"
            : "LA PREGUNTA IMPORTANT"}
        </div>

        {variant === "critical" ? (
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontFamily: THEME.fonts.display,
                fontWeight: 800,
                fontSize: 186,
                lineHeight: 0.88,
                letterSpacing: "-0.045em",
                color: THEME.colors.blueText,
                transform: `translateY(${((1 - reveal) * 90).toFixed(1)}%)`,
              }}
            >
              SENTIT
              <br />
              <span
                style={{
                  fontFamily: THEME.fonts.editorial,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 212,
                  color: THEME.colors.textPrimary,
                }}
              >
                crític.
              </span>
            </div>
          </div>
        ) : (
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 28,
                color: THEME.colors.textSecondary,
                letterSpacing: THEME.tracking.monoWide,
                marginBottom: 14,
              }}
            >
              QUÈ DECIDIM FER
            </div>
            <div
              style={{
                fontFamily: THEME.fonts.display,
                fontWeight: 800,
                fontSize: 152,
                lineHeight: 0.88,
                letterSpacing: "-0.045em",
                color: THEME.colors.blueText,
                transform: `translateY(${((1 - reveal) * 90).toFixed(1)}%)`,
              }}
            >
              NOSALTRES
            </div>
            <div
              style={{
                marginTop: 22,
                height: 6,
                width: `${(reveal * 100).toFixed(1)}%`,
                backgroundColor: THEME.colors.lime,
              }}
            />
          </div>
        )}
      </div>
    </ModeCWipeStage>
  );
};
