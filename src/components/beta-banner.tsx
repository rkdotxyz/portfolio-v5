// A full-width note under the header that the site is still in beta, in
// inverted colours so it reads as a notice. Its height is --beta-h (in
// globals.css), which the canvas subtracts so it still fits the first screen.
export function BetaBanner() {
  return (
    <div
      role="note"
      className="flex h-[var(--beta-h)] items-center gap-2.5 bg-foreground px-4 font-mono text-[10px] uppercase tracking-wider text-background sm:px-6 sm:text-[11px]"
    >
      <span className="shrink-0 bg-background px-1.5 py-[3px] leading-none text-foreground">Beta</span>
      <span className="truncate">
        <span className="sm:hidden">Still being refined, so expect a few rough edges.</span>
        <span className="hidden sm:inline lg:hidden">This site is still being refined, so you may notice a few rough edges.</span>
        <span className="hidden lg:inline">
          This site is still being refined, so you may notice a few rough edges or details that change. Thanks for your
          patience.
        </span>
      </span>
    </div>
  );
}
