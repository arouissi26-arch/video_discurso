import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const CLIPS_DIR = path.join(ROOT, "clips_reales");
const CACHE_DIR = path.join(ROOT, ".cache", "clips");
const NORM_DIR = path.join(ROOT, ".cache", "normalized");
const REMOTION_PUBLIC_DIR = path.join(ROOT, ".cache", "public");
const PUBLIC_DIR = path.join(ROOT, "public");

const EXPECTED_CLIP1_SHA256 =
  "2f0d825199acea1ee0c50cf273a835d2555b636237c2efc489e49431b935e34d";

function resolveFfmpeg(binName) {
  const localBin = path.join(
    ROOT,
    "node_modules",
    "@remotion",
    "compositor-linux-x64-gnu",
    binName
  );
  if (fs.existsSync(localBin)) return localBin;
  return binName;
}

function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  const fd = fs.openSync(filePath, "r");
  const buf = Buffer.alloc(4 * 1024 * 1024);
  let bytesRead = 0;
  while ((bytesRead = fs.readSync(fd, buf, 0, buf.length, null)) > 0) {
    hash.update(buf.subarray(0, bytesRead));
  }
  fs.closeSync(fd);
  return hash.digest("hex");
}

function ensureClip1Mov() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const outMov = path.join(CACHE_DIR, "clip_1.mov");
  if (fs.existsSync(outMov)) {
    const digest = sha256File(outMov);
    if (digest === EXPECTED_CLIP1_SHA256) {
      console.log("[prepare-clips] clip_1.mov already reconstructed & verified.");
      return outMov;
    }
    fs.unlinkSync(outMov);
  }

  const parts = fs
    .readdirSync(CLIPS_DIR)
    .filter((f) => f.startsWith("clip_1.mov.part-"))
    .sort()
    .map((f) => path.join(CLIPS_DIR, f));

  if (parts.length === 0) {
    throw new Error("No clip_1.mov.part-* files found in clips_reales/");
  }

  console.log(`[prepare-clips] Joining ${parts.length} parts -> .cache/clips/clip_1.mov...`);
  const outFd = fs.openSync(outMov, "w");
  const buf = Buffer.alloc(4 * 1024 * 1024);
  for (const part of parts) {
    const inFd = fs.openSync(part, "r");
    let n = 0;
    while ((n = fs.readSync(inFd, buf, 0, buf.length, null)) > 0) {
      fs.writeSync(outFd, buf.subarray(0, n));
    }
    fs.closeSync(inFd);
  }
  fs.closeSync(outFd);

  const digest = sha256File(outMov);
  if (digest !== EXPECTED_CLIP1_SHA256) {
    throw new Error(
      `SHA-256 mismatch for clip_1.mov: got ${digest}, expected ${EXPECTED_CLIP1_SHA256}`
    );
  }
  console.log("[prepare-clips] Verified SHA-256 for clip_1.mov.");
  return outMov;
}

function normalizeClip({ inputPath, normPath, publicLinkPath, targetTP = "-2.0" }) {
  fs.mkdirSync(NORM_DIR, { recursive: true });
  if (!fs.existsSync(normPath) || fs.statSync(normPath).size < 1_000_000) {
    const ffmpeg = resolveFfmpeg("ffmpeg");
    console.log(`[prepare-clips] Normalizing ${path.basename(normPath)} (1080x1920 @ 30fps CFR, -16 LUFS)...`);
    const loudnormFilter = `loudnorm=I=-16:TP=${targetTP}:LRA=11`;
    execFileSync(
      ffmpeg,
      [
        "-y",
        "-i",
        inputPath,
        "-map",
        "0:v:0",
        "-map",
        "0:a:0",
        "-vf",
        "scale=1080:1920",
        "-r",
        "30",
        "-fps_mode",
        "cfr",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "17",
        "-pix_fmt",
        "yuv420p",
        "-color_primaries",
        "bt709",
        "-color_trc",
        "bt709",
        "-colorspace",
        "bt709",
        "-af",
        loudnormFilter,
        "-ar",
        "48000",
        "-ac",
        "2",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        normPath,
      ],
      { stdio: "inherit" }
    );
  }
  try {
    fs.unlinkSync(publicLinkPath);
  } catch {}
  const relTarget = path.relative(path.dirname(publicLinkPath), normPath);
  fs.symlinkSync(relTarget, publicLinkPath);

  const remotionAssetPath = path.join(
    REMOTION_PUBLIC_DIR,
    path.basename(publicLinkPath)
  );
  fs.mkdirSync(REMOTION_PUBLIC_DIR, { recursive: true });
  try {
    fs.unlinkSync(remotionAssetPath);
  } catch {}
  fs.linkSync(normPath, remotionAssetPath);
}

function copyFontsToPublic() {
  const fontsOut = path.join(PUBLIC_DIR, "fonts");
  fs.mkdirSync(fontsOut, { recursive: true });
  const fontFiles = [
    [
      "@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2",
      "bricolage-grotesque-latin-800.woff2",
    ],
    [
      "@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-ext-800-normal.woff2",
      "bricolage-grotesque-latin-ext-800.woff2",
    ],
    [
      "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
      "instrument-serif-latin-400-italic.woff2",
    ],
    [
      "@fontsource/instrument-serif/files/instrument-serif-latin-ext-400-italic.woff2",
      "instrument-serif-latin-ext-400-italic.woff2",
    ],
    [
      "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
      "jetbrains-mono-latin-500.woff2",
    ],
    [
      "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-ext-500-normal.woff2",
      "jetbrains-mono-latin-ext-500.woff2",
    ],
    [
      "@fontsource/inter-tight/files/inter-tight-latin-800-normal.woff2",
      "inter-tight-latin-800.woff2",
    ],
    [
      "@fontsource/inter-tight/files/inter-tight-latin-ext-800-normal.woff2",
      "inter-tight-latin-ext-800.woff2",
    ],
  ];
  for (const dir of [PUBLIC_DIR, REMOTION_PUBLIC_DIR]) {
    const fontsOut = path.join(dir, "fonts");
    fs.mkdirSync(fontsOut, { recursive: true });
    for (const [relSrc, destName] of fontFiles) {
      const src = path.join(ROOT, "node_modules", relSrc);
      const dest = path.join(fontsOut, destName);
      if (fs.existsSync(src) && !fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
      }
    }
  }
}

async function ensureChromiumReady() {
  try {
    process.env.AWS_EXECUTION_ENV = "AWS_Lambda_nodejs20.x";
    const mod = await import("@sparticuz/chromium");
    const chromium = mod.default ?? mod;
    const execPath = await chromium.executablePath();
    console.log(`[prepare-clips] Headless Chromium ready at: ${execPath}`);
  } catch (err) {
    console.warn("[prepare-clips] Chromium check skipped:", err.message);
  }
}

async function main() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const clip1Mov = ensureClip1Mov();
  const clip2Mov = path.join(CLIPS_DIR, "clip_2.mov");

  normalizeClip({
    inputPath: clip1Mov,
    normPath: path.join(NORM_DIR, "clip_1.mp4"),
    publicLinkPath: path.join(PUBLIC_DIR, "clip_1.mp4"),
    targetTP: "-2.2",
  });

  normalizeClip({
    inputPath: clip2Mov,
    normPath: path.join(NORM_DIR, "clip_2.mp4"),
    publicLinkPath: path.join(PUBLIC_DIR, "clip_2.mp4"),
    targetTP: "-1.5",
  });

  copyFontsToPublic();
  await ensureChromiumReady();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
