/* ------------------------------------------------------------------ *
 *  Short case studies, opened from a card on the canvas. Keyed by the
 *  work item's id (see work.ts). Keep each one brief: what it is, why it
 *  exists, how it works. Leave a field out to hide that part.
 * ------------------------------------------------------------------ */

import type { Media } from "./work";

export type CaseStudy = {
  summary: string; // one line under the title
  role?: string;
  team?: string;
  status?: string;
  what: string;
  why?: string;
  how: string;
  flow?: string[]; // the signal path, drawn as connected boxes
  stack: string[];
  outcome?: string;
  links?: { label: string; href: string }[];
  gallery?: Media[];
};

export const caseStudies: Record<string, CaseStudy> = {
  "planet-under-pressure": {
    summary: "An interactive data-art installation: turn eight knobs and watch a planet change.",
    status: "Shown at VizChitra 2025",
    what: "A planet built from environmental data. Each knob on a MIDI controller drives one measure of the planet's health across 201 years, and the planet's colour, texture and balance of land and water shift as you turn it.",
    why: "Data about the environment usually lives in charts, which take a certain data literacy to read. The question was how to make that data interactive and visual for everyone, from designers and journalists to professors, students and artists.",
    how: "Eight parameters, one per knob: air quality, water quality, sea level rise, ocean temperature anomaly, land pollution, jet stream fluctuation, loss of living life and vegetation loss. A hundred years of open data per parameter was extended with a predicted hundred years ahead. The planet is built in TouchDesigner with its functions left configurable, and each knob is mapped to several of them; one knob moves blur radius, noise amplitude and hue together. The mappings were tested so no two knobs fight over the same value.",
    flow: ["Open data · 201 years", "8 parameters", "MIDI knobs", "TouchDesigner", "Planet"],
    stack: ["TouchDesigner", "MIDI controller", "Open datasets", "Data mapping"],
    outcome: "Presented at VizChitra 2025 to 50+ people. The takeaway from the room: data is more than graphs and charts, and people understand it better by interacting with it than by reading numbers.",
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
  "esp32-led-snake": {
    summary: "Snake on a 32×8 LED matrix, played from any phone over the ESP32's own WiFi.",
    status: "Working prototype",
    what: "A pocket arcade: the classic Snake game on a 256-LED matrix, controlled from a phone browser. No app, no router, one USB cable.",
    how: "The ESP32 runs its own WiFi access point and serves the controller page itself. A live WebSocket carries button presses in and score and game events back out. Game rules, display, controller and settings are separate modules, and a firmware power cap keeps 256 LEDs safe on USB power.",
    flow: ["Phone browser", "WiFi + WebSocket", "ESP32", "8×32 LED matrix"],
    stack: ["ESP32", "C++ / Arduino", "FastLED", "WebSockets", "HTML / JS controller"],
    outcome: "Attract screen, crash animation, walls or wrap-around, colour presets, phone-side sound and haptics, and settings that survive power-off.",
    links: [{ label: "Code", href: "https://github.com/rkdotxyz/esp32-led-snake" }],
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
      { label: "Code", href: "https://github.com/rkdotxyz/DM2601" },
    ],
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
