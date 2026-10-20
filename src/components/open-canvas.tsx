"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { work, type Category } from "@/content/work";
import { play, type SoundName } from "@/lib/sound";
import { CanvasFilter, CATEGORIES } from "./canvas-filter";
import { CaseStudyDialog } from "./case-study-dialog";
import { CanvasMinimap, type Rect } from "./canvas-minimap";
import { WorkCard, cardHeight } from "./work-card";

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

// Every draggable thing on the canvas, with its scattered starting position.
const ITEMS: { id: string; x: number; y: number; w: number }[] = [
  { id: "note", x: -440, y: 330, w: 170 },
  ...work.map(({ id, x, y, w }) => ({ id, x, y, w })),
];
const itemById = new Map(ITEMS.map((i) => [i.id, i]));
const workById = new Map(work.map((w) => [w.id, w]));
const initialPositions = () => Object.fromEntries(ITEMS.map((i) => [i.id, { x: i.x, y: i.y }]));
const initialOrder = () => ITEMS.map((i) => i.id);

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// A press that moves less than this (screen px) counts as a click, not a drag.
const TAP_SLOP = 5;

// The open case study lives in the URL (?project=<id>) so it can be linked to
// and the back button closes it.
const PROJECT_EVENT = "projectchange";
const subscribeProject = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  window.addEventListener(PROJECT_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(PROJECT_EVENT, onChange);
  };
};
const readProject = () => new URLSearchParams(window.location.search).get("project");
const setProjectParam = (id: string | null, mode: "push" | "replace") => {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("project", id);
  else url.searchParams.delete("project");
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(PROJECT_EVENT));
};

const gridColumns = (width: number) =>
  width < 640 ? 2 : clamp(Math.floor((width - 96 + GAP) / (COL + GAP)), 2, 5);

// Shown work packed into the shortest column, key projects first. Centred on
// world x = 0, starting at world y = 0.
function masonry(cols: number, shown: Set<Category>) {
  const total = cols * COL + (cols - 1) * GAP;
  const x0 = -total / 2;
  const positions: Record<string, Point> = {};
  const colY = Array<number>(cols).fill(0);
  const items = CATEGORY_ORDER.flatMap((c) => work.filter((w) => w.category === c && shown.has(c)));
  for (const w of items) {
    const c = colY.indexOf(Math.min(...colY));
    positions[w.id] = { x: x0 + c * (COL + GAP), y: colY[c] };
    colY[c] += cardHeight(w.category, COL) + GAP;
  }
  return { positions, width: total };
}

export function OpenCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, s: 1 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [fitScale, setFitScale] = useState(1);
  const [positions, setPositions] = useState<Record<string, Point>>(initialPositions);
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [activeId, setActiveId] = useState<string | null>(null);
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
  const pushedProject = useRef(false);

  const projectId = useSyncExternalStore(subscribeProject, readProject, () => null);
  const openItem = projectId ? (workById.get(projectId) ?? null) : null;

  const openProject = (id: string) => {
    if (!projectId) play("open");
    // First open adds a history entry; moving between projects replaces it.
    if (!projectId) pushedProject.current = true;
    setProjectParam(id, projectId ? "replace" : "push");
  };
  const closeProject = () => {
    play("close");
    if (pushedProject.current) {
      pushedProject.current = false;
      window.history.back();
    } else {
      setProjectParam(null, "replace");
    }
  };
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
      if (card?.dataset.workId) openProject(card.dataset.workId);
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
    else if (workById.has(d.id)) openProject(d.id);
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
    const width = inGrid && w ? COL : item.w;
    const height = w ? cardHeight(w.category, width) : NOTE_HEIGHT;
    return { id, w, visible, pos, width, height };
  });

  const minimapRects: Rect[] = placed
    .filter((p) => p.visible)
    .map((p) => ({ id: p.id, x: p.pos.x, y: p.pos.y, w: p.width, h: p.height, strong: p.w?.category === "key-project" }));

  const gridSize = GRID * view.s;
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
            const hidden = layout === "grid" ? "pointer-events-none opacity-0" : "pointer-events-none opacity-10";
            return (
              <div
                key={id}
                data-work-id={w ? id : undefined}
                onPointerDown={draggable ? onCardDown(id) : undefined}
                onPointerMove={draggable ? onCardMove : undefined}
                onPointerUp={draggable ? onCardUp : undefined}
                onPointerCancel={draggable ? onCardUp : undefined}
                className={`absolute ${animating ? ease : "transition-opacity duration-300"} ${
                  draggable ? "cursor-move touch-none" : w ? "cursor-pointer" : ""
                } ${visible ? "" : hidden}`}
                style={{ left: pos.x, top: pos.y, width }}
              >
                {w ? (
                  <WorkCard item={w} active={activeId === id} />
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
      <CaseStudyDialog item={openItem} onClose={closeProject} onOpen={openProject} />
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
