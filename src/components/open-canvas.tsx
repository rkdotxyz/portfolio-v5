"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { widthOf, work, type Category } from "@/content/work";
import { pack } from "@/lib/pack";
import { play, type SoundName } from "@/lib/sound";
import { CanvasFilter, CATEGORIES } from "./canvas-filter";
import { CanvasMinimap, type Rect } from "./canvas-minimap";
import { WorkCard, cardHeight, type CalloutDirection } from "./work-card";

type View = { x: number; y: number; s: number };
type Point = { x: number; y: number };
type Layout = "scatter" | "grid";

const MIN_SCALE = 0.3;
const MAX_SCALE = 2.5;
const GRID = 24;
const NOTE_HEIGHT = 44;
// The 2×2 key project cluster at the centre, including the tags above it.
const CLUSTER = { w: 768, top: -322, bottom: 284 };
// Masonry layout: uniform column width and gap, in world px.
const COL = 260;
const GAP = 24;
// The minimap appears once zoomed in past the fitted scale by this much.
const MINIMAP_ZOOM = 1.15;

const ALL = new Set<Category>(CATEGORIES.map((c) => c.id));
const CATEGORY_ORDER: Category[] = ["key-project", "side-project", "exploration"];

// Every draggable thing on the canvas, with its scattered starting position:
// key projects where work.ts puts them, everything else packed around them.
const NOTE_WIDTH = 170;
const KEYS = work.filter((w) => w.category === "key-project");
const keyRects = KEYS.map((w) => ({ x: w.x ?? 0, y: w.y ?? 0, w: widthOf(w), h: cardHeight(w, widthOf(w)) }));
const packed = pack(
  keyRects,
  [
    { id: "note", w: NOTE_WIDTH, h: NOTE_HEIGHT },
    ...work.filter((w) => w.category !== "key-project").map((w) => ({ id: w.id, w: widthOf(w), h: cardHeight(w, widthOf(w)) })),
  ],
  { gap: 28, top: 28, stretch: 1.6, snap: 4 },
);
const ITEMS: { id: string; x: number; y: number; w: number }[] = [
  { id: "note", ...packed.note, w: NOTE_WIDTH },
  ...work.map((w) => ({ id: w.id, ...(w.x !== undefined && w.y !== undefined ? { x: w.x, y: w.y } : packed[w.id]), w: widthOf(w) })),
];
const itemById = new Map(ITEMS.map((i) => [i.id, i]));
const workById = new Map(work.map((w) => [w.id, w]));
const initialPositions = () => Object.fromEntries(ITEMS.map((i) => [i.id, { x: i.x, y: i.y }]));
const initialOrder = () => ITEMS.map((i) => i.id);

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// A press that moves less than this (screen px) counts as a click, not a drag.
const TAP_SLOP = 5;

const gridColumns = (width: number) =>
  width < 640 ? 2 : clamp(Math.floor((width - 96 + GAP) / (COL + GAP)), 2, 5);

// Key projects first, two across at the top (one across on narrow grids),
// since their labels need the width;
// then side projects and explorations packed into the shortest column.
// Centred on world x = 0, starting at world y = 0.
const LABEL_ROOM = 28; // space above a card for its detection label
function masonry(cols: number, shown: Set<Category>) {
  const total = cols * COL + (cols - 1) * GAP;
  const x0 = -total / 2;
  const perRow = cols > 2 ? 2 : 1;
  const keyWidth = (total - GAP * (perRow - 1)) / perRow;
  const positions: Record<string, Point> = {};

  let y = 0;
  const keys = work.filter((w) => w.category === "key-project" && shown.has(w.category));
  keys.forEach((w, i) => {
    positions[w.id] = { x: x0 + (i % perRow) * (keyWidth + GAP), y };
    if (i % perRow === perRow - 1 || i === keys.length - 1) y += cardHeight(w, keyWidth) + LABEL_ROOM;
  });

  const colY = Array<number>(cols).fill(y);
  const rest = CATEGORY_ORDER.filter((c) => c !== "key-project").flatMap((c) =>
    work.filter((w) => w.category === c && shown.has(c)),
  );
  for (const w of rest) {
    const c = colY.indexOf(Math.min(...colY));
    positions[w.id] = { x: x0 + c * (COL + GAP), y: colY[c] };
    colY[c] += cardHeight(w, COL) + GAP;
  }
  return { positions, width: total, keyWidth };
}

