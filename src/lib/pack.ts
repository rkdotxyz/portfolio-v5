// Packs boxes of different sizes around fixed ones, for the canvas's
// scattered layout. Each box walks outward along a spiral from the middle
// and takes the first spot that clears everything already placed, so boxes
// earlier in the list end up closer to the centre. The spiral starts at a
// different angle for each box, which keeps the result loose rather than
// ringed, and is stretched sideways to suit wide screens. Deterministic: the
// same input always gives the same layout.

export type Rect = { x: number; y: number; w: number; h: number };
export type Box = { id: string; w: number; h: number };

type Options = {
  gap: number; // clear space between boxes
  top: number; // extra clear space above each box (for its label)
  stretch: number; // horizontal stretch of the spiral
  snap: number; // round positions to this grid
};

// A stable pseudo-random number in [0, 1) from a string.
function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

const hits = (a: Rect, b: Rect, gap: number, top: number) =>
  a.x < b.x + b.w + gap && b.x < a.x + a.w + gap && a.y - top < b.y + b.h + gap && b.y - top < a.y + a.h + gap;

export function pack(fixed: Rect[], boxes: Box[], { gap, top, stretch, snap }: Options) {
  const placed: Rect[] = [...fixed];
  const out: Record<string, { x: number; y: number }> = {};
  const round = (v: number) => Math.round(v / snap) * snap;

  for (const box of boxes) {
    const start = hash(box.id) * Math.PI * 2;
    // Archimedean spiral, r = k·t, sampled about every 12px along its length.
    const k = 14;
    for (let t = 0.5; t < 400; ) {
      const r = k * t;
      const a = start + t;
      const cx = Math.cos(a) * r * stretch;
      const cy = Math.sin(a) * r;
      const rect = { x: round(cx - box.w / 2), y: round(cy - box.h / 2), w: box.w, h: box.h };
      if (!placed.some((p) => hits(rect, p, gap, top))) {
        placed.push(rect);
        out[box.id] = { x: rect.x, y: rect.y };
        break;
      }
      t += 12 / Math.max(r, 12);
    }
  }
  return out;
}
