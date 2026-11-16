import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BrutalistBackdrop } from "../components/BrutalistBackdrop";
import { MarqueeStrip } from "../components/MarqueeStrip";
import { THEME } from "../theme";
import { INTRO_FRAMES } from "../timeline";

export interface EditorialMetaProps {
  authorName?: string;
  subjectName?: string;
  courseName?: string;
}

interface MaskedHeadlineRowProps {
  text: string;
  startFrame: number;
  fontSize: number;
  wipeColor: string;
}

const MaskedHeadlineRow: React.FC<MaskedHeadlineRowProps> = ({
  text,
  startFrame,
  fontSize,
  wipeColor,
}) => {
  const frame = useCurrentFrame();

  // Fase 1: el bloc lima entra cobrint la línia; Fase 2: es retira revelant el text per màscara vertical
  const blockIn = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blockOut = interpolate(
    frame,
    [startFrame + 8, startFrame + 18],
    [0, 1],
    {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const textReveal = interpolate(
    frame,
    [startFrame + 5, startFrame + 19],
    [0, 1],
    {
      easing: THEME.motion.enter,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "4px 0 8px 0",
        width: "100%",
      }}
    >
      <div
        style={{
          fontFamily: THEME.fonts.display,
          fontWeight: THEME.fontWeights.display,
          fontSize,
          lineHeight: THEME.lineHeights.display,
          letterSpacing: THEME.tracking.displayTight,
          color: THEME.colors.textPrimary,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          transform: `translateY(${((1 - textReveal) * 105).toFixed(1)}%)`,
        }}
      >
        {text}
      </div>

      {/* Wipe de bloc lima que revela el titular */}
      {blockOut < 1 && blockIn > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: wipeColor,
            clipPath: `inset(0% ${((1 - blockIn) * 100).toFixed(1)}% 0% ${(
              blockOut * 100
            ).toFixed(1)}%)`,
          }}
        />
      )}
    </div>
  );
};

