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
