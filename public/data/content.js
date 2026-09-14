const SITE_MODE = "prelaunch"; // "prelaunch" | "live"

const SITE_MODE_CONTENT = {
  prelaunch: {
    heroEyebrow: "YORU FOUNDRY / WORKSHOP PREVIEW",
    heroCta: { label: "Explore the Workshop", href: "/crafted-art.html" },
    heroStatus: "Prelaunch workshop preview",
    footerStatus: "Prelaunch workshop preview • Real build documentation will replace these placeholders as I complete, tune, and photograph commissions."
  },
  live: {
    heroEyebrow: "YORU FOUNDRY / COMMISSIONS OPEN",
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

window.YORU_CONTENT = Object.freeze({ SITE_MODE, SITE_MODE_CONTENT, BUILDS, SOUND_SAMPLES });
