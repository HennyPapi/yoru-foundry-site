const SITE_MODE = "__SITE_MODE__"; // "prelaunch" | "live"

const SITE_MODE_CONTENT = {
  prelaunch: {
    heroEyebrow: "YORU FOUNDRY / EST. 2026",
    heroCta: { label: "Explore Crafted Art", href: "/crafted-art.html" },
    heroStatus: "Currently accepting commissions",
    footerStatus: "Built one at a time in Miami."
  },
  live: {
    heroEyebrow: "YORU FOUNDRY / EST. 2026",
    heroCta: { label: "Explore Crafted Art", href: "/crafted-art.html" },
    heroStatus: "Currently accepting commissions",
    footerStatus: "Commission-built one at a time • I document each finished build after tuning, testing, and photography."
  }
};

const BUILDS = [
  {
    id: "YF-001",
    name: "Commission Documentation Study 001",
    status: "placeholder",
    date: "PRELAUNCH DOCUMENTATION SLOT",
    layout: "75%",
    home: {
      heroCaption: "Placeholder for cinematic macro photography or a slow build video loop",
      heroSpecs: ["CNC ALUMINUM", "GASKET MOUNT", "HAND TUNED"],
      featuredMediaLabel: "Placeholder — full-width editorial build photography",
      featuredEyebrow: "FEATURED COMMISSION • YF-001",
      featuredHeading: "Built around a feeling, not a parts list.",
      featuredBody: "This placeholder commission demonstrates how future Yoru builds will be presented: the customer's goal, material choices, sound direction, layout, and the decisions that shaped the final result.",
      featuredSpecs: [
        { label: "Layout", value: "75%" },
        { label: "Sound", value: "Ember" },
        { label: "Case", value: "Aluminum" },
        { label: "Mount", value: "Gasket" }
      ],
      featuredHref: "/commission-yf-001.html",
      featuredLinkLabel: "View Commission YF-001 →"
    },
    summary: "Reserved archive entry showing the final card density, media proportions, and specification hierarchy a completed commission will use.",
    heroImage: "/img/placeholder-16x9.svg",
    images: ["/img/placeholder-4x5.svg"],
    detailImages: ["/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg"],
    audio: null,
    specs: {
      case: "CNC 6063 ALUMINUM, ANODIZED",
      plate: "POLYCARBONATE, 1.5MM",
      switches: "GATERON OIL KING, 205G0",
      lube: "KRYTOX 205G0 / XHT-BDZ",
      keycaps: "DOUBLE-SHOT PBT, CHERRY PROFILE",
      mount: "GASKET MOUNT, MEDIUM FIRM"
    },
    notes: "This prelaunch record intentionally uses production-length copy and specifications so the final archive can accept a real photographed commission without changing the layout.",
    processNotes: "When this slot becomes a real commission, I will document the tuning decisions, acoustic changes, corrections, and final quality-control pass here using the same structure."
  },
  {
    id: "YF-002",
    name: "Commission Documentation Study 002",
    status: "placeholder",
    date: "PRELAUNCH DOCUMENTATION SLOT",
    layout: "75%",
    summary: "A second reserved build record used to validate how longer component names and detailed specifications wrap inside the finished archive system.",
    heroImage: "/img/placeholder-16x9.svg",
    images: ["/img/placeholder-4x5.svg"],
    detailImages: ["/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg"],
    audio: null,
    specs: {
      case: "CNC ALUMINUM, FINE BEAD-BLASTED",
      plate: "FR4 FULL PLATE, 1.6MM",
      switches: "HMX XINHAI, FACTORY LUBED",
      lube: "TRIBOSYS 3204 / XHT-BDZ",
      keycaps: "DYE-SUB PBT, CHERRY PROFILE",
      mount: "TOP MOUNT, CONTROLLED FIRMNESS"
    },
    notes: "This placeholder tests realistic production-length metadata instead of short labels, preventing later content from changing card heights or breaking the archive grid.",
    processNotes: "The finished version will explain what I changed during preparation and tuning, why those adjustments were made, and what I verified before the build left the bench."
  },
  {
    id: "YF-003",
    name: "Commission Documentation Study 003",
    status: "placeholder",
    date: "PRELAUNCH DOCUMENTATION SLOT",
    layout: "75%",
    summary: "Reserved for a future documented commission while preserving the exact four-by-five image frame and long-form specification footprint now.",
    heroImage: "/img/placeholder-16x9.svg",
    images: ["/img/placeholder-4x5.svg"],
    detailImages: ["/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg"],
    audio: null,
    specs: {
      case: "CNC 6063 ALUMINUM, E-COATED",
      plate: "ALUMINUM HALF PLATE, 1.5MM",
      switches: "GATERON INK BLACK V2, 205G0",
      lube: "KRYTOX 205G0 / GPL 105",
      keycaps: "DOUBLE-SHOT ABS, CHERRY PROFILE",
      mount: "GASKET MOUNT, SOFT ISOLATION"
    },
    notes: "The content here is intentionally honest placeholder copy rather than a fabricated customer story, while still occupying the space expected from a finished editorial record.",
    processNotes: "A future real build can replace this record by changing only this data object, including media paths, status, specifications, sound file, and documented process notes."
  },
  {
    id: "YF-004",
    name: "Commission Documentation Study 004",
    status: "placeholder",
    date: "PRELAUNCH DOCUMENTATION SLOT",
    layout: "75%",
    summary: "A reserved archive slot for testing the visual rhythm of multiple completed commissions before any real photography or finished customer work exists.",
    heroImage: "/img/placeholder-16x9.svg",
    images: ["/img/placeholder-4x5.svg"],
    detailImages: ["/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg"],
    audio: null,
    specs: {
      case: "CNC ALUMINUM, SATIN ANODIZED",
      plate: "POLYCARBONATE FULL PLATE, 1.5MM",
      switches: "WS MORANDI LINEAR, HAND CHECKED",
      lube: "KRYTOX 205G0 / GPL 105",
      keycaps: "THICK PBT, CHERRY PROFILE",
      mount: "GASKET MOUNT, BALANCED RESPONSE"
    },
    notes: "This study keeps the archive visually complete during prelaunch without pretending that a commissioned keyboard has already been completed or photographed.",
    processNotes: "Once replaced by real work, this section will carry the build-specific decisions that affected feel, resonance, consistency, and the final result."
  },
  {
    id: "YF-005",
    name: "Commission Documentation Study 005",
    status: "placeholder",
    date: "PRELAUNCH DOCUMENTATION SLOT",
    layout: "75%",
    summary: "A neutral prelaunch entry proving that long technical values remain readable on desktop, tablet, and mobile before production media is available.",
    heroImage: "/img/placeholder-16x9.svg",
    images: ["/img/placeholder-4x5.svg"],
    detailImages: ["/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg"],
    audio: null,
    specs: {
      case: "CNC ALUMINUM, HARD ANODIZED",
      plate: "CARBON FIBER FULL PLATE, 1.5MM",
      switches: "LONG-POLE LINEAR, HAND LUBED",
      lube: "TRIBOSYS 3204 / GPL 105",
      keycaps: "DOUBLE-SHOT PBT, SCULPTED PROFILE",
      mount: "ISOLATED GASKET, MEDIUM FIRM"
    },
    notes: "The archive card, detail page, and audio area all read from this single object so later launch content does not require duplicating markup across the site.",
    processNotes: "Real documentation will use this same field for concrete observations from assembly, sound testing, corrections, and the final inspection."
  },
  {
    id: "YF-006",
    name: "Commission Documentation Study 006",
    status: "placeholder",
    date: "PRELAUNCH DOCUMENTATION SLOT",
    layout: "75%",
    summary: "The final reserved prelaunch slot gives the archive enough density to test scrolling, card alignment, filtering, and future pagination decisions.",
    heroImage: "/img/placeholder-16x9.svg",
    images: ["/img/placeholder-4x5.svg"],
    detailImages: ["/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg", "/img/placeholder-1x1.svg"],
    audio: null,
    specs: {
      case: "CNC 6063 ALUMINUM, MATTE FINISH",
      plate: "FR4 HALF PLATE, FLEX-CUT",
      switches: "GATERON OIL KING, 205G0",
      lube: "KRYTOX 205G0 / XHT-BDZ",
      keycaps: "DYE-SUB PBT, CHERRY PROFILE",
      mount: "GASKET MOUNT, TUNED ISOLATION"
    },
    notes: "This placeholder is intentionally the same content shape a completed build will use, including media, audio, specifications, summary, and process notes.",
    processNotes: "When a real commission takes this slot, I can replace the values here and move its status out of placeholder without touching the page templates."
  }
];

