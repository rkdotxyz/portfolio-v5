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
          <p className="truncate font-mono text-[10px] uppercase tracking-wide text-muted sm:text-xs sm:tracking-wider">
            Creative Technologist
          </p>
        </div>
        <VersionSwitcher />
      </div>
    </header>
  );
}
