import { VIDEO_FPS, type AccentRole } from "./theme";

export const secToFrames = (sec: number): number => Math.round(sec * VIDEO_FPS);

// Durades base (en frames a 30 fps)
export const INTRO_FRAMES = secToFrames(4.5); // 135 frames (0.00s -> 4.50s)
export const CLIP1_START_FRAME = INTRO_FRAMES; // frame 135 (4.50s)
export const CLIP1_DURATION_FRAMES = 5958; // 198.60s (talla el silenci mort final de clip_1)
export const AUDIO_CROSSFADE_FRAMES = 8; // 8 frames (~0.27s) crossfade net entre clip_1 i clip_2

export const CLIP2_START_FRAME =
  CLIP1_START_FRAME + CLIP1_DURATION_FRAMES - AUDIO_CROSSFADE_FRAMES; // frame 6085 (202.833s)
export const CLIP2_DURATION_FRAMES = 915; // 30.50s (fins frame 7000 = 233.333s)
export const CLIP2_END_FADE_FRAMES = 24; // fade d'àudio de sortida cap a l'outro

export const OUTRO_START_FRAME = CLIP2_START_FRAME + CLIP2_DURATION_FRAMES; // frame 7000
export const OUTRO_FRAMES = secToFrames(5.0); // 150 frames (5.00s)
export const TOTAL_DURATION_FRAMES = OUTRO_START_FRAME + OUTRO_FRAMES; // 7150 frames (3m 58.33s)

// Helpers per convertir segons interns de cada clip a segons globals de la composició Main
export const c1Sec = (s: number): number => CLIP1_START_FRAME / VIDEO_FPS + s;
export const c2Sec = (s: number): number => CLIP2_START_FRAME / VIDEO_FPS + s;

export type LayoutMode = "A" | "B" | "C" | "D" | "E";

export type InsertId =
  | "ecg-alert" // 1. Mòbil sap que estàs malalt (Mode B)
  | "pulse-anomaly" // 2. Rellotges intel·ligents · Pols anomalia (Mode B)
  | "what-is-ai" // 3. Què és la IA? (Mode C blau)
  | "three-tasks" // 4. Cara / Veu / Sèrie (Mode B 3 files stagger)
  | "cat-patterns" // 5. Milers de fotos -> GAT (Mode B)
  | "daily-trio" // 6. Cara / Música / Camí GPS (Mode B)
  | "alphafold-full" // 7a. 2024 Nobel · AlphaFold (Mode C)
  | "alphafold-panel" // 7b. Proteïnes · Anys -> IA (Mode B)
  | "central-duality" // 8. OPORTUNITAT o AMENAÇA? (Mode E + C)
  | "card-pro-1" // 9.0 A FAVOR · 01/03 SALUT (Mode C lima)
  | "pro-health" // 9.1 Radiografia i escaneig (Mode B)
  | "card-pro-2" // 9.2a A FAVOR · 02/03 EDUCACIÓ (Mode C lima)
  | "pro-education" // 9.2b Ritmes alumnes + Nit abans d'un examen (Mode B)
  | "card-pro-3" // 9.3a A FAVOR · 03/03 VIDA QUOTIDIANA (Mode C lima)
  | "pro-daily" // 9.3b Traductors / Mapes / Assistents (Mode B)
  | "card-con-1" // 10.0 EN CONTRA · 01/03 FIABILITAT (Mode C wipe vermell brusc)
  | "con-deepfakes" // 10.1 REAL vs FALS amb glitch RGB + VERITAT? (Mode E)
  | "card-con-2" // 10.2a EN CONTRA · 02/03 PRIVACITAT (Mode C vermell)
  | "con-privacy" // 10.2b Fuga de dades + redacció QUI MÉS HO SAP? (Mode B)
  | "card-con-3" // 10.3a EN CONTRA · 03/03 FEINA I ÚS ÈTIC (Mode C vermell)
  | "con-copy-learn" // 10.3b COPIAR ≠ APRENDRE (Mode C breu)
  | "balance-duality" // Síntesi Beneficis vs Riscos (Mode E amb orador)
  | "ecg-callback-panel" // 11a. Tornem al principi (Mode B callback ECG)
  | "ecg-callback-bridge" // 11b. Callback ritme normal a pantalla completa ocultant tall clip_1->clip_2 (Mode C)
  | "critical-sense" // 12a. SENTIT CRÍTIC (Mode C blau clar)
  | "us-decision"; // 12b. NOSALTRES (Mode C blau clar)

