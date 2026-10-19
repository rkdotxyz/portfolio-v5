"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";

export type Rect = { id: string; x: number; y: number; w: number; h: number; strong?: boolean };

const W = 160;
const H = 104;
const PAD = 8;

// Overview of the whole canvas with the current viewport. Click or drag to move.
export function CanvasMinimap({
  rects,
  viewport,
  visible,
  onNavigate,
}: {
  rects: Rect[];
  viewport: { x: number; y: number; w: number; h: number };
  visible: boolean;
  onNavigate: (worldX: number, worldY: number) => void;
}) {
  const pressed = useRef(false);
  if (rects.length === 0) return null;

  const minX = Math.min(...rects.map((r) => r.x));
  const minY = Math.min(...rects.map((r) => r.y));
  const maxX = Math.max(...rects.map((r) => r.x + r.w));
  const maxY = Math.max(...rects.map((r) => r.y + r.h));
  const k = Math.min((W - PAD * 2) / (maxX - minX), (H - PAD * 2) / (maxY - minY));
  const ox = (W - (maxX - minX) * k) / 2 - minX * k;
  const oy = (H - (maxY - minY) * k) / 2 - minY * k;

  const toWorld = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onNavigate((e.clientX - r.left - ox) / k, (e.clientY - r.top - oy) / k);
  };

  // Clip the viewport box to the minimap so it never spills out.
  const vx = Math.max(0, viewport.x * k + ox);
  const vy = Math.max(0, viewport.y * k + oy);
  const vw = Math.min(W, viewport.x * k + ox + viewport.w * k) - vx;
  const vh = Math.min(H, viewport.y * k + oy + viewport.h * k) - vy;

  return (
    <div
      aria-hidden
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        pressed.current = true;
        toWorld(e);
      }}
      onPointerMove={(e) => pressed.current && toWorld(e)}
      onPointerUp={() => (pressed.current = false)}
      onPointerCancel={() => (pressed.current = false)}
      className={`relative cursor-crosshair touch-none overflow-hidden rounded-lg border border-line bg-surface/90 backdrop-blur transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
      style={{ width: W, height: H }}
    >
      {rects.map((r) => (
        <span
          key={r.id}
          className={`absolute rounded-[1px] ${r.strong ? "bg-muted" : "bg-faint"}`}
          style={{ left: r.x * k + ox, top: r.y * k + oy, width: r.w * k, height: r.h * k }}
        />
      ))}
      {vw > 0 && vh > 0 && (
        <span
          className="absolute border border-foreground bg-foreground/5"
          style={{ left: vx, top: vy, width: vw, height: vh }}
        />
      )}
    </div>
  );
}
