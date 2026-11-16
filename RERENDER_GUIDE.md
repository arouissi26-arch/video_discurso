# Rerender and edit guide

## Requirements

From the repository root, install the locked dependencies once with `npm ci`. The project is configured for Remotion 4.0.544, 30 fps, 1920×1080, H.264 video (`CRF 18`) and AAC audio (192 kb/s). The render script prepares/verifies the original media, regenerates the SRT, and writes `out/final.mp4`.

## Rebuild the media links and subtitles

```bash
npm run prepare-media
npm run srt
```

`prepare-media` reconstructs and SHA-256 verifies the chunked first clip, and prepares the `public/` media references. It does not edit the supplied chunks or source clip. The output clips and generated SRT live in ignored `out/` and `public/` paths.

## Render the final video

```bash
npm run render
```

To override the Remotion input props for an experiment, pass JSON via the environment variable (the default render needs no props):

```bash
REMOTION_PROPS='{"course":"..."}' npm run render
```

The script always prepares the source media and rewrites the draft SRT before rendering. The final file is `out/final.mp4`; the encoded intermediate is temporary. Rendering all 7,164 frames can take a long time on a low-core CPU. Do not terminate the render before the script prints its completion message.

## Verify the finished MP4

```bash
node_modules/@ffprobe-installer/linux-x64/ffprobe \
  -v error -show_entries format=duration,size \
  -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels \
  -of json out/final.mp4
```

Expected: H.264 video, 1920×1080, 30 fps; AAC audio; duration about 238.8 seconds. Check the container and audio/video decode:

```bash
node_modules/@ffmpeg-installer/linux-x64/ffmpeg -v error -i out/final.mp4 -f null -
```

Review the SRT separately in a media player or subtitle editor. It is currently based on estimated timings and still requires listening-based synchronization.

## Edit map

- Palette, typography, scale, safe areas, and timing constants: `src/theme.ts`.
- Insert cues and chapter anchors: `src/timeline.ts`. `at` values are seconds after the first source clip begins; keep cues aligned with that shared source-media clock.
- Caption text/timings and sentence grouping: `src/lib/transcript.ts`; export via `npm run srt`.
- Insert graphic implementations: `src/inserts/Inserts.tsx`.
- Intro/outro and main scene composition: `src/scenes/` and `src/Root.tsx`.
- Frame-driven animation should remain deterministic (use `useCurrentFrame`; do not add `Math.random()`).

After code edits, run:

```bash
npx tsc --noEmit
npm run srt
npm run render
```

Preview a single frame without rendering the full film (in the provided Linux render environment, Chrome's extracted libraries may need to be exposed):

```bash
LD_LIBRARY_PATH=/tmp/al2023/lib npx remotion still src/index.ts Main out/stills/spot-check.png \
  --frame=5923 --browser-executable=/tmp/chromium
```

Use a frame within a cue to inspect it; cue start frame is approximately `(INTRO_FRAMES + cue.at * FPS)`. The project still renders the original clips and never overwrites them.
