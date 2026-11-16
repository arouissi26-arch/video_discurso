/** Design tokens for the 16:9 brutalist-tech editorial system. Coordinates scale from 1080px high. */
export const theme = {
  color: {
    ink: '#0A0A0B',
    graphite: '#16171A',
    line: '#2A2C31',
    paper: '#F4F5F7',
    secondary: '#8D93A0',
    lime: '#C6FF3D',
    red: '#FF3B1F',
    blue: '#3D4BFF',
    blueText: '#8C97FF',
    black: '#0A0A0B',
  },
  font: {
    display: 'Bricolage Grotesque, Arial, sans-serif',
    editorial: 'Instrument Serif, Georgia, serif',
    mono: 'JetBrains Mono, monospace',
    caption: 'Inter Tight, Arial, sans-serif',
    displayWeight: 800,
    editorialWeight: 400,
    monoWeight: 500,
    captionWeight: 800,
  },
  size: {
    mega: 0.151,       // relative to canvas height
    display: 0.097,
    title: 0.059,
    subtitle: 0.037,
    caption: 0.034,
    label: 0.014,
    tiny: 0.011,
  },
  layout: {
    width: 1920,
    height: 1080,
    columns: 12,
    sideSafe: 0.06,
    verticalSafe: 0.08,
    gridGutter: 0.018,
    lineWidth: 2,
    cornerRadius: 0,
    panelLeft: 0.66,
    panelWidth: 0.29,
    panelTop: 0.17,
    captionBottom: 0.105,
    captionWidth: 0.86,
  },
  motion: {
    enter: [0.16, 1, 0.3, 1] as const,
    exitFrames: 8,
    maskDistance: 0.035,
    sectionCardSeconds: 1.35,
    textureOpacity: 0.035,
    gridOpacity: 0.12,
    cropSize: 24,
    progressHeight: 3,
    marqueeSeconds: 32,
  },
  timing: {
    fps: 30,
    introSeconds: 4,
    outroSeconds: 5,
    clip1Frames: 6002,
    clip2Frames: 892, // trim 24 trailing-silence frames from the 30.53s source
    clip2SourceFrames: 916,
    audioCrossfadeFrames: 8,
    finalAudioFadeFrames: 24,
  },
  widths: {
    hairline: 1,
    rule: 2,
    panelStroke: 2,
    captionStroke: 3,
  },
} as const;

export type Accent = 'lime' | 'red' | 'blue' | 'paper';
export const accentColor = (accent: Accent): string => {
  if (accent === 'lime') return theme.color.lime;
  if (accent === 'red') return theme.color.red;
  if (accent === 'blue') return theme.color.blueText;
  return theme.color.paper;
};

export const scaleH = (fraction: number): number => fraction * theme.layout.height;
