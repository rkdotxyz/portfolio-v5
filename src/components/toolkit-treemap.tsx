"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { disciplines, exploring } from "@/content/profile";
import { work } from "@/content/work";
import { squarify, type Tile } from "@/lib/treemap";

/* ------------------------------------------------------------------ *
 *  The toolkit as a treemap mosaic: the whole block is split into
 *  fields, and each field into its tools, with area following how many
 *  pieces of work a tool was used in. Hover a tool to light it up and
 *  list what it made; left alone, it steps through the biggest ones.
 *
 *  Tiles are laid out in percentages for two shapes, landscape (sm and
 *  up) and portrait (phones), so it scales without measuring anything.
 *  Adding a tool in profile.ts reflows everything.
 * ------------------------------------------------------------------ */

type ToolT = { name: string; uses: string[]; field: string };
type FieldT = { id: string; label: string; tools: ToolT[]; untried?: boolean };

const titleOf = new Map(work.map((w) => [w.id, w.title]));
const hasMedia = new Set(work.filter((w) => w.media).map((w) => w.id));
const weight = (t: ToolT) => Math.max(1, t.uses.length);

const fields: FieldT[] = [
  ...disciplines.map((d) => ({ id: d.id, label: d.label, tools: d.tools.map((t) => ({ ...t, field: d.id })) })),
  // Not tried yet: one dashed block, about as big as a mid-sized field.
  { id: "exploring", label: "Exploring next", tools: [], untried: true },
];
const EXPLORING_WEIGHT = 7;
const fieldWeight = (f: FieldT) => (f.untried ? EXPLORING_WEIGHT : f.tools.reduce((s, t) => s + weight(t), 0));

const allTools = fields.flatMap((f) => f.tools);
const maxWeight = Math.max(...allTools.map(weight));
const scanOrder = [...allTools].sort((a, b) => b.uses.length - a.uses.length).filter((t) => t.uses.length >= 3);

// Both shapes, worked out once. Field tiles are in % of the whole; tool
// tiles are in % of their field.
function layout(width: number, height: number) {
  return squarify(fields, fieldWeight, { x: 0, y: 0, w: width, h: height }).map((f) => ({
    field: f,
    tools: squarify(f.item.tools, weight, { x: 0, y: 0, w: f.w, h: f.h }),
  }));
}
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
// `px` is the mosaic's typical width on screen, for sizing labels.
const WIDE = { w: 220, h: 100, px: 1100, tiles: layout(220, 100) };
const TALL = { w: 100, h: 230, px: 340, tiles: layout(100, 230) };

// "A, B, C and 4 more"
function names(ids: string[], limit = 4) {
  const list = ids.map((id) => titleOf.get(id)).filter(Boolean) as string[];
  if (list.length <= limit) return list.join(", ");
  return `${list.slice(0, limit).join(", ")} and ${list.length - limit} more`;
}

// Type size follows the tool's share of the biggest tool, capped so the
// longest word fits its tile (`px`: the tile's width on screen; the font
// averages about 0.55em per character).
function fontSize(t: ToolT, px: number) {
  const r = weight(t) / maxWeight;
  const wanted = r >= 0.6 ? 30 : r >= 0.35 ? 20 : r >= 0.15 ? 16 : 12;
  const longest = Math.max(...t.name.split(/\s+/).map((w) => w.length));
  const fits = (px - 20) / (longest * 0.55);
  return Math.max(10, Math.min(wanted, Math.floor(fits)));
}

const SCAN_MS = 2400;

