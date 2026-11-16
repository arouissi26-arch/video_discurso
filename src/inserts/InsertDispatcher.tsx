import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import { VISUAL_BEATS, type VisualBeat } from "../timeline";
import {
  BalanceDualityOverlay,
  Insert08CentralDuality,
  Insert12FinalKeyword,
  SectionCard,
} from "./DualityAndCards";
import {
  Insert01EcgAlert,
  Insert02PulseAnomaly,
  Insert11aEcgCallbackPanel,
  Insert11bEcgCallbackBridge,
} from "./EcgInserts";
import {
  Insert03WhatIsAi,
  Insert04ThreeTasks,
  Insert05CatPatterns,
  Insert06DailyTrio,
  Insert07aAlphaFoldFull,
  Insert07bAlphaFoldPanel,
} from "./IntroTopicInserts";
import {
  Insert09aHealthXray,
  Insert09bEducationRhythm,
  Insert09cDailyLifeRows,
  Insert10aDeepfakesGlitch,
  Insert10bPrivacyLeak,
  Insert10cCopyNotLearn,
} from "./ProConArguments";

function renderInsertContent(beat: VisualBeat, durationInFrames: number) {
  switch (beat.insertId) {
    case "ecg-alert":
      return <Insert01EcgAlert durationInFrames={durationInFrames} />;
    case "pulse-anomaly":
      return <Insert02PulseAnomaly durationInFrames={durationInFrames} />;
    case "what-is-ai":
      return (
        <Insert03WhatIsAi
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "three-tasks":
      return <Insert04ThreeTasks durationInFrames={durationInFrames} />;
    case "cat-patterns":
      return <Insert05CatPatterns durationInFrames={durationInFrames} />;
    case "daily-trio":
      return <Insert06DailyTrio durationInFrames={durationInFrames} />;
    case "alphafold-full":
      return (
        <Insert07aAlphaFoldFull
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "alphafold-panel":
      return <Insert07bAlphaFoldPanel durationInFrames={durationInFrames} />;
    case "central-duality":
      return (
        <Insert08CentralDuality
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "card-pro-1":
      return (
        <SectionCard
          stance="pro"
          indexLabel="01/03"
          topic="SALUT"
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "pro-health":
      return <Insert09aHealthXray durationInFrames={durationInFrames} />;
    case "card-pro-2":
      return (
        <SectionCard
          stance="pro"
          indexLabel="02/03"
          topic="EDUCACIÓ"
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "pro-education":
      return <Insert09bEducationRhythm durationInFrames={durationInFrames} />;
    case "card-pro-3":
      return (
        <SectionCard
          stance="pro"
          indexLabel="03/03"
          topic="VIDA QUOTIDIANA"
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "pro-daily":
      return <Insert09cDailyLifeRows durationInFrames={durationInFrames} />;
    case "card-con-1":
      return (
        <SectionCard
          stance="con"
          indexLabel="01/03"
          topic="FIABILITAT"
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "con-deepfakes":
      return (
        <Insert10aDeepfakesGlitch
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "card-con-2":
      return (
        <SectionCard
          stance="con"
          indexLabel="02/03"
          topic="PRIVACITAT"
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "con-privacy":
      return <Insert10bPrivacyLeak durationInFrames={durationInFrames} />;
    case "card-con-3":
      return (
        <SectionCard
          stance="con"
          indexLabel="03/03"
          topic="FEINA I ÚS ÈTIC"
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "con-copy-learn":
      return (
        <Insert10cCopyNotLearn
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "balance-duality":
      return <BalanceDualityOverlay durationInFrames={durationInFrames} />;
    case "ecg-callback-panel":
      return <Insert11aEcgCallbackPanel durationInFrames={durationInFrames} />;
    case "ecg-callback-bridge":
      return (
        <Insert11bEcgCallbackBridge
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "critical-sense":
      return (
        <Insert12FinalKeyword
          variant="critical"
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    case "us-decision":
      return (
        <Insert12FinalKeyword
          variant="us"
          durationInFrames={durationInFrames}
          figLabel={beat.figLabel}
        />
      );
    default:
      return null;
  }
}

export const InsertDispatcher: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      {VISUAL_BEATS.filter((b) => Boolean(b.insertId)).map((beat) => {
        const from = Math.round(beat.startSec * fps);
        const end = Math.round(beat.endSec * fps);
        const durationInFrames = Math.max(1, end - from);

        return (
          <Sequence
            key={beat.id}
            from={from}
            durationInFrames={durationInFrames}
          >
            {renderInsertContent(beat, durationInFrames)}
          </Sequence>
        );
      })}
    </>
  );
};
