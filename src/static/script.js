const menuButton=document.querySelector(".menu-toggle");const nav=document.querySelector(".nav");menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));if(open)nav.querySelector("a")?.focus()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav?.classList.contains("open")){nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.focus()}});document.querySelectorAll(".nav>a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false")}));const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();

/* Phase 2 — content architecture */
const yoruContent=window.YORU_CONTENT||{};
const siteMode=yoruContent.SITE_MODE||"prelaunch";
const siteModeContent=(yoruContent.SITE_MODE_CONTENT||{})[siteMode]||(yoruContent.SITE_MODE_CONTENT||{}).prelaunch||{};
const builds=Array.isArray(yoruContent.BUILDS)?yoruContent.BUILDS:[];
const stories=yoruContent.STORIES||{};
const compareOptions=yoruContent.COMPARE_OPTIONS||{};
document.documentElement.dataset.siteMode=siteMode;
function yfEscape(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]))}
function yfApplySiteMode(){
  document.querySelectorAll("[data-site-footer-status]").forEach(line=>{line.textContent=siteModeContent.footerStatus||"Built one at a time."});
}
function yfShowRecord(){   // commission.html carries every published record; show the one named by ?id=
  const records=[...document.querySelectorAll("[data-record]")];
  if(!records.length)return;
  const id=new URLSearchParams(location.search).get("id");
  const match=id&&records.find(r=>r.dataset.record===id);
  if(!id)return;
  records.forEach(r=>{r.hidden=r!==(match||records.find(x=>x.dataset.record==="none"))});
  if(match)document.title=id+" | Yoru Foundry";
}
yfApplySiteMode();

yfShowRecord();



