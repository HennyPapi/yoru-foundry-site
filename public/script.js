const menuButton=document.querySelector(".menu-toggle");const nav=document.querySelector(".nav");menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open))});document.querySelectorAll(".nav>a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false")}));const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();

/* Phase 2 — content architecture */
const yoruContent=window.YORU_CONTENT||{};
const siteMode=yoruContent.SITE_MODE||"prelaunch";
const siteModeContent=(yoruContent.SITE_MODE_CONTENT||{})[siteMode]||(yoruContent.SITE_MODE_CONTENT||{}).prelaunch||{};
const builds=Array.isArray(yoruContent.BUILDS)?yoruContent.BUILDS:[];
const soundSamples=Array.isArray(yoruContent.SOUND_SAMPLES)?yoruContent.SOUND_SAMPLES:[];
document.documentElement.dataset.siteMode=siteMode;
function yfEscape(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]))}
function yfBuildHref(build){return "/commission.html?id="+encodeURIComponent(build.id)}
function yfVisibleBuilds(){return siteMode==="live"?builds.filter(build=>build.status!=="placeholder"):builds}
function yfStatusLabel(status){return ({placeholder:"PRELAUNCH STUDY","in-progress":"IN PROGRESS",built:"BUILT",available:"AVAILABLE"})[status]||String(status||"").toUpperCase()}
function yfApplySiteMode(){
  const eyebrow=document.querySelector("[data-site-hero-eyebrow]");
  if(eyebrow)eyebrow.textContent=siteModeContent.heroEyebrow||"YORU FOUNDRY";
  const cta=document.querySelector("[data-site-hero-cta]");
  if(cta){cta.textContent=siteModeContent.heroCta?.label||"Explore Crafted Art";cta.href=siteModeContent.heroCta?.href||"/crafted-art.html"}
  const heroStatus=document.querySelector("[data-site-hero-status]");
  if(heroStatus)heroStatus.textContent=siteModeContent.heroStatus||"Built one at a time";
  document.querySelectorAll(".site-footer").forEach(footer=>{
    let line=footer.querySelector("[data-site-footer-status]");
    if(!line){
      line=document.createElement("p");
      line.className="footer-status";
      line.dataset.siteFooterStatus="";
      const copyright=footer.querySelector(".copyright");
      footer.insertBefore(line,copyright||null);
    }
    line.textContent=siteModeContent.footerStatus||"Built one at a time.";
  });
}
function yfRenderArchive(){
  const grid=document.querySelector("[data-archive-grid]");
  if(!grid)return;
  const visible=yfVisibleBuilds();
  if(!visible.length){
    grid.innerHTML='<div class="archive-empty"><p class="eyebrow">ARCHIVE IN PROGRESS</p><h2>I will add finished commissions here as they are completed and documented.</h2></div>';
    return;
  }
  grid.innerHTML=visible.map(build=>{
    const placeholder=build.status==="placeholder";
    const image=build.images?.[0]||"/img/placeholder-4x5.svg";
    return '<a href="'+yfBuildHref(build)+'" class="archive-entry'+(placeholder?' is-placeholder':'')+'"><div class="archive-media"><img src="'+yfEscape(image)+'" alt="" width="1200" height="1500" loading="lazy" decoding="async"></div><div class="archive-copy"><span class="archive-status">'+yfEscape(yfStatusLabel(build.status))+' • '+yfEscape(build.id)+' • '+yfEscape(build.layout||"")+'</span><h2>'+yfEscape(build.name)+'</h2><p>'+yfEscape(build.summary)+'</p><div class="archive-specs" aria-label="Build specifications"><span><b>CASE</b><em>'+yfEscape(build.specs?.case||"")+'</em></span><span><b>SWITCHES</b><em>'+yfEscape(build.specs?.switches||"")+'</em></span><span><b>MOUNT</b><em>'+yfEscape(build.specs?.mount||"")+'</em></span></div></div></a>';
  }).join("");
}
function yfRenderHomeBuild(){
  const visible=yfVisibleBuilds();
  const build=visible[0]||builds[0];
  if(!build)return;
  const media=document.querySelector("[data-hero-build-media]");
  if(media)media.innerHTML='<img src="'+yfEscape(build.heroImage||"/img/placeholder-16x9.svg")+'" alt="" width="1600" height="900" decoding="async"><span class="showpiece-index">'+yfEscape(build.id.replace("-"," / "))+'</span><div class="showpiece-caption">'+yfEscape(build.summary)+'</div>';
  const specs=document.querySelector("[data-hero-build-specs]");
  if(specs)specs.innerHTML='<span>'+yfEscape(build.specs.case)+'</span><span>'+yfEscape(build.specs.mount)+'</span><span>'+yfEscape(build.specs.switches)+'</span>';
  const feature=document.querySelector("[data-featured-build]");
  if(feature){
    feature.classList.toggle("is-placeholder",build.status==="placeholder");
    feature.innerHTML='<div class="featured-photo"><img src="'+yfEscape(build.images?.[0]||"/img/placeholder-4x5.svg")+'" alt="" width="1200" height="1500" loading="lazy" decoding="async"></div><div class="featured-copy"><p class="eyebrow">'+yfEscape(yfStatusLabel(build.status))+' • '+yfEscape(build.id)+'</p><h2>'+yfEscape(build.name)+'</h2><p>'+yfEscape(build.notes)+'</p><dl class="commission-specs"><div><dt>Layout</dt><dd>'+yfEscape(build.layout)+'</dd></div><div><dt>Plate</dt><dd>'+yfEscape(build.specs.plate)+'</dd></div><div><dt>Case</dt><dd>'+yfEscape(build.specs.case)+'</dd></div><div><dt>Mount</dt><dd>'+yfEscape(build.specs.mount)+'</dd></div></dl><a class="text-link" href="'+yfBuildHref(build)+'">View '+yfEscape(build.id)+' record →</a></div>';
  }
}
function yfSoundPlayer(sample){
  if(!sample)return '<p>Audio reference is not available yet.</p>';
  return '<div class="sound-player-copy"><strong>'+yfEscape(sample.name)+'</strong><p>'+yfEscape(sample.description)+'</p></div><audio controls preload="metadata" src="'+yfEscape(sample.file)+'" aria-label="'+yfEscape(sample.name)+'"></audio>';
}
function yfRenderSoundPlayers(){
  document.querySelectorAll("[data-sound-player]").forEach((slot,index)=>{
    const requested=Number(slot.dataset.soundPlayer);
    const sample=soundSamples[Number.isFinite(requested)?requested:index]||soundSamples[0];
    slot.innerHTML=yfSoundPlayer(sample);
  });
}
function yfRenderBuildDetail(){
  const root=document.querySelector("[data-build-detail]");
  if(!root)return;
  const id=new URLSearchParams(location.search).get("id")||"YF-001";
  const build=builds.find(item=>item.id===id);
  if(!build||(siteMode==="live"&&build.status==="placeholder")){
    root.innerHTML='<section class="page-hero"><p class="eyebrow">BUILD RECORD</p><h1>This record is not published.</h1><p>I publish build records after the work is ready to document.</p></section>';
    return;
  }
  document.title=build.id+" | Yoru Foundry";
  const details=(build.detailImages?.length?build.detailImages:["/img/placeholder-1x1.svg","/img/placeholder-1x1.svg","/img/placeholder-1x1.svg"]).slice(0,3);
  const audioSample=build.audio?{name:build.id+" standardized sound test",file:build.audio,description:"Recorded using the standardized Yoru Foundry comparison setup."}:soundSamples[0];
  root.innerHTML='<section class="page-hero"><p class="eyebrow">'+yfEscape(yfStatusLabel(build.status))+' • '+yfEscape(build.id)+' • '+yfEscape(build.layout)+'</p><h1>'+yfEscape(build.name)+'</h1><p>'+yfEscape(build.summary)+'</p></section><section class="commission-hero-media"><img src="'+yfEscape(build.heroImage||"/img/placeholder-16x9.svg")+'" alt="" width="1600" height="900"></section><section class="commission-story"><div><p class="eyebrow">THE RECORD</p><h2>Documented around intent, not a catalog SKU.</h2></div><div><p>'+yfEscape(build.notes)+'</p></div></section><section class="commission-detail-grid"><article><span>Case</span><strong>'+yfEscape(build.specs.case)+'</strong></article><article><span>Plate</span><strong>'+yfEscape(build.specs.plate)+'</strong></article><article><span>Switches</span><strong>'+yfEscape(build.specs.switches)+'</strong></article><article><span>Lube</span><strong>'+yfEscape(build.specs.lube)+'</strong></article><article><span>Keycaps</span><strong>'+yfEscape(build.specs.keycaps)+'</strong></article><article><span>Mount</span><strong>'+yfEscape(build.specs.mount)+'</strong></article></section><section class="commission-media-grid">'+details.map(src=>'<div class="detail-media"><img src="'+yfEscape(src)+'" alt="" width="1000" height="1000" loading="lazy" decoding="async"></div>').join("")+'</section><section class="sound-sample"><div><p class="eyebrow">STANDARDIZED SOUND TEST</p><h2>Hear the build under the same conditions.</h2><p>The player footprint is already locked so a real recording can replace the silent reference without moving the layout.</p></div><div class="compare-audio build-audio">'+yfSoundPlayer(audioSample)+'</div></section><section class="commission-story"><div><p class="eyebrow">PROCESS NOTES</p><h2>Why these choices.</h2></div><div><p>'+yfEscape(build.processNotes||build.notes)+'</p><a class="text-link" href="/request-a-build.html?layout='+encodeURIComponent(build.layout)+'">Request a '+yfEscape(build.layout)+' commission →</a></div></section>';
}
yfApplySiteMode();
yfRenderArchive();
yfRenderHomeBuild();
yfRenderSoundPlayers();
yfRenderBuildDetail();


