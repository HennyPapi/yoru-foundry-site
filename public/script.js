const menuButton=document.querySelector(".menu-toggle");const nav=document.querySelector(".nav");menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open))});document.querySelectorAll(".nav>a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false")}));const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();

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
const modal=document.getElementById("storyModal");const title=document.getElementById("storyTitle");const intro=document.getElementById("storyIntro");const content=document.getElementById("storyContent");
function openStory(type,id){const story=stories[type]?.[id];if(!story||!modal)return;title.textContent=story.title;intro.textContent=story.intro;content.innerHTML=story.steps.map((s,i)=>`<section class="story-row ${i%2?"reverse":""}"><div class="story-media">${s[1]}</div><div class="story-copy"><p class="eyebrow">STEP 0${i+1}</p><h3>${s[0]}</h3><p>${s[2]}</p></div></section>`).join("");modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");content.scrollTop=0}
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
;(()=>{document.querySelectorAll("img.brand-mark").forEach(img=>{img.src="/assets/yoru-emblem.webp";img.removeAttribute("srcset")})})();
;(()=>{document.querySelectorAll("img.brand-mark").forEach(img=>{img.src="/assets/yoru-emblem-header.png";img.removeAttribute("srcset");img.style.display="block";img.style.opacity="1";});})();
;(()=>{
  document.querySelectorAll('a[href="/request-a-build.html"]').forEach(a=>{
    if(a.textContent.trim()==="Request a Build") a.textContent="Request a Commission";
  });
})();
;(()=>{
  document.querySelectorAll('img.brand-mark').forEach(img=>{
    img.src='/assets/yoru-emblem-official.webp';
    img.removeAttribute('srcset');
  });
  let icon=document.querySelector('link[rel="icon"]');
  if(!icon){
    icon=document.createElement('link');
    icon.rel='icon';
    document.head.appendChild(icon);
  }
  icon.href='/assets/favicon.png';
  icon.type='image/png';
})();
;(()=>{
  /* Stop legacy logo swaps from controlling the visible mark.
     The visible header logo is now the CSS-embedded .brand background. */
  document.querySelectorAll('.brand-mark').forEach(img=>{
    img.setAttribute('aria-hidden','true');
    img.style.display='none';
  });

  /* Inline favicon from the verified uploaded mark so bookmarks don't depend on asset routing. */
  let icon=document.querySelector('link[rel="icon"]');
  if(!icon){
    icon=document.createElement('link');
    icon.rel='icon';
    document.head.appendChild(icon);
  }
  icon.type='image/png';
  icon.href='data:image/png;base64,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';

  document.querySelectorAll('a.nav-cta').forEach(a=>{
    a.textContent='Request a Commission';
  });
})();