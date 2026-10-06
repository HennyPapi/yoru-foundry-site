const menuButton=document.querySelector(".menu-toggle");const nav=document.querySelector(".nav");menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open))});document.querySelectorAll(".nav>a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false")}));const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();

/* Phase 2 — content architecture */
const yoruContent=window.YORU_CONTENT||{};
const siteMode=yoruContent.SITE_MODE||"prelaunch";
const siteModeContent=(yoruContent.SITE_MODE_CONTENT||{})[siteMode]||(yoruContent.SITE_MODE_CONTENT||{}).prelaunch||{};
const builds=Array.isArray(yoruContent.BUILDS)?yoruContent.BUILDS:[];
const soundSamples=Array.isArray(yoruContent.SOUND_SAMPLES)?yoruContent.SOUND_SAMPLES:[];
const stories=yoruContent.STORIES||{};
const compareOptions=yoruContent.COMPARE_OPTIONS||{};
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
  const home=build.home||{};
  const media=document.querySelector("[data-hero-build-media]");
  if(media)media.innerHTML='<img src="'+yfEscape(build.heroImage||"/img/placeholder-16x9.svg")+'" alt="" width="1600" height="900" decoding="async"><span class="showpiece-index">'+yfEscape(build.id.replace("-"," / "))+'</span><div class="showpiece-caption">'+yfEscape(home.heroCaption||build.summary)+'</div>';
  const heroSpecs=Array.isArray(home.heroSpecs)&&home.heroSpecs.length?home.heroSpecs:[build.specs.case,build.specs.mount,build.specs.switches];
  const specs=document.querySelector("[data-hero-build-specs]");
  if(specs)specs.innerHTML=heroSpecs.map(value=>'<span>'+yfEscape(value)+'</span>').join("");
  const feature=document.querySelector("[data-featured-build]");
  if(feature){
    feature.classList.toggle("is-placeholder",build.status==="placeholder");
    const featureSpecs=Array.isArray(home.featuredSpecs)&&home.featuredSpecs.length?home.featuredSpecs:[
      {label:"Layout",value:build.layout},
      {label:"Plate",value:build.specs.plate},
      {label:"Case",value:build.specs.case},
      {label:"Mount",value:build.specs.mount}
    ];
    const featureMedia=home.featuredMediaLabel?'<div class="featured-photo">'+yfEscape(home.featuredMediaLabel)+'</div>':'<div class="featured-photo"><img src="'+yfEscape(build.images?.[0]||"/img/placeholder-4x5.svg")+'" alt="" width="1200" height="1500" loading="lazy" decoding="async"></div>';
    feature.innerHTML=featureMedia+'<div class="featured-copy"><p class="eyebrow">'+yfEscape(home.featuredEyebrow||(yfStatusLabel(build.status)+" • "+build.id))+'</p><h2>'+yfEscape(home.featuredHeading||build.name)+'</h2><p>'+yfEscape(home.featuredBody||build.notes)+'</p><dl class="commission-specs">'+featureSpecs.map(item=>'<div><dt>'+yfEscape(item.label)+'</dt><dd>'+yfEscape(item.value)+'</dd></div>').join("")+'</dl><a class="text-link" href="'+yfEscape(home.featuredHref||yfBuildHref(build))+'">'+yfEscape(home.featuredLinkLabel||("View "+build.id+" record →"))+'</a></div>';
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
    root.innerHTML='<section class="page-hero-shell section-shell"><div class="section-shell-frame"><div class="page-hero"><p class="eyebrow">BUILD RECORD</p><h1>This record is not published.</h1><p>I publish build records after the work is ready to document.</p></div></div></section>';
    return;
  }
  document.title=build.id+" | Yoru Foundry";
  const details=(build.detailImages?.length?build.detailImages:["/img/placeholder-1x1.svg","/img/placeholder-1x1.svg","/img/placeholder-1x1.svg"]).slice(0,3);
  const audioSample=build.audio?{name:build.id+" standardized sound test",file:build.audio,description:"Recorded using the standardized Yoru Foundry comparison setup."}:soundSamples[0];
  root.innerHTML='<section class="page-hero-shell section-shell"><div class="section-shell-frame"><div class="page-hero"><p class="eyebrow">'+yfEscape(yfStatusLabel(build.status))+' • '+yfEscape(build.id)+' • '+yfEscape(build.layout)+'</p><h1>'+yfEscape(build.name)+'</h1><p>'+yfEscape(build.summary)+'</p></div></div></section><section class="commission-hero-media"><img src="'+yfEscape(build.heroImage||"/img/placeholder-16x9.svg")+'" alt="" width="1600" height="900"></section><section class="commission-story"><div><p class="eyebrow">THE RECORD</p><h2>Documented around intent, not a catalog SKU.</h2></div><div><p>'+yfEscape(build.notes)+'</p></div></section><section class="commission-detail-grid"><article><span>Case</span><strong>'+yfEscape(build.specs.case)+'</strong></article><article><span>Plate</span><strong>'+yfEscape(build.specs.plate)+'</strong></article><article><span>Switches</span><strong>'+yfEscape(build.specs.switches)+'</strong></article><article><span>Lube</span><strong>'+yfEscape(build.specs.lube)+'</strong></article><article><span>Keycaps</span><strong>'+yfEscape(build.specs.keycaps)+'</strong></article><article><span>Mount</span><strong>'+yfEscape(build.specs.mount)+'</strong></article></section><section class="commission-media-grid">'+details.map(src=>'<div class="detail-media"><img src="'+yfEscape(src)+'" alt="" width="1000" height="1000" loading="lazy" decoding="async"></div>').join("")+'</section><section class="sound-sample"><div><p class="eyebrow">STANDARDIZED SOUND TEST</p><h2>Hear the build under the same conditions.</h2><p>The player footprint is already locked so a real recording can replace the silent reference without moving the layout.</p></div><div class="compare-audio build-audio">'+yfSoundPlayer(audioSample)+'</div></section><section class="commission-story"><div><p class="eyebrow">PROCESS NOTES</p><h2>Why these choices.</h2></div><div><p>'+yfEscape(build.processNotes||build.notes)+'</p><a class="text-link" href="/request-a-build.html?layout='+encodeURIComponent(build.layout)+'">Request a '+yfEscape(build.layout)+' commission →</a></div></section>';
}
yfApplySiteMode();
yfRenderArchive();
yfRenderHomeBuild();
yfRenderSoundPlayers();
yfRenderBuildDetail();



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
let lastFocus=null;
function openStory(type,id){const story=stories[type]?.[id];if(!story||!modal)return;title.textContent=story.title;intro.textContent=story.intro;content.innerHTML=story.steps.map((s,i)=>"<section class=\"story-row "+(i%2?"reverse":"")+"\"><div class=\"story-media\"><img src=\"/img/placeholder-3x2.svg\" alt=\"\" width=\"1200\" height=\"800\" loading=\"lazy\" decoding=\"async\"><span class=\"media-label\">"+yfEscape(s[1])+"</span></div><div class=\"story-copy\"><p class=\"eyebrow\">STEP "+String(i+1).padStart(2,"0")+"</p><h3>"+yfEscape(s[0])+"</h3><p>"+yfEscape(s[2])+"</p></div></section>").join("");lastFocus=document.activeElement;modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");content.scrollTop=0;modal.querySelector(".modal-close")?.focus()}
function closeStory(){if(!modal||!modal.classList.contains("open"))return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");lastFocus?.focus?.()}
document.querySelectorAll("[data-story]").forEach(el=>el.addEventListener("click",()=>openStory(el.dataset.storyType,el.dataset.story)));document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeStory));document.addEventListener("keydown",e=>{if(e.key==="Escape")closeStory()});