const modal=document.getElementById("storyModal");const title=document.getElementById("storyTitle");const intro=document.getElementById("storyIntro");const content=document.getElementById("storyContent");
let lastFocus=null;
function yfMedia(src,label){   // same rules as build.js mediaInner: video, photo, or an honest label
  if(!src||/placeholder|silence/.test(src))return "<span>"+yfEscape(label)+"</span>";
  if(/\.(mp4|webm)$/i.test(src))return '<video src="'+yfEscape(src)+'" muted loop playsinline preload="metadata" data-autoplay aria-label="'+yfEscape(label)+'"></video>';
  return '<img src="'+yfEscape(src)+'" alt="'+yfEscape(label)+'" loading="lazy" decoding="async">';
}
function openStory(type,id){const story=stories[type]?.[id];if(!story||!modal)return;title.textContent=story.title;intro.textContent=story.intro;content.innerHTML=story.steps.map((s,i)=>"<section class=\"guide-step\"><div class=\"guide-media\">"+yfMedia(s[3],s[1])+"</div><div class=\"guide-copy\"><h3>"+yfEscape(s[0])+"</h3><p>"+yfEscape(s[2])+"</p></div></section>").join("");lastFocus=document.activeElement;modal.classList.add("open");yfVideos(content);modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");content.scrollTop=0;modal.querySelector(".modal-close")?.focus()}
function closeStory(){if(!modal||!modal.classList.contains("open"))return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");lastFocus?.focus?.()}
document.querySelectorAll("[data-story]").forEach(el=>el.addEventListener("click",()=>openStory(el.dataset.storyType,el.dataset.story)));document.querySelectorAll("[data-close-modal]").forEach(el=>el.addEventListener("click",closeStory));document.addEventListener("keydown",e=>{if(e.key==="Escape")closeStory()});

const form=document.getElementById("buildForm");if(form){const params=new URLSearchParams(location.search);const layoutParam=params.get("layout");const layoutSelect=form.querySelector('[name="layout"]');const locked=form.querySelector('[data-layout-locked]');if(layoutParam&&layoutSelect){let option=[...layoutSelect.options].find(o=>o.value===layoutParam||o.textContent===layoutParam);if(!option){option=new Option(layoutParam,layoutParam);layoutSelect.add(option)}layoutSelect.value=layoutParam;layoutSelect.disabled=true;layoutSelect.classList.add("locked-layout");if(locked)locked.value=layoutParam}const mailDraft=(data,layout)=>{const subject=`Yoru Foundry Build Request — ${data.get("name")}`;const body=["YORU FOUNDRY BUILD REQUEST","",`Name: ${data.get("name")}`,`Email: ${data.get("email")}`,`Layout: ${layout}`,`Budget range: ${data.get("budget")}`,`Switch feel: ${data.get("feel")}`,"","Build details:",data.get("details")||"No additional details provided.",...(data.get("spec")?["","Exact spec:",data.get("spec")]:[])].join("\n");location.href=`mailto:hello@yorufoundry.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`};const show=id=>{for(const p of form.querySelectorAll(".form-status"))p.classList.toggle("is-shown",p.id===id)};form.addEventListener("submit",async event=>{event.preventDefault();const data=new FormData(form);const layout=layoutParam||data.get("layout");data.set("layout",layout);const button=form.querySelector('[type="submit"]');if(button)button.disabled=true;show("");try{const res=await fetch(form.action,{method:"POST",body:data,headers:{accept:"application/json"}});if(res.ok){form.reset();if(layoutParam&&layoutSelect)layoutSelect.value=layoutParam;show("sent");return}if(res.status===400||res.status===403){show("send-failed");return}}catch{}finally{if(button)button.disabled=false}/* endpoint missing or email not set up yet: open the mail draft, so nothing is lost */mailDraft(data,layout)})}
;(()=>{
  // Footer keyboard: the linked keys' underglow rises once when the board is half in view (at once with reduced motion)
  const board=document.querySelector(".site-footer .kb-board");if(!board)return;
  const still=matchMedia("(prefers-reduced-motion: reduce)").matches,canWatch="IntersectionObserver" in window;
  const lightUp=()=>board.classList.add("lit");
  // homepage: the hub's display fades on as it comes into view
  const hub=document.querySelector("[data-hub]"),art=hub&&hub.querySelector(".hub-art");
  // the hub's cable ends under the keyboard: clip the drawing just inside the board's top edge so no cable shows past it
  const clipCable=()=>{if(!art)return;art.style.clipPath="";const a=art.getBoundingClientRect(),b=board.getBoundingClientRect();if(!a.width||!b.width)return;const cut=a.bottom-(b.top+b.height*.12);if(cut>0)art.style.clipPath=`inset(0 0 ${cut}px 0)`};
  if(art){clipCable();addEventListener("resize",clipCable);addEventListener("load",clipCable)}
  if(hub){if(still||!canWatch)hub.classList.add("on");else new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){hub.classList.add("on");o.disconnect()}},{threshold:.5}).observe(hub)}
  // homepage: copper light runs down inside the hub's cable once, following the scroll going down (never back up):
  // a bright head with a long soft tail, easing toward the scroll position; at the keyboard the keys light and the
  // cable's light fades out
  if(art&&!still&&getComputedStyle(art).display!=="none"){
    const svg=art.querySelector(".hub-led"),route=svg.querySelector(".hub-route"),pulse=[...svg.querySelectorAll(".hub-pulse")];
    const glowImg=svg.querySelector(".hub-light");glowImg.setAttribute("href",glowImg.dataset.href);   // only fetched when the cable light runs
    const total=route.getTotalLength(),LEN={p1:70,p2:150,p3:260};let end=total,target=0,cur=0,done=false,raf=0,idle=0;
    const scale=()=>art.getBoundingClientRect().width/svg.viewBox.baseVal.width;
    const pageY=l=>art.getBoundingClientRect().top+scrollY+route.getPointAtLength(l).y*scale();
    const measure=()=>{const r=board.getBoundingClientRect(),top=r.top+scrollY+r.height*.07;end=total;for(let l=0;l<=total;l+=4)if(pageY(l)>=top){end=l;break}};
    const seg=(el,len,b)=>{el.style.strokeDasharray=`${len} 100000`;el.style.strokeDashoffset=`${len-b}`};
    const step=()=>{
      raf=0;cur+=(target-cur)*.14;if(target-cur<1)cur=target;
      pulse.forEach(el=>seg(el,LEN[el.classList[1]],cur));
      if(cur>=end-1){done=true;svg.classList.add("done");lightUp();return}
      if(cur<target)raf=requestAnimationFrame(step);
    };
    const ride=()=>{
      if(done)return;
      const vh=innerHeight,start=pageY(0)-vh*.85,stop=Math.min(document.documentElement.scrollHeight-vh,pageY(end)-vh*.3);
      const b=Math.max(0,Math.min(1,(scrollY-start)/Math.max(1,stop-start)))*end;
      if(b>target){target=b;if(!raf)raf=requestAnimationFrame(step);svg.classList.remove("idle");clearTimeout(idle);idle=setTimeout(()=>svg.classList.add("idle"),700)}
    };
    measure();addEventListener("resize",()=>{measure();ride()});addEventListener("load",()=>{measure();ride()});
    addEventListener("scroll",ride,{passive:true});ride();
    return;
  }
  if(still||!canWatch){lightUp();return}
  new IntersectionObserver((entries,obs)=>{if(entries[0].isIntersecting){lightUp();obs.disconnect()}},{threshold:.5}).observe(board);
})();

