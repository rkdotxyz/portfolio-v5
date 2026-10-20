"use client";

import { useEffect, useState } from "react";
import { exploring, toolGroups, type ToolGroup } from "@/content/profile";
import { DetectFrame } from "./detect-frame";

// Fields not tried yet ride along as one more group. They are drawn as targets
// still being searched for (dashed, crawling outline, no score) rather than
// locked-on detections.
const groups: (ToolGroup & { untried?: boolean })[] = [
  ...toolGroups,
  { id: "exploring", label: "Exploring next", tools: exploring, untried: true },
];

// Every tool once, interleaved across groups so a detected group lights up
// chips scattered through the field rather than one block.
const chips = (() => {
  const out: { name: string; group: string; label: string; untried: boolean }[] = [];
  const longest = Math.max(...groups.map((g) => g.tools.length));
  for (let i = 0; i < longest; i++) {
    for (const g of groups) {
      const name = g.tools[i];
      if (!name) continue;
      out.push({
        name,
        group: g.id,
        label: g.label,
        untried: !!g.untried,
      });
    }
  }
  return out;
})();
const knownCount = chips.filter((c) => !c.untried).length;

const SCAN_MS = 2400;

// Toolkit as an object-detection field: pick a group (or let it scan) and its
// tools get detected; hover a single tool to detect just that one.
export function Toolkit() {
  const [active, setActive] = useState(groups[0].id);
  // Clicking a group locks it; hovering the list only pauses the scan.
  const [locked, setLocked] = useState(false);
  const [paused, setPaused] = useState(false);
  const scanning = !locked && !paused;

  useEffect(() => {
    if (!scanning) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setActive((id) => {
        const i = groups.findIndex((g) => g.id === id);
        return groups[(i + 1) % groups.length].id;
      });
    }, SCAN_MS);
    return () => window.clearInterval(t);
  }, [scanning]);

  const lock = (id: string) => {
    setLocked(true);
    setActive(id);
  };

  const group = groups.find((g) => g.id === active)!;

  return (
    <div className="grid gap-4 md:grid-cols-[13rem_1fr] md:gap-6">
      <div
        role="tablist"
        aria-label="Toolkit groups"
        onMouseLeave={() => setPaused(false)}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 pt-3 md:mx-0 md:flex-col md:overflow-visible md:p-0"
      >
        {groups.map((g) => {
          const on = g.id === active;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => lock(g.id)}
              onMouseEnter={() => {
                setPaused(true);
                setActive(g.id);
              }}
              className={`relative flex shrink-0 items-center justify-between gap-4 border px-3 py-2.5 text-left text-sm transition-colors md:w-full ${
                g.untried ? "md:mt-4" : ""
              } ${
                on
                  ? "border-transparent text-foreground"
                  : `${g.untried ? "border-transparent" : "border-dashed border-faint"} text-muted hover:text-foreground`
              }`}
            >
              {g.untried ? <SearchFrame active={on} /> : on && <DetectFrame visible />}
              <span className="whitespace-nowrap">{g.label}</span>
              <span className="font-mono text-[10px] tabular-nums text-muted">
                {String(g.tools.length).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden border border-line">
        <div
          className="flex min-h-64 flex-wrap content-start gap-x-3 gap-y-8 p-5 pt-10 sm:gap-x-4 sm:p-8 sm:pt-12"
          style={{
            backgroundImage: "radial-gradient(circle, var(--faint) 1px, transparent 1.2px)",
            backgroundSize: "24px 24px",
          }}
        >
          {chips.map((c) => {
            const hit = c.group === active;
            if (c.untried) {
              return (
                <span
                  key={c.name}
                  data-sound-hover
                  className={`group relative bg-background px-3 py-2 text-sm italic transition-opacity duration-300 ${
                    hit ? "opacity-100" : "opacity-35 hover:opacity-100"
                  }`}
                >
                  <SearchFrame active={hit} label={hit ? "searching…" : "untried"} />
                  {c.name}
                </span>
              );
            }
            return (
              <span
                key={c.name}
                data-sound-hover
                className={`group relative border bg-background px-3 py-2 text-sm transition-opacity duration-300 ${
                  hit ? "border-transparent opacity-100" : "border-line opacity-35 hover:opacity-100"
                }`}
              >
                <DetectFrame visible={hit} label={c.label.toLowerCase()} />
                {c.name}
              </span>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted sm:text-[11px]">
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${scanning ? "animate-pulse bg-foreground" : "bg-faint"}`}
            />
            {scanning ? "Scanning" : locked ? "Locked" : "Paused"} · {group.label}
          </span>
          <span className="tabular-nums">
            {group.untried
              ? `${group.tools.length} targets · not acquired`
              : `${group.tools.length} / ${knownCount} detected`}
          </span>
        </div>
      </div>
    </div>
  );
}

// Dashed outline for targets not yet acquired; it crawls while active. The tag
// is dashed and unscored, unlike the solid detection tags.
function SearchFrame({ active, label }: { active: boolean; label?: string }) {
  return (
    <>
      <svg
        aria-hidden
        className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-colors ${
          active ? "text-foreground" : "text-faint group-hover:text-muted"
        }`}
      >
        <rect
          x="0.5"
          y="0.5"
          width="100%"
          height="100%"
          fill="none"
          stroke="currentColor"
          strokeDasharray="4 4"
          className={active ? "marching-ants" : ""}
        />
      </svg>
      {label && (
        <span
          aria-hidden
          className={`absolute -left-px bottom-full whitespace-nowrap border border-dashed px-1.5 py-[3px] font-mono text-[10px] not-italic leading-none ${
            active ? "border-foreground text-foreground" : "border-faint text-muted opacity-0 group-hover:opacity-100"
          }`}
        >
          {label}
        </span>
      )}
    </>
  );
}