export function ToolkitTreemap() {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  // The mosaic's width on screen, so labels size to their tiles (a typical
  // width until measured).
  const [width, setWidth] = useState({ wide: WIDE.px, tall: TALL.px });
  const [scan, setScan] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setWidth({ wide: w, tall: w });
    });
    ro.observe(el);
    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (hover || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setScan((i) => (i + 1) % scanOrder.length), SCAN_MS);
    return () => window.clearInterval(t);
  }, [hover, inView]);

  const active = hover ?? scanOrder[scan].name;
  const tool = allTools.find((t) => t.name === active)!;

  // `callouts`: wide screens point a callout from the tile; phones show the
  // same thumbnails under the readout instead, where they always fit.
  const mosaic = (shape: typeof WIDE, screenWidth: number, className: string, callouts: boolean) => (
    <div className={`relative ${className}`} style={{ aspectRatio: `${shape.w} / ${shape.h}` }}>
      {shape.tiles.map(({ field, tools }) => {
        const f = field.item;
        const hasActive = f.tools.some((t) => t.name === active);
        return (
          <div
            key={f.id}
            className={`absolute p-1 ${hasActive && hover ? "z-30" : ""}`}
            style={{ left: pct(field.x, shape.w), top: pct(field.y, shape.h), width: pct(field.w, shape.w), height: pct(field.h, shape.h) }}
          >
            <div
              className={`flex h-full flex-col border p-1 ${f.untried ? "border-dashed border-faint" : "border-line"}`}
            >
              <h4
                className={`shrink-0 truncate px-1 pb-1 pt-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors sm:text-[11px] ${
                  hasActive ? "text-foreground" : "text-muted"
                }`}
              >
                {f.label}
              </h4>
              {f.untried ? (
                <ul className="flex flex-1 flex-wrap content-start gap-1.5 overflow-hidden p-1">
                  {exploring.map((name) => (
                    <li key={name} className="border border-dashed border-faint px-2 py-1 text-[11px] italic text-muted sm:text-xs">
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="relative flex-1">
                  {tools.map((tile: Tile<ToolT>) => {
                    const t = tile.item;
                    const on = t.name === active;
                    // Where the tile sits in the whole mosaic (0–1), to point its callout inward.
                    const cx = (field.x + tile.x + tile.w / 2) / shape.w;
                    const cy = (field.y + tile.y + tile.h / 2) / shape.h;
                    return (
                      <div
                        key={t.name}
                        className={`absolute p-[2px] ${hover === t.name ? "z-30" : ""}`}
                        style={{ left: pct(tile.x, field.w), top: pct(tile.y, field.h), width: pct(tile.w, field.w), height: pct(tile.h, field.h) }}
                      >
                        <button
                          type="button"
                          data-sound-hover
                          onMouseEnter={() => setHover(t.name)}
                          onFocus={() => setHover(t.name)}
                          onBlur={() => setHover(null)}
                          onClick={() => setHover(t.name)}
                          className={`flex h-full w-full flex-col justify-between overflow-hidden p-2 text-left transition-colors duration-300 ${
                            on ? "bg-foreground text-background" : "bg-surface text-muted hover:text-foreground"
                          }`}
                        >
                          {(tile.w / shape.w) * screenWidth < 46 ? (
                            // Too thin for a name: the count alone, and the readout names it.
                            <span className="sr-only">{t.name}</span>
                          ) : (
                            <span className="leading-tight tracking-tight" style={{ fontSize: fontSize(t, (tile.w / shape.w) * screenWidth) }}>
                              {t.name}
                            </span>
                          )}
                          <span className={`self-end font-mono text-[10px] tabular-nums ${on ? "text-background" : "text-muted"}`}>
                            {t.uses.length}
                          </span>
                        </button>
                        {callouts && hover === t.name && t.uses.length > 0 && (
                          <ToolCallout tool={t} x={cx < 0.5 ? "right" : "left"} y={cy < 0.4 ? "down" : "up"} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={ref} className="border border-line" onMouseLeave={() => setHover(null)}>
      <div className="p-2 sm:p-3">
        {mosaic(WIDE, width.wide, "hidden sm:block", true)}
        {mosaic(TALL, width.tall, "sm:hidden", false)}
      </div>

      {/* Readout. */}
      <p className="flex min-h-12 flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line px-4 py-3 text-sm sm:px-5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-foreground">
          <span aria-hidden className={`mr-2 inline-block h-1.5 w-1.5 rounded-full bg-foreground align-middle ${hover ? "" : "animate-pulse"}`} />
          {tool.name} · {tool.uses.length} {tool.uses.length === 1 ? "piece" : "pieces"}
        </span>
        <span className="text-muted">{tool.uses.length ? names(tool.uses) : "In the toolkit"}</span>
      </p>
      {hover && tool.uses.length > 0 && (
        <div className="border-t border-line p-2 sm:hidden">
          <Thumbs ids={tool.uses} wide />
        </div>
      )}
    </div>
  );
}

// Leader line, as on the canvas: a 60° rise off the tile's corner, then a run out to the box.
const RISE = { x: 24, y: 42 };
const RUN = 36;

// The canvas's callout, holding a thumbnail of every piece the tool was used in.
function ToolCallout({ tool, x, y }: { tool: ToolT; x: "left" | "right"; y: "up" | "down" }) {
  const sx = x === "right" ? 1 : -1;
  const sy = y === "up" ? -1 : 1;
  const end = { x: sx * (RISE.x + RUN), y: sy * RISE.y };
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute h-0 w-0"
      style={{ left: x === "right" ? "100%" : 0, top: y === "up" ? 0 : "100%" }}
    >
      <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
        <polyline
          points={`0,0 ${sx * RISE.x},${sy * RISE.y} ${end.x},${end.y}`}
          pathLength={1}
          fill="none"
          stroke="var(--foreground)"
          className="callout-draw [stroke-dasharray:1]"
        />
        <circle cx={0} cy={0} r={2.5} fill="var(--foreground)" />
      </svg>
      <div
        className="absolute w-64 border border-foreground bg-background"
        style={{ [x === "right" ? "left" : "right"]: Math.abs(end.x), top: end.y, transform: "translateY(-50%)" }}
      >
        <p className="flex justify-between gap-3 bg-foreground px-2 py-[5px] font-mono text-[13px] leading-none text-background">
          <span className="truncate">{tool.name}</span>
          <span className="shrink-0 opacity-60">
            {tool.uses.length} {tool.uses.length === 1 ? "piece" : "pieces"}
          </span>
        </p>
        <div className="p-2">
          <Thumbs ids={tool.uses} />
        </div>
      </div>
    </div>
  );
}

// A thumbnail for each piece of work.
function Thumbs({ ids, wide = false }: { ids: string[]; wide?: boolean }) {
  return (
    <ul className={`grid gap-1 ${wide ? "grid-cols-6" : "grid-cols-4"}`}>
      {ids.map((id) => (
        <li key={id} className="relative aspect-square overflow-hidden bg-surface" title={titleOf.get(id)}>
          {hasMedia.has(id) ? (
            <Image src={`/work/thumbs/${id}.jpg`} alt={titleOf.get(id) ?? ""} fill sizes="80px" className="object-cover" />
          ) : (
            <span className="gen-dots absolute inset-0" />
          )}
        </li>
      ))}
    </ul>
  );
}
