import fs from "node:fs";
import path from "node:path";
import { serializeSrt } from "@remotion/captions";

const ROOT = process.cwd();
const dataFile = fs.readFileSync(path.join(ROOT, "src", "lib", "captions-data.ts"), "utf8");
const match = dataFile.match(/export const SRT_BLOCKS: Caption\[\]\[\] = (\[[\s\S]*?\]);\s*$/);

if (!match) {
  throw new Error("Could not parse SRT_BLOCKS from src/lib/captions-data.ts");
}

const srtBlocks = JSON.parse(match[1]);
const srtText = serializeSrt({ lines: srtBlocks });

fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "public"), { recursive: true });

fs.writeFileSync(path.join(ROOT, "out", "subtitles.srt"), srtText, "utf8");
fs.writeFileSync(path.join(ROOT, "public", "subtitles.srt"), srtText, "utf8");
console.log(`[export-srt] Wrote ${srtBlocks.length} subtitle blocks -> out/subtitles.srt & public/subtitles.srt`);
