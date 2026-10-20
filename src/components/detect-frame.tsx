// Object-detection frame: a thin white box with solid label tabs sitting
// flush on its top-left edge, like a detector's bounding box. Several labels
// render as separate segments.
// Place inside a `relative group` parent. It shows on group hover, or when
// the parent has data-active="true", or always with `visible`.
export function DetectFrame({ label, visible = false }: { label?: string | string[]; visible?: boolean }) {
  const labels = label ? [label].flat() : [];
  // Hidden frames rest at full size (so they never overflow); showing plays
  // a short snap-in from slightly larger.
  const show = visible
    ? "detect-in opacity-100"
    : "opacity-0 group-hover:detect-in group-hover:opacity-100 group-data-[active=true]:detect-in group-data-[active=true]:opacity-100";
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-10 border border-foreground transition-opacity duration-200 ${show}`}
    >
      {labels.length > 0 && (
        <span className="absolute -left-px bottom-full flex gap-px whitespace-nowrap">
          {labels.map((l) => (
            <span key={l} className="bg-foreground px-2 py-[5px] font-mono text-[13px] leading-none text-background">
              {l}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
