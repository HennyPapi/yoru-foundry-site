const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1632,height:720}}); const e=[]; p.on('pageerror',x=>e.push(x.message)); p.on('console',m=>{if(m.type()==='error')e.push(m.text())});
await p.goto('http://localhost:8767/render-keycap.html',{waitUntil:'networkidle'}); await p.waitForFunction(()=>window.ready,null,{timeout:30000});
const jobs = JSON.parse(process.argv[2]);
for (const [name, opts] of Object.entries(jobs)) { const url=await p.evaluate(o=>window.renderKey(o), opts); fs.writeFileSync(process.argv[3]+'/'+name+'.png', Buffer.from(url.split(',')[1],'base64')); console.log(name, JSON.stringify(await p.evaluate(()=>({face:window.lastFace,base:window.lastBase})))); }
console.log('errors', e); await b.close();})();
