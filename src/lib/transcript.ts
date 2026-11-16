import {createTikTokStyleCaptions, type Caption, type TikTokPage} from '@remotion/captions';
import {CLIP_1_SECONDS, CLIP_2_SOURCE_SECONDS} from '../timeline';

/** Transcript follows the supplied Catalan script; timestamps are silence-aware estimates from the original audio. */
const clipOneSentences = [
  'Bon dia, professor.',
  'T’imagines un món on el mòbil sàpiga que estàs malalt abans que tu?',
  'Pot semblar ciència-ficció, però no ho és tant.',
  'Alguns rellotges intel·ligents ja detecten canvis en el pols que avisen que alguna cosa no va bé.',
  'I al darrere hi ha la intel·ligència artificial.',
  'Però, què és exactament la IA?',
  'És la capacitat de les màquines de fer tasques que normalment necessiten intel·ligència humana: reconèixer una cara, entendre el que diem, o recomanar-nos una sèrie.',
  'No pensa com una persona: analitza moltes dades, hi troba patrons i fa prediccions.',
  'Per reconèixer un gat, per exemple, ha de veure milers de fotos fins que aprèn quins trets el defineixen.',
  'I ja la fem servir cada dia, moltes vegades sense adonar-nos-en: quan desbloquegem el mòbil amb la cara, quan Spotify ens recomana música, o quan el GPS ens busca el camí més ràpid.',
  'Una notícia ho demostra: el 2024, el Premi Nobel de Química va reconèixer AlphaFold, una IA de Google DeepMind que prediu la forma de les proteïnes, una feina que als científics els podia costar anys.',
  'Aquest és només un exemple.',
  'La pregunta és més gran: la intel·ligència artificial és una OPORTUNITAT o una AMENAÇA?',
  'Començo pels arguments a favor.',
  'El primer és la SALUT.',
  'La IA ajuda a analitzar radiografies, a detectar malalties abans i a accelerar la recerca de medicaments.',
  'Un diagnòstic ràpid pot salvar vides.',
  'El segon és l’EDUCACIÓ.',
  'Cada alumne aprèn a un ritme diferent, i la IA pot adaptar els exercicis a cadascun i resoldre dubtes a qualsevol hora, fins i tot la nit abans d’un examen.',
  'El tercer és la VIDA QUOTIDIANA.',
  'Els traductors ens permeten entendre idiomes que no coneixem, els mapes ens estalvien temps i els assistents virtuals ens ajuden a organitzar-nos.',
  'Ara, els arguments en contra.',
  'El primer és la FIABILITAT.',
  'La IA es pot equivocar i donar informació falsa amb molta seguretat.',
  'A més, permet crear fotos i vídeos falsos que semblen reals, els anomenats DEEPFAKES.',
  'Abans pensàvem que, si ho havíem vist en un vídeo, era veritat.',
  'Ara ja no n’estem tan segurs.',
  'El segon és la PRIVACITAT.',
  'Aquests sistemes funcionen amb dades, i molts cops no sabem qui les recull ni què en fa.',
  'Si el mòbil sap que estàs malalt, qui més ho sap?',
  'El tercer és la FEINA I L’ÚS ÈTIC.',
  'Algunes professions canviaran, i a classe, si fem servir la IA per fer un treball sense entendre’l, no aprenem res, només copiem.',
  'Per tant, els beneficis són enormes, però els riscos també.',
  'Per això calen normes i un ús responsable.',
];

const clipTwoSentences = [
  'Tornem al principi: un mòbil que sap que estàs malalt abans que tu.',
  'Ara ja no sembla tan estrany, oi?',
  'La IA ja és als nostres mòbils, a les aules i als hospitals.',
  'No és una cosa del futur: és del present.',
  'Per això no hem de tenir ni por ni confiança cega, sinó SENTIT CRÍTIC.',
  'La pregunta important no és què pot fer la IA, sinó què decidim fer NOSALTRES amb ella.',
  'La tecnologia avançarà igualment, però la decisió de com utilitzar-la seguirà sent humana.',
  'Moltes gràcies.',
];

export type TimedWord = {text: string; start: number; end: number};
export type CaptionCue = {start: number; end: number; words: TimedWord[]; text: string};
export type WordPage = TikTokPage & {words: TimedWord[]; endMs: number};

// Long silences detected in clip_1 are kept intact, including the deliberate ~2s pauses.
const clipOneSilence: [number, number][] = [
  [0,0.852],[5.804,7.218],[19.402,21.688],[23.173,23.931],[29.078,30.779],
  [35.091,36.092],[41.546,42.324],[48.941,50.530],[54.562,56.364],[63.724,64.571],
  [87.483,89.165],[90.795,91.822],[92.990,94.244],[101.260,102.063],[104.764,105.720],
  [118.298,120.258],[132.486,135.895],[156.661,157.431],[159.059,160.351],[169.356,170.295],
  [173.252,174.444],[185.622,186.558],[193.014,194.690],[198.051,199.807],
];

const tokenPattern = /[^\s]+/gu;
const tokenWeight = (text: string) => 1 + Math.min(0.65, Math.max(0, text.replace(/[^\p{L}·]/gu, '').length - 4) * 0.06);