const stories={
 process:{
  1:{title:"Preparation",intro:"The decisions before assembly determine how cleanly the rest of a build comes together.",steps:[
   ["Inspect & Plan","Sample photo — parts laid out","Every component is inspected, the layout is confirmed, and the build plan is mapped before anything is modified."],
   ["Stabilizer Preparation","Sample video — stabilizer prep","Large keys are checked, balanced and prepared so later tuning has a consistent foundation."],
   ["Switch & Component Check","Sample photo — switches and PCB","Switches, sockets, PCB, plate and hardware are checked before the build is committed."]
  ]},
  2:{title:"Tuning",intro:"This is where small adjustments begin shaping the personality of the board.",steps:[
   ["Lubing & Consistency","Sample video — switch lubing","Lubrication can reduce scratch, change pitch and improve consistency when applied deliberately."],
   ["Foam & Acoustic Decisions","Sample photo — foam options","Not every build needs every layer. Material is added or removed based on the sound and response we are aiming for."],
   ["Mount & Plate Testing","Sample video — flex test","The mounting system and plate influence stiffness, rebound and resonance, so they are evaluated as part of the whole build."]
  ]},
  3:{title:"Assembly",intro:"The planned parts and tuning choices finally become one object.",steps:[
   ["Core Assembly","Sample video — PCB and plate assembly","The switches, plate, PCB and case are brought together carefully and checked as the build progresses."],
   ["Cable & Hardware Check","Sample photo — internal assembly","Internal routing, screws, daughterboards and connections are verified before the case is closed."],
   ["Keycap Installation","Sample video — final keycaps","Keycaps are installed and visually checked for fit, alignment and the intended final presentation."]
  ]},
  4:{title:"Final Refinement",intro:"A build is not finished because the screws are in. It is finished when it behaves the way it should.",steps:[
   ["Typing & Sound Test","Sample video — typing test","Every key is tested while listening for inconsistencies, rattle, tick, binding or unwanted resonance."],
   ["Correction Pass","Sample photo — adjustment","Anything that does not meet the intended standard is reopened, adjusted and tested again."],
   ["Final Presentation","Sample photo — finished build","The completed board is cleaned, photographed and prepared for handoff."]
  ]}
 },
 taste:{
  1:{title:"Switch Lubing",intro:"Hear and understand what lubrication changes — and what it does not.",steps:[
   ["Before","Sample audio/video — unlubed switch","A clean baseline shows the natural scratch, pitch and spring character of the switch."],
   ["After","Sample audio/video — lubed switch","The same switch after careful lubrication demonstrates the change in smoothness, consistency and sound."],
   ["What You Feel","Sample close-up video","The goal is not simply 'quieter.' The difference can be in friction, return, texture and perceived refinement."]
  ]},
  2:{title:"Stabilizer Tuning",intro:"Spacebars, shifts, enter and backspace reveal poor tuning immediately.",steps:[
   ["Untuned","Sample audio — rattle/tick","An untuned stabilizer can add wire rattle, ticking and uneven travel."],
   ["Tuned","Sample audio — tuned stabilizer","Lubrication, wire correction and balance can make large keys sound cleaner and feel more consistent."],
   ["Why It Matters","Sample video — side-by-side","This comparison makes one of the most audible build-quality differences easy to understand."]
  ]},
  3:{title:"Keycap Material & Profile",intro:"Shape, thickness and material all influence the way a keyboard speaks back.",steps:[
   ["Material","Sample photo — ABS vs PBT","ABS and PBT differ in texture, wear, density and often perceived pitch."],
   ["Profile","Sample diagram — profiles","Cherry, OEM, SA and other profiles change sculpting, height and finger positioning."],
   ["Sound Comparison","Sample audio/video","The same board with different keycaps reveals how much the cap itself can change the final sound."]
  ]},
  4:{title:"Mounting Style",intro:"How the plate and PCB are supported changes stiffness, movement and resonance.",steps:[
   ["Gasket Mount","Sample flex video","Gasket systems can isolate the assembly and provide a softer, more cushioned response depending on implementation."],
   ["Firmer Mounts","Sample flex video","Top, tray and other firmer systems can create a more direct response and different resonance."],
   ["Side by Side","Sample audio/video comparison","The meaningful choice is not which mount is 'best,' but which behavior matches your preference."]
  ]},
  5:{title:"Plate Material",intro:"Plate material changes more than appearance.",steps:[
   ["Aluminum","Sample plate photo/audio","Typically firmer and more direct, with its own resonant character."],
   ["Polycarbonate / FR4","Sample plate comparison","Softer or more flexible materials can change rebound, pitch and perceived softness."],
   ["Choose by Feel","Sample typing comparison","The plate is selected as part of the full system, not in isolation."]
  ]},
  6:{title:"Sound Profiles",intro:"Rather than vague internet labels, we will use real recordings so you can choose by ear.",steps:[
   ["Profile A","Sample audio — sound profile","A controlled recording with notes describing pitch, resonance and character."],
   ["Profile B","Sample audio — alternate profile","A contrasting tuning direction on comparable hardware."],
   ["Your Preference","Sample comparison player","These examples will become the vocabulary used in the build request form."]
  ]}
 }
};
function renderStoryGrids(){
  document.querySelectorAll("[data-story-grid]").forEach(grid=>{
    const type=grid.dataset.storyGrid;
    const group=stories[type]||{};
    grid.innerHTML=Object.entries(group).map(([id,story],index)=>{
      const action=type==="process"?"Open process →":"Explore comparison →";
      return '<button class="story-tile" data-story-type="'+yfEscape(type)+'" data-story="'+yfEscape(id)+'"><div class="sample-image"><img src="/img/placeholder-3x2.svg" alt="" width="1200" height="800" loading="lazy" decoding="async"></div><span>'+String(index+1).padStart(2,"0")+'</span><h2>'+yfEscape(story.title)+'</h2><p>'+yfEscape(story.intro)+'</p><b>'+action+'</b></button>';
    }).join("");
  });
}
renderStoryGrids();
const modal=document.getElementById("storyModal");const title=document.getElementById("storyTitle");const intro=document.getElementById("storyIntro");const content=document.getElementById("storyContent");
function openStory(type,id){const story=stories[type]?.[id];if(!story||!modal)return;title.textContent=story.title;intro.textContent=story.intro;content.innerHTML=story.steps.map((s,i)=>"<section class=\"story-row "+(i%2?"reverse":"")+"\"><div class=\"story-media\"><img src=\"/img/placeholder-3x2.svg\" alt=\"\" width=\"1200\" height=\"800\" loading=\"lazy\" decoding=\"async\"><span class=\"media-label\">"+yfEscape(s[1])+"</span></div><div class=\"story-copy\"><p class=\"eyebrow\">STEP "+String(i+1).padStart(2,"0")+"</p><h3>"+yfEscape(s[0])+"</h3><p>"+yfEscape(s[2])+"</p></div></section>").join("");modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");content.scrollTop=0}
function closeStory(){if(!modal)return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")}
document.querySelectorAll("[data-story]").forEach(el=>el.addEventListener("click",()=>openStory(el.dataset.storyType,el.dataset.story)));document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeStory));document.addEventListener("keydown",e=>{if(e.key==="Escape")closeStory()});

