# Khooni Shatranj · खूनी शतरंज

**Bloody chess.** A 16 v 16 action-chess battle that runs in the browser. Pick an army (Sun or Eclipse), pick a piece, and fight on the board with only two buttons: strike and block.

**Play:** https://achallakiran.github.io/khooni-shatranj/

## How it plays
- **Block and parry.** Hold Block to guard; tap it as the enemy's blade flashes to parry. White: block or parry. Blue: parry only. Red: step out of the ring.
- **Break the guard.** Heavies, combo finishers and bashes fill the enemy's posture bar. A full bar means Guard Broken: no defence, extra damage.
- **Counter.** After a parry time slows; strike to counter, hold to execute. A last-instant parry opens a longer window.
- **Resolve.** Hold both buttons: heal below three diamonds, unleash your piece's technique at three.
- **Win** by killing the enemy Raja (Shah Mat). If you fall, you take over a random ally.

Pieces: Sipahi (pawn), Ashvarohi (knight, horse), Ushtra (bishop, camel), Gaja (rook, war elephant), Rani (queen), Raja (king). There is also a five-round Gauntlet mode.

## Controls
| Action | Keyboard and mouse | Touch |
| --- | --- | --- |
| Move | W A S D | Left joystick |
| Strike (hold: heavy) | J or left click | Strike button |
| Block (tap: parry) | K or right click | Block button |
| Resolve technique / heal | Hold J + K | Hold both |
| Camera | Mouse, Q / E | Drag |
| Zoom | Mouse wheel | Pinch |
| Pause | Esc | Pause button |

## Build
Everything is plain JavaScript on [Babylon.js](https://www.babylonjs.com/); models, textures, sound and music are generated in code. `index.html` is built from `src/`:

```
./build.sh
```

## Looks (Settings, Look)
Seven visual styles, each with its own slider: **Realistic**, **Painted** (miniature-painting brushwork), **Comic** (cel shading with ink outlines), **Toy board** (tilt-shift miniature), **Night battle**, **Shadow war** (silhouettes in mist, army-coloured rims) and **Retro pixel**. Time of day (Dawn, Day, Dusk, Night) and weather (Clear, Rain, Snow, Storm, Random) combine with any style. Combat signals (warning glints, counter ring, danger zones) are drawn on top of every style, so they always read the same.

Quality: **High** by default; pick Normal, Lite or Minimal for slower phones, or **Auto** to step between them by frame rate.

Other settings: camera zoom, assist, blood level (Off / Low / Full), and music, effects and voice volumes. On a phone, add the page to your home screen to play it fullscreen and offline.

## Versions
- `main` / [play](https://achallakiran.github.io/khooni-shatranj/): Version 3 (visual styles, weather, sharper rendering).
- [`/v2/`](https://achallakiran.github.io/khooni-shatranj/v2/): Version 2, kept as it was (also tag `v2`).
