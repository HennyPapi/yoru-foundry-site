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
  const LED={"axis":42.4,"collar":19.6,"coil":[[0.0,42.4,1],[13.8,42.4,1],[27.2,44.0,0],[31.9,42.6,0],[32.6,45.8,0],[33.6,50.7,0],[34.6,52.4,1],[35.6,50.5,1],[36.6,45.5,1],[37.6,38.0,1],[38.6,29.4,1],[39.6,20.9,1],[40.6,13.8,1],[41.6,9.4,1],[42.5,8.3,1],[43.5,11.0,0],[44.5,16.8,0],[45.4,24.8,0],[46.4,33.6,0],[47.4,41.6,0],[48.3,47.5,0],[49.3,50.4,1],[50.2,49.8,1],[51.2,45.6,1],[52.1,38.6,1],[53.0,30.0,1],[53.9,21.5,1],[54.9,14.4,1],[55.8,10.0,1],[56.7,9.0,1],[57.6,11.4,0],[58.5,17.0,0],[59.4,24.8,0],[60.3,33.6,0],[61.2,41.8,0],[62.1,48.0,0],[63.0,51.3,0],[63.9,51.1,1],[64.9,47.5,1],[65.8,41.1,1],[66.7,32.8,1],[67.7,24.1,1],[68.6,16.3,1],[69.6,10.9,1],[70.5,8.6,1],[71.5,9.7,0],[72.5,14.1,0],[73.5,21.1,0],[74.5,29.6,0],[75.5,38.2,0],[76.5,45.7,0],[77.5,50.6,0],[78.6,52.0,1],[79.6,49.8,1],[80.7,44.3,1],[81.7,36.6,1],[82.8,27.9,1],[83.8,19.6,1],[84.9,13.3,1],[85.9,9.9,1],[86.9,10.3,0],[88.0,14.2,0],[89.0,21.0,0],[90.0,29.4,0],[91.0,38.0,0],[92.0,45.5,0],[92.9,50.5,0],[93.9,52.2,1],[94.8,50.3,1],[95.7,45.2,1],[96.6,37.6,1],[97.5,28.9,1],[98.5,20.5,1],[99.4,13.7,1],[100.2,9.6,1],[101.1,8.8,0],[102.0,11.5,0],[102.9,17.4,0],[103.8,25.4,0],[104.6,34.1,0],[105.5,42.2,0],[106.4,48.2,0],[107.3,51.3,0],[108.2,51.0,1],[109.1,47.3,1],[110.0,40.9,1],[110.9,32.6,1],[111.9,23.9,1],[112.8,16.2,1],[113.8,11.0,1],[114.8,9.0,1],[115.8,10.7,0],[116.8,15.7,0],[117.8,23.2,0],[118.8,31.9,0],[119.8,40.2,0],[120.9,46.8,0],[121.9,50.4,0],[122.9,50.4,1],[124.0,46.8,1],[125.0,40.4,1],[126.1,32.1,1],[127.1,23.4,1],[128.1,15.7,1],[129.2,10.2,1],[130.2,8.0,1],[131.2,9.3,0],[132.2,14.0,0],[133.2,21.2,0],[134.2,29.8,0],[135.1,38.4,0],[136.1,45.7,0],[137.1,50.6,0],[138.0,52.2,1],[139.0,50.2,1],[139.9,44.9,1],[140.9,37.2,1],[141.8,28.5,1],[142.8,20.2,1],[143.7,13.5,1],[144.6,9.6,1],[145.5,9.1,0],[146.4,12.2,0],[147.3,18.3,0],[148.2,26.4,0],[149.1,35.1,0],[150.0,43.0,0],[151.0,48.7,0],[151.9,51.3,0],[152.8,50.2,1],[153.8,45.7,1],[154.7,38.5,1],[155.6,29.8,1],[156.5,21.4,1],[157.5,14.6,1],[158.4,10.6,1],[159.4,10.0,0],[160.3,12.9,0],[161.3,18.9,0],[162.2,26.9,0],[163.2,35.7,0],[164.1,43.7,0],[165.1,49.5,0],[166.1,52.3,0],[167.1,51.6,1],[168.1,47.6,1],[169.0,41.0,1],[170.0,32.6,1],[171.0,23.9,1],[172.0,16.2,1],[173.0,10.7,1],[174.0,8.5,1],[175.1,9.9,0],[176.1,14.6,0],[177.1,21.9,0],[178.1,30.5,0],[179.2,39.0,0],[180.2,46.1,0],[181.2,50.5,0],[182.2,51.5,1],[183.2,48.9,1],[184.2,43.1,1],[185.2,35.2,1],[186.2,26.4,1],[187.2,18.3,1],[188.2,12.1,1],[189.2,9.0,1],[190.1,9.6,0],[191.1,13.8,0],[192.0,20.9,0],[192.9,29.4,0],[193.9,37.9,0],[194.5,41.7,0],[198.8,40.4,0],[212.2,42.4,1],[226.2,42.4,1],[226.2,42.4,1]]};                  // coil centreline in CSS px within the coil image, from mockups/keys/cable-export.py
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