export const IntroScene: React.FC<EditorialMetaProps> = ({
  authorName = "",
  subjectName = "",
  courseName = "",
}) => {
  const frame = useCurrentFrame();

  // Sortida per wipe de bloc net cap a clip_1 (últims 11 frames)
  const exitWipe = interpolate(
    frame,
    [INTRO_FRAMES - 11, INTRO_FRAMES],
    [0, 1],
    {
      easing: THEME.motion.exit,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Subtítol dual: la barra central es dibuixa i empeny "Oportunitat" i "amenaça?" cap als costats
  const subEnter = interpolate(frame, [28, 42], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pushApart = interpolate(frame, [38, 62], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const metaParts = [authorName, subjectName, courseName]
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(0% 0% ${(exitWipe * 100).toFixed(2)}% 0%)`,
        zIndex: 75,
      }}
    >
      <BrutalistBackdrop />

      {/* Capçalera editorial superior dins safe area */}
      <div
        style={{
          position: "absolute",
          top: THEME.layout.safeY,
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `${THEME.layout.borderWidth}px solid ${THEME.colors.line}`,
          paddingBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              backgroundColor: THEME.colors.lime,
            }}
          />
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: THEME.typeScale.label,
              letterSpacing: THEME.tracking.monoWide,
              color: THEME.colors.textPrimary,
            }}
          >
            EXPOSICIÓ ORAL · DOSSIER IA
          </span>
        </div>
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontWeight: THEME.fontWeights.mono,
            fontSize: THEME.typeScale.label,
            letterSpacing: THEME.tracking.monoNormal,
            color: THEME.colors.textSecondary,
          }}
        >
          ED. 2026
        </span>
      </div>

      {/* Franja superior de marquee mono */}
      <MarqueeStrip
        top={268}
        text="OPORTUNITAT — AMENAÇA — INTEL·LIGÈNCIA ARTIFICIAL — "
        speedPxPerFrame={1.8}
      />

      {/* Bloc central tipogràfic protagonista */}
      <div
        style={{
          position: "absolute",
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          top: 520,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.mono,
            fontWeight: THEME.fontWeights.mono,
            fontSize: THEME.typeScale.label,
            letterSpacing: THEME.tracking.monoWide,
            color: THEME.colors.blueText,
            marginBottom: 14,
            opacity: interpolate(frame, [2, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          [ TESI CENTRAL ]
        </div>

        {/* INTEL·LIGÈNCIA (amb punt volat català verificat) + ARTIFICIAL apilat enorme gairebé tocant les vores */}
        <MaskedHeadlineRow
          text="INTEL·LIGÈNCIA"
          startFrame={6}
          fontSize={121}
          wipeColor={THEME.colors.lime}
        />
        <MaskedHeadlineRow
          text="ARTIFICIAL"
          startFrame={15}
          fontSize={170}
          wipeColor={THEME.colors.lime}
        />

        {/* Línia divisòria de 2px que es dibuixa */}
        <div
          style={{
            marginTop: 34,
            height: THEME.layout.borderWidth,
            width: `${(
              interpolate(frame, [24, 44], [0, 1], {
                easing: THEME.motion.enter,
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }) * 100
            ).toFixed(1)}%`,
            backgroundColor: THEME.colors.textPrimary,
          }}
        />

        {/* Subtítol dual: "Oportunitat" (lima sans) <-- barra que empeny --> "amenaça?" (vermell Instrument Serif cursiva) */}
        <div
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            opacity: subEnter,
            transform: `translateY(${((1 - subEnter) * 18).toFixed(1)}px)`,
          }}
        >
          <span
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: THEME.fontWeights.display,
              fontSize: 64,
              letterSpacing: THEME.tracking.displayTight,
              color: THEME.colors.lime,
              lineHeight: 1,
            }}
          >
            Oportunitat
          </span>

          {/* Barra elàstica que s'expandeix i empeny cada paraula al seu extrem */}
          <div
            style={{
              flex: pushApart,
              margin: "0 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              minWidth: 50,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 2,
                backgroundColor: THEME.colors.lime,
              }}
            />
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontWeight: THEME.fontWeights.mono,
                fontSize: 24,
                color: THEME.colors.textSecondary,
                border: `2px solid ${THEME.colors.line}`,
                padding: "2px 10px",
                backgroundColor: THEME.colors.graphite,
              }}
            >
              o
            </span>
            <div
              style={{
                flex: 1,
                height: 2,
                backgroundColor: THEME.colors.red,
              }}
            />
          </div>

          <span
            style={{
              fontFamily: THEME.fonts.editorial,
              fontStyle: "italic",
              fontWeight: THEME.fontWeights.editorial,
              fontSize: 78,
              color: THEME.colors.red,
              lineHeight: 0.95,
            }}
          >
            amenaça?
          </span>
        </div>

        {/* Blocs cromàtics d'identitat 70/20/10 */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 12,
            opacity: interpolate(frame, [46, 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              backgroundColor: THEME.colors.lime,
              color: THEME.colors.onAccentDark,
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: 19,
              padding: "6px 14px",
              letterSpacing: THEME.tracking.monoNormal,
            }}
          >
            + 03 A FAVOR
          </div>
          <div
            style={{
              backgroundColor: THEME.colors.red,
              color: THEME.colors.onAccentDark,
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: 19,
              padding: "6px 14px",
              letterSpacing: THEME.tracking.monoNormal,
            }}
          >
            − 03 EN CONTRA
          </div>
          <div
            style={{
              border: `2px solid ${THEME.colors.blue}`,
              color: THEME.colors.blueText,
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: 19,
              padding: "6px 14px",
              letterSpacing: THEME.tracking.monoNormal,
            }}
          >
            = SENTIT CRÍTIC
          </div>
        </div>
      </div>

      {/* Franja inferior de marquee mono per equilibrar la meitat baixa del pòster */}
      <MarqueeStrip
        bottom={268}
        text="OPORTUNITAT — AMENAÇA — INTEL·LIGÈNCIA ARTIFICIAL — "
        speedPxPerFrame={1.8}
      />

      {/* Peu de pòster amb metadades editables (si són buides, no es mostren) i numeració 01 / INTRODUCCIÓ */}
      <div
        style={{
          position: "absolute",
          bottom: THEME.layout.safeY,
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          borderTop: `${THEME.layout.borderWidth}px solid ${THEME.colors.line}`,
          paddingTop: 20,
          display: "flex",
          justifyContent: metaParts.length > 0 ? "space-between" : "flex-end",
          alignItems: "center",
          opacity: interpolate(frame, [30, 46], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {metaParts.length > 0 && (
          <div
            style={{
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: THEME.typeScale.label,
              letterSpacing: THEME.tracking.monoNormal,
              color: THEME.colors.textSecondary,
            }}
          >
            {metaParts.join(" · ")}
          </div>
        )}

        <div
          style={{
            backgroundColor: THEME.colors.blue,
            color: THEME.colors.textPrimary,
            fontFamily: THEME.fonts.mono,
            fontWeight: THEME.fontWeights.mono,
            fontSize: THEME.typeScale.label,
            letterSpacing: THEME.tracking.monoWide,
            padding: "6px 14px",
          }}
        >
          01 / INTRODUCCIÓ
        </div>
      </div>

      {/* Franja lima fina al tall del wipe de sortida */}
      {exitWipe > 0 && exitWipe < 1 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: `${(exitWipe * 100).toFixed(2)}%`,
            height: 14,
            backgroundColor: THEME.colors.lime,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
