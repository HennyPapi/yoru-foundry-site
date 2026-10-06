// node cable-run.js '<opts json>' <outdir>: renders tile, coil and plug; prints spans and alignment data
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1800, height: 480 } }); const e = [];
  p.on('pageerror', x => e.push(x.message)); p.on('console', m => { if (m.type() === 'error') e.push(m.text()) });
  await p.goto('http://localhost:8767/render-cable.html', { waitUntil: 'networkidle' }); await p.waitForFunction(() => window.ready, null, { timeout: 30000 });
  const opts = JSON.parse(process.argv[2]), out = process.argv[3], meta = { keyGroundY: await p.evaluate(() => window.keyGroundY), keyPxPerMm: await p.evaluate(() => window.keyPxPerMm) };
  for (const name of ['tile', 'coil', 'plug']) for (const glow of [false, true]) {
    const url = await p.evaluate(o => window.renderPiece(o), { ...opts, name, glow });
    fs.writeFileSync(`${out}/${name}${glow ? '-glow' : ''}.png`, Buffer.from(url.split(',')[1], 'base64'));
    if (!glow) meta[name] = await p.evaluate(() => window.lastSpan);
  }
  fs.writeFileSync(`${out}/cable-meta.json`, JSON.stringify(meta)); console.log(JSON.stringify(meta), 'errors', e); await b.close();
})();