export interface VisualBeat {
  id: string;
  startSec: number; // Temps global en segons
  endSec: number; // Temps global en segons
  mode: LayoutMode;
  accent: AccentRole;
  insertId?: InsertId;
  zoom?: number; // Per a Mode D (1.23 - 1.26 sobre 1080p per no pixelar)
  figLabel?: string;
}

/**
 * MAPA COMPLET DE RITME VISUAL I INSERCIONS (canvi visual cada 3–9.5 s; mai > 10 s sense moviment).
 */
export const VISUAL_BEATS: VisualBeat[] = [
  // === 01. INTRODUCCIÓ ===
  {
    id: "intro-open-speaker",
    startSec: c1Sec(0.0),
    endSec: c1Sec(2.10),
    mode: "A",
    accent: "blue",
  },
  {
    id: "ins-01-ecg-alert",
    startSec: c1Sec(2.10),
    endSec: c1Sec(6.08),
    mode: "B",
    accent: "red",
    insertId: "ecg-alert",
    figLabel: "FIG. 01 · ECG PRECOÇ",
  },
  {
    id: "beat-scifi-punch",
    startSec: c1Sec(6.08),
    endSec: c1Sec(11.60),
    mode: "D",
    accent: "blue",
    zoom: 1.23,
  },
  {
    id: "ins-02-pulse-anomaly",
    startSec: c1Sec(11.60),
    endSec: c1Sec(15.20),
    mode: "B",
    accent: "lime",
    insertId: "pulse-anomaly",
    figLabel: "FIG. 02 · POLS · ANOMALIA",
  },
  {
    id: "beat-behind-ai",
    startSec: c1Sec(15.20),
    endSec: c1Sec(20.90),
    mode: "A",
    accent: "blue",
  },
  {
    id: "ins-03-what-is-ai",
    startSec: c1Sec(20.90),
    endSec: c1Sec(23.55),
    mode: "C",
    accent: "blue",
    insertId: "what-is-ai",
    figLabel: "FIG. 03 · DEFINICIÓ",
  },
  {
    id: "beat-ai-definition",
    startSec: c1Sec(23.55),
    endSec: c1Sec(30.30),
    mode: "D",
    accent: "blue",
    zoom: 1.24,
  },
  {
    id: "ins-04-three-tasks",
    startSec: c1Sec(30.30),
    endSec: c1Sec(35.30),
    mode: "B",
    accent: "blue",
    insertId: "three-tasks",
    figLabel: "FIG. 04 · CAPACITATS",
  },
  {
    id: "beat-data-patterns",
    startSec: c1Sec(35.30),
    endSec: c1Sec(42.60),
    mode: "A",
    accent: "blue",
  },
  {
    id: "ins-05-cat-patterns",
    startSec: c1Sec(42.60),
    endSec: c1Sec(46.80),
    mode: "B",
    accent: "lime",
    insertId: "cat-patterns",
    figLabel: "FIG. 05 · APRENENTATGE",
  },
  {
    id: "beat-everyday-intro",
    startSec: c1Sec(46.80),
    endSec: c1Sec(55.44),
    mode: "D",
    accent: "lime",
    zoom: 1.23,
  },
  {
    id: "ins-06-daily-trio",
    startSec: c1Sec(55.44),
    endSec: c1Sec(59.80),
    mode: "B",
    accent: "lime",
    insertId: "daily-trio",
    figLabel: "FIG. 06 · ÚS DIARI",
  },
  {
    id: "beat-gps-speaker",
    startSec: c1Sec(59.80),
    endSec: c1Sec(66.44),
    mode: "A",
    accent: "lime",
  },
  {
    id: "ins-07a-alphafold-full",
    startSec: c1Sec(66.44),
    endSec: c1Sec(68.90),
    mode: "C",
    accent: "blue",
    insertId: "alphafold-full",
    figLabel: "FIG. 07 · NOBEL 2024",
  },
  {
    id: "beat-alphafold-speaker",
    startSec: c1Sec(68.90),
    endSec: c1Sec(74.70),
    mode: "D",
    accent: "blue",
    zoom: 1.23,
  },
  {
    id: "ins-07b-alphafold-panel",
    startSec: c1Sec(74.70),
    endSec: c1Sec(78.90),
    mode: "B",
    accent: "lime",
    insertId: "alphafold-panel",
    figLabel: "FIG. 07B · ALPHAFOLD",
  },
  {
    id: "beat-big-question-setup",
    startSec: c1Sec(78.90),
    endSec: c1Sec(83.90),
    mode: "A",
    accent: "blue",
  },
  {
    id: "ins-08-central-duality",
    startSec: c1Sec(83.90),
    endSec: c1Sec(87.46),
    mode: "E",
    accent: "lime",
    insertId: "central-duality",
    figLabel: "FIG. 08 · DUALITAT CENTRAL",
  },

  // === 02. NUS: ARGUMENTS A FAVOR (LIMA) ===
  {
    id: "beat-pro-intro",
    startSec: c1Sec(87.46),
    endSec: c1Sec(91.52),
    mode: "D",
    accent: "lime",
    zoom: 1.23,
  },
  {
    id: "ins-09-card-1",
    startSec: c1Sec(91.52),
    endSec: c1Sec(93.02),
    mode: "C",
    accent: "lime",
    insertId: "card-pro-1",
    figLabel: "SEC. 02 · A FAVOR 01/03",
  },
  {
    id: "ins-09-health",
    startSec: c1Sec(93.02),
    endSec: c1Sec(97.20),
    mode: "B",
    accent: "lime",
    insertId: "pro-health",
    figLabel: "FIG. 09 · DIAGNÒSTIC RÀPID",
  },
  {
    id: "beat-save-lives",
    startSec: c1Sec(97.20),
    endSec: c1Sec(104.98),
    mode: "D",
    accent: "lime",
    zoom: 1.25,
  },
  {
    id: "ins-09-card-2",
    startSec: c1Sec(104.98),
    endSec: c1Sec(106.48),
    mode: "C",
    accent: "lime",
    insertId: "card-pro-2",
    figLabel: "SEC. 02 · A FAVOR 02/03",
  },
  {
    id: "beat-edu-lead",
    startSec: c1Sec(106.48),
    endSec: c1Sec(114.50),
    mode: "A",
    accent: "lime",
  },
  {
    id: "ins-09-education",
    startSec: c1Sec(114.50),
    endSec: c1Sec(118.90),
    mode: "B",
    accent: "lime",
    insertId: "pro-education",
    figLabel: "FIG. 10 · RITME D'APRENENTATGE",
  },
  {
    id: "ins-09-card-3",
    startSec: c1Sec(118.90),
    endSec: c1Sec(120.40),
    mode: "C",
    accent: "lime",
    insertId: "card-pro-3",
    figLabel: "SEC. 02 · A FAVOR 03/03",
  },
  {
    id: "ins-09-daily",
    startSec: c1Sec(120.40),
    endSec: c1Sec(124.60),
    mode: "B",
    accent: "lime",
    insertId: "pro-daily",
    figLabel: "FIG. 11 · VIDA QUOTIDIANA",
  },
  {
    id: "beat-daily-mid",
    startSec: c1Sec(124.60),
    endSec: c1Sec(130.80),
    mode: "A",
    accent: "lime",
  },
  {
    id: "beat-daily-close",
    startSec: c1Sec(130.80),
    endSec: c1Sec(135.44),
    mode: "D",
    accent: "lime",
    zoom: 1.24,
  },

  // === 03. NUS: ARGUMENTS EN CONTRA (ROJO) ===
  {
    id: "ins-10-card-1",
    startSec: c1Sec(135.44),
    endSec: c1Sec(136.95),
    mode: "C",
    accent: "red",
    insertId: "card-con-1",
    figLabel: "SEC. 03 · EN CONTRA 01/03",
  },
  {
    id: "beat-con-1-lead",
    startSec: c1Sec(136.95),
    endSec: c1Sec(143.50),
    mode: "A",
    accent: "red",
  },
  {
    id: "beat-con-1-false-info",
    startSec: c1Sec(143.50),
    endSec: c1Sec(150.20),
    mode: "D",
    accent: "red",
    zoom: 1.24,
  },
  {
    id: "ins-10-deepfakes",
    startSec: c1Sec(150.20),
    endSec: c1Sec(156.20),
    mode: "E",
    accent: "red",
    insertId: "con-deepfakes",
    figLabel: "FIG. 12 · DEEPFAKES · GLITCH",
  },
  {
    id: "beat-not-so-sure",
    startSec: c1Sec(156.20),
    endSec: c1Sec(160.20),
    mode: "A",
    accent: "red",
  },
  {
    id: "ins-10-card-2",
    startSec: c1Sec(160.20),
    endSec: c1Sec(161.70),
    mode: "C",
    accent: "red",
    insertId: "card-con-2",
    figLabel: "SEC. 03 · EN CONTRA 02/03",
  },
  {
    id: "beat-privacy-lead",
    startSec: c1Sec(161.70),
    endSec: c1Sec(168.40),
    mode: "D",
    accent: "red",
    zoom: 1.23,
  },
  {
    id: "ins-10-privacy",
    startSec: c1Sec(168.40),
    endSec: c1Sec(173.44),
    mode: "B",
    accent: "red",
    insertId: "con-privacy",
    figLabel: "FIG. 13 · DADES I PRIVACITAT",
  },
  {
    id: "ins-10-card-3",
    startSec: c1Sec(173.44),
    endSec: c1Sec(174.90),
    mode: "C",
    accent: "red",
    insertId: "card-con-3",
    figLabel: "SEC. 03 · EN CONTRA 03/03",
  },
  {
    id: "beat-jobs-lead",
    startSec: c1Sec(174.90),
    endSec: c1Sec(178.90),
    mode: "A",
    accent: "red",
  },
  {
    id: "beat-classroom-punch",
    startSec: c1Sec(178.90),
    endSec: c1Sec(182.90),
    mode: "D",
    accent: "red",
    zoom: 1.24,
  },
  {
    id: "ins-10-copy-learn",
    startSec: c1Sec(182.90),
    endSec: c1Sec(185.44),
    mode: "C",
    accent: "red",
    insertId: "con-copy-learn",
    figLabel: "FIG. 14 · ÈTICA ACADÈMICA",
  },
  {
    id: "beat-balance-duality",
    startSec: c1Sec(185.44),
    endSec: c1Sec(189.20),
    mode: "E",
    accent: "blue",
    insertId: "balance-duality",
    figLabel: "FIG. 15 · BALANÇ",
  },
  {
    id: "beat-rules-responsible",
    startSec: c1Sec(189.20),
    endSec: c1Sec(194.80),
    mode: "D",
    accent: "blue",
    zoom: 1.23,
  },

  // === 04. DESENLLAÇ / CLOENDA (AZUL + CALLBACK) ===
  {
    id: "ins-11a-ecg-callback-panel",
    startSec: c1Sec(194.80),
    endSec: c1Sec(198.10),
    mode: "B",
    accent: "blue",
    insertId: "ecg-callback-panel",
    figLabel: "FIG. 16 · RETORN AL PRINCIPI",
  },
  // Oculta tant el tall clip_1 -> clip_2 com el moviment inicial de càmera de clip_2 (0.0s -> 3.25s)!
  {
    id: "ins-11b-ecg-callback-bridge",
    startSec: c1Sec(198.10),
    endSec: c2Sec(3.28),
    mode: "C",
    accent: "blue",
    insertId: "ecg-callback-bridge",
    figLabel: "FIG. 16B · POLS ESTABLE",
  },
  {
    id: "beat-c2-hospitals",
    startSec: c2Sec(3.28),
    endSec: c2Sec(8.00),
    mode: "A",
    accent: "blue",
  },
  {
    id: "beat-c2-present",
    startSec: c2Sec(8.00),
    endSec: c2Sec(11.00),
    mode: "D",
    accent: "blue",
    zoom: 1.24,
  },
  {
    id: "beat-c2-neither-fear",
    startSec: c2Sec(11.00),
    endSec: c2Sec(14.90),
    mode: "A",
    accent: "blue",
  },
  {
    id: "ins-12a-critical-sense",
    startSec: c2Sec(14.90),
    endSec: c2Sec(16.45),
    mode: "C",
    accent: "blue",
    insertId: "critical-sense",
    figLabel: "FIG. 17 · TESI",
  },
  {
    id: "beat-c2-question-punch",
    startSec: c2Sec(16.45),
    endSec: c2Sec(20.35),
    mode: "D",
    accent: "blue",
    zoom: 1.26,
  },
  {
    id: "ins-12b-us-decision",
    startSec: c2Sec(20.35),
    endSec: c2Sec(22.10),
    mode: "C",
    accent: "blue",
    insertId: "us-decision",
    figLabel: "FIG. 18 · AGÈNCIA HUMANA",
  },
  {
    id: "beat-c2-tech-advance",
    startSec: c2Sec(22.10),
    endSec: c2Sec(25.05),
    mode: "A",
    accent: "blue",
  },
  {
    id: "beat-c2-human-final",
    startSec: c2Sec(25.05),
    endSec: c2Sec(30.50),
    mode: "D",
    accent: "blue",
    zoom: 1.26,
  },
];

