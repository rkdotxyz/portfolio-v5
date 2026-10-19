"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

type View = { x: number; y: number; s: number };
type Point = { x: number; y: number };

type Item = {
  id: string;
  x: number; // world coordinates of the item's top-left corner
  y: number;
  w: number;
  kind: "intro" | "tile" | "note";
  title?: string;
  meta?: string;
  body?: ReactNode;
};

const MIN_SCALE = 0.35;
const MAX_SCALE = 2.5;
const GRID = 24;
const INTRO_WIDTH = 460;

// Placeholder content: swap in real work as sections get built.
const initialItems: Item[] = [
  {
    id: "intro",
    kind: "intro",
    x: -INTRO_WIDTH / 2,
    y: -120,
    w: INTRO_WIDTH,
    body: (
      <>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
          Rama Krushna Behera
        </p>
        <h1 className="mt-3 text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
          Designing and building interactive things where design meets code.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          A senior product designer becoming a creative technologist. This canvas is open: drag the
          cards, pan around, zoom in.
        </p>
      </>
    ),
  },
  { id: "t1", kind: "tile", x: -560, y: -300, w: 220, title: "Gesture Bloom", meta: "exp / 01" },
  { id: "t2", kind: "tile", x: 340, y: -280, w: 220, title: "ESP32 LED Snake", meta: "hw / 02" },
  { id: "t3", kind: "tile", x: -520, y: 160, w: 220, title: "Projection TTT", meta: "exp / 03" },
  { id: "t4", kind: "tile", x: 360, y: 150, w: 220, title: "Motion Studio", meta: "tool / 04" },
  { id: "n1", kind: "note", x: 60, y: 210, w: 170, body: "psst, drag me around ↗" },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function OpenCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, s: 1 });
  const [items, setItems] = useState(initialItems);
  const [ready, setReady] = useState(false);
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  // Active pointers on the background, for panning and pinch-zoom.
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ dist: number; mid: Point } | null>(null);
  // Active card drag.
  const drag = useRef<{ id: string; pointerId: number; last: Point } | null>(null);

  const fit = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    // Desktop: fit the whole scene. Phones: fit the intro card to the width and
    // let the tiles peek in from the edges as an invitation to pan.
    const fitScene = width < 640 ? (width - 32) / INTRO_WIDTH : Math.min(width / 1240, height / 760);
    const s = clamp(fitScene, MIN_SCALE, 1);
    setView({ x: width / 2, y: height / 2, s });
  }, []);

  // Fit once the canvas has a measured size, then reveal it.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      fit();
      setReady(true);
      ro.disconnect();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);

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
  };

  const onCardDown = (id: string) => (e: ReactPointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id, pointerId: e.pointerId, last: local(e) };
    // Bring the dragged card to the top.
    setItems((list) => [...list.filter((i) => i.id !== id), list.find((i) => i.id === id)!]);
  };

  const onCardMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const p = local(e);
    const s = viewRef.current.s;
    const dx = (p.x - d.last.x) / s;
    const dy = (p.y - d.last.y) / s;
    d.last = p;
    setItems((list) => list.map((i) => (i.id === d.id ? { ...i, x: i.x + dx, y: i.y + dy } : i)));
  };

  const onCardUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId === e.pointerId) drag.current = null;
  };

  const center = (): Point => {
    const r = rootRef.current!.getBoundingClientRect();
    return { x: r.width / 2, y: r.height / 2 };
  };

  const gridSize = GRID * view.s;

  return (
    <section
      aria-label="Open canvas"
      className="relative h-[calc(100svh-3.5rem)] w-full overflow-hidden border-b border-line sm:h-[calc(100svh-4rem)]"
    >
      <div
        ref={rootRef}
        onPointerDown={onBgDown}
        onPointerMove={onBgMove}
        onPointerUp={onBgUp}
        onPointerCancel={onBgUp}
        className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{
          backgroundImage: "radial-gradient(circle, var(--faint) 1px, transparent 1.2px)",
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${view.x}px ${view.y}px`,
        }}
      >
        <div
          className={`absolute left-0 top-0 origin-top-left transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})` }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              onPointerDown={onCardDown(item.id)}
              onPointerMove={onCardMove}
              onPointerUp={onCardUp}
              onPointerCancel={onCardUp}
              className="absolute cursor-move touch-none"
              style={{ left: item.x, top: item.y, width: item.w }}
            >
              <CanvasCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Hint, top left */}
      <p className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-wider text-muted sm:left-6 sm:text-[11px]">
        <span className="hidden sm:inline">Drag to pan · ⌘/Ctrl + scroll to zoom</span>
        <span className="sm:hidden">Drag sideways to pan · pinch to zoom</span>
      </p>

      {/* Controls, bottom right */}
      <div className="absolute bottom-4 right-4 flex items-center gap-px overflow-hidden rounded-full border border-line bg-surface font-mono text-xs sm:bottom-6 sm:right-6">
        <CanvasButton label="Zoom out" onClick={() => zoomAt(center(), 1 / 1.2)}>
          −
        </CanvasButton>
        <span className="w-12 text-center tabular-nums text-muted">{Math.round(view.s * 100)}%</span>
        <CanvasButton label="Zoom in" onClick={() => zoomAt(center(), 1.2)}>
          +
        </CanvasButton>
        <CanvasButton label="Reset view" onClick={() => { fit(); setItems(initialItems); }}>
          ⟲
        </CanvasButton>
      </div>
    </section>
  );
}

function CanvasButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-line hover:text-foreground"
    >
      {children}
    </button>
  );
}

function CanvasCard({ item }: { item: Item }) {
  if (item.kind === "intro") {
    return <div className="rounded-xl border border-faint bg-background p-6 sm:p-8">{item.body}</div>;
  }
  if (item.kind === "note") {
    return (
      <div className="-rotate-3 rounded-sm bg-foreground px-4 py-3 font-mono text-xs text-background">
        {item.body}
      </div>
    );
  }
  return (
    <div className="group rounded-lg border border-line bg-surface p-3 transition-colors hover:border-faint">
      <div className="aspect-[4/3] rounded border border-dashed border-line" />
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-sm">{item.title}</span>
        <span className="font-mono text-[10px] uppercase text-faint">{item.meta}</span>
      </div>
    </div>
  );
}