const form=document.getElementById("buildForm");if(form){const params=new URLSearchParams(location.search);const layoutParam=params.get("layout");const layoutSelect=form.querySelector('[name="layout"]');const locked=form.querySelector('[data-layout-locked]');if(layoutParam&&layoutSelect){let option=[...layoutSelect.options].find(o=>o.value===layoutParam||o.textContent===layoutParam);if(!option){option=new Option(layoutParam,layoutParam);layoutSelect.add(option)}layoutSelect.value=layoutParam;layoutSelect.disabled=true;layoutSelect.classList.add("locked-layout");if(locked)locked.value=layoutParam}form.addEventListener("submit",event=>{event.preventDefault();const data=new FormData(form);const layout=layoutParam||data.get("layout");const subject=`Yoru Foundry Build Request — ${data.get("name")}`;const body=["YORU FOUNDRY BUILD REQUEST","",`Name: ${data.get("name")}`,`Email: ${data.get("email")}`,`Layout: ${layout}`,`Budget range: ${data.get("budget")}`,`Switch feel: ${data.get("feel")}`,`Sound preference: ${data.get("sound")}`,"","Build details:",data.get("details")||"No additional details provided."].join("\n");location.href=`mailto:hello@yorufoundry.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`})}
;(()=>{
  document.querySelectorAll(".site-footer .footer-links").forEach(f=>{if(!f.querySelector('[href="/archive.html"]'))f.insertAdjacentHTML("afterbegin",'<a href="/archive.html">Archive</a><a href="/why-yoru.html">Why Yoru</a><a href="/journal.html">Journal</a>')});
})();

