// Squarified treemap (Bruls, Huizing & van Wijk): splits a rectangle into
// one tile per value, with areas proportional to the values and tiles kept
// as close to square as possible. Values are laid out largest first.

export type Tile<T> = { item: T; x: number; y: number; w: number; h: number };

type Rect = { x: number; y: number; w: number; h: number };

// Worst aspect ratio in a row of areas laid along a side of length `side`.
function worst(row: number[], side: number) {
  const sum = row.reduce((a, b) => a + b, 0);
  const max = Math.max(...row);
  const min = Math.min(...row);
  return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
}

export function squarify<T>(items: T[], value: (t: T) => number, rect: Rect): Tile<T>[] {
  const total = items.reduce((s, t) => s + value(t), 0);
  if (!total) return [];
  const scale = (rect.w * rect.h) / total;
  const queue = [...items].sort((a, b) => value(b) - value(a)).map((item) => ({ item, area: value(item) * scale }));
  const out: Tile<T>[] = [];
  let r = { ...rect };

  while (queue.length) {
    const side = Math.min(r.w, r.h);
    const row = [queue.shift()!];
    while (queue.length) {
      const next = [...row, queue[0]];
      if (worst(next.map((x) => x.area), side) > worst(row.map((x) => x.area), side)) break;
      row.push(queue.shift()!);
    }
    // Lay the row along the shorter side, then shrink the space left.
    const sum = row.reduce((s, x) => s + x.area, 0);
    if (r.w >= r.h) {
      const w = sum / r.h;
      let y = r.y;
      for (const x of row) {
        const h = x.area / w;
        out.push({ item: x.item, x: r.x, y, w, h });
        y += h;
      }
      r = { x: r.x + w, y: r.y, w: r.w - w, h: r.h };
    } else {
      const h = sum / r.w;
      let x0 = r.x;
      for (const x of row) {
        const w = x.area / h;
        out.push({ item: x.item, x: x0, y: r.y, w, h });
        x0 += w;
      }
      r = { x: r.x, y: r.y + h, w: r.w, h: r.h - h };
    }
  }
  return out;
}
