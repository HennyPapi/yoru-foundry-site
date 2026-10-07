const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:3000,height:1500}}); const e=[]; p.on('pageerror',x=>e.push(x.message)); p.on('console',m=>{if(m.type()==='error')e.push(m.text())});
await p.goto('http://localhost:8767/kb.html',{waitUntil:'networkidle'}); await p.waitForFunction(()=>window.ready,null,{timeout:30000});
const out=process.argv[2]; const layout=JSON.parse(fs.readFileSync(out+'/layout.json'));
await p.evaluate(l=>window.build(l), layout);
const jobs=JSON.parse(process.argv[3]);
for (const [name, opts] of Object.entries(jobs)) { const t=Date.now(); const url=await p.evaluate(o=>window.renderBoard(o), opts);
  fs.writeFileSync(out+'/'+name+'.png', Buffer.from(url.split(',')[1],'base64')); if(name==='base') fs.writeFileSync(out+'/boxes.json', JSON.stringify(await p.evaluate(()=>window.lastBoxes))); console.log(name, Date.now()-t,'ms'); }
console.log('errors', e); await b.close();})();
