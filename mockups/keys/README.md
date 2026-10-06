# Rendered keycap

`enter-copper.webp` and `enter-sand.webp` are renders of a 2.25u Enter keycap (three.js, matte PBT
material, studio light, cast shadow on a transparent ground).

To re-render (different legend, color or size):

1. In a scratch folder: `npm install three@0.169.0`, then copy `render-keycap.html` and `render-keycap.js` there.
2. Serve that folder with a static server on the port the script expects (see `render-keycap.js`).
3. Run: `node render-keycap.js '{"copper":{"face":"#E8834D","ink":"#151A1A","text":"Request a Commission"}}' .`
   (headless Chromium with SwiftShader WebGL; writes `copper.png`).
4. Crop to the visible pixels and save as WebP.

A real photograph of an actual keycap can replace these files later with no layout change.