const assignTimes = (sentences: string[], silence: [number, number][], totalSeconds: number, clipTwo = false): TimedWord[] => {
  const tokens = sentences.flatMap((sentence) => [...sentence.matchAll(tokenPattern)].map((m) => m[0]));
  const weights = tokens.map(tokenWeight);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const windows: [number, number][] = clipTwo ? [[0.28, totalSeconds - 1.15]] : [];
  if (!clipTwo) {
    let cursor = 0;
    for (const [a, b] of silence) {
      if (a > cursor) windows.push([cursor, a]);
      cursor = Math.max(cursor, b);
    }
    if (cursor < totalSeconds) windows.push([cursor, totalSeconds]);
  }
  const speechTotal = windows.reduce((sum, [a, b]) => sum + b - a, 0);
  const output: TimedWord[] = [];
  let target = 0;
  let windowIndex = 0;
  let position = windows[0]?.[0] ?? 0;
  tokens.forEach((text, index) => {
    const startTarget = (target / totalWeight) * speechTotal;
    target += weights[index];
    const endTarget = (target / totalWeight) * speechTotal;
    while (windowIndex < windows.length - 1 && startTarget >= windows.slice(0, windowIndex + 1).reduce((sum, [a,b]) => sum + b - a, 0)) {
      windowIndex += 1;
      position = windows[windowIndex][0];
    }
    const before = windows.slice(0, windowIndex).reduce((sum, [a,b]) => sum + b - a, 0);
    const remaining = endTarget - before;
    const available = windows[windowIndex][1] - Math.max(position, windows[windowIndex][0]);
    const start = Math.max(position, windows[windowIndex][0]);
    const end = start + Math.min(available, Math.max(0.08, remaining - (startTarget - before)));
    output.push({text, start, end});
    position = end;
  });
  return output;
};

const clipOneWords = assignTimes(clipOneSentences, clipOneSilence, CLIP_1_SECONDS);
const clipTwoWords = assignTimes(clipTwoSentences, [], CLIP_2_SOURCE_SECONDS, true).map((word) => ({
  ...word, start: word.start + CLIP_1_SECONDS, end: word.end + CLIP_1_SECONDS,
}));
export const timedWords: TimedWord[] = [...clipOneWords, ...clipTwoWords];

const wrapWords = (words: TimedWord[], maxLineChars: number): TimedWord[][] => {
  const pages: TimedWord[][] = [];
  let lines: TimedWord[][] = [];
  let line: TimedWord[] = [];
  let chars = 0;
  const commitSentence = () => {
    if (line.length) lines.push(line);
    for (let i = 0; i < lines.length; i += 2) pages.push([...lines[i], ...(lines[i + 1] ?? [])]);
    lines = []; line = []; chars = 0;
  };
  for (const word of words) {
    const next = chars + (line.length ? 1 : 0) + word.text.length;
    if (line.length && next > maxLineChars) {
      lines.push(line); line = []; chars = 0;
    }
    line.push(word);
    chars += (line.length > 1 ? 1 : 0) + word.text.length;
    if (/[.!?]$/u.test(word.text)) commitSentence();
  }
  if (line.length || lines.length) commitSentence();
  return pages;
};

const wordPages = wrapWords(timedWords, 38);
const captions: Caption[] = [];
export const captionCues: CaptionCue[] = wordPages.map((words) => {
  const text = words.map((word) => word.text).join(' ');
  const start = words[0].start;
  const end = words[words.length - 1].end;
  const startMs = Math.round((start + 4) * 1000);
  const endMs = Math.max(startMs + 80, Math.round((end + 4) * 1000));
  words.forEach((word, index) => captions.push({
    text: `${word.text}${index < words.length - 1 ? ' ' : ''}`,
    startMs: Math.round((word.start + 4) * 1000),
    endMs: Math.max(Math.round((word.start + 4) * 1000) + 40, Math.round((word.end + 4) * 1000)),
    timestampMs: null,
    confidence: null,
    pageBreakAfter: index === words.length - 1,
  }));
  return {start, end, words, text};
});

// Uses Remotion's TikTok caption page grouper; page breaks are at our natural subtitle line breaks.
export const captionPages = createTikTokStyleCaptions({
  captions,
  combineTokensWithinMilliseconds: 2000,
  breakOnSilenceAfterMilliseconds: 1800,
}).pages as WordPage[];

export const exportSrt = (): string => captionCues.map((cue, i) => {
  const lines: string[] = [];
  let line = '';
  for (const word of cue.words) {
    const candidate = line ? `${line} ${word.text}` : word.text;
    if (candidate.length > 38 && line) { lines.push(line); line = word.text; }
    else line = candidate;
  }
  if (line) lines.push(line);
  const format = (seconds: number) => {
    const ms = Math.max(0, Math.round((seconds + 4) * 1000));
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(ms % 1000).padStart(3,'0')}`;
  };
  return `${i + 1}\n${format(cue.start)} --> ${format(cue.end)}\n${lines.join('\n')}`;
}).join('\n\n') + '\n';