const form=document.getElementById("buildForm");if(form){const params=new URLSearchParams(location.search);const layoutParam=params.get("layout");const layoutSelect=form.querySelector('[name="layout"]');const locked=form.querySelector('[data-layout-locked]');if(layoutParam&&layoutSelect){let option=[...layoutSelect.options].find(o=>o.value===layoutParam||o.textContent===layoutParam);if(!option){option=new Option(layoutParam,layoutParam);layoutSelect.add(option)}layoutSelect.value=layoutParam;layoutSelect.disabled=true;layoutSelect.classList.add("locked-layout");if(locked)locked.value=layoutParam}form.addEventListener("submit",event=>{event.preventDefault();const data=new FormData(form);const layout=layoutParam||data.get("layout");const subject=`Yoru Foundry Build Request — ${data.get("name")}`;const body=["YORU FOUNDRY BUILD REQUEST","",`Name: ${data.get("name")}`,`Email: ${data.get("email")}`,`Layout: ${layout}`,`Budget range: ${data.get("budget")}`,`Switch feel: ${data.get("feel")}`,`Sound preference: ${data.get("sound")}`,"","Build details:",data.get("details")||"No additional details provided."].join("\n");location.href=`mailto:hello@yorufoundry.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`})}
;(()=>{const path=location.pathname;document.querySelectorAll(".nav>a").forEach(a=>{const href=new URL(a.href,location.origin).pathname;if(href===path)a.classList.add("active")});const products=document.querySelector(".products-menu");if(products&&path.startsWith("/products-"))products.classList.add("active");})();
;(()=>{
  const dropdown=document.querySelector(".products-dropdown");
  if(dropdown){
    dropdown.classList.add("mega-menu");
    dropdown.innerHTML='<div class="mega-col"><span>KEYBOARDS</span><a href="/products-keyboards.html">All Keyboards</a><a href="/request-a-build.html?layout=75%">75%</a><a href="/request-a-build.html?layout=65%">65% <small>Coming Soon</small></a><a href="/request-a-build.html?layout=TKL">TKL / 80% <small>Coming Soon</small></a></div><div class="mega-col"><span>DESK</span><a href="/products-deskmats.html">Desk Mats</a><a href="/products-mousepads.html">Mouse Pads</a><a href="/products-wristrests.html">Wrist Rests</a></div><div class="mega-col"><span>INPUT + MORE</span><a href="/products-mice.html">Mice</a><a href="/products-accessories.html">Accessories</a></div>';
  }
  document.querySelectorAll(".site-footer .footer-links").forEach(f=>{if(!f.querySelector('[href="/archive.html"]'))f.insertAdjacentHTML("afterbegin",'<a href="/archive.html">Archive</a><a href="/why-yoru.html">Why Yoru</a><a href="/journal.html">Journal</a>')});
})();

