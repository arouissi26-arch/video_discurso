import {theme} from './theme';

export const FPS = theme.timing.fps;
export const INTRO_FRAMES = theme.timing.introSeconds * FPS;
export const CLIP_1_FRAMES = theme.timing.clip1Frames;
export const CLIP_2_FRAMES = theme.timing.clip2Frames;
export const CLIP_2_SOURCE_FRAMES = theme.timing.clip2SourceFrames;
export const CLIP_2_SOURCE_SECONDS = CLIP_2_SOURCE_FRAMES / FPS;
export const XFADE_FRAMES = theme.timing.audioCrossfadeFrames;
export const CLIP_1_SECONDS = CLIP_1_FRAMES / FPS;
export const CLIP_2_SECONDS = CLIP_2_FRAMES / FPS;
export const CLIP_2_START_MEDIA_SECONDS = CLIP_1_SECONDS;
export const OUTRO_FRAMES = theme.timing.outroSeconds * FPS;
export const MAIN_FRAMES = INTRO_FRAMES + CLIP_1_FRAMES + CLIP_2_FRAMES + OUTRO_FRAMES;

export type LayoutMode = 'A' | 'B' | 'C' | 'D' | 'E';
export type CueKind =
  | 'ecg' | 'ecg-anomaly' | 'definition' | 'three-examples' | 'cat-learning'
  | 'daily-tools' | 'alphafold' | 'duality' | 'section-pro' | 'health'
  | 'education' | 'everyday' | 'balance' | 'section-con' | 'deepfake' | 'privacy'
  | 'ethics' | 'ethics-opening' | 'reliability' | 'ecg-callback' | 'critical' | 'ours';
export type Cue = {
  id: string;
  at: number; // source-media seconds after the first clip begins; cues and subtitles share this clock.
  duration: number;
  layout: LayoutMode;
  kind: CueKind;
  accent: 'lime' | 'red' | 'blue';
  label: string;
  headline?: string;
  detail?: string;
};

