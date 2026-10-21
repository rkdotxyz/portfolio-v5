"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ *
 *  A custom cursor for mouse and trackpad (never touch).
 *
 *  On the canvas it's a reticle: a crosshair reading out world
 *  coordinates, which locks onto a card with corner ticks (pulled gently
 *  toward the card's centre) and says what clicking will do, and reads
 *  "moving" while dragging. Elsewhere it reads its target: an I-beam over
 *  text, a ring tagged "open" over links, "play" or "pause" over video.
 *
 *  Everything is drawn by writing to the DOM on animation frames, so it
 *  never re-renders React. Drawn white with difference blending, so it
 *  stays visible on black and on white.
 * ------------------------------------------------------------------ */

type Mode = "cross" | "lock" | "drag" | "text" | "link" | "video" | "dot";

const TEXT = "p, li, h1, h2, h3, h4, blockquote, figcaption, dd, dt";
const INTERACTIVE = "a, button, [role=button], summary, label, select, [data-sound-hover]";

export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const corners = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    html.classList.add("custom-cursor");

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const box = { x: 0, y: 0, w: 0, h: 0 };
    let tlLift = 0; // how far the top-left tick rises above the box
    let mode: Mode = "dot";
    let label = "";
    let lockEl: Element | null = null;
    let canvasEl: Element | null = null;
    let pressedOnCard = false;
    let moved = false;
    let shown = false;
    let raf = 0;

    const setLabel = (text: string) => {
      if (text === label) return;
      label = text;
      tag.current!.textContent = text;
      if (shown) tag.current!.style.opacity = text ? "1" : "0";
    };

    // Work out what the pointer is over, and so what the cursor should be.
    const classify = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      lockEl = null;
      canvasEl = el?.closest('section[aria-label="Open canvas"]') ?? null;
      if (pressedOnCard && moved) return (mode = "drag");
      if (!el) return (mode = "dot");

      if (canvasEl) {
        const card = el.closest("[data-work-id]");
        if (card) {
          lockEl = card;
          return (mode = "lock");
        }
        if (el.closest(INTERACTIVE)) return (mode = "link");
        return (mode = "cross");
      }

      const video = el.closest("video");
      if (video && video.controls) return (mode = "video");
      if (el.closest('button[aria-label^="Play video"]')) return (mode = "video");
      if (el.closest(INTERACTIVE)) return (mode = "link");
      if (el.closest(TEXT) && (el.textContent ?? "").trim()) return (mode = "text");
      return (mode = "dot");
    };

    const labelFor = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      switch (mode) {
        case "lock": {
          const card = lockEl as HTMLElement;
          const opens = card.getAttribute("aria-label") ?? "";
          if (opens.includes("case study")) return "→ case study";
          if (opens.includes("live site")) return "↗ open";
          // Nothing happens on click, so no tag: the corner ticks are enough.
          return "";
        }
        case "drag":
          return "moving";
        case "video": {
          const video = el?.closest("video");
          return video && !video.paused ? "❚❚ pause" : "▶ play";
        }
        case "link": {
          const a = el?.closest("a");
          if (a?.hasAttribute("download")) return "↓ download";
          if (a?.getAttribute("target") === "_blank") return "↗ open";
          if (a) return "→ open";
          return "";
        }
        default:
          return "";
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return hide();
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (pressedOnCard && Math.hypot(e.movementX, e.movementY) > 0) moved = true;
      classify(e.target);
      setLabel(labelFor(e.target));
      if (!shown) {
        shown = true;
        pos.x = mouse.x;
        pos.y = mouse.y;
        root.current!.style.opacity = "1";
        tag.current!.style.opacity = label ? "1" : "0";
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pressedOnCard = !!(e.target instanceof Element && e.target.closest('section[aria-label="Open canvas"] [data-work-id]'));
      moved = false;
      root.current!.dataset.pressed = "true";
    };
    const onUp = (e: PointerEvent) => {
      pressedOnCard = false;
      moved = false;
      root.current!.dataset.pressed = "false";
      classify(e.target);
      setLabel(labelFor(e.target));
    };
    const hide = () => {
      shown = false;
      root.current!.style.opacity = "0";
      tag.current!.style.opacity = "0";
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      // Over a card the cursor leans toward the card's centre (the magnet).
      let tx = mouse.x;
      let ty = mouse.y;
      if (mode === "lock" && lockEl) {
        const r = lockEl.getBoundingClientRect();
        // The detection tags sit on the card's top-left edge, so only the
        // top-left tick lifts above them; the others hug the card.
        const tags = lockEl.querySelector("[data-detect-label]")?.getBoundingClientRect();
        const lift = tags ? Math.max(0, r.top - tags.top) : 0;
        tlLift += (lift - tlLift) * (reduce ? 1 : 0.25);
        tx += (r.left + r.width / 2 - mouse.x) * 0.12;
        ty += (r.top + r.height / 2 - mouse.y) * 0.12;
        const pad = 6;
        const k = reduce ? 1 : 0.25;
        box.x += (r.left - pad - box.x) * k;
        box.y += (r.top - pad - box.y) * k;
        box.w += (r.width + pad * 2 - box.w) * k;
        box.h += (r.height + pad * 2 - box.h) * k;
      } else {
        // Corner ticks collapse back onto the pointer.
        const k = reduce ? 1 : 0.3;
        tlLift += (0 - tlLift) * k;
        box.x += (mouse.x - 10 - box.x) * k;
        box.y += (mouse.y - 10 - box.y) * k;
        box.w += (20 - box.w) * k;
        box.h += (20 - box.h) * k;
      }
      const k = reduce ? 1 : 0.35;
      pos.x += (tx - pos.x) * k;
      pos.y += (ty - pos.y) * k;

      const at = `translate(${pos.x}px, ${pos.y}px)`;
      cross.current!.style.transform = at;
      beam.current!.style.transform = at;
      ring.current!.style.transform = at;
      corners.current!.style.transform = `translate(${box.x}px, ${box.y}px)`;
      corners.current!.style.width = `${box.w}px`;
      corners.current!.style.height = `${box.h}px`;
      corners.current!.style.setProperty("--tl-lift", `${tlLift}px`);
      // Keep the ticks inside the canvas, so a card half under the header
      // doesn't draw them over the header, the beta banner or the footer bar.
      const section = mode === "lock" ? canvasEl?.getBoundingClientRect() : undefined;
      corners.current!.style.clipPath = section
        ? `inset(${Math.max(section.top - box.y, -(tlLift + 2))}px ${Math.max(box.x + box.w - section.right, -2)}px ${Math.max(
            box.y + box.h - section.bottom,
            -2,
          )}px ${Math.max(section.left - box.x, -2)}px)`
        : "none";

      // On empty canvas the readout is the world position under the pointer.
      if (mode === "cross" && canvasEl) {
        const world = canvasEl.querySelector<HTMLElement>("[data-canvas-world]");
        const parent = world?.parentElement?.getBoundingClientRect();
        if (world && parent) {
          const s = Number(world.dataset.s) || 1;
          const x = Math.round((mouse.x - parent.left - Number(world.dataset.x)) / s);
          const y = Math.round((mouse.y - parent.top - Number(world.dataset.y)) / s);
          setLabel(`x ${x}  y ${y}`);
        }
      }
      tag.current!.style.transform = `translate(${pos.x + 14}px, ${pos.y + 14}px)`;

      const show = (el: HTMLElement | null, on: boolean) => {
        if (el) el.style.opacity = on ? "1" : "0";
      };
      show(cross.current, mode === "cross" || mode === "drag");
      show(beam.current, mode === "text");
      show(ring.current, mode === "link" || mode === "video" || mode === "dot" || mode === "lock");
      show(corners.current, mode === "lock");
      ring.current!.dataset.size = mode === "link" || mode === "video" ? "big" : "small";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    html.addEventListener("pointerleave", hide);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      html.removeEventListener("pointerleave", hide);
      html.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={root}
        aria-hidden
        data-pressed="false"
        className="cursor-root pointer-events-none fixed inset-0 z-[200] opacity-0 mix-blend-difference"
      >
        {/* Crosshair, with a gap at the centre. */}
        <div ref={cross} className="absolute left-0 top-0 transition-opacity duration-150">
          <span className="absolute -left-[9px] top-0 h-px w-[6px] bg-white" />
          <span className="absolute left-[3px] top-0 h-px w-[6px] bg-white" />
          <span className="absolute -top-[9px] left-0 h-[6px] w-px bg-white" />
          <span className="absolute left-0 top-[3px] h-[6px] w-px bg-white" />
        </div>
        {/* I-beam over text. */}
        <div ref={beam} className="absolute left-0 top-0 opacity-0 transition-opacity duration-150">
          <span className="absolute -left-px -top-[11px] h-[22px] w-[2px] bg-white" />
        </div>
        {/* A dot that grows into a ring over things you can click. */}
        <div ref={ring} className="cursor-ring absolute left-0 top-0 opacity-0 transition-opacity duration-150">
          <span className="absolute rounded-full border border-white bg-white transition-all duration-200" />
        </div>
        {/* Corner ticks that lock onto a card. */}
        <div ref={corners} className="absolute left-0 top-0 opacity-0 transition-opacity duration-150">
          <span className="absolute left-0 top-[calc(-1*var(--tl-lift,0px))] h-2.5 w-2.5 border-l border-t border-white" />
          <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-white" />
          <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-white" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-white" />
        </div>
      </div>
      {/* What the pointer is over, or where it is: a solid label tab, like
          the detection tags, so it reads over any image. */}
      <div
        ref={tag}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] whitespace-pre bg-foreground px-1.5 py-[3px] font-mono text-[10px] uppercase leading-none tracking-wider text-background opacity-0 transition-opacity duration-150"
      />
    </>
  );
}
