// Strip under the canvas so the first fold signals there is more below.
export function ScrollCue() {
  return (
    <div className="flex h-12 items-center justify-between border-b border-line px-4 font-mono text-[10px] uppercase tracking-wider text-muted sm:px-6 sm:text-[11px]">
      <span className="flex items-center gap-2">
        <span aria-hidden className="scroll-cue-arrow inline-block">↓</span>
        Scroll for more
      </span>
      <a href="#contact" className="transition-colors hover:text-foreground">
        Get in touch ↘
      </a>
    </div>
  );
}
