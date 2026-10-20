/* ------------------------------------------------------------------ *
 *  Short case studies, opened from a card on the canvas. Keyed by the
 *  work item's id (see work.ts). Keep each one brief: what it is, why it
 *  exists, how it works. Leave a field out to hide that part.
 *
 *  Sources: the v4 site (ramakrushna.xyz), v3 (ramakrushna.webflow.io),
 *  the CV, GitHub READMEs and the projects' own sites. Only what those say.
 * ------------------------------------------------------------------ */

import { FRAMER, GITHUB, img, type Media } from "./work";

export type CaseStudy = {
  summary: string; // one line under the title
  role?: string;
  team?: string;
  status?: string;
  what?: string;
  why?: string;
  how?: string;
  flow?: string[]; // the signal path, drawn as connected boxes
  stack?: string[];
  outcome?: string;
  links?: { label: string; href: string }[];
  gallery?: Media[]; // captioned by each item's alt
};

const WEBFLOW = "https://cdn.prod.website-files.com/612ef3767dea2ece58c49cd5/";

export const caseStudies: Record<string, CaseStudy> = {
  /* ── Key projects ─────────────────────────────────────────────── */

  "esp32-led-snake": {
    summary: "Snake on a 32×8 LED matrix, played from any phone over the ESP32's own WiFi.",
    status: "Working prototype",
    what: "A pocket arcade: the classic Snake game on a 256-LED matrix, controlled from a phone browser. No app, no router, one USB cable.",
    how: "The ESP32 runs its own WiFi access point and serves the controller page itself. A live WebSocket carries button presses in and score and game events back out. Game rules, display, controller and settings are separate modules, and a firmware power cap keeps 256 LEDs safe on USB power.",
    flow: ["Phone browser", "WiFi + WebSocket", "ESP32", "8×32 LED matrix"],
    stack: ["ESP32", "C++ / Arduino", "FastLED", "WebSockets", "HTML / JS controller"],
    outcome: "Attract screen, crash animation, walls or wrap-around, colour presets, phone-side sound and haptics, and settings that survive power-off.",
    links: [{ label: "Code", href: "https://github.com/rkdotxyz/esp32-led-snake" }],
    gallery: [img(`${GITHUB}esp32-led-snake/main/hardware/wiring.svg`, "Wiring: ESP32, WS2812B matrix, capacitor and data resistor")],
  },

  "planet-under-pressure": {
    summary: "An interactive data-art installation: turn eight knobs and watch a planet change.",
    status: "Shown at VizChitra 2025",
    what: "A planet built from environmental data. Each knob on a MIDI controller drives one measure of the planet's health across 201 years, and the planet's colour, texture and balance of land and water shift as you turn it.",
    why: "Data about the environment usually lives in charts, which take a certain data literacy to read. The question was how to make that data interactive and visual for everyone, from designers and journalists to professors, students and artists.",
    how: "Eight parameters, one per knob: air quality, water quality, sea level rise, ocean temperature anomaly, land pollution, jet stream fluctuation, loss of living life and vegetation loss. A hundred years of open data per parameter was extended with a predicted hundred years ahead. The planet is built in TouchDesigner with its functions left configurable, and each knob is mapped to several of them; one knob moves blur radius, noise amplitude and hue together. The mappings were tested so no two knobs fight over the same value.",
    flow: ["Open data · 201 years", "8 parameters", "MIDI knobs", "TouchDesigner", "Planet"],
    stack: ["TouchDesigner", "MIDI controller", "Open datasets", "Data mapping"],
    outcome: "Presented at VizChitra 2025 to 50+ people. The takeaway from the room: data is more than graphs and charts, and people understand it better by interacting with it than by reading numbers.",
    gallery: [
      img(`${FRAMER}SMPx1FVSLO78nmGPfUkHYoRGTQ.png`, "Control panel: one parameter per knob"),
      img(`${FRAMER}AyxkfEijZ7vhio7kMTAdedpBU.png`, "Curated data trend"),
      img(`${FRAMER}ALwoUvsXLC2suknfLrEyanqyyI.png`, "Art setup in TouchDesigner"),
      img(`${FRAMER}tWa06kk1CHAXIaQIPDrOzt11qM8.png`, "Data mapping in TouchDesigner"),
      img(`${FRAMER}43Pe3pGYM3wFWtnaIODntJ6T24k.png`, "The planet"),
      img(`${FRAMER}9hZjmA9PSrqvr1pNXGRN2JHzkWM.png`, "The MIDI controller driving the planet"),
      img(`${FRAMER}luX8tSEV5K466VrYqHIBNFOMDo.png`, "At VizChitra 2025"),
    ],
  },

  "blade-design-system": {
    summary: "The design system that powers Razorpay's products.",
    role: "Product designer to senior product designer, design systems",
    team: "Blade design systems team, Razorpay",
    status: "2022–2026",
    what: "Blade is Razorpay's design system, used across 75+ products in the dashboard, checkout, mobile app and POS, by 60+ designers and 100+ frontend engineers across 6–8 business verticals.",
    why: "As teams scaled, products drifted apart visually and in how they behaved, designers and developers went back and forth before every launch, and teams kept building one-off versions of what should have been reusable patterns.",
    how: "Designed 30+ components end to end, from research and API decisions to delivery, and defined the motion of 32 of them. Added design patterns, built the foundations of a data visualisation system, and built Figma plugins including Pattern Creator. On the AI side: built blade-runner, an agent that answers consumers' questions, and rewrote the system's knowledge base for AI agents, improving MCP accuracy by about 25%.",
    flow: ["Tokens & foundations", "Components", "Patterns", "Figma plugins", "AI agent + MCP", "75+ products"],
    stack: ["Figma", "Figma plugin API", "Design tokens", "React", "Motion design", "AI agents", "MCP", "Amplitude"],
    outcome: "Component coverage up 40%, with an estimated $60k and 2,000+ hours saved. Pattern Creator saves about 70% of the time for its ~5 daily users; blade-runner answers with 94% accuracy for ~10 daily users. Two brand refreshes landed without breaking changes, and the open-sourced Figma library passed 14k downloads.",
    links: [
      { label: "Blade", href: "https://blade.razorpay.com" },
      { label: "Code", href: "https://github.com/razorpay/blade" },
      { label: "Launch video", href: "https://www.youtube.com/watch?v=GH3HA6xOFEw" },
    ],
    gallery: [
      img(`${WEBFLOW}66362a2d5a8c79cdbad52313_blade-problem.png`, "The problem: consistency, collaboration, ease of use"),
      img(`${WEBFLOW}663758d9e60961d576b6976e_component-design.png`, "Component design"),
      img(`${WEBFLOW}663758d988c8673f48ac97f3_motion-design.png`, "Motion design for components"),
      img(`${WEBFLOW}66375f3bd24d4bea08caa336_ds-pattern.png`, "Design patterns"),
      img(`${WEBFLOW}66375f3a056d35d92ba8a57c_icon-library-1.png`, "Icon library"),
      img(`${WEBFLOW}66375b03ecb1594f748592a2_figma-library-1.png`, "Figma library"),
      img(`${WEBFLOW}66375f3a8280bfbeff6ab702_brand-refresh.png`, "Brand refresh"),
      img(`${WEBFLOW}66375f3b612ac9d08e0ee9bb_ds-education.png`, "Design system education"),
      img(`${WEBFLOW}66371c57056d35d92b7048db_open-source.png`, "Open-sourcing Blade on Figma Community"),
    ],
  },

  "heart-doll": {
    summary: "A doll whose heart glows when someone far away is there for you.",
    team: "KTH DM2601, group 11: Ellen, Max, Rama Krushna, Roxanne",
    status: "Course project · HT26",
    what: "A doll for pre-sleep rituals, made for people who have moved abroad for work or study. Its heart glows when someone far away is there for you.",
    why: "The course theme was pre-sleep rituals. We focused on people living away from home, working from literature, interviews, a persona and affinity analysis toward a direction and ideas.",
    how: "An ESP32 drives an RGB LED heart and two buttons, and serves a phone app of its own. The app, rebuilt in 3D with React Three Fiber, shows a glass heart that fills as the two people join. A separate web customiser lets you dress the doll: colours, hats, glasses, stickers and drawing.",
    flow: ["Buttons", "ESP32", "RGB heart", "Phone app (3D)"],
    stack: ["ESP32", "Arduino", "React", "React Three Fiber", "Vite", "GitHub Pages"],
    links: [
      { label: "Customiser", href: "https://rkdotxyz.github.io/DM2601/website/" },
      { label: "App demo", href: "https://rkdotxyz.github.io/DM2601/app/" },
      { label: "Research deck", href: "https://rkdotxyz.github.io/DM2601/presentation/" },
      { label: "Code", href: "https://github.com/rkdotxyz/DM2601" },
    ],
    gallery: [
      img(`${GITHUB}DM2601/main/presentation/images/persona.png`, "Persona from the research phase"),
      img(`${GITHUB}DM2601/main/prototype/hardware/wiring.svg`, "Wiring: ESP32, RGB LED and two buttons"),
    ],
  },

  /* ── Side projects ────────────────────────────────────────────── */

  "mystic-designs": {
    summary: "A newsletter documenting products that redefine how tangible interfaces work.",
    status: "Newsletter on Substack",
    what: "A curation of real-world tangible UI and interactions: products that redefine how tangible interfaces work, shared as a weekly dose of design inspiration.",
    links: [{ label: "Read", href: "https://www.mysticdesigns.xyz/" }],
  },

  keyscout: {
    summary: "A Figma plugin to search, filter and export the keys and IDs of components, styles and variables.",
    status: "Published on Figma Community",
    what: "KeyScout finds the keys and IDs of components, styles and variables in a Figma file, and exports them as JSON, CSV, TXT or TypeScript.",
    stack: ["Figma plugin API", "HTML", "JavaScript"],
    links: [
      { label: "Figma Community", href: "https://www.figma.com/community/plugin/1537879434431017434/keyscout" },
      { label: "Code", href: "https://github.com/rkdotxyz/keyscout-plugin" },
    ],
  },

  "pattern-creator": {
    summary: "A Figma plugin for discovering and using Blade's UI patterns.",
    what: "Built as part of Blade at Razorpay: a plugin that makes the system's UI patterns easy to find and use, covering dashboards, list views, detail views, creation views, modal templates and settings, for desktop and mobile.",
    stack: ["Figma plugin API", "Blade components", "Amplitude"],
    outcome: "Around 5 daily users and about 70% time saved, with usage tracked through Amplitude.",
    gallery: [
      img(`${GITHUB}pattern-creator-plugin-images/main/list_view_desktop.png`, "List view pattern, desktop"),
      img(`${GITHUB}pattern-creator-plugin-images/main/detail_view_desktop.png`, "Detail view pattern, desktop"),
      img(`${GITHUB}pattern-creator-plugin-images/main/detail_view_mobile.png`, "Detail view pattern, mobile"),
    ],
  },

  healthicons: {
    summary: "Free, open-source health icons, made with a team of volunteer designers.",
    role: "Volunteer designer",
    what: "An icon library for health projects: outline and filled icons in SVG and PNG, released into the public domain (CC0), so anyone can use, edit and republish them without credit.",
    links: [{ label: "Healthicons", href: "https://healthicons.org/" }],
  },

  stratosplash: {
    summary: "Gradients inspired by the sky.",
    what: "A curated collection of gradients captured from real skies, real moments and real places, gathered in one place to browse and use.",
    stack: ["Framer"],
    links: [{ label: "Visit", href: "https://stratosplash.framer.website/" }],
  },

  "scenic-seats": {
    summary: "Which side of the plane has the best view? Find out for any Indian domestic route.",
    what: "Enter a route and a departure time, and Scenic Seats tells you which side of the plane to sit on: for the sunrise, the sunset, or a notable view below such as mountains, coastlines or lakes.",
    how: "It covers 198 Indian domestic routes, each with three independent view types: sunrise, sunset and scenic.",
    links: [{ label: "Try it", href: "https://scenic-seats.vercel.app" }],
  },

  /* ── Explorations ─────────────────────────────────────────────── */

  "pen-plotter": {
    summary: "Pushing a pen plotter beyond pen and paper, one medium at a time.",
    status: "Ongoing since 2022",
    what: "A series of plots, each using a different medium in the plotter's pen holder: sketch pen, UV ink, an LED, a micro-tip pen, pencil, brush pen, calligraphy pen and gel pen.",
    why: "A pen plotter works well with a simple pen and paper. The question was what happens when you push it: what else can go in the pen holder, and what ideas can it bring to life?",
    how: "Artworks were generated in TouchDesigner, p5.js, a maze generator and QGIS, then plotted. The UV ink plot hides an easter egg that only shows under UV light. The LED was captured with long-exposure photography. The micro-tip plot is a contour map of the Himalayas over Sikkim from open elevation data. The pencil plot draws a grid over coins to fake an embossed effect, and the brush pen shows how the arm's weight changes stroke width when it is extended.",
    stack: ["Pen plotter", "TouchDesigner", "p5.js", "QGIS"],
    gallery: [
      img(`${FRAMER}t7oQyurKHBTpUxq6laEWOGwkCss.png`, "The series"),
      img(`${FRAMER}8Y9Eh4Wdv5yGccSigjK4NDnnwU.png`, "001 · Sketch pen"),
      img(`${FRAMER}ee2Cr1bKZQR2GdHNGomQbm2Y1c.png`, "002 · UV ink pen"),
      img(`${FRAMER}BO45dFu1JfXvb7JqxK210hmCJI.png`, "003 · LED light, long exposure"),
      img(`${FRAMER}mBfXsexqmaPm5y6sziwrbMZs88.png`, "004 · Micro-tip pen: Himalayan contours"),
      img(`${FRAMER}cpptd1uKslvqja42s2vGMTylXQ.png`, "005 · Pencil over coins"),
      img(`${FRAMER}lZYSoLpbj7VxLNOSYBIez4AyYRM.png`, "006 · Brush pen"),
      img(`${FRAMER}mJImn26HMmWYQNSkR3dZwPO1cU.png`, "007 · Calligraphy pen"),
      img(`${FRAMER}KmfnyPij19vTllpvNAohppOO0.png`, "008 · Gel pen ASCII art"),
    ],
  },

  "gesture-bloom": {
    summary: "Open your hand, and a paper flower opens with it.",
    status: "In progress",
    what: "A paper flower that mirrors your hand. A webcam watches how open your hand is, and a servo inside the flower opens or closes the petals to match.",
    how: "MediaPipe hand tracking runs in Chrome and turns the hand into a single openness value. The browser sends it over USB with Web Serial to an Arduino Uno, which drives an MG996R servo. The servo winds a thread that pulls the petals closed; unwinding lets them fall open.",
    flow: ["Webcam", "MediaPipe", "Web Serial", "Arduino Uno", "Servo", "Paper flower"],
    stack: ["MediaPipe", "JavaScript", "Web Serial", "Arduino", "MG996R servo", "Paper mechanism"],
    links: [{ label: "Code", href: "https://github.com/rkdotxyz/gesture-bloom" }],
  },

  "sonic-signature": {
    summary: "Draw a shape or sign your name, and hear it.",
    what: "An interactive web app that turns drawings into sound. Draw on the canvas and your signature or shape becomes its own audio composition.",
    how: "Strokes are turned into sound in real time, with controls for the waveform and frequency.",
    stack: ["TypeScript"],
    links: [
      { label: "Try it", href: "https://sonic-signature.vercel.app" },
      { label: "Code", href: "https://github.com/rkdotxyz/Sonic-Signature" },
    ],
  },

  "force-field": {
    summary: "A grid of circles that bends around your cursor.",
    what: "An interactive art tool: a grid of circles responds to the cursor, producing force-field patterns as you move.",
    how: "Attraction or repulsion, circle density and field strength can all be tuned live.",
    stack: ["TypeScript"],
    links: [
      { label: "Try it", href: "https://force-field-jade.vercel.app" },
      { label: "Code", href: "https://github.com/rkdotxyz/Force-Field" },
    ],
  },

  "pixel-art-generator": {
    summary: "Turn any image into pixel art.",
    what: "A web tool that converts images into pixel art with retro-style effects.",
    how: "Adjustable pixel size and a choice of colour palettes, from the original colours to greyscale.",
    stack: ["TypeScript"],
    links: [
      { label: "Try it", href: "https://pixel-art-generator-lilac.vercel.app" },
      { label: "Code", href: "https://github.com/rkdotxyz/Pixel-Art-Generator" },
    ],
  },

  "language-of-gen-z": {
    summary: "A fun, data-driven look at Gen Z's most-used slang and emojis.",
    what: "An interactive word cloud of popular Gen Z slang and emojis. Toggle between the two, and hover any word for its definition.",
    stack: ["D3.js", "JavaScript"],
    links: [
      { label: "Try it", href: "https://the-language-of-gen-z.vercel.app" },
      { label: "Code", href: "https://github.com/rkdotxyz/the-language-of-gen-z" },
    ],
  },

  middventory: {
    summary: "A pixel-style map of every part in Middla Lab, and which drawer it lives in.",
    what: "An inventory of the lab's components in a pixel style, showing which drawer each part lives in.",
    how: "A static site in plain HTML, CSS and JavaScript; the parts list and drawer names live in one data file, so anyone can keep it up to date.",
    stack: ["HTML", "CSS", "JavaScript"],
    links: [{ label: "Code", href: "https://github.com/rkdotxyz/middventory" }],
  },

  "motion-studio": {
    summary: "Short films rendered entirely from code.",
    what: "A setup for making motion pieces in code and rendering them to video.",
    how: "Every film is a pure function of time: seeking to a moment paints that exact frame, with seeded noise instead of randomness, so a Node script can step through the frames and encode them to H.264.",
    stack: ["JavaScript", "Node.js"],
  },

  "projection-ttt": {
    summary: "Tic-tac-toe, projected onto a surface and played with your hands.",
    status: "In progress",
    what: "A projected game of tic-tac-toe. The board is mapped onto a physical surface and moves are made by hand rather than with a mouse.",
    how: "Built up through separate tests for the webcam, hand tracking, mapping the projected grid and calibrating projector and camera together.",
    flow: ["Webcam", "Hand tracking", "Calibration", "Projected grid"],
  },

  "projection-mapping": {
    summary: "Visuals mapped onto physical objects.",
    status: "Experiment",
  },
  shader: {
    summary: "Colour and motion from a shader.",
    status: "Experiment",
  },
  "midi-controller": {
    summary: "Visuals played live with a MIDI controller.",
    status: "Experiment",
  },
  "generative-music": {
    summary: "Music generated from code.",
    status: "Experiment",
  },
  "light-painting": {
    summary: "Drawing with light.",
    status: "Experiment",
  },
  "audio-reactive": {
    summary: "Visuals that move with sound.",
    status: "Experiment",
  },
  typography: {
    summary: "Letterforms in motion.",
    status: "Experiment",
  },
};

// Shown for work that has no case study yet, so the layout can be reviewed.
export const placeholderCaseStudy: CaseStudy = {
  summary: "One line on what this is.",
  role: "Your role",
  team: "Who you worked with",
  status: "Year · status",
  what: "Two or three sentences on what the project is and who it is for.",
  why: "The problem, question or curiosity that started it.",
  how: "How it works: the build, the technology and the key decisions.",
  flow: ["Input", "Processing", "Output"],
  stack: ["Tool", "Tool", "Tool"],
  outcome: "What came of it: results, learnings, where it went next.",
};
