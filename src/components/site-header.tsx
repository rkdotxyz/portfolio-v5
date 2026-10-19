import Link from "next/link";
import { VersionSwitcher } from "./version-switcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-baseline gap-3 sm:gap-5">
          <Link
            href="/"
            className="shrink-0 text-base font-semibold tracking-tight sm:text-lg"
          >
            rkdotxyz
          </Link>
          <p className="flex min-w-0 flex-wrap items-baseline gap-x-2 font-mono text-[11px] uppercase tracking-wider sm:text-xs">
            <s className="hidden text-muted decoration-foreground/60 sm:inline">
              Senior Product Designer
            </s>
            <s className="text-muted decoration-foreground/60 sm:hidden">Product Designer</s>
            <span className="truncate text-foreground">Creative Technologist</span>
          </p>
        </div>
        <VersionSwitcher />
      </div>
    </header>
  );
}