;(()=>{
const options=compareOptions;
function fill(side){
 const type=document.getElementById("compareType"+side),opt=document.getElementById("compareOption"+side),desc=document.getElementById("compareDesc"+side);if(!type||!opt)return;
 const list=options[type.value]||[];opt.innerHTML=list.map((x,i)=>'<option value="'+i+'">'+x[0]+'</option>').join("");
 opt.value=String(side==="B"?Math.min(1,list.length-1):0);   // the two sides start on different options
 const title=opt.closest(".ab-side")?.querySelector(".sound-player-copy strong");
 const render=()=>{const item=list[Number(opt.value)];desc.textContent=item?.[1]||"";if(title&&item)title.textContent=item[0]};opt.onchange=render;render();
}
["A","B"].forEach(side=>{const type=document.getElementById("compareType"+side);if(type){type.onchange=()=>fill(side);fill(side)}})
})();







// Header cable LED: pulses of copper light travel from the medallion to the first key, one after another,
// spiralling through the coil (dimmer behind a loop). Like the homepage hub cable, each pulse is light inside the
// braid only (a bright core with a quick soft falloff behind it), revealed from the cable's glow render through a
// mask. Off for reduced motion and when the cable isn't shown.
;(()=>{
  const header=document.querySelector(".site-header"),cable=header&&header.querySelector(".cable");
  const light=()=>header&&header.classList.add("lit");   // the keys glow once the LED reaches them
  if(!cable||matchMedia("(prefers-reduced-motion: reduce)").matches){light();return}
  const LED={"axis":42.4,"collar":19.6,"coil":[[0.0,42.4,1],[13.8,42.4,1],[27.2,44.0,0],[31.9,42.6,0],[32.6,45.8,0],[33.6,50.7,0],[34.6,52.4,1],[35.6,50.5,1],[36.6,45.5,1],[37.6,38.0,1],[38.6,29.4,1],[39.6,20.9,1],[40.6,13.8,1],[41.6,9.4,1],[42.5,8.3,1],[43.5,11.0,0],[44.5,16.8,0],[45.4,24.8,0],[46.4,33.6,0],[47.4,41.6,0],[48.3,47.5,0],[49.3,50.4,1],[50.2,49.8,1],[51.2,45.6,1],[52.1,38.6,1],[53.0,30.0,1],[53.9,21.5,1],[54.9,14.4,1],[55.8,10.0,1],[56.7,9.0,1],[57.6,11.4,0],[58.5,17.0,0],[59.4,24.8,0],[60.3,33.6,0],[61.2,41.8,0],[62.1,48.0,0],[63.0,51.3,0],[63.9,51.1,1],[64.9,47.5,1],[65.8,41.1,1],[66.7,32.8,1],[67.7,24.1,1],[68.6,16.3,1],[69.6,10.9,1],[70.5,8.6,1],[71.5,9.7,0],[72.5,14.1,0],[73.5,21.1,0],[74.5,29.6,0],[75.5,38.2,0],[76.5,45.7,0],[77.5,50.6,0],[78.6,52.0,1],[79.6,49.8,1],[80.7,44.3,1],[81.7,36.6,1],[82.8,27.9,1],[83.8,19.6,1],[84.9,13.3,1],[85.9,9.9,1],[86.9,10.3,0],[88.0,14.2,0],[89.0,21.0,0],[90.0,29.4,0],[91.0,38.0,0],[92.0,45.5,0],[92.9,50.5,0],[93.9,52.2,1],[94.8,50.3,1],[95.7,45.2,1],[96.6,37.6,1],[97.5,28.9,1],[98.5,20.5,1],[99.4,13.7,1],[100.2,9.6,1],[101.1,8.8,0],[102.0,11.5,0],[102.9,17.4,0],[103.8,25.4,0],[104.6,34.1,0],[105.5,42.2,0],[106.4,48.2,0],[107.3,51.3,0],[108.2,51.0,1],[109.1,47.3,1],[110.0,40.9,1],[110.9,32.6,1],[111.9,23.9,1],[112.8,16.2,1],[113.8,11.0,1],[114.8,9.0,1],[115.8,10.7,0],[116.8,15.7,0],[117.8,23.2,0],[118.8,31.9,0],[119.8,40.2,0],[120.9,46.8,0],[121.9,50.4,0],[122.9,50.4,1],[124.0,46.8,1],[125.0,40.4,1],[126.1,32.1,1],[127.1,23.4,1],[128.1,15.7,1],[129.2,10.2,1],[130.2,8.0,1],[131.2,9.3,0],[132.2,14.0,0],[133.2,21.2,0],[134.2,29.8,0],[135.1,38.4,0],[136.1,45.7,0],[137.1,50.6,0],[138.0,52.2,1],[139.0,50.2,1],[139.9,44.9,1],[140.9,37.2,1],[141.8,28.5,1],[142.8,20.2,1],[143.7,13.5,1],[144.6,9.6,1],[145.5,9.1,0],[146.4,12.2,0],[147.3,18.3,0],[148.2,26.4,0],[149.1,35.1,0],[150.0,43.0,0],[151.0,48.7,0],[151.9,51.3,0],[152.8,50.2,1],[153.8,45.7,1],[154.7,38.5,1],[155.6,29.8,1],[156.5,21.4,1],[157.5,14.6,1],[158.4,10.6,1],[159.4,10.0,0],[160.3,12.9,0],[161.3,18.9,0],[162.2,26.9,0],[163.2,35.7,0],[164.1,43.7,0],[165.1,49.5,0],[166.1,52.3,0],[167.1,51.6,1],[168.1,47.6,1],[169.0,41.0,1],[170.0,32.6,1],[171.0,23.9,1],[172.0,16.2,1],[173.0,10.7,1],[174.0,8.5,1],[175.1,9.9,0],[176.1,14.6,0],[177.1,21.9,0],[178.1,30.5,0],[179.2,39.0,0],[180.2,46.1,0],[181.2,50.5,0],[182.2,51.5,1],[183.2,48.9,1],[184.2,43.1,1],[185.2,35.2,1],[186.2,26.4,1],[187.2,18.3,1],[188.2,12.1,1],[189.2,9.0,1],[190.1,9.6,0],[191.1,13.8,0],[192.0,20.9,0],[192.9,29.4,0],[193.9,37.9,0],[194.5,41.7,0],[198.8,40.4,0],[212.2,42.4,1],[226.2,42.4,1],[226.2,42.4,1]]};                  // coil centreline in CSS px within the coil image, from mockups/keys/cable-export.py
  const SPEED=140,GAP=SPEED*1.4;      // px per second; px between beads (one every 1.4s)
  const [run1,coil,run2,plug]=cable.children,pieces=[run1,coil,run2],CORE=16,FALL=70;
  let route=null;
  function build(){
    const pts=[],line=(a,b)=>{for(let x=a;x<b;x+=3)pts.push([x,LED.axis,1])};
    line(0,run1.offsetLeft+run1.offsetWidth);
    if(coil.offsetWidth)for(const [x,y,v] of LED.coil)pts.push([coil.offsetLeft+x,y,v&&x>LED.collar&&x<coil.offsetWidth-LED.collar?1:0]);
    if(run2.offsetWidth)line(run2.offsetLeft,run2.offsetLeft+run2.offsetWidth);
    pts.push([plug.offsetLeft+6,LED.axis,0]);   // the light ends where the plug meets the key
    const len=[0];for(let i=1;i<pts.length;i++)len.push(len[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
    route=cable.offsetWidth?{pts,len}:null;
    if(!route)light();   // no cable on this screen size: the keys are simply lit
  }
  build();addEventListener("resize",build);
  const t0=performance.now();
  (function frame(now){
    if(route){
      const total=route.len[route.len.length-1],n=Math.ceil((total+GAP)/GAP),masks=pieces.map(()=>[]);
      if((now-t0)/1000*SPEED>=total)light();
      const at=d=>{d=Math.max(0,Math.min(total,d));const i=Math.max(1,route.len.findIndex(l=>l>=d)),[ax,ay,av]=route.pts[i-1],[bx,by,bv]=route.pts[i];
        const f=(d-route.len[i-1])/(route.len[i]-route.len[i-1]||1);return [ax+(bx-ax)*f,ay+(by-ay)*f,av&&bv?1:0.25]};
      for(let k=0;k<n;k++){
        const s=((now-t0)/1000*SPEED-k*GAP)%(n*GAP);
        if(s<0||s>total+FALL)continue;
        for(let d=0;d<=FALL;d+=5){                       // samples from the head back along the cable
          if(s-d<0||s-d>total)continue;
          const [x,y,v]=at(s-d),fall=d<CORE?1:Math.pow(1-(d-CORE)/(FALL-CORE),1.6);
          const a=(v*fall*Math.min(1,(s-d)/30,(total-(s-d))/30)).toFixed(3);   // dim behind a loop; ease in and out at the ends
          pieces.forEach((p,j)=>{const lx=x-p.offsetLeft;if(p.offsetWidth&&lx>-12&&lx<p.offsetWidth+12)masks[j].push("radial-gradient(9px 9px at "+lx.toFixed(1)+"px "+y.toFixed(1)+"px,rgba(0,0,0,"+a+"),rgba(0,0,0,0))")});
        }
      }
      pieces.forEach((p,j)=>{const g=p.querySelector(".glow"),v=masks[j].length?masks[j].join(","):"linear-gradient(transparent,transparent)";g.style.maskImage=v;g.style.webkitMaskImage=v});
    }
    requestAnimationFrame(frame);
  })(t0);
})();


// Silent looping videos (hero, guide steps) play on their own, except with reduced motion: then they stay on
// their first frame with controls, so nothing moves unless the visitor asks.
function yfVideos(root){
  const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  (root||document).querySelectorAll("video[data-autoplay]").forEach(v=>{v.muted=true;if(still){v.controls=true}else{v.play().catch(()=>{v.controls=true})}});
}
yfVideos();
