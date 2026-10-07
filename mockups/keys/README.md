# Rendered keycap

`enter-copper.webp` and `enter-sand.webp` are renders of a 2.25u Enter keycap (three.js, matte PBT
material, studio light, cast shadow on a transparent ground).
`-hover` and `-press` frames are the same cap sunk 1.2mm and 3.2mm into the plate (`"press"` option);
crop all three frames of a color to one shared box so they line up.

To re-render (different legend, color or size):

1. In a scratch folder: `npm install three@0.169.0`, then copy `render-keycap.html` and `render-keycap.js` there.
2. Serve that folder with a static server on the port the script expects (see `render-keycap.js`).
3. Run: `node render-keycap.js '{"copper":{"face":"#E8834D","ink":"#151A1A","text":"Request a Commission"}}' .`
   (headless Chromium with SwiftShader WebGL; writes `copper.png`).
4. Crop to the visible pixels and save as WebP.

A real photograph of an actual keycap can replace these files later with no layout change.

## Keyboard-row keys (`row/`)

`render-keycap.html` takes `u` (key width in units: 1.25, 1.5, 6.25 for the spacebar...) and `arrow` (Enter arrow on/off).
Leave `text` empty for a blank cap; the page sets the legend as real text on the top face. `row-crop.py` crops
every key's frames to one shared plate line and prints each key's base offsets and face position for the layout
(`nav-row.html` uses them).

## Braided cable (`cable/`)

`render-cable.html` renders three pieces through an orthographic camera with the keycaps' viewing direction and
lights: `tile` (a straight run of black 24-carrier braid, a whole number of periods, so it repeats seamlessly),
`coil` (11 touching loops with patina-copper collars hiding the joins) and `plug` (heat-shrink tail, patina-copper
housing, steel USB-C shell). Each also renders as `-glow`: lit only from inside, copper light through the gaps in
the weave, for the LED beads. Serve the folder on port 8767, run `node render-cable.js '{}' <scratch>/cable`,
then `python3 cable-export.py <scratch> cable` (it also writes the coil path the LED script follows).

## Footer keyboard (`render-board.html`)

The whole 75% board in one scene: bead-blasted matte black case with chamfered edges, plate, every keycap with its
legend (`board-layout.json`: one entry per key, `id` marks a link; keys sharing an `id` press together), the logo
medallion printed on Esc, and the linked keys' copper underglow. `renderBoard({lit, pressed, boost})` renders one frame.

1. Serve this folder (with `node_modules/three` and `logo.png`, a PNG of `yoru-foundry-logo-trim.webp`) on port 8767.
2. Put `board-layout.json` in a scratch folder as `layout.json`, then render `base` (unlit), `lit` and, for every
   link id, `<id>-h` (`lit:1, pressed:{id:2.4}, boost:{id:3.2}`) and `<id>-p` (`pressed 4.4, boost 3.6`) in ONE run
   (`node render-board.js <scratch> '<jobs json>'`), so every frame shares the same grain.
3. `python3 board-export.py <scratch> <repo>` crops everything into `src/static/assets/footer-board/` and writes the
   boxes into `src/static/data/footer-board.json`. To change a link's target or name, edit that JSON only.

## Homepage hub (`render-hub.html`)

The USB dock (space-grey shell, black glass front, backlit display with a status bar and the closing line, ports,
stand) with a braided cable plugged into its front-right USB-C port and hanging down past the table edge. It renders
`hub-on`, `hub-off` and `hub-glow` (only the braid's inner light, for the bead) through a tall camera window, and
`path.json` (the cable's centreline). Serve this folder on port 8767 with `node_modules/three`, run
`node render-hub.js <scratch> '<jobs json>'`, then `python3 hub-export.py <scratch> <repo>`.