;(()=>{
const options={
stabilizer:[["Untuned","Natural wire rattle, tick and unevenness before correction."],["Tuned","Balanced, lubricated and checked for cleaner large-key behavior."]],
switchlube:[["Stock","Factory or dry feel, depending on the switch."],["Hand Lubed","Reduced friction and a more consistent travel when applied carefully."]],
switch:[["Linear","Smooth travel without a tactile bump."],["Tactile","A defined bump provides physical feedback."],["Clicky","Tactile and intentionally audible feedback."]],
tape:[["No Tape","PCB left untreated."],["2 Layers","A light tape treatment with a smaller acoustic shift."],["4 Layers","A stronger treatment that can increase reflected energy."],["6 Layers","An intentionally exaggerated tape treatment for comparison."]],
plate:[["Aluminum","Firm, direct and typically more rigid."],["Polycarbonate","Softer and more flexible in many implementations."],["FR4","A middle-ground fiberglass laminate."],["Brass","Dense and firm with added mass."]],
keycap:[["PBT","Textured and durable with its own density and pitch."],["ABS","Smooth, vivid and often brighter or more resonant."]],
mount:[["Gasket","Isolated mounting that can allow a softer response."],["Top Mount","More direct attachment and controlled firmness."],["Tray Mount","Simple, rigid mounting with a distinct feel."]]
};
function fill(side){
 const type=document.getElementById("compareType"+side),opt=document.getElementById("compareOption"+side),desc=document.getElementById("compareDesc"+side);if(!type||!opt)return;
 const list=options[type.value]||[];opt.innerHTML=list.map((x,i)=>'<option value="'+i+'">'+x[0]+'</option>').join("");
 const render=()=>{desc.textContent=list[Number(opt.value)]?.[1]||""};opt.onchange=render;render();
}
["A","B"].forEach(side=>{const type=document.getElementById("compareType"+side);if(type){type.onchange=()=>fill(side);fill(side)}})
})();


;(()=>{
  document.querySelectorAll('a[href="/request-a-build.html"]').forEach(a=>{
    if(a.textContent.trim()==="Request a Build") a.textContent="Request a Commission";
  });
})();



