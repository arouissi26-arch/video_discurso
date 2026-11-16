# Fast cloud render: GitHub Codespaces vs Google Colab

## Recommendation

For this Remotion project, start with a **6-core Codespace** (or the largest 6/8-core machine offered to the account). This is the simpler, more predictable option: the current branch and tracked clip sources are already together, Node/Remotion runs natively, and the render script now uses the CPU cores it can see. Choose Colab if a GPU runtime is available and you want to benchmark NVIDIA-assisted H.264 encoding; a Colab GPU does **not** automatically accelerate Chrome's per-frame React/Remotion rendering, which can remain CPU-bound. The project opts into Remotion's `if-possible` encoding acceleration and falls back to software if unavailable.

## Option A — Codespaces (recommended)

1. Open this pull request on GitHub. In its **Code** menu choose **Codespaces → Create codespace on the PR branch**. If that menu is not shown, open the repository, select branch `arena/09c32f0c-video-discurso`, then choose **Code → Codespaces → Create codespace**.
2. Choose a **6-core** machine if listed; otherwise use the largest suitable size available (8 cores is preferable to 4 for this CPU-heavy render). If it opens on a smaller type, use the Codespace menu/Command Palette to change the machine type, then restart it.
3. In the Codespace terminal:

   ```bash
   npm ci
   npm run prepare-media
   npm run srt
   node -p "require('node:os').availableParallelism()"
   npm run render
   ```

   `npm run render` reads the available CPU count and sets Remotion concurrency automatically. To set a lower value explicitly (must not exceed the printed core count):

   ```bash
   REMOTION_CONCURRENCY=6 npm run render
   ```

4. Wait for `Done: out/final.mp4 and out/subtitles.srt`. In the VS Code Explorer, right-click `out/final.mp4` and choose **Download**, or copy it to a mounted cloud drive. Keep the Codespace running until the render and file transfer both finish; stop it afterward to avoid continued machine usage.

## Option B — Google Colab with an NVIDIA GPU

1. In Colab create a notebook, open **Runtime → Change runtime type**, and select a GPU accelerator (for example, T4 if the account offers it). Run `!nvidia-smi` to confirm that the runtime actually received a GPU; availability varies by account/session.
2. Get this PR's project files into the runtime. If the repository is public, clone the PR branch:

   ```bash
   !git clone --depth 1 --branch arena/09c32f0c-video-discurso https://github.com/arouissi26-arch/video_discurso.git /content/video_discurso
   %cd /content/video_discurso
   ```

   If it is private, use GitHub's **Code → Download ZIP** for the PR branch in your browser, then put the archive in Google Drive and unzip it in Colab. Do not paste GitHub tokens into notebook cells. The tracked source clips/chunks are in the repository; `npm run prepare-media` reconstructs and verifies clip 1 without changing the source.
3. In a Colab cell run:

   ```bash
   %cd /content/video_discurso
   !npm ci
   !npm run prepare-media
   !npm run srt
   !node -p "require('node:os').availableParallelism()"
   !npm run render
   ```

   The script automatically uses the CPU cores visible to the runtime. Colab's GPU can speed up H.264 encoding only when the installed FFmpeg/NVIDIA stack supports it; Remotion is set to try hardware acceleration and safely fall back. A GPU may not improve Chrome's frame rendering, so compare elapsed time rather than assuming it will be faster.
4. After the script prints its completion message, copy the result to Drive:

   ```python
   from google.colab import drive
   drive.mount('/content/drive')
   ```

   ```bash
   !mkdir -p /content/drive/MyDrive/video_discurso
   !cp out/final.mp4 out/subtitles.srt /content/drive/MyDrive/video_discurso/
   ```

## What changed for performance

- `REMOTION_CONCURRENCY` defaults to Node's available CPU count; set it to a positive integer no greater than the runtime's available cores to reserve resources.
- The final H.264 pass asks Remotion for `--hardware-acceleration=if-possible`; software fallback remains enabled.
- Removed the full-canvas SVG `feTurbulence` grain overlay from the main video, avoiding a costly per-frame filter while retaining the grid, crop marks, colors, and captions.

The active render already running in the original sandbox uses the code/options it started with. These speed settings apply to a new run from this PR; they do not alter or interrupt that render.
