"use client";

import { useEffect, useRef, useState } from "react";

type Version = {
  label: string;
  note: string;
  href?: string;
  current?: boolean;
};

// Each past portfolio. Versions without an href are archived and not live.
const versions: Version[] = [
  { label: "v5", note: "you are here", current: true },
  { label: "v4", note: "ramakrushna.xyz", href: "https://ramakrushna.xyz" },
  { label: "v3", note: "ramakrushna.webflow.io", href: "https://ramakrushna.webflow.io" },
  { label: "v2", note: "archived" },
  { label: "v1", note: "archived" },
];

export function VersionSwitcher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-faint px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors hover:border-foreground sm:text-xs"
      >
        <span>v5</span>
        <span className="rounded-full bg-foreground px-1.5 py-px text-[10px] text-background">
          beta
        </span>
        <svg
          aria-hidden
          viewBox="0 0 10 6"
          className={`h-1.5 w-2.5 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-60 overflow-hidden rounded-lg border border-line bg-surface py-1 font-mono text-xs shadow-2xl shadow-black">
          {versions.map((v) => {
            const row = (
              <>
                <span className={v.current ? "text-foreground" : "text-foreground/80"}>{v.label}</span>
                <span className="truncate text-muted group-hover:text-foreground">{v.note}</span>
                {v.href && (
                  <span aria-hidden className="ml-auto text-faint group-hover:text-foreground">
                    ↗
                  </span>
                )}
              </>
            );
            const cls = "group flex items-center gap-3 px-3 py-2.5";
            return (
              <li key={v.label}>
                {v.href ? (
                  <a
                    href={v.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cls} hover:bg-line`}
                  >
                    {row}
                  </a>
                ) : (
                  <span className={`${cls} ${v.current ? "" : "opacity-50"}`}>{row}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
