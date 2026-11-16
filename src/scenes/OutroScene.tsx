import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BrutalistBackdrop } from "../components/BrutalistBackdrop";
import { MarqueeStrip } from "../components/MarqueeStrip";
import { THEME } from "../theme";
import { OUTRO_FRAMES } from "../timeline";
import type { EditorialMetaProps } from "./IntroScene";

interface WordMaskProps {
  text: string;
  delay: number;
  color?: string;
  serifItalic?: boolean;
  fontSize?: number;
}

const WordMask: React.FC<WordMaskProps> = ({
  text,
  delay,
  color = THEME.colors.textPrimary,
  serifItalic = false,
  fontSize = 98,
}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [delay, delay + 13], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "bottom",
        paddingBottom: serifItalic ? 8 : 4,
        marginRight: 18,
      }}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily: serifItalic ? THEME.fonts.editorial : THEME.fonts.display,
          fontStyle: serifItalic ? "italic" : "normal",
          fontWeight: serifItalic
            ? THEME.fontWeights.editorial
            : THEME.fontWeights.display,
          fontSize: serifItalic ? fontSize + 18 : fontSize,
          lineHeight: 0.96,
          letterSpacing: serifItalic ? "-0.01em" : THEME.tracking.displayTight,
          color,
          transform: `translateY(${((1 - reveal) * 110).toFixed(1)}%)`,
        }}
      >
        {text}
      </span>
    </span>
  );
};

export const OutroScene: React.FC<EditorialMetaProps> = ({
  authorName = "",
  courseName = "",
}) => {
  const frame = useCurrentFrame();

  // Entrada per wipe vertical des de baix
  const enterWipe = interpolate(frame, [0, 12], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subratllat de "humana." que es dibuixa amb stroke-dashoffset
  const underlineDraw = interpolate(frame, [42, 64], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Moltes gràcies" amb retard
  const thanksReveal = interpolate(frame, [56, 72], [0, 1], {
    easing: THEME.motion.enter,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Últim wipe a tinta pura als últims 24 frames (tancament de sala de cinema)
  const closeToInk = interpolate(
    frame,
    [OUTRO_FRAMES - 24, OUTRO_FRAMES - 2],
    [0, 1],
    {
      easing: THEME.motion.inOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const creditParts = [authorName, courseName]
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(${((1 - enterWipe) * 100).toFixed(2)}% 0% 0% 0%)`,
        zIndex: 78,
      }}
    >
      <BrutalistBackdrop />

      {/* Capçalera simètrica a la intro per tancar el cercle */}
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
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontWeight: THEME.fontWeights.mono,
            fontSize: THEME.typeScale.label,
            letterSpacing: THEME.tracking.monoWide,
            color: THEME.colors.blueText,
          }}
        >
          04 / DESENLLAÇ · CONCLUSIÓ
        </span>
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontWeight: THEME.fontWeights.mono,
            fontSize: THEME.typeScale.label,
            letterSpacing: THEME.tracking.monoNormal,
            color: THEME.colors.textSecondary,
          }}
        >
          IA · OPORTUNITAT O AMENAÇA
        </span>
      </div>

      {/* Marquee editorial que tanca el motiu de la portada */}
      <MarqueeStrip
        top={268}
        text="SENTIT CRÍTIC — DECISIÓ HUMANA — ÚS RESPONSABLE — "
        speedPxPerFrame={1.6}
      />

      {/* Frase gegant: "Sentit crític: la decisió seguirà sent humana." */}
      <div
        style={{
          position: "absolute",
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          top: 470,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", rowGap: 8 }}>
          <WordMask
            text="Sentit"
            delay={8}
            color={THEME.colors.blueText}
            fontSize={104}
          />
          <WordMask
            text="crític:"
            delay={13}
            color={THEME.colors.blueText}
            fontSize={104}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            rowGap: 6,
            marginTop: 8,
          }}
        >
          <WordMask text="la" delay={19} fontSize={96} />
          <WordMask text="decisió" delay={23} fontSize={96} />
          <WordMask text="seguirà" delay={28} fontSize={96} />
          <WordMask text="sent" delay={33} fontSize={96} />
        </div>

        {/* "humana." en Instrument Serif cursiva blanca + línia dibuixada a sota */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            alignSelf: "flex-start",
            marginTop: 4,
          }}
        >
          <WordMask
            text="humana."
            delay={38}
            color={THEME.colors.textPrimary}
            serifItalic
            fontSize={118}
          />
          <svg
            width={430}
            height={18}
            style={{
              position: "absolute",
              left: 0,
              bottom: -4,
              overflow: "visible",
            }}
          >
            <line
              x1={0}
              y1={8}
              x2={415}
              y2={8}
              stroke={THEME.colors.lime}
              strokeWidth={4}
              strokeDasharray={415}
              strokeDashoffset={(1 - underlineDraw) * 415}
            />
          </svg>
        </div>

        {/* "Moltes gràcies" a sota amb retard, mida title */}
        <div
          style={{
            marginTop: 78,
            paddingTop: 30,
            borderTop: `${THEME.layout.borderWidth}px solid ${THEME.colors.line}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: THEME.fonts.display,
              fontWeight: THEME.fontWeights.display,
              fontSize: THEME.typeScale.title,
              letterSpacing: THEME.tracking.displayTight,
              color: THEME.colors.textPrimary,
              transform: `translateY(${((1 - thanksReveal) * 45).toFixed(1)}px)`,
              opacity: thanksReveal,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 18,
                height: 18,
                backgroundColor: THEME.colors.lime,
              }}
            />
            <span>Moltes gràcies.</span>
          </div>
        </div>
      </div>

      {/* Crèdits mínims en mono */}
      <div
        style={{
          position: "absolute",
          bottom: THEME.layout.safeY,
          left: THEME.layout.safeX,
          right: THEME.layout.safeX,
          borderTop: `${THEME.layout.borderWidth}px solid ${THEME.colors.line}`,
          paddingTop: 20,
          display: "flex",
          justifyContent: creditParts.length > 0 ? "space-between" : "flex-end",
          alignItems: "center",
          opacity: thanksReveal,
        }}
      >
        {creditParts.length > 0 && (
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontWeight: THEME.fontWeights.mono,
              fontSize: THEME.typeScale.label,
              letterSpacing: THEME.tracking.monoNormal,
              color: THEME.colors.textSecondary,
            }}
          >
            {creditParts.join(" · ")}
          </span>
        )}
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontWeight: THEME.fontWeights.mono,
            fontSize: THEME.typeScale.label,
            letterSpacing: THEME.tracking.monoWide,
            color: THEME.colors.blueText,
          }}
        >
          FI DE L&apos;EXPOSICIÓ
        </span>
      </div>

      {/* Últim wipe final a tinta negra pura */}
      {closeToInk > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: THEME.colors.ink,
            clipPath: `inset(0% 0% ${((1 - closeToInk) * 100).toFixed(2)}% 0%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
