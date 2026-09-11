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