#!/bin/bash
# Rebuild index.html from src/ (one self-contained page; Babylon.js from jsDelivr).
#   ./build.sh            -> index.html (for GitHub Pages / the Claude page)
#   ./build.sh local OUT  -> OUT with a local babylon.js (offline testing)
cd "$(dirname "$0")"
OUT=index.html; BAB='https://cdn.jsdelivr.net/npm/babylonjs@7.0.0/babylon.js'
if [ "$1" == "local" ]; then OUT=$2; BAB='babylon.js'; fi
{ cat src/head.html
  echo "<script src=\"$BAB\"></script>"
  echo '<script>'
  cat src/field.js src/rig.js src/anim.js src/mount.js src/engine.js src/audio.js src/look.js src/ui.js
  echo '</script>'; } > "$OUT"
if [ "$1" == "local" ]; then sed -i 's#<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>##' "$OUT"; fi
echo "built $OUT"
