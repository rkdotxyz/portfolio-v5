// Packs boxes of different sizes around fixed ones, for the canvas's
// scattered layout. Deterministic: the same input always gives the same
// layout. Boxes are placed in list order, each in the first clear spot:
//
// - A box with an `angle` grows outward along that direction (radians,
//   0 = right, π/2 = down), trying spots within `spread` of it at each
//   distance, so boxes sent the same way build up one side.
// - A box without one walks a spiral out from the middle, starting at an
//   angle of its own so the result stays loose rather than ringed.
//
// Both are stretched sideways to suit wide screens.

export type Rect = { x: number; y: number; w: number; h: number };
export type Box = { id: string; w: number; h: number; angle?: number };

type Options = {
  gap: number; // clear space between boxes
  top: number; // extra clear space above each box (for its label)
  stretch: number; // horizontal stretch
  snap: number; // round positions to this grid
  spread: number; // how far (radians) a box may stray from its angle
};

// A stable pseudo-random number in [0, 1) from a string.
function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

const hits = (a: Rect, b: Rect, gap: number, top: number) =>
  a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y - top < b.y + b.h + gap && b.y - top < a.y + a.h + gap;

export function pack(fixed: Rect[], boxes: Box[], { gap, top, stretch, snap, spread }: Options) {
  const placed: Rect[] = [...fixed];
  const out: Record<string, { x: number; y: number }> = {};
  const round = (v: number) => Math.round(v / snap) * snap;

  const tryAt = (box: Box, a: number, r: number) => {
    const cx = Math.cos(a) * r * stretch;
    const cy = Math.sin(a) * r;
    const rect = { x: round(cx - box.w / 2), y: round(cy - box.h / 2), w: box.w, h: box.h };
    if (placed.some((p) => hits(rect, p, gap, top))) return false;
    placed.push(rect);
    out[box.id] = { x: rect.x, y: rect.y };
    return true;
  };

  for (const box of boxes) {
    if (box.angle !== undefined) {
      // Out along the angle, fanning either side of it a little more at
      // each step, so a side fills evenly instead of as one thin line.
      search: for (let r = 0; r < 6000; r += 8) {
        const step = 12 / Math.max(r, 12);
        for (let d = 0; d <= spread; d += step) {
          if (tryAt(box, box.angle + d, r)) break search;
          if (d > 0 && tryAt(box, box.angle - d, r)) break search;
        }
      }
    } else {
      // Archimedean spiral, r = k·t, sampled about every 12px along its length.
      const start = hash(box.id) * Math.PI * 2;
      for (let t = 0.5, k = 14; t < 400; ) {
        const r = k * t;
        if (tryAt(box, start + t, r)) break;
        t += 12 / Math.max(r, 12);
      }
    }
  }
  return out;
}
