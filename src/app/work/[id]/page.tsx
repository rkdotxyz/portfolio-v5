import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { DetectFrame } from "@/components/detect-frame";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WorkMedia } from "@/components/work-card";
import { caseStudies, placeholderCaseStudy } from "@/content/case-studies";
import { CATEGORY_LABEL, work } from "@/content/work";

// One page per project, prerendered at build time.
export function generateStaticParams() {
  return work.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: PageProps<"/work/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = work.find((w) => w.id === id);
  if (!item) return {};
  const study = caseStudies[id];
  return {
    title: `${item.title} — rkdotxyz`,
    description: study?.summary,
  };
}

// Header and footer render straight away; the project content waits on the
// route param inside Suspense, so navigation between projects stays instant.
export default function CaseStudyPage({ params }: PageProps<"/work/[id]">) {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<main className="flex-1" />}>
        <CaseStudy params={params} />
      </Suspense>
      <SiteFooter />
    </>
  );
}

async function CaseStudy({ params }: { params: PageProps<"/work/[id]">["params"] }) {
  const { id } = await params;
  const index = work.findIndex((w) => w.id === id);
  if (index < 0) notFound();

  const item = work[index];
  const prev = work[(index - 1 + work.length) % work.length];
  const next = work[(index + 1) % work.length];
  const study = caseStudies[id] ?? placeholderCaseStudy;
  const isDraft = !caseStudies[id];
  const labels = item.tags ?? [CATEGORY_LABEL[item.category]];

  const meta = [
    ["Year", item.year],
    ["Status", study.status],
    ["Role", study.role],
    ["Team", study.team],
  ].filter((m): m is [string, string] => Boolean(m[1]));

  return (
    <main className="flex-1">
      {/* Navigation bar */}
      <nav className="flex h-12 items-center justify-between gap-4 border-b border-line px-4 font-mono text-[10px] uppercase tracking-wider text-muted sm:px-6 sm:text-[11px]">
        <Link href="/" className="transition-colors hover:text-foreground">
          ← All work
        </Link>
        <div className="flex items-center gap-4">
          <Link href={`/work/${prev.id}`} className="transition-colors hover:text-foreground" aria-label={`Previous: ${prev.title}`}>
            ← <span className="hidden sm:inline">{prev.title}</span>
          </Link>
          <span aria-hidden className="h-3 w-px bg-line" />
          <Link href={`/work/${next.id}`} className="transition-colors hover:text-foreground" aria-label={`Next: ${next.title}`}>
            <span className="hidden sm:inline">{next.title}</span> →
          </Link>
        </div>
      </nav>

      <article className="px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
        {isDraft && (
          <p className="mb-8 border border-dashed border-faint px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            Template: no case study written for this project yet
          </p>
        )}

        {/* Title */}
        <header className="max-w-4xl">
          <h1 className="text-4xl font-medium tracking-tight sm:text-6xl">{item.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{study.summary}</p>
        </header>

        {/* Hero media, framed and labelled like its card */}
        <div className="group relative mt-12 sm:mt-16" data-active="true">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface sm:aspect-[16/8]">
            <WorkMedia item={item} sizes="100vw" />
          </div>
          <DetectFrame visible label={labels} />
        </div>

        {/* Details beside the story on wide screens */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[18rem_1fr] lg:gap-20">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {meta.length > 0 && (
              <dl className="border-t border-line">
                {meta.map(([label, value]) => (
                  <div key={label} className="border-b border-line py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</dt>
                    <dd className="mt-1 text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {study.stack && study.stack.length > 0 && (
              <div className="mt-8">
                <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted">Built with</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {study.stack.map((t, i) => (
                    <li key={`${t}-${i}`} className="border border-line px-2.5 py-1.5 text-sm">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {study.links && study.links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {study.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-faint px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors hover:border-foreground"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </aside>

          <div className="max-w-2xl">
            {study.what && <Block title="What it is">{study.what}</Block>}
            {study.why && <Block title="Why">{study.why}</Block>}
            {(study.how || study.flow) && (
              <Block title="How it works">
                {study.how}
                {study.flow && <Flow steps={study.flow} />}
              </Block>
            )}
            {study.outcome && <Block title="Outcome">{study.outcome}</Block>}
            {!study.what && !study.why && !study.how && !study.outcome && (
              <p className="text-muted">More on this one soon.</p>
            )}
          </div>
        </div>

        {/* Gallery */}
        {study.gallery && study.gallery.length > 0 && (
          <section className="mt-20 sm:mt-28">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-muted">Gallery</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {study.gallery.map((m, i) => (
                <figure key={m.src} className={study.gallery!.length % 2 === 1 && i === 0 ? "md:col-span-2" : ""}>
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <WorkMedia item={{ ...item, media: m }} sizes="(min-width: 768px) 50vw, 100vw" fit="contain" />
                  </div>
                  {m.alt && <figcaption className="mt-2 text-sm text-muted">{m.alt}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Next project */}
        <Link
          href={`/work/${next.id}`}
          className="group mt-24 flex items-end justify-between gap-6 border-t border-line pt-8 sm:mt-32"
        >
          <span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Next project</span>
            <span className="mt-2 block text-3xl font-medium tracking-tight transition-colors group-hover:text-muted sm:text-5xl">
              {next.title}
            </span>
          </span>
          <span aria-hidden className="text-3xl transition-transform group-hover:translate-x-1 sm:text-5xl">
            →
          </span>
        </Link>
      </article>
    </main>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12 last:mb-0">
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-muted">{title}</h2>
      <div className="mt-3 text-lg leading-relaxed">{children}</div>
    </section>
  );
}

// The signal path through the project, as connected boxes.
function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-6 flex flex-wrap items-center gap-y-3">
      {steps.map((step, i) => (
        <li key={`${step}-${i}`} className="flex items-center">
          <span className="border border-foreground px-2.5 py-1.5 font-mono text-xs">{step}</span>
          {i < steps.length - 1 && (
            <span aria-hidden className="w-7 text-center font-mono text-xs text-muted">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