// Cue anchors follow the corrected Catalan script and the silence-aware word map in lib/transcript.ts.
export const cues: Cue[] = [
  {id:'health-question',at:2.04,duration:3.0,layout:'B',kind:'ecg',accent:'lime',label:'01 / SENYAL VITAL',headline:'ABANS QUE TU?',detail:'POLS · SENYAL'},
  {id:'pulse-anomaly',at:11.44,duration:2.8,layout:'B',kind:'ecg-anomaly',accent:'red',label:'PULS · ANOMALIA',headline:'CANVI DETECTAT',detail:'PATRÓ FORA DE RITME'},
  {id:'ai-behind-it',at:18.10,duration:2.0,layout:'D',kind:'ours',accent:'blue',label:'INTEL·LIGÈNCIA ARTIFICIAL'},
  {id:'what-is-ai',at:24.42,duration:2.3,layout:'C',kind:'definition',accent:'blue',label:'02 / DEFINICIÓ',headline:'QUÈ ÉS LA IA?'},
  {id:'recognition-examples',at:34.23,duration:3.0,layout:'B',kind:'three-examples',accent:'blue',label:'FIG. 01—03',headline:'TASQUES HUMANES',detail:'RECONÈIXER · ENTENDRE · RECOMANAR'},
  {id:'cat-learning',at:45.49,duration:4.8,layout:'B',kind:'cat-learning',accent:'lime',label:'APRENENTATGE · PATRONS',headline:'MILERS D’EXEMPLES',detail:'EXEMPLES / GAT'},
  {id:'daily-intro',at:56.36,duration:2.0,layout:'D',kind:'daily-tools',accent:'lime',label:'JA LA FEM SERVIR CADA DIA'},
  {id:'daily-tools',at:60.99,duration:3.6,layout:'B',kind:'daily-tools',accent:'lime',label:'CADA DIA · SENSE ADONAR-NOS-EN',headline:'JA HI ÉS',detail:'CARA / MÚSICA / CAMÍ'},
  {id:'gps-route',at:67.28,duration:2.2,layout:'D',kind:'daily-tools',accent:'lime',label:'GPS · CAMÍ MÉS RÀPID'},
  {id:'alphafold',at:72.87,duration:4.5,layout:'B',kind:'alphafold',accent:'blue',label:'PREMI NOBEL DE QUÍMICA · ALPHAFOLD',headline:'2024',detail:'GOOGLE DEEPMIND · PROTEÏNES'},
  {id:'example-punch',at:83.39,duration:2.6,layout:'D',kind:'ours',accent:'blue',label:'AQUEST ÉS NOMÉS UN EXEMPLE'},
  {id:'big-question',at:92.18,duration:3.5,layout:'E',kind:'duality',accent:'blue',label:'LA PREGUNTA',headline:'OPORTUNITAT / AMENAÇA?'},
  {id:'for-card',at:95.03,duration:1.35,layout:'C',kind:'section-pro',accent:'lime',label:'ARGUMENTS A FAVOR',headline:'A FAVOR',detail:'01 / 03 · SALUT'},
  {id:'health-benefit',at:98.49,duration:3.5,layout:'B',kind:'health',accent:'lime',label:'A FAVOR · 01 / 03',headline:'SALUT',detail:'DIAGNÒSTIC RÀPID'},
  {id:'education-benefit',at:110.83,duration:3.4,layout:'B',kind:'education',accent:'lime',label:'A FAVOR · 02 / 03',headline:'EDUCACIÓ',detail:'RITMES DIFERENTS · A QUALSEVOL HORA'},
  {id:'education-punch',at:121.84,duration:2.0,layout:'D',kind:'education',accent:'lime',label:'NIT ABANS D’UN EXAMEN',headline:'EDUCACIÓ'},
  {id:'everyday-benefit',at:126.61,duration:3.4,layout:'B',kind:'everyday',accent:'lime',label:'A FAVOR · 03 / 03',headline:'VIDA QUOTIDIANA',detail:'TRADUCTORS / MAPES / ASSISTENTS'},
  {id:'daily-punch',at:135.2,duration:2.0,layout:'D',kind:'daily-tools',accent:'lime',label:'TRADUCTORS · MAPES · ASSISTENTS'},
  {id:'against-card',at:139.60,duration:1.35,layout:'C',kind:'section-con',accent:'red',label:'ARGUMENTS EN CONTRA',headline:'EN CONTRA',detail:'01 / 03 · FIABILITAT'},
  {id:'reliability',at:143.02,duration:3.5,layout:'B',kind:'reliability',accent:'red',label:'EN CONTRA · 01 / 03',headline:'FIABILITAT',detail:'INFORMACIÓ / RESPOSTA'},
  {id:'deepfake-proof',at:150.86,duration:5.5,layout:'E',kind:'deepfake',accent:'red',label:'EN CONTRA · 01 / 03',headline:'REAL / FALS',detail:'DEEPFAKES · VERITAT?'},
  {id:'privacy',at:164.05,duration:4.0,layout:'B',kind:'privacy',accent:'red',label:'EN CONTRA · 02 / 03',headline:'PRIVACITAT',detail:'QUI MÉS HO SAP?'},
  {id:'privacy-question',at:174.1,duration:2.2,layout:'D',kind:'privacy',accent:'red',label:'QUI MÉS HO SAP?'},
  {id:'ethics-opening',at:178.50,duration:2.8,layout:'B',kind:'ethics-opening',accent:'red',label:'EN CONTRA · 03 / 03',headline:'FEINA',detail:'PROFESSIONS · ÚS ÈTIC'},
  {id:'ethics',at:185.38,duration:2.7,layout:'C',kind:'ethics',accent:'red',label:'COPIAR ≠ APRENDRE',headline:'COPIAR ≠ APRENDRE'},
  {id:'wrap-up',at:189.33,duration:8.2,layout:'B',kind:'balance',accent:'blue',label:'BALANÇ',headline:'BENEFICIS / RISCOS',detail:'NORMES · ÚS RESPONSABLE'},
  {id:'callback',at:200.35,duration:3.2,layout:'B',kind:'ecg-callback',accent:'blue',label:'TORNEM AL PRINCIPI',headline:'EL SENYAL, ARA CALMAT',detail:'POLS · SENYAL'},
  {id:'present-now',at:207.18,duration:2.8,layout:'D',kind:'daily-tools',accent:'blue',label:'PRESENT · MÒBILS / AULES / HOSPITALS'},
  {id:'critical',at:217.83,duration:1.5,layout:'C',kind:'critical',accent:'blue',label:'CONCLUSIÓ',headline:'SENTIT CRÍTIC'},
  {id:'ours',at:223.11,duration:1.5,layout:'C',kind:'ours',accent:'blue',label:'CONCLUSIÓ',headline:'NOSALTRES'},
  {id:'final-human',at:226.28,duration:2.5,layout:'D',kind:'ours',accent:'blue',label:'LA DECISIÓ SEGUIRÀ SENT HUMANA'},
];

export const chapters = [
  {at:0.0,label:'01  INTRODUCCIÓ',accent:'blue' as const},
  {at:95.03,label:'A FAVOR  1/3  SALUT',accent:'lime' as const},
  {at:110.83,label:'A FAVOR  2/3  EDUCACIÓ',accent:'lime' as const},
  {at:126.61,label:'A FAVOR  3/3  VIDA QUOTIDIANA',accent:'lime' as const},
  {at:139.60,label:'EN CONTRA  1/3  FIABILITAT',accent:'red' as const},
  {at:164.05,label:'EN CONTRA  2/3  PRIVACITAT',accent:'red' as const},
  {at:178.50,label:'EN CONTRA  3/3  FEINA I ÚS ÈTIC',accent:'red' as const},
  {at:200.35,label:'CONCLUSIÓ',accent:'blue' as const},
];

export const sectionAt = (mediaSeconds: number): 'lime' | 'red' | 'blue' => {
  if (mediaSeconds >= 139.60 && mediaSeconds < 200.35) return 'red';
  if (mediaSeconds >= 95.03 && mediaSeconds < 139.60) return 'lime';
  return 'blue';
};

export const currentCue = (mediaSeconds: number): Cue | undefined =>
  [...cues].reverse().find((cue) => mediaSeconds >= cue.at && mediaSeconds < cue.at + cue.duration);
