import Link from "next/link";
import { VersionSwitcher } from "./version-switcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-5">
          <Link
            href="/"
            className="shrink-0 text-base font-semibold leading-tight tracking-tight sm:text-lg"
          >
            rkdotxyz
          </Link>
          <p className="truncate font-mono text-[10px] uppercase tracking-wide text-muted sm:text-xs sm:tracking-wider">
            Creative Technologist
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="/rama-krushna-behera-cv.pdf"
            download
            className="flex items-center gap-1.5 rounded-full border border-faint px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors hover:border-foreground sm:text-xs"
          >
            CV <span aria-hidden>↓</span>
          </a>
          <VersionSwitcher />
        </div>
      </div>
    </header>
  );
}
