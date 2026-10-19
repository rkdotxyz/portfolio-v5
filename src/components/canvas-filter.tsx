"use client";

import { useEffect, useRef, useState } from "react";
import { work, type Category } from "@/content/work";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "key-project", label: "Key projects" },
  { id: "project", label: "Projects" },
  { id: "exploration", label: "Explorations" },
];

const counts = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, work.filter((w) => w.category === c.id).length]),
) as Record<Category, number>;

// Filter button with a toast-style panel that rises from the bottom-left corner.
export function CanvasFilter({
  shown,
  onToggle,
  onReset,
}: {
  shown: Set<Category>;
  onToggle: (c: Category) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const all = shown.size === CATEGORIES.length;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative" onPointerDown={(e) => e.stopPropagation()}>
      {open && (
        <div
          role="dialog"
          aria-label="Filter work"
          className="toast-in absolute bottom-full left-0 mb-2 w-[min(18rem,calc(100vw-2rem))] border border-line bg-surface p-2 shadow-2xl shadow-black"
        >
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Show on canvas</p>
            {!all && (
              <button
                type="button"
                onClick={onReset}
                className="font-mono text-[10px] uppercase tracking-wider text-muted hover:text-foreground"
              >
                Show all
              </button>
            )}
          </div>
          {/* Each option reads like a detection: framed and tagged when selected. */}
          <ul className="flex flex-col gap-1.5">
            {CATEGORIES.map((c) => {
              const on = shown.has(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    data-sound={on ? "toggle-off" : "toggle-on"}
                    onClick={() => onToggle(c.id)}
                    className={`relative flex w-full items-center justify-between gap-3 border px-3 py-2.5 text-left text-sm transition-colors ${
                      on
                        ? "border-foreground text-foreground"
                        : "border-dashed border-faint text-muted hover:border-muted hover:text-foreground"
                    }`}
                  >
                    {on && (
                      <>
                        <Corner className="-left-px -top-px border-l-2 border-t-2" />
                        <Corner className="-right-px -top-px border-r-2 border-t-2" />
                        <Corner className="-bottom-px -left-px border-b-2 border-l-2" />
                        <Corner className="-bottom-px -right-px border-b-2 border-r-2" />
                      </>
                    )}
                    <span>{c.label}</span>
                    <span
                      className={`px-1.5 py-1 font-mono text-[10px] leading-none tabular-nums ${
                        on ? "bg-foreground text-background" : "text-muted"
                      }`}
                    >
                      {String(counts[c.id]).padStart(2, "0")}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        data-sound={open ? "close" : "open"}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2 rounded-full border border-line bg-surface/90 px-3.5 font-mono text-[11px] text-muted backdrop-blur transition-colors hover:text-foreground sm:text-xs"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M2 4h12M4 8h8M6 12h4" />
        </svg>
        <span className={all ? "" : "text-foreground"}>
          {all ? "All work" : `${shown.size} of ${CATEGORIES.length}`}
        </span>
      </button>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return <span aria-hidden className={`absolute h-2.5 w-2.5 border-foreground ${className}`} />;
}
