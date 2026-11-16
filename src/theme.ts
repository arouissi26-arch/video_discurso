import { Easing } from "remotion";

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;

/**
 * SISTEMA DE DISEÑO — "Editorial brutalista-tech: póster de alto contraste"
 * Todos los tokens visuales centralizados aquí. Prohibidos degradados salvo barra de progreso.
 */
export const THEME = {
  colors: {
    ink: "#0A0A0B",
    graphite: "#16171A",
    line: "#2A2C31",
    textPrimary: "#F4F5F7",
    textSecondary: "#8D93A0",
    lime: "#C6FF3D", // Oportunitat / A favor
    red: "#FF3B1F", // Amenaça / En contra
    blue: "#3D4BFF", // IA / Neutre / Blocs i fons
    blueText: "#8C97FF", // Text blau sobre fons fosc (WCAG AA/AAA)
    onAccentDark: "#0A0A0B", // Text negre sobre blocs lima o vermell
    progressGradient:
      "linear-gradient(90deg, #C6FF3D 0%, #FF3B1F 52%, #3D4BFF 100%)",
  },

  fonts: {
    display: "'Bricolage Grotesque', sans-serif",
    editorial: "'Instrument Serif', serif",
    mono: "'JetBrains Mono', monospace",
    subtitle: "'Inter Tight', sans-serif",
  },

  fontWeights: {
    display: 800,
    editorial: 400,
    mono: 500,
    subtitle: 800,
  },

  // Escala tipogràfica relativa a l'altura del vídeo (1920px en 9:16)
  typeScale: {
    mega: Math.round(VIDEO_HEIGHT * 0.064), // 123px — titulars de pòster a sang
    display: Math.round(VIDEO_HEIGHT * 0.048), // 92px — interludis Mode C
    title: Math.round(VIDEO_HEIGHT * 0.032), // 61px — títols de panell i Moltes gràcies
    subtitle: Math.round(VIDEO_HEIGHT * 0.0255), // 49px — subtítols sincronitzats (Inter Tight 800)
    caption: Math.round(VIDEO_HEIGHT * 0.0165), // 32px — textos de suport en gràfics
    label: Math.round(VIDEO_HEIGHT * 0.0115), // 22px — metadades, chips, timecode en mono
  },

  tracking: {
    displayTight: "-0.04em",
    subtitleTight: "-0.015em",
    monoWide: "0.08em",
    monoNormal: "0.03em",
  },

  lineHeights: {
    display: 0.9,
    title: 1.02,
    subtitle: 1.22,
    mono: 1.2,
  },

  // Reixeta de 12 columnes i Safe Area (6% lateral = 65px, 8% superior/inferior = 154px)
  layout: {
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    safeX: Math.round(VIDEO_WIDTH * 0.06), // 65px
    safeY: Math.round(VIDEO_HEIGHT * 0.08), // 154px
    usableWidth: VIDEO_WIDTH - Math.round(VIDEO_WIDTH * 0.06) * 2, // 950px
    usableHeight: VIDEO_HEIGHT - Math.round(VIDEO_HEIGHT * 0.08) * 2, // 1612px
    columns: 12,
    gutter: 14,
    borderWidth: 2,
    progressHeight: 3,
    radius: 0, // Firma brutalista: cantonades rectes (0px) en tot el sistema
    cropMarkSize: 20,
    // Mode B (9:16 vertical: panell gràfic a dalt, orador emmarcat a sota)
    modeB: {
      graphicTop: 154,
      graphicHeight: 616, // 154 -> 770px (zona superior neta per a l'infogràfic)
      speakerTop: 790,
      speakerHeight: 976, // 790 -> 1766px (51% d'alçada d'escenari dins safe area, rostre i mans 100% visibles)
      speakerLeft: 65,
      speakerWidth: 950,
    },
  },

  motion: {
    enter: Easing.bezier(0.16, 1, 0.3, 1),
    exit: Easing.bezier(0.7, 0, 0.84, 0),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    enterFrames: 14,
    exitFrames: 9,
    frameMorphFrames: 14,
  },

  texture: {
    grainOpacity: 0.042, // <= 5% gra fi constant d'acabat editorial/cinema
    gridOpacity: 0.38,
    speakerGradeFilter: "contrast(1.055) saturate(0.95) brightness(0.99)",
  },
} as const;

export type AccentRole = "lime" | "red" | "blue";

export function getAccentColors(role: AccentRole): {
  bg: string;
  textOnDark: string;
  textOnBlock: string;
} {
  switch (role) {
    case "lime":
      return {
        bg: THEME.colors.lime,
        textOnDark: THEME.colors.lime,
        textOnBlock: THEME.colors.onAccentDark,
      };
    case "red":
      return {
        bg: THEME.colors.red,
        textOnDark: THEME.colors.red,
        textOnBlock: THEME.colors.onAccentDark,
      };
    case "blue":
      return {
        bg: THEME.colors.blue,
        textOnDark: THEME.colors.blueText,
        textOnBlock: THEME.colors.textPrimary,
      };
  }
}

/**
 * Paraules clau del discurs que es ressalten sempre als subtítols amb el seu color semàntic.
 */
export const KEYWORD_ROLES: Array<{
  words: string[];
  role: AccentRole;
}> = [
  // Frases de 2 paraules primer per a coincidència exacta
  { words: ["VIDA", "QUOTIDIANA"], role: "lime" },
  { words: ["ÚS", "ÈTIC"], role: "red" },
  { words: ["L'ÚS", "ÈTIC"], role: "red" },
  { words: ["SENTIT", "CRÍTIC"], role: "blue" },
  // Paraules individuals
  { words: ["OPORTUNITAT"], role: "lime" },
  { words: ["SALUT"], role: "lime" },
  { words: ["EDUCACIÓ"], role: "lime" },
  { words: ["L'EDUCACIÓ"], role: "lime" },
  { words: ["AMENAÇA"], role: "red" },
  { words: ["FIABILITAT"], role: "red" },
  { words: ["DEEPFAKES"], role: "red" },
  { words: ["PRIVACITAT"], role: "red" },
  { words: ["FEINA"], role: "red" },
  { words: ["NOSALTRES"], role: "blue" },
];
