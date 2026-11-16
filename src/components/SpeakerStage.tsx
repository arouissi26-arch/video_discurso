import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME, getAccentColors } from "../theme";
import {
  AUDIO_CROSSFADE_FRAMES,
  CLIP1_DURATION_FRAMES,
  CLIP1_START_FRAME,
  CLIP2_DURATION_FRAMES,
  CLIP2_END_FADE_FRAMES,
  CLIP2_START_FRAME,
  OUTRO_START_FRAME,
  VISUAL_BEATS,
  getActiveBeat,
} from "../timeline";
import { BrutalistBackdrop } from "./BrutalistBackdrop";

/**
 * Escenari persistent de l'orador:
 * - Manté clip_1 i clip_2 muntats contínuament per garantir àudio 100% fluid
 *   fins i tot quan hi ha interludis gràfics a pantalla completa (Mode C / Mode E).
 * - Anima amb suavitat l'entrada/sortida del marc (Mode A/D <-> Mode B/E) en 12 frames.
 * - Centra horitzontalment i verticalment l'orador dins la finestra (pla mitjà amb aire net).
 * - Aplica crossfade d'àudio de 8 frames sense clics entre clip_1 i clip_2.
 */
export const SpeakerStage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const globalSec = frame / fps;

  if (frame < CLIP1_START_FRAME - 30 || frame >= OUTRO_START_FRAME + 5) {
    return null;
  }

  const activeBeat = getActiveBeat(globalSec);
  const beatIndex = VISUAL_BEATS.indexOf(activeBeat);
  const prevBeat = beatIndex > 0 ? VISUAL_BEATS[beatIndex - 1] : activeBeat;

  const isFramedTarget = (b: typeof activeBeat) =>
    b.mode === "B" || b.insertId === "balance-duality";

  const currFramed = isFramedTarget(activeBeat);
  const prevFramed = isFramedTarget(prevBeat);

  const beatStartFrame = Math.round(activeBeat.startSec * fps);
  const morphT =
    currFramed !== prevFramed
      ? interpolate(
          frame,
          [beatStartFrame, beatStartFrame + THEME.motion.frameMorphFrames],
          [prevFramed ? 1 : 0, currFramed ? 1 : 0],
          {
            easing: THEME.motion.enter,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        )
      : currFramed
      ? 1
      : 0;

  const isBalance =
    activeBeat.insertId === "balance-duality" ||
    prevBeat.insertId === "balance-duality";

  // Geometria de la finestra de l'orador
  const targetBox = isBalance
    ? { left: 65, top: 462, width: 950, height: 885 }
    : {
        left: THEME.layout.modeB.speakerLeft,
        top: THEME.layout.modeB.speakerTop,
        width: THEME.layout.modeB.speakerWidth,
        height: THEME.layout.modeB.speakerHeight,
      };

  const boxLeft = interpolate(morphT, [0, 1], [0, targetBox.left]);
  const boxTop = interpolate(morphT, [0, 1], [0, targetBox.top]);
  const boxWidth = interpolate(
    morphT,
    [0, 1],
    [THEME.layout.width, targetBox.width]
  );
  const boxHeight = interpolate(
    morphT,
    [0, 1],
    [THEME.layout.height, targetBox.height]
  );

  // Enquadrament multicàmera (Mode D) o re-enquadrament mitjà centrat dins la finestra (Mode B / Balance)
  const baseScale =
    activeBeat.mode === "D" ? activeBeat.zoom ?? 1.24 : 1.0;
  const framedScale = isBalance ? 1.08 : 1.12;
  const videoScale = interpolate(morphT, [0, 1], [baseScale, framedScale]);

  // Centrat horitzontal exacte (540 -> 475 = -65px) i vertical (cap a ~135px del marge superior de la finestra)
  const videoTranslateX = interpolate(morphT, [0, 1], [0, -65]);
  const videoTranslateY = interpolate(
    morphT,
    [0, 1],
    [0, isBalance ? -470 : -455]
  );

  const accentColors = getAccentColors(activeBeat.accent);

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.ink }}>
      {/* Fons editorial tinta + reixeta + marques de registre sempre sota el marc */}
      <BrutalistBackdrop />

      {/* Finestra animada de l'orador */}
      <div
        style={{
          position: "absolute",
          left: boxLeft,
          top: boxTop,
          width: boxWidth,
          height: boxHeight,
          overflow: "hidden",
          backgroundColor: THEME.colors.graphite,
          border:
            morphT > 0.02
              ? `${THEME.layout.borderWidth}px solid ${
                  morphT > 0.7 ? accentColors.bg : THEME.colors.line
                }`
              : "none",
          boxSizing: "border-box",
        }}
      >
        {/* CLIP 1 amb crossfade de sortida de 8 frames sense clics */}
        <Sequence
          from={CLIP1_START_FRAME}
          durationInFrames={CLIP1_DURATION_FRAMES}
          premountFor={60}
        >
          <OffthreadVideo
            src={staticFile("clip_1.mp4")}
            volume={(f) =>
              interpolate(
                f,
                [
                  0,
                  4,
                  CLIP1_DURATION_FRAMES - AUDIO_CROSSFADE_FRAMES,
                  CLIP1_DURATION_FRAMES,
                ],
                [0, 0.92, 0.92, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )
            }
            style={{
              width: THEME.layout.width,
              height: THEME.layout.height,
              objectFit: "cover",
              transformOrigin: "50% 35%",
              transform: `translate(${videoTranslateX.toFixed(
                1
              )}px, ${videoTranslateY.toFixed(1)}px) scale(${videoScale.toFixed(
                4
              )})`,
              filter: THEME.texture.speakerGradeFilter,
            }}
          />
        </Sequence>

        {/* CLIP 2 amb crossfade d'entrada de 8 frames i fade final cap a l'outro */}
        <Sequence
          from={CLIP2_START_FRAME}
          durationInFrames={CLIP2_DURATION_FRAMES}
          premountFor={60}
        >
          <OffthreadVideo
            src={staticFile("clip_2.mp4")}
            volume={(f) =>
              interpolate(
                f,
                [
                  0,
                  AUDIO_CROSSFADE_FRAMES,
                  CLIP2_DURATION_FRAMES - CLIP2_END_FADE_FRAMES,
                  CLIP2_DURATION_FRAMES - 2,
                ],
                [0, 0.92, 0.92, 0],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              )
            }
            style={{
              width: THEME.layout.width,
              height: THEME.layout.height,
              objectFit: "cover",
              transformOrigin: "50% 35%",
              transform: `translate(${videoTranslateX.toFixed(
                1
              )}px, ${videoTranslateY.toFixed(1)}px) scale(${videoScale.toFixed(
                4
              )})`,
              filter: THEME.texture.speakerGradeFilter,
            }}
          />
        </Sequence>

        {/* Micro-etiqueta tècnica del marc de vídeo quan està en Mode B/E */}
        {morphT > 0.65 && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "rgba(10, 10, 11, 0.88)",
              border: `1px solid ${THEME.colors.line}`,
              padding: "5px 10px",
              fontFamily: THEME.fonts.mono,
              fontSize: 16,
              letterSpacing: THEME.tracking.monoWide,
              color: THEME.colors.textSecondary,
              opacity: interpolate(morphT, [0.65, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {frame >= CLIP2_START_FRAME ? "ORADOR · CAM 02" : "ORADOR · CAM 01"}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
