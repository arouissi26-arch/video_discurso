#!/bin/sh
# Low-memory alternative: render continuous frame ranges, then join them.
set -eu
mkdir -p .cache/render out
for spec in '0-2999 1' '3000-5999 2' '6000-7110 3'; do
  set -- $spec
  npx remotion render src/index.ts Main ".cache/render/part$2.mp4" --frames="$1" --codec=h264 --crf=18 --audio-bitrate=192k --concurrency=1 --offthreadvideo-cache-size-in-bytes=134217728
done
printf "file 'part1.mp4'\nfile 'part2.mp4'\nfile 'part3.mp4'\n" > .cache/render/concat.txt
ffmpeg -y -f concat -safe 0 -i .cache/render/concat.txt -c:v copy -c:a aac -b:a 192k -movflags +faststart out/final.mp4