export function OpenCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, s: 1 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [fitScale, setFitScale] = useState(1);
  const [positions, setPositions] = useState<Record<string, Point>>(initialPositions);
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [activeId, setActiveId] = useState<string | null>(null);
  // A side project or exploration whose callout is held open by a tap.
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [shown, setShown] = useState<Set<Category>>(ALL);
  const [layout, setLayout] = useState<Layout>("scatter");
  const [animating, setAnimating] = useState(false);
  const [ready, setReady] = useState(false);
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  // Active pointers on the background, for panning and pinch-zoom.
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ dist: number; mid: Point } | null>(null);
  // Active card drag.
  const drag = useRef<{ id: string; pointerId: number; last: Point; start: Point; moved: boolean } | null>(null);
  // A single-finger press on the background, to tell a click on a card from a pan.
  const tap = useRef<{ start: Point; moved: boolean } | null>(null);
  const router = useRouter();

  // Key projects open their case study. Other cards with a live site open it
  // in a new tab: straight away with a mouse, or on a second tap on touch,
  // where the first tap shows the callout. The rest toggle their callout.
  const openProject = (id: string, pointerType = "mouse") => {
    const w = workById.get(id);
    if (w?.category === "key-project") {
      play("open");
      router.push(`/work/${id}`);
    } else if (w?.url && (pointerType === "mouse" || pinnedId === id)) {
      play("open");
      window.open(w.url, "_blank", "noopener,noreferrer");
    } else {
      play("click");
      setPinnedId((p) => (p === id ? null : id));
    }
  };

  // Old shared links used ?project=<id>; send them to the project's page.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("project");
    if (id && workById.get(id)?.category === "key-project") router.replace(`/work/${id}`);
  }, [router]);

  const animTimer = useRef<number | undefined>(undefined);
  const fitted = useRef(false);

  // Ease the next view/layout change instead of jumping.
  const animate = () => {
    setAnimating(true);
    window.clearTimeout(animTimer.current);
    animTimer.current = window.setTimeout(() => setAnimating(false), 600);
  };

  const grid = useMemo(
    () => masonry(gridColumns(size.w), shown),
    [size.w, shown],
  );

  const fitScatter = useCallback((width: number, height: number) => {
    // Fit the key project cluster with room around it, so side projects and
    // explorations peek in from the edges as an invitation to pan.
    const fitScene =
      width < 640
        ? (width - 32) / CLUSTER.w
        : Math.min(width / (CLUSTER.w + 320), height / (CLUSTER.bottom - CLUSTER.top + 120));
    const s = clamp(fitScene, MIN_SCALE, 1);
    setFitScale(s);
    setView({ x: width / 2, y: height / 2 - ((CLUSTER.top + CLUSTER.bottom) / 2) * s, s });
  }, []);

  const fitGrid = (width: number, gridWidth: number) => {
    const s = clamp((width - 32) / gridWidth, MIN_SCALE, 1);
    setFitScale(s);
    setView({ x: width / 2, y: 32, s });
  };

  // Track the canvas size; fit once it is first measured, then reveal.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
      if (!fitted.current) {
        fitted.current = true;
        fitScatter(width, height);
        setReady(true);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fitScatter]);

  const zoomAt = useCallback((p: Point, factor: number) => {
    setView((v) => {
      const s = clamp(v.s * factor, MIN_SCALE, MAX_SCALE);
      const k = s / v.s;
      return { s, x: p.x - (p.x - v.x) * k, y: p.y - (p.y - v.y) * k };
    });
  }, []);

  // Wheel needs a non-passive listener to stop the browser zooming the page.
  // Plain scrolling is left alone so the page still scrolls past the hero.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt({ x: e.clientX - r.left, y: e.clientY - r.top }, Math.exp(-e.deltaY * 0.01));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const local = (e: ReactPointerEvent): Point => {
    const r = rootRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onBgDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, local(e));
    tap.current = pointers.current.size === 1 ? { start: { x: e.clientX, y: e.clientY }, moved: false } : null;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
    }
  };

  const onBgMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    if (tap.current && Math.hypot(e.clientX - tap.current.start.x, e.clientY - tap.current.start.y) > TAP_SLOP) {
      tap.current.moved = true;
    }

    if (pointers.current.size === 1) {
      setView((v) => ({ ...v, x: v.x + p.x - prev.x, y: v.y + p.y - prev.y }));
    } else if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const last = pinch.current;
      setView((v) => ({ ...v, x: v.x + mid.x - last.mid.x, y: v.y + mid.y - last.mid.y }));
      zoomAt(mid, dist / last.dist);
      pinch.current = { dist, mid };
    }
  };

  const onBgUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    // A tap that didn't pan: open the card under it (cards in the grid
    // layout aren't draggable, so their clicks arrive here).
    if (tap.current && !tap.current.moved && pointers.current.size === 0) {
      const card = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-work-id]");
      if (card?.dataset.workId) openProject(card.dataset.workId, e.pointerType);
      else setPinnedId(null);
    }
    tap.current = null;
  };

  const onCardDown = (id: string) => (e: ReactPointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id, pointerId: e.pointerId, last: local(e), start: { x: e.clientX, y: e.clientY }, moved: false };
    setActiveId(id);
    play("pickup");
    // Bring the dragged card to the top.
    setOrder((list) => [...list.filter((i) => i !== id), id]);
  };

  const onCardMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const p = local(e);
    if (Math.hypot(e.clientX - d.start.x, e.clientY - d.start.y) > TAP_SLOP) d.moved = true;
    const s = viewRef.current.s;
    const dx = (p.x - d.last.x) / s;
    const dy = (p.y - d.last.y) / s;
    d.last = p;
    setPositions((all) => ({ ...all, [d.id]: { x: all[d.id].x + dx, y: all[d.id].y + dy } }));
  };

  const onCardUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d?.pointerId !== e.pointerId) return;
    drag.current = null;
    setActiveId(null);
    if (d.moved) play("drop");
    else if (workById.has(d.id)) openProject(d.id, e.pointerType);
  };

  const center = (): Point => ({ x: size.w / 2, y: size.h / 2 });

  const toggleLayout = () => {
    animate();
    if (layout === "scatter") {
      setLayout("grid");
      fitGrid(size.w, grid.width);
    } else {
      setLayout("scatter");
      fitScatter(size.w, size.h);
    }
  };

  const toggleCategory = (c: Category) => {
    if (layout === "grid") animate();
    setShown((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const reset = () => {
    animate();
    setLayout("scatter");
    setPositions(initialPositions());
    setOrder(initialOrder());
    setShown(ALL);
    fitScatter(size.w, size.h);
  };

  const navigate = (wx: number, wy: number) =>
    setView((v) => ({ ...v, x: size.w / 2 - wx * v.s, y: size.h / 2 - wy * v.s }));

  // Where each item sits right now, and whether it is shown.
  const placed = order.map((id) => {
    const item = itemById.get(id)!;
    const w = workById.get(id);
    const inGrid = layout === "grid";
    const visible = w ? shown.has(w.category) : !(inGrid && id === "note");
    const pos = inGrid && grid.positions[id] ? grid.positions[id] : positions[id];
    const width = inGrid && w ? (w.category === "key-project" ? grid.keyWidth : COL) : item.w;
    const height = w ? cardHeight(w, width) : NOTE_HEIGHT;
    return { id, w, visible, pos, width, height };
  });

  const minimapRects: Rect[] = placed
    .filter((p) => p.visible)
    .map((p) => ({ id: p.id, x: p.pos.x, y: p.pos.y, w: p.width, h: p.height, strong: p.w?.category === "key-project" }));

  // Keep the dots the same size and roughly the same spacing at any zoom:
  // the world grid doubles or halves to stay within a band around GRID on
  // screen, like a design tool's canvas, while still moving with the pan.
  let gridSize = GRID * view.s;
  while (gridSize < GRID * 0.75) gridSize *= 2;
  while (gridSize >= GRID * 1.5) gridSize /= 2;
  const ease = animating ? "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" : "";

  return (
    <section
      aria-label="Open canvas"
      className="relative h-[calc(100svh-3.5rem-3rem)] w-full overflow-clip border-b border-line sm:h-[calc(100svh-4rem-3rem)]"
    >
      {/* The page's heading; the canvas itself is visual. */}
      <h1 className="sr-only">Rama Krushna Behera, creative technologist: selected work</h1>
      <div
        ref={rootRef}
        onPointerDown={onBgDown}
        onPointerMove={onBgMove}
        onPointerUp={onBgUp}
        onPointerCancel={onBgUp}
        className={`absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing ${ease}`}
        style={{
          backgroundImage: "radial-gradient(circle, var(--faint) 1px, transparent 1.2px)",
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${view.x}px ${view.y}px`,
        }}
      >
        <div
          className={`absolute left-0 top-0 origin-top-left ${ease} ${ready ? "opacity-100" : "opacity-0"}`}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
        >
          {placed.map(({ id, w, visible, pos, width }) => {
            const draggable = layout === "scatter" && visible;
            const isKey = w?.category === "key-project";
            const pinned = pinnedId === id;
            // Point the callout toward the middle of the view, and below the
            // card when it sits near the top.
            const callout: CalloutDirection = {
              x: view.x + (pos.x + width / 2) * view.s > size.w / 2 ? "left" : "right",
              y: view.y + pos.y * view.s < 180 ? "down" : "up",
            };
            const hidden = layout === "grid" ? "pointer-events-none opacity-0" : "pointer-events-none opacity-10";
            return (
              <div
                key={id}
                data-work-id={w ? id : undefined}
                onPointerDown={draggable ? onCardDown(id) : undefined}
                onPointerMove={draggable ? onCardMove : undefined}
                onPointerUp={draggable ? onCardUp : undefined}
                onPointerCancel={draggable ? onCardUp : undefined}
                className={`absolute hover:z-30 ${pinned ? "z-30" : ""} ${
                  animating ? ease : "transition-opacity duration-300"
                } ${draggable ? "cursor-move touch-none" : isKey || w?.url ? "cursor-pointer" : ""} ${visible ? "" : hidden}`}
                style={{ left: pos.x, top: pos.y, width }}
              >
                {w ? (
                  <WorkCard item={w} active={activeId === id || pinned} callout={callout} scale={view.s} />
                ) : (
                  <NoteCard />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom left: filter */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
        <CanvasFilter
          shown={shown}
          onToggle={toggleCategory}
          onReset={() => {
            if (layout === "grid") animate();
            setShown(ALL);
          }}
        />
      </div>

      {/* Bottom right: minimap above layout + zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
        <CanvasMinimap
          rects={minimapRects}
          viewport={{ x: -view.x / view.s, y: -view.y / view.s, w: size.w / view.s, h: size.h / view.s }}
          visible={ready && view.s > fitScale * MINIMAP_ZOOM}
          onNavigate={navigate}
        />
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center overflow-hidden rounded-full border border-line bg-surface/90 font-mono text-[11px] backdrop-blur sm:text-xs"
        >
          <CanvasButton
            label={layout === "scatter" ? "Arrange in a grid" : "Scatter cards"}
            pressed={layout === "grid"}
            sound="arrange"
            onClick={toggleLayout}
          >
            {layout === "scatter" ? <GridIcon /> : <ScatterIcon />}
          </CanvasButton>
          <span aria-hidden className="h-5 w-px bg-line" />
          <CanvasButton label="Zoom out" sound="zoom-out" onClick={() => zoomAt(center(), 1 / 1.2)}>
            −
          </CanvasButton>
          <span className="hidden w-11 text-center tabular-nums text-muted sm:inline">{Math.round(view.s * 100)}%</span>
          <CanvasButton label="Zoom in" sound="zoom-in" onClick={() => zoomAt(center(), 1.2)}>
            +
          </CanvasButton>
          <CanvasButton label="Reset canvas" sound="arrange" onClick={reset}>
            ⟲
          </CanvasButton>
        </div>
      </div>
    </section>
  );
}

function CanvasButton({
  label,
  onClick,
  pressed,
  sound,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  sound?: SoundName;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      data-sound={sound}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-line hover:text-foreground"
    >
      {children}
    </button>
  );
}

function GridIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="2" y="2" width="5" height="7" />
      <rect x="9" y="2" width="5" height="4" />
      <rect x="2" y="11" width="5" height="3" />
      <rect x="9" y="8" width="5" height="6" />
    </svg>
  );
}

function ScatterIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="1.5" y="2" width="5" height="4" transform="rotate(-8 4 4)" />
      <rect x="9" y="1.5" width="5" height="5" transform="rotate(6 11.5 4)" />
      <rect x="4" y="9" width="6" height="5" transform="rotate(-4 7 11.5)" />
    </svg>
  );
}

function NoteCard() {
  return (
    <div className="-rotate-3 rounded-sm bg-foreground px-4 py-3 font-mono text-xs text-background">
      psst, drag anything ↗
    </div>
  );
}
