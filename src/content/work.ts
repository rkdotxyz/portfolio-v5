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

export type Category = "key-project" | "project" | "exploration";

export type Media = { type: "image" | "video"; src: string; alt?: string };

export type WorkItem = {
  id: string;
  category: Category;
  title: string;
  year?: string;
  media?: Media;
  confidence: number; // shown in the detection tag, 0–1
  // World position on the canvas (top-left corner) and card width, in px.
  x: number;
  y: number;
  w: number;
};

export const CATEGORY_LABEL: Record<Category, string> = {
  "key-project": "key project",
  project: "project",
  exploration: "exploration",
};

// Placeholder titles until real work is added.
export const work: WorkItem[] = [
  { id: "key-project-01", category: "key-project", title: "Key project 01", year: "2026", confidence: 0.98, x: -660, y: -420, w: 320 },
  { id: "key-project-02", category: "key-project", title: "Key project 02", year: "2025", confidence: 0.97, x: 340, y: -400, w: 320 },

  { id: "project-01", category: "project", title: "Project 01", year: "2025", confidence: 0.94, x: -660, y: 110, w: 240 },
  { id: "project-02", category: "project", title: "Project 02", year: "2024", confidence: 0.91, x: 400, y: 130, w: 240 },
  { id: "project-03", category: "project", title: "Project 03", year: "2024", confidence: 0.89, x: -150, y: 220, w: 240 },

  { id: "gesture-bloom", category: "exploration", title: "Gesture Bloom", year: "2026", confidence: 0.87, x: -280, y: -440, w: 190 },
  { id: "esp32-led-snake", category: "exploration", title: "ESP32 LED Snake", year: "2026", confidence: 0.92, x: 90, y: -430, w: 190 },
  { id: "projection-ttt", category: "exploration", title: "Projection TTT", confidence: 0.84, x: 150, y: 260, w: 190 },
  { id: "motion-studio", category: "exploration", title: "Motion Studio", confidence: 0.9, x: -900, y: -110, w: 190 },
  { id: "heart-doll", category: "exploration", title: "Heart Doll", year: "2026", confidence: 0.86, x: 720, y: -90, w: 190 },
];