const SOUND_SAMPLES = [
  {
    name: "Reference A — Untuned Baseline",
    file: "/audio/silence-3s.mp3",
    description: "Three-second silent placeholder used to validate player sizing, controls, spacing, and metadata before standardized keyboard recordings exist."
  },
  {
    name: "Reference B — Tuned Stabilizer",
    file: "/audio/silence-3s.mp3",
    description: "Three-second silent placeholder preserving the production-length description and player footprint for a future matched stabilizer comparison."
  },
  {
    name: "Reference C — Material Comparison",
    file: "/audio/silence-3s.mp3",
    description: "Three-second silent placeholder reserved for a controlled plate, switch, or keycap comparison recorded with the same microphone and desk setup."
  }
];

const STORIES = {
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

const COMPARE_OPTIONS = {
stabilizer:[["Untuned","Natural wire rattle, tick and unevenness before correction."],["Tuned","Balanced, lubricated and checked for cleaner large-key behavior."]],
switchlube:[["Stock","Factory or dry feel, depending on the switch."],["Hand Lubed","Reduced friction and a more consistent travel when applied carefully."]],
switch:[["Linear","Smooth travel without a tactile bump."],["Tactile","A defined bump provides physical feedback."],["Clicky","Tactile and intentionally audible feedback."]],
tape:[["No Tape","PCB left untreated."],["2 Layers","A light tape treatment with a smaller acoustic shift."],["4 Layers","A stronger treatment that can increase reflected energy."],["6 Layers","An intentionally exaggerated tape treatment for comparison."]],
plate:[["Aluminum","Firm, direct and typically more rigid."],["Polycarbonate","Softer and more flexible in many implementations."],["FR4","A middle-ground fiberglass laminate."],["Brass","Dense and firm with added mass."]],
keycap:[["PBT","Textured and durable with its own density and pitch."],["ABS","Smooth, vivid and often brighter or more resonant."]],
mount:[["Gasket","Isolated mounting that can allow a softer response."],["Top Mount","More direct attachment and controlled firmness."],["Tray Mount","Simple, rigid mounting with a distinct feel."]]
};

window.YORU_CONTENT = Object.freeze({ SITE_MODE, SITE_MODE_CONTENT, BUILDS, SOUND_SAMPLES, STORIES, COMPARE_OPTIONS });
