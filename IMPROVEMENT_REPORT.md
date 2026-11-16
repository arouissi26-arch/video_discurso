# Improvement report — Catalan AI presentation

## Delivered in the project

- A modular Remotion composition with a four-second opening, the two supplied presenter clips in sequence, and a five-second closing. The current composition is 7,164 frames at 30 fps (3:58.8). The source recording's clips are preserved; only the generated public media links and rendered output are derived copies.
- 31 time-anchored visual cues, including lateral split-screen diagrams, definition/section cards, and transitions between lime (benefits), red (risks), and blue (AI/conclusion). Presenter footage remains the main image in split layouts.
- A tokenized, landscape-first design system in `src/theme.ts`, cue timing in `src/timeline.ts`, and typed Remotion scenes/components.
- Catalan on-screen captions with sentence-aware page breaks and a current-word highlight; generated SRT at `out/subtitles.srt` (61 subtitle pages; 518 timed words).
- Deterministic frame-based animation. No generated voice, invented narration, or added music.
- Reviewed stills under `out/stills/final-review/` and current validation stills under `out/stills/final-check/`.

## Changes from visual review

The follow-up review caught cramped insert headings and dense content in the balance insert. The headings were reduced, the benefit/risk display simplified, and the presenter examples redesigned as three icon-led rows. The privacy, reliability, balance, ethics, and outro stills were rendered again. The new balance has more breathing room; “PRIVACITAT” and “FIABILITAT” fit their panels. In the review still, the education insert split its long Catalan headline (“EDUCACI / Ó”) at the narrow panel edge. A final type-size reduction was then applied to long panel headings and included in the current full render; that specific frame has not yet been re-rendered and checked after the reduction. Recheck it before sign-off, and shorten or size the word specifically if the wrap remains.

A final typography pass reduced long panel headlines further. TypeScript validation passes. The final MP4 render has been started with `npm run render`; it is a long CPU-bound render, so the final file must not be considered delivered until `out/final.mp4` exists and passes the verification commands in `RERENDER_GUIDE.md`.

## Quantitative notes

- Runtime: 238.8 seconds.
- Source clips: approximately 200.07 seconds and 30.53 seconds; the second clip's render is trimmed to 29.73 seconds to remove its trailing silence. Its original source remains unchanged.
- 31 insertion cues; panel-oriented B/C/E cue windows total 73.4 seconds (about 31.9% of the 229.8-second source-footage interval; this is a cue-duration sum, not a frame-by-frame unique coverage calculation).
- TypeScript check, media preparation/hash check, and SRT generation pass.

## Accuracy limitation / recommended next step

The transcript timing is a manually estimated word map, not verified word alignment. The generated SRT is therefore a draft for review, despite the active-word animation and sentence-aware layout. Run `npm run transcribe:ca` if Whisper.cpp can be installed in the environment, then compare/correct its transcript against the supplied speech and regenerate the SRT. Do not treat machine transcription as authoritative without listening. No speech or claims were added to the graphics; the original speech remains the source of truth.

## Optional improvements (not applied)

1. Complete a full listen-through and word-level caption synchronization pass; this is the highest-priority quality improvement.
2. Adjust the “EDUCACIÓ” panel headline to avoid the narrow-column line break, then render a replacement still.
3. Add an independent H.264 playback/audio check and inspect representative frames throughout `out/final.mp4` after rendering completes.
4. If a smaller delivery is required, create a separate size-optimized encode; the default render targets quality (`CRF 18`, AAC 192 kb/s, fast-start MP4).
