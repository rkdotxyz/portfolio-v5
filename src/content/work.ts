/* ------------------------------------------------------------------ *
 *  Work shown on the open canvas.
 *
 *  To add real media, drop files in /public/work and set `media`:
 *    media: { type: "image", src: "/work/gesture-bloom.jpg" }   // jpg, png, webp, gif
 *    media: { type: "video", src: "/work/gesture-bloom.mp4" }   // mp4/webm, plays muted on loop
 *  Without `media`, the card shows a generative placeholder.
 *
 *  `id` is the URL slug (?project=<id>) and the key for the case study in
 *  case-studies.ts.
 * ------------------------------------------------------------------ */

export type Category = "key-project" | "side-project" | "exploration";

export type Media = { type: "image" | "video"; src: string; alt?: string };

export type WorkItem = {
  id: string;
  category: Category;
  title: string;
  year?: string;
  media?: Media;
  // Key projects: the kinds of work, shown as label segments on their always-on frame.
  tags?: string[];
  // World position on the canvas (top-left corner) and card width, in px.
  x: number;
  y: number;
  w: number;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  "key-project": "key project",
  "side-project": "side project",
  exploration: "exploration",
};

// Card widths per category, in world px.
const KEY = 360;
const SIDE = 220;
const EXP = 180;

export const work: WorkItem[] = [
  // Key projects: a 2×2 cluster at the centre of the canvas.
  {
    id: "esp32-led-snake",
    category: "key-project",
    title: "ESP32 LED Snake",
    year: "2026",
    tags: ["physical computing", "game", "embedded web"],
    x: -KEY - 24,
    y: -300,
    w: KEY,
  },
  {
    id: "planet-under-pressure",
    category: "key-project",
    title: "Planet Under Pressure",
    year: "2025",
    tags: ["data art", "interactive installation"],
    x: 24,
    y: -300,
    w: KEY,
  },
  {
    id: "blade-design-system",
    category: "key-project",
    title: "Blade Design System",
    year: "2022–26",
    tags: ["design system", "figma plugins", "ai agents"],
    x: -KEY - 24,
    y: 20,
    w: KEY,
  },
  {
    id: "heart-doll",
    category: "key-project",
    title: "Heart Doll",
    year: "2026",
    tags: ["soft robotics", "electronics", "tangible"],
    x: 24,
    y: 20,
    w: KEY,
  },

  // Side projects and explorations, scattered around the cluster.
  { id: "mystic-designs", category: "side-project", title: "Mystic Designs", x: -400, y: -640, w: SIDE },
  { id: "gesture-bloom", category: "exploration", title: "Gesture Bloom", year: "2026", x: -110, y: -620, w: EXP },
  { id: "keyscout", category: "side-project", title: "KeyScout", year: "2025", x: 120, y: -650, w: SIDE },
  { id: "sonic-signature", category: "exploration", title: "Sonic Signature", year: "2025", x: 400, y: -610, w: EXP },
  { id: "projection-ttt", category: "exploration", title: "Projection TTT", x: -660, y: -560, w: EXP },

  { id: "pattern-creator", category: "side-project", title: "Pattern Creator", x: -680, y: -310, w: SIDE },
  { id: "pen-plotter", category: "exploration", title: "Pen Plotter", x: -640, y: -40, w: EXP },
  { id: "healthicons", category: "side-project", title: "Healthicons", x: -700, y: 220, w: SIDE },

  { id: "force-field", category: "exploration", title: "Force Field", year: "2025", x: 470, y: -330, w: EXP },
  { id: "scenic-seats", category: "side-project", title: "Scenic Seats", x: 470, y: -60, w: SIDE },
  { id: "motion-studio", category: "exploration", title: "Motion Studio", x: 500, y: 230, w: EXP },

  { id: "pixel-art-generator", category: "exploration", title: "Pixel Art Generator", year: "2025", x: -440, y: 400, w: EXP },
  { id: "language-of-gen-z", category: "exploration", title: "Language of Gen Z", year: "2025", x: -180, y: 420, w: EXP },
  { id: "stratosplash", category: "side-project", title: "Stratosplash", x: 60, y: 400, w: SIDE },
  { id: "middventory", category: "exploration", title: "Middventory", year: "2026", x: 300, y: 450, w: EXP },
];
