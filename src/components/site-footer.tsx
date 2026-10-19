const links = [
  { label: "Email", value: "ramakrushna.design@gmail.com", href: "mailto:ramakrushna.design@gmail.com" },
  { label: "GitHub", value: "@rkdotxyz", href: "https://github.com/rkdotxyz" },
  { label: "Photography", value: "@rkdotphotography", href: "https://www.instagram.com/rkdotphotography/" },
  { label: "Previous site", value: "ramakrushna.xyz", href: "https://ramakrushna.xyz" },
];

export function SiteFooter() {
  return (
    <footer className="flex min-h-[80svh] flex-col justify-between gap-16 overflow-hidden px-4 pt-20 sm:px-6 sm:pt-28">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted sm:text-xs">
            Open to creative & design technologist roles
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
            Have something that should feel alive? Let&apos;s talk.
          </h2>
          <a
            href="mailto:ramakrushna.design@gmail.com"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm text-background transition-opacity hover:opacity-80"
          >
            Say hi <span aria-hidden>↗</span>
          </a>
        </div>

        <ul className="self-end border-t border-line">
          {links.map((l) => (
            <li key={l.label} className="border-b border-line">
              <a
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-4 py-3.5"
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted sm:text-xs">
                  {l.label}
                </span>
                <span className="truncate text-sm transition-colors group-hover:text-muted">
                  {l.value} <span aria-hidden className="text-muted group-hover:text-foreground">↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-wider text-muted sm:text-[11px]">
          <span>© 2026 Rama Krushna Behera</span>
          <span>v5 beta · built with Next.js</span>
        </div>
        <p
          aria-hidden
          className="-mb-[0.18em] select-none whitespace-nowrap text-center text-[19.5vw] font-semibold leading-none tracking-[-0.06em]"
        >
          rkdotxyz
        </p>
      </div>
    </footer>
  );
}
