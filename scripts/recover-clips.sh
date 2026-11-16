#!/bin/sh
set -eu
# Fetch the exact source commit without switching branches or changing the original files.
git fetch origin 9410d2c9e25f882564b617119638de61838758ee
mkdir -p public
for part in 00 01 02 03; do git show "FETCH_HEAD:clips_reales/clip_1.mov.part-$part"; done > public/clip_1.mov
git show FETCH_HEAD:clips_reales/clip_2.mov > public/clip_2.mov
printf '%s  %s\n' '2f0d825199acea1ee0c50cf273a835d2555b636237c2efc489e49431b935e34d' 'public/clip_1.mov' '31f24d1a70e939eed33790034ced6884f9a4a772e47964cd5e91cad8a2d52dee' 'public/clip_2.mov' | sha256sum -c