;(()=>{
const options=compareOptions;
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





// Header cable LED: beads of copper light travel from the medallion to the first key, one after another,
// spiralling through the coil (dimmer behind a loop). Each bead reveals the glow render of the cable through a
// mask, so the light shows through the weave. Off for reduced motion and when the cable isn't shown.
;(()=>{
  const cable=document.querySelector(".site-header .cable");
  if(!cable||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const LED={"axis":43.1,"collar":19.6,"coil":[[0.0,43.1,1],[13.8,43.1,1],[27.2,44.7,0],[31.9,43.3,0],[32.6,46.5,0],[33.6,51.4,0],[34.6,53.1,1],[35.6,51.3,1],[36.6,46.2,1],[37.6,38.8,1],[38.6,30.1,1],[39.6,21.6,1],[40.6,14.5,1],[41.6,10.1,1],[42.5,9.1,1],[43.5,11.7,0],[44.5,17.5,0],[45.4,25.5,0],[46.4,34.3,0],[47.4,42.3,0],[48.3,48.2,0],[49.3,51.1,1],[50.2,50.5,1],[51.2,46.3,1],[52.1,39.3,1],[53.0,30.8,1],[53.9,22.2,1],[54.9,15.1,1],[55.8,10.7,1],[56.7,9.7,1],[57.6,12.1,0],[58.5,17.7,0],[59.4,25.6,0],[60.3,34.3,0],[61.2,42.5,0],[62.1,48.7,0],[63.0,52.0,0],[63.9,51.8,1],[64.9,48.2,1],[65.8,41.8,1],[66.7,33.5,1],[67.7,24.8,1],[68.6,17.0,1],[69.6,11.6,1],[70.5,9.3,1],[71.5,10.4,0],[72.5,14.8,0],[73.5,21.8,0],[74.5,30.3,0],[75.5,38.9,0],[76.5,46.4,0],[77.5,51.3,0],[78.6,52.8,1],[79.6,50.5,1],[80.7,45.1,1],[81.7,37.3,1],[82.8,28.6,1],[83.8,20.3,1],[84.9,14.0,1],[85.9,10.7,1],[86.9,11.0,0],[88.0,14.9,0],[89.0,21.7,0],[90.0,30.1,0],[91.0,38.8,0],[92.0,46.2,0],[92.9,51.2,0],[93.9,52.9,1],[94.8,51.1,1],[95.7,45.9,1],[96.6,38.3,1],[97.5,29.6,1],[98.5,21.2,1],[99.4,14.4,1],[100.2,10.3,1],[101.1,9.5,0],[102.0,12.2,0],[102.9,18.1,0],[103.8,26.1,0],[104.6,34.9,0],[105.5,42.9,0],[106.4,48.9,0],[107.3,52.0,0],[108.2,51.7,1],[109.1,48.1,1],[110.0,41.6,1],[110.9,33.3,1],[111.9,24.6,1],[112.8,16.9,1],[113.8,11.7,1],[114.8,9.8,1],[115.8,11.4,0],[116.8,16.4,0],[117.8,23.9,0],[118.8,32.6,0],[119.8,40.9,0],[120.9,47.5,0],[121.9,51.1,0],[122.9,51.1,1],[124.0,47.5,1],[125.0,41.1,1],[126.1,32.9,1],[127.1,24.1,1],[128.1,16.4,1],[129.2,10.9,1],[130.2,8.7,1],[131.2,10.0,0],[132.2,14.7,0],[133.2,21.9,0],[134.2,30.5,0],[135.1,39.1,0],[136.1,46.4,0],[137.1,51.3,0],[138.0,52.9,1],[139.0,50.9,1],[139.9,45.6,1],[140.9,37.9,1],[141.8,29.2,1],[142.8,20.9,1],[143.7,14.2,1],[144.6,10.4,1],[145.5,9.9,0],[146.4,12.9,0],[147.3,19.0,0],[148.2,27.1,0],[149.1,35.8,0],[150.0,43.7,0],[151.0,49.4,0],[151.9,52.0,0],[152.8,50.9,1],[153.8,46.4,1],[154.7,39.2,1],[155.6,30.5,1],[156.5,22.1,1],[157.5,15.3,1],[158.4,11.3,1],[159.4,10.7,0],[160.3,13.7,0],[161.3,19.6,0],[162.2,27.6,0],[163.2,36.4,0],[164.1,44.4,0],[165.1,50.2,0],[166.1,53.0,0],[167.1,52.3,1],[168.1,48.3,1],[169.0,41.7,1],[170.0,33.3,1],[171.0,24.6,1],[172.0,16.9,1],[173.0,11.4,1],[174.0,9.2,1],[175.1,10.6,0],[176.1,15.3,0],[177.1,22.6,0],[178.1,31.2,0],[179.2,39.7,0],[180.2,46.8,0],[181.2,51.3,0],[182.2,52.2,1],[183.2,49.6,1],[184.2,43.8,1],[185.2,35.9,1],[186.2,27.1,1],[187.2,19.0,1],[188.2,12.8,1],[189.2,9.8,1],[190.1,10.3,0],[191.1,14.5,0],[192.0,21.6,0],[192.9,30.1,0],[193.9,38.6,0],[194.5,42.4,0],[198.8,41.1,0],[212.2,43.1,1],[226.2,43.1,1],[226.2,43.1,1]]};                  // coil centreline in CSS px within the coil image, from mockups/keys/cable-export.py
  const SPEED=140,GAP=SPEED*1.4;      // px per second; px between beads (one every 1.4s)
  const [run1,coil,run2,plug]=cable.children,pieces=[run1,coil,run2],blooms=[];
  let route=null;
  function build(){
    const pts=[],line=(a,b)=>{for(let x=a;x<b;x+=3)pts.push([x,LED.axis,1])};
    line(0,run1.offsetLeft+run1.offsetWidth);
    if(coil.offsetWidth)for(const [x,y,v] of LED.coil)pts.push([coil.offsetLeft+x,y,v&&x>LED.collar&&x<coil.offsetWidth-LED.collar?1:0]);
    if(run2.offsetWidth)line(run2.offsetLeft,run2.offsetLeft+run2.offsetWidth);
    pts.push([plug.offsetLeft+6,LED.axis,0]);   // the light ends where the plug meets the key
    const len=[0];for(let i=1;i<pts.length;i++)len.push(len[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
    route=cable.offsetWidth?{pts,len}:null;
  }
  build();addEventListener("resize",build);
  const t0=performance.now();
  (function frame(now){
    if(route){
      const total=route.len[route.len.length-1],n=Math.ceil((total+GAP)/GAP),masks=pieces.map(()=>[]);
      while(blooms.length<n){const b=document.createElement("span");b.className="bead";cable.appendChild(b);blooms.push(b)}
      blooms.forEach((b,k)=>{
        const s=((now-t0)/1000*SPEED-k*GAP)%(n*GAP);
        if(k>=n||s<0||s>total){b.style.opacity=0;return}
        const i=Math.max(1,route.len.findIndex(l=>l>=s)),[ax,ay,av]=route.pts[i-1],[bx,by,bv]=route.pts[i];
        const f=(s-route.len[i-1])/(route.len[i]-route.len[i-1]||1),x=ax+(bx-ax)*f,y=ay+(by-ay)*f;
        const a=(av&&bv?1:0.25)*Math.min(1,s/30,(total-s)/30);   // dim behind a loop; ease in and out at the ends
        b.style.transform="translate("+x+"px,"+y+"px)";b.style.opacity=a;
        pieces.forEach((p,j)=>{const lx=x-p.offsetLeft;if(p.offsetWidth&&lx>-24&&lx<p.offsetWidth+24)masks[j].push("radial-gradient(22px 16px at "+lx+"px "+y+"px,rgba(0,0,0,"+a+"),rgba(0,0,0,0))")});
      });
      pieces.forEach((p,j)=>{const g=p.firstElementChild,v=masks[j].length?masks[j].join(","):"linear-gradient(transparent,transparent)";g.style.maskImage=v;g.style.webkitMaskImage=v});
    }
    requestAnimationFrame(frame);
  })(t0);
})();
