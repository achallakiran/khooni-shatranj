#!/bin/bash
# Rebuild index.html from src/ (one self-contained page; Babylon.js from jsDelivr).
cd "$(dirname "$0")"
{ cat src/head.html
  echo '<script src="https://cdn.jsdelivr.net/npm/babylonjs@7.0.0/babylon.js"></script>'
  echo '<script>'
  cat src/b_field.js src/c_rig.js src/d_anim.js src/m_mount.js src/f_v2.js src/s_audio.js src/u_ui.js
  echo '</script>'; } > index.html
echo "built index.html"
