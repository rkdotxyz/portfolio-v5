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
