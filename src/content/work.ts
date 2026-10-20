/* ------------------------------------------------------------------ *
 *  Work shown on the open canvas.
 *
 *  `media` is the card's image or video:
 *    media: { type: "image", src: "/work/gesture-bloom.jpg" }   // jpg, png, webp, gif, svg
 *    media: { type: "video", src: "/work/gesture-bloom.mp4" }   // mp4/webm, plays muted on loop
 *  Local files go in /public/work. Remote URLs need their host listed in
 *  next.config.ts. Without `media`, the card shows a generative placeholder.
 *
 *  `id` is the key project's URL slug (/work/<id>) and the key for its case
 *  study in case-studies.ts.
 * ------------------------------------------------------------------ */

export type Category = "key-project" | "side-project" | "exploration";

// `youtube` media uses the video id as `src`. `aspect` (width / height) keeps
// an image at its original proportions where it is shown uncropped.
export type Media = { type: "image" | "video" | "youtube"; src: string; alt?: string; aspect?: number };

export type WorkItem = {
  id: string;
  category: Category;
  title: string;
  year?: string;
  media?: Media;
  // Key projects: the kinds of work, shown as label segments on their always-on frame.
  tags?: string[];
  // Side projects and explorations: a line or two shown in a callout on hover,
  // and what it was made with. (Key projects have a case study page instead.)
  about?: string;
  tools?: string[];
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

// Where existing media lives: the v4 (Framer) site and GitHub.
export const FRAMER = "https://framerusercontent.com/images/";
export const GITHUB = "https://raw.githubusercontent.com/rkdotxyz/";

export const img = (src: string, alt?: string): Media => ({ type: "image", src, alt });

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
    // No footage yet: the demo video goes here once it's shared.
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
    media: {
      type: "video",
      src: "https://framerusercontent.com/assets/yit5o8m47SUwAemEkxiWGGDKiA.mp4",
      alt: "The planet changing as data parameters move",
    },
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
    media: img(`${FRAMER}TlacyP4UHkDd8DiBZNtzn9YEeM.png`, "Blade components and product screens"),
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
    media: img("/work/heart-doll/glowing-heart.jpg", "Rocky, the Heart Doll, with its heart glowing red"),
    x: 24,
    y: 20,
    w: KEY,
  },

  // Ring around the cluster, media-rich work closest in.
  // Top row
  {
    id: "projection-mapping",
    category: "exploration",
    title: "Projection Mapping",
    about: "Visuals projection-mapped onto physical objects.",
    media: img(`${FRAMER}1kvOIZy1UJFdiTUTeIkoV4kEpwU.gif`, "Visuals projection-mapped onto boxes"),
    x: -700, y: -640, w: EXP,
  },
  {
    id: "mystic-designs",
    category: "side-project",
    title: "Mystic Designs",
    about: "A newsletter curating real-world tangible UI: products that redefine how tangible interfaces work.",
    tools: ["Substack"],
    media: img("/work/mystic-designs.jpg", "The Mystic Designs newsletter archive"),
    x: -470, y: -640, w: SIDE,
  },
  {
    id: "shader",
    category: "exploration",
    title: "Shader",
    about: "Colour and motion from a shader.",
    media: img(`${FRAMER}DO3mYijHrDZGuzgr1gna9uLGaHo.gif`, "Flowing shader colour bands"),
    x: -200, y: -640, w: EXP,
  },
  {
    id: "keyscout",
    category: "side-project",
    title: "KeyScout",
    year: "2025",
    about: "A Figma plugin that finds the keys and IDs of components, styles and variables, and exports them as JSON, CSV, TXT or TypeScript.",
    tools: ["Figma plugin API", "JavaScript"],
    media: img("/work/keyscout.jpg", "KeyScout on Figma Community"),
    x: 30, y: -640, w: SIDE,
  },
  {
    id: "midi-controller",
    category: "exploration",
    title: "MIDI Controller",
    about: "Visuals played live with a MIDI controller.",
    media: img(`${FRAMER}sFlrG9ptSIgjdMPW5PTVfsbuaPM.gif`, "Visuals driven by a MIDI controller"),
    x: 300, y: -640, w: EXP,
  },
  {
    id: "light-painting",
    category: "exploration",
    title: "Light Painting",
    about: "Drawing with light.",
    media: img(`${FRAMER}oWQOJPIs0pZLGlql5qlXAjOlvW8.gif`, "A light trail drawn in the dark"),
    x: 540, y: -640, w: EXP,
  },

  // Left column
  {
    id: "pen-plotter",
    category: "exploration",
    title: "Pen Plotter",
    year: "2022–",
    about: "Pushing a pen plotter beyond pen and paper: UV ink, an LED, pencil, brush and calligraphy pens, one medium per plot.",
    tools: ["TouchDesigner", "p5.js", "QGIS"],
    media: img(`${FRAMER}lVyFtm0Ztev0RVnv1832OAAdKvM.png`, "Plotted artworks in different mediums"),
    x: -660, y: -360, w: EXP,
  },
  {
    id: "healthicons",
    category: "side-project",
    title: "Healthicons",
    about: "Free, open-source health icons in the public domain, made with a team of volunteer designers.",
    media: img("/work/healthicons.jpg", "The Healthicons library"),
    x: -700, y: -100, w: SIDE,
  },
  {
    id: "audio-reactive",
    category: "exploration",
    title: "Audio Reactive",
    about: "Visuals that move with sound.",
    media: img(`${FRAMER}VD3Y9czXbRsExpkUTPAAzDSQ7hY.gif`, "Visuals reacting to sound"),
    x: -660, y: 150, w: EXP,
  },

  // Right column
  {
    id: "stratosplash",
    category: "side-project",
    title: "Stratosplash",
    about: "Gradients captured from real skies, real moments and real places, collected in one place.",
    tools: ["Framer"],
    media: img("/work/stratosplash.jpg", "The Stratosplash site"),
    x: 480, y: -360, w: SIDE,
  },
  {
    id: "generative-music",
    category: "exploration",
    title: "Generative Music",
    about: "Music generated from code.",
    media: img(`${FRAMER}ssF2EBws3Q9SoKkiiiNnqRDO3Zk.gif`, "Live-coded generative music"),
    x: 500, y: -100, w: EXP,
  },
  {
    id: "pattern-creator",
    category: "side-project",
    title: "Pattern Creator",
    about: "A Figma plugin, built for Blade at Razorpay, that makes the system's UI patterns easy to find and use. About 70% time saved.",
    tools: ["Figma plugin API", "Amplitude"],
    media: img(`${GITHUB}pattern-creator-plugin-images/main/Dashboard%20UI%20-%20Desktop.png`, "A dashboard pattern generated by the plugin"),
    x: 480, y: 150, w: SIDE,
  },

  // Bottom row
  {
    id: "typography",
    category: "exploration",
    title: "Typography",
    about: "Letterforms in motion.",
    media: img(`${FRAMER}PfMZ22AeOAugh6aFxtL0gmS4Xo.gif`, "Animated letterform"),
    x: -700, y: 420, w: EXP,
  },
  {
    id: "scenic-seats",
    category: "side-project",
    title: "Scenic Seats",
    about: "Which side of the plane to sit on for the sunrise, the sunset or the view, across 198 Indian domestic routes.",
    x: -470, y: 420, w: SIDE,
  },
  {
    id: "gesture-bloom",
    category: "exploration",
    title: "Gesture Bloom",
    year: "2026",
    about: "A paper flower that opens with your hand. MediaPipe tracks the hand in the browser; a servo pulls the petals.",
    tools: ["MediaPipe", "Web Serial", "Arduino"],
    x: -200, y: 420, w: EXP,
  },
  {
    id: "sonic-signature",
    category: "exploration",
    title: "Sonic Signature",
    year: "2025",
    about: "Draw a shape or sign your name, and hear it as its own composition.",
    tools: ["TypeScript"],
    x: 30, y: 420, w: EXP,
  },
  {
    id: "projection-ttt",
    category: "exploration",
    title: "Projection TTT",
    about: "Tic-tac-toe projected onto a surface and played with your hands, tracked by a webcam.",
    x: 270, y: 420, w: EXP,
  },
  {
    id: "force-field",
    category: "exploration",
    title: "Force Field",
    year: "2025",
    about: "A grid of circles that bends around your cursor, with live controls for attraction, density and strength.",
    tools: ["TypeScript"],
    x: 510, y: 420, w: EXP,
  },

  // Outer edges
  {
    id: "pixel-art-generator",
    category: "exploration",
    title: "Pixel Art Generator",
    year: "2025",
    about: "Turns any image into pixel art, with adjustable pixel size and colour palettes.",
    tools: ["TypeScript"],
    x: -960, y: -480, w: EXP,
  },
  {
    id: "language-of-gen-z",
    category: "exploration",
    title: "Language of Gen Z",
    year: "2025",
    about: "An interactive word cloud of Gen Z slang and emojis. Hover any word for its meaning.",
    tools: ["D3.js"],
    x: -960, y: -150, w: EXP,
  },
  {
    id: "middventory",
    category: "side-project",
    title: "Middventory",
    year: "2026",
    about: "A pixel-style map of every part in Middla Lab, and which drawer it lives in.",
    tools: ["HTML", "CSS", "JavaScript"],
    media: img("/work/middventory.jpg", "The Middventory parts grid"),
    x: -960, y: 180, w: SIDE,
  },
  {
    id: "motion-studio",
    category: "exploration",
    title: "Motion Studio",
    about: "Short films rendered entirely from code, frame by frame, then encoded to video.",
    tools: ["JavaScript", "Node.js"],
    x: 780, y: -150, w: EXP,
  },
  {
    id: "led-matrix",
    category: "exploration",
    title: "LED Matrix",
    about: "An LED matrix lit up and driven from a laptop.",
    media: img(`${FRAMER}ddm6ikbkhswupc3CCIhiIEiTgHI.gif`, "An LED matrix lit up beside a laptop"),
    x: 780, y: 150, w: EXP,
  },
];