export interface ChapterChipSpec {
  id: string;
  code: string;
  label: string;
  accent: AccentRole;
  startSec: number;
  endSec: number;
}

/**
 * Chips de capítol en mono (cantonada superior esquerra dins safe area).
 * Apareixen uns segons en començar cada tema sense recarregar.
 */
export const CHAPTER_CHIPS: ChapterChipSpec[] = [
  {
    id: "chip-intro",
    code: "01",
    label: "INTRODUCCIÓ",
    accent: "blue",
    startSec: c1Sec(0.1),
    endSec: c1Sec(9.8),
  },
  {
    id: "chip-def",
    code: "01.B",
    label: "QUÈ ÉS LA IA",
    accent: "blue",
    startSec: c1Sec(23.7),
    endSec: c1Sec(29.3),
  },
  {
    id: "chip-nobel",
    code: "01.C",
    label: "CAS ALPHAFOLD",
    accent: "blue",
    startSec: c1Sec(69.6),
    endSec: c1Sec(75.5),
  },
  {
    id: "chip-pro-open",
    code: "02",
    label: "ARGUMENTS A FAVOR",
    accent: "lime",
    startSec: c1Sec(87.6),
    endSec: c1Sec(91.4),
  },
  {
    id: "chip-pro-1",
    code: "A FAVOR 1/3",
    label: "SALUT",
    accent: "lime",
    startSec: c1Sec(93.2),
    endSec: c1Sec(101.3),
  },
  {
    id: "chip-pro-2",
    code: "A FAVOR 2/3",
    label: "EDUCACIÓ",
    accent: "lime",
    startSec: c1Sec(106.6),
    endSec: c1Sec(114.5),
  },
  {
    id: "chip-pro-3",
    code: "A FAVOR 3/3",
    label: "VIDA QUOTIDIANA",
    accent: "lime",
    startSec: c1Sec(121.1),
    endSec: c1Sec(129.0),
  },
  {
    id: "chip-con-1",
    code: "EN CONTRA 1/3",
    label: "FIABILITAT",
    accent: "red",
    startSec: c1Sec(137.1),
    endSec: c1Sec(145.8),
  },
  {
    id: "chip-con-2",
    code: "EN CONTRA 2/3",
    label: "PRIVACITAT",
    accent: "red",
    startSec: c1Sec(161.8),
    endSec: c1Sec(169.5),
  },
  {
    id: "chip-con-3",
    code: "EN CONTRA 3/3",
    label: "FEINA I ÚS ÈTIC",
    accent: "red",
    startSec: c1Sec(175.0),
    endSec: c1Sec(182.6),
  },
  {
    id: "chip-conclusion",
    code: "04",
    label: "CONCLUSIÓ",
    accent: "blue",
    startSec: c2Sec(3.35),
    endSec: c2Sec(10.8),
  },
  {
    id: "chip-closing",
    code: "04.B",
    label: "DECISIÓ HUMANA",
    accent: "blue",
    startSec: c2Sec(22.2),
    endSec: c2Sec(28.8),
  },
];

export function getActiveBeat(globalSec: number): VisualBeat {
  for (const beat of VISUAL_BEATS) {
    if (globalSec >= beat.startSec && globalSec < beat.endSec) {
      return beat;
    }
  }
  return VISUAL_BEATS[VISUAL_BEATS.length - 1];
}

export function getActiveChapterChip(globalSec: number): ChapterChipSpec | null {
  for (const chip of CHAPTER_CHIPS) {
    if (globalSec >= chip.startSec && globalSec <= chip.endSec) {
      return chip;
    }
  }
  return null;
}
