import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { FilmGrainOverlay } from "./components/BrutalistBackdrop";
import { CatalanSubtitles } from "./components/CatalanSubtitles";
import { ChapterChip } from "./components/ChapterChip";
import { ProgressBar } from "./components/ProgressBar";
import { SpeakerStage } from "./components/SpeakerStage";
import { TimecodeStamp } from "./components/TimecodeStamp";
import { InsertDispatcher } from "./inserts/InsertDispatcher";
import { ensureFontsLoaded } from "./lib/fonts";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { THEME } from "./theme";
import {
  CLIP1_START_FRAME,
  INTRO_FRAMES,
  OUTRO_FRAMES,
  OUTRO_START_FRAME,
  getActiveBeat,
  getActiveChapterChip,
} from "./timeline";

export const mainSchema = z.object({
  authorName: z.string().default(""),
  subjectName: z.string().default(""),
  courseName: z.string().default(""),
});

export type MainProps = z.infer<typeof mainSchema>;

const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading brutalist Google Fonts"));

  useEffect(() => {
    Promise.all([
      ensureFontsLoaded(),
      typeof document !== "undefined" && document.fonts
        ? document.fonts.ready
        : Promise.resolve(),
    ])
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(err);
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);

  if (!ready) {
    return <AbsoluteFill style={{ backgroundColor: THEME.colors.ink }} />;
  }

  return <>{children}</>;
};

const BRIGHT_FULLSCREEN_INSERTS = new Set([
  "what-is-ai",
  "central-duality",
  "card-pro-1",
  "card-pro-2",
  "card-pro-3",
  "card-con-1",
  "card-con-2",
  "card-con-3",
]);

export const MainComposition: React.FC<MainProps> = ({
  authorName,
  subjectName,
  courseName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const globalSec = frame / fps;

  const inSpeech = frame >= CLIP1_START_FRAME && frame < OUTRO_START_FRAME;
  const activeBeat = getActiveBeat(globalSec);
  const activeChip = inSpeech ? getActiveChapterChip(globalSec) : null;
  const showChip =
    Boolean(activeChip) && activeBeat.mode !== "C" && activeBeat.mode !== "E";
  const showTimecode =
    inSpeech &&
    (activeBeat.mode === "B" ||
      activeBeat.mode === "C" ||
      activeBeat.mode === "E") &&
    activeBeat.insertId !== "balance-duality";

  return (
    <FontGate>
      <AbsoluteFill style={{ backgroundColor: THEME.colors.ink }}>
        {/* Escenari principal d'orador (clip_1 + clip_2 amb pre-muntatge i crossfade d'àudio) */}
        <SpeakerStage />

        {/* Insercions i interludis vectorials sincronitzats al discurs */}
        <InsertDispatcher />

        {/* Chips de capítol en mono (s'oculten durant interludis Mode C/E per no competir) */}
        {showChip && activeChip && (
          <ChapterChip
            chip={activeChip}
            elevated={activeBeat.mode === "B"}
          />
        )}

        {/* Timecode tècnic continu de tota la peça (compacte quan conviu amb ChapterChip a l'esquerra) */}
        {showTimecode && (
          <TimecodeStamp
            figLabel={activeBeat.figLabel}
            compact={showChip}
            solidDark={
              Boolean(activeBeat.insertId) &&
              BRIGHT_FULLSCREEN_INSERTS.has(activeBeat.insertId!)
            }
          />
        )}

        {/* Subtítols en català sempre actius mentre parla l'orador */}
        {inSpeech && (
          <CatalanSubtitles
            sectionAccent={activeBeat.accent}
            layoutMode={activeBeat.mode}
          />
        )}

        {/* INTRO / PORTADA (frames 0..135) */}
        <Sequence from={0} durationInFrames={INTRO_FRAMES}>
          <IntroScene
            authorName={authorName}
            subjectName={subjectName}
            courseName={courseName}
          />
        </Sequence>

        {/* OUTRO / TANCAMENT (frames 7000..7150) */}
        <Sequence from={OUTRO_START_FRAME} durationInFrames={OUTRO_FRAMES}>
          <OutroScene
            authorName={authorName}
            subjectName={subjectName}
            courseName={courseName}
          />
        </Sequence>

        {/* Barra de progrés superior de 3 px (lima -> vermell -> blau) */}
        <ProgressBar />

        {/* Textura de gra fi constant (<= 5%) sobre tota la peça */}
        <FilmGrainOverlay />
      </AbsoluteFill>
    </FontGate>
  );
};

export const StandaloneIntro: React.FC<MainProps> = (props) => (
  <FontGate>
    <AbsoluteFill style={{ backgroundColor: THEME.colors.ink }}>
      <IntroScene {...props} />
      <FilmGrainOverlay />
    </AbsoluteFill>
  </FontGate>
);

export const StandaloneOutro: React.FC<MainProps> = (props) => (
  <FontGate>
    <AbsoluteFill style={{ backgroundColor: THEME.colors.ink }}>
      <OutroScene {...props} />
      <FilmGrainOverlay />
    </AbsoluteFill>
  </FontGate>
);
