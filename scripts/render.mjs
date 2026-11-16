import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const OUT_MP4 = path.join(OUT_DIR, "final.mp4");
const BUNDLE_DIR = path.join(ROOT, ".cache", "bundle");
const CHUNKS_DIR = path.join(ROOT, ".cache", "chunks");
const AUDIO_AAC = path.join(ROOT, ".cache", "full_audio.aac");

function resolveFfmpeg() {
  const localBin = path.join(
    ROOT,
    "node_modules",
    "@remotion",
    "compositor-linux-x64-gnu",
    "ffmpeg"
  );
  if (fs.existsSync(localBin)) return localBin;
  return "ffmpeg";
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(CHUNKS_DIR, { recursive: true });

// 1. Exportar subtítols externs .srt
execFileSync("node", ["scripts/export-srt.mjs"], {
  cwd: ROOT,
  stdio: "inherit",
});

// 2. Empaquetar el bundle de Remotion
console.log("[render] Generant bundle de producció...");
fs.rmSync(BUNDLE_DIR, { recursive: true, force: true });
execFileSync(
  "npx",
  ["remotion", "bundle", "src/index.ts", "--out-dir", BUNDLE_DIR],
  {
    cwd: ROOT,
    stdio: "inherit",
  }
);

const cores = Math.max(1, Math.min(4, os.cpus().length));

// 3. Renderitzar pista mestra d'àudio contínua (0..7149) a 192 kbps AAC
console.log("[render] Renderitzant pista d'àudio contínua (AAC 192k)...");
execFileSync(
  "npx",
  [
    "remotion",
    "render",
    BUNDLE_DIR,
    "Main",
    AUDIO_AAC,
    "--codec=aac",
    "--audio-bitrate=192k",
    "--log=warn",
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
  }
);

// 4. Renderitzar vídeo H.264 CRF 18 per blocs amb límit estricte de caché de compositor (segur en 4 GB RAM)
const ranges = [
  [0, 2399],
  [2400, 4799],
  [4800, 7149],
];

const chunkFiles = [];
for (let i = 0; i < ranges.length; i++) {
  const [start, end] = ranges[i];
  const chunkFile = path.join(CHUNKS_DIR, `part_${i}.mp4`);
  console.log(`[render] Renderitzant bloc ${i + 1}/${ranges.length} (frames ${start}-${end})...`);
  execFileSync(
    "npx",
    [
      "remotion",
      "render",
      BUNDLE_DIR,
      "Main",
      chunkFile,
      `--frames=${start}-${end}`,
      "--muted",
      `--concurrency=${cores}`,
      "--offthreadvideo-cache-size-in-bytes=201326592",
      "--offthreadvideo-video-threads=2",
      "--codec=h264",
      "--crf=18",
      "--log=warn",
    ],
    {
      cwd: ROOT,
      stdio: "inherit",
    }
  );
  chunkFiles.push(chunkFile);
}

// 5. Concatenació sense pèrdua (-c copy) + mux d'àudio continu + faststart
const concatListPath = path.join(CHUNKS_DIR, "concat.txt");
fs.writeFileSync(
  concatListPath,
  chunkFiles.map((f) => `file '${path.basename(f)}'`).join("\n") + "\n",
  "utf8"
);

execFileSync(
  resolveFfmpeg(),
  [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatListPath,
    "-i",
    AUDIO_AAC,
    "-c:v",
    "copy",
    "-c:a",
    "copy",
    "-movflags",
    "+faststart",
    OUT_MP4,
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
  }
);

console.log(`\n[render] Render final completat: ${OUT_MP4}`);
