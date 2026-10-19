// MediaPipe-style detection frame: a 1px box with corner brackets flush
// against it and an optional tag above the top-left corner.
// Place inside a `relative group` parent. It shows on group hover, or when
// the parent has data-active="true", or always with `visible`.
export function DetectFrame({ label, visible = false }: { label?: string; visible?: boolean }) {
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
      <Corner className="-left-[2px] -top-[2px] border-l-2 border-t-2" />
      <Corner className="-right-[2px] -top-[2px] border-r-2 border-t-2" />
      <Corner className="-bottom-[2px] -left-[2px] border-b-2 border-l-2" />
      <Corner className="-bottom-[2px] -right-[2px] border-b-2 border-r-2" />
      {label && (
        <span className="absolute -left-[2px] bottom-full mb-[2px] whitespace-nowrap bg-foreground px-1.5 py-1 font-mono text-[10px] leading-none text-background">
          {label}
        </span>
      )}
    </span>
  );
}

function Corner({ className }: { className: string }) {
  return <span className={`absolute h-3 w-3 border-foreground ${className}`} />;
}
