"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { caseStudies, placeholderCaseStudy } from "@/content/case-studies";
import { CATEGORY_LABEL, work, type WorkItem } from "@/content/work";
import { DetectFrame } from "./detect-frame";
import { WorkMedia } from "./work-card";

// A short case study in a panel that slides in over the canvas (full screen
// on phones). Uses <dialog> for focus trapping, Escape and the backdrop.
export function CaseStudyDialog({
  item,
  onClose,
  onOpen,
}: {
  item: WorkItem | null;
  onClose: () => void;
  onOpen: (id: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
    // Keep the page behind from scrolling while the panel is open.
    document.documentElement.style.overflow = item ? "hidden" : "";
    scrollRef.current?.scrollTo(0, 0);
  }, [item]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  const index = item ? work.findIndex((w) => w.id === item.id) : -1;
  const prev = index >= 0 ? work[(index - 1 + work.length) % work.length] : null;
  const next = index >= 0 ? work[(index + 1) % work.length] : null;
  const study = item ? (caseStudies[item.id] ?? placeholderCaseStudy) : null;
  const isDraft = item ? !caseStudies[item.id] : false;

  return (
    <dialog
      ref={ref}
      aria-labelledby="case-study-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="drawer-in fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-none border-line bg-background p-0 text-foreground backdrop:bg-black/70 backdrop:backdrop-blur-[2px] sm:max-w-[40rem] sm:border-l"
    >
      {item && study && (
        <div ref={scrollRef} className="h-full overflow-y-auto overscroll-contain">
          {/* Top bar */}
          <div className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-line bg-background/90 px-4 backdrop-blur sm:px-6">
            <span className="flex gap-px">
              {(item.tags ?? [CATEGORY_LABEL[item.category]]).map((t) => (
                <span key={t} className="bg-foreground px-2 py-[5px] font-mono text-xs leading-none text-background">
                  {t}
                </span>
              ))}
            </span>
            <div className="flex items-center gap-1">
              <IconButton label={`Previous: ${prev!.title}`} onClick={() => onOpen(prev!.id)}>
                ←
              </IconButton>
              <IconButton label={`Next: ${next!.title}`} onClick={() => onOpen(next!.id)}>
                →
              </IconButton>
              <IconButton label="Close" sound="close" onClick={onClose}>
                ✕
              </IconButton>
            </div>
          </div>

          <div className="px-4 pb-16 pt-6 sm:px-6">
            {isDraft && (
              <p className="mb-6 border border-dashed border-faint px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted">
                Template: no case study written for this project yet
              </p>
            )}

            <div className="group relative" data-active="true">
              <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                <WorkMedia item={item} sizes="(min-width: 640px) 640px, 100vw" />
              </div>
              <DetectFrame />
            </div>

            <h2 id="case-study-title" className="mt-8 text-3xl font-medium tracking-tight sm:text-4xl">
              {item.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">{study.summary}</p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 border-t border-line">
              {[
                ["Year", item.year],
                ["Status", study.status],
                ["Role", study.role],
                ["Team", study.team],
              ]
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label} className="border-b border-line py-3">
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</dt>
                    <dd className="mt-1 text-sm">{value}</dd>
                  </div>
                ))}
            </dl>

            {study.links && study.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
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

            <Block title="What it is">{study.what}</Block>
            {study.why && <Block title="Why">{study.why}</Block>}
            <Block title="How it works">
              {study.how}
              {study.flow && <Flow steps={study.flow} />}
            </Block>

            <div className="mt-10">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">Built with</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {study.stack.map((t, i) => (
                  <li key={`${t}-${i}`} className="border border-line px-2.5 py-1.5 text-sm">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {study.outcome && <Block title="Outcome">{study.outcome}</Block>}

            {study.gallery && study.gallery.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-3">
                {study.gallery.map((m) => (
                  <div key={m.src} className="relative aspect-square overflow-hidden bg-surface">
                    <WorkMedia item={{ ...item, media: m }} sizes="320px" />
                  </div>
                ))}
              </div>
            )}

            {/* Next project */}
            <button
              type="button"
              onClick={() => onOpen(next!.id)}
              className="group relative mt-14 flex w-full items-baseline justify-between gap-4 border-t border-line pt-5 text-left"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Next</span>
              <span className="text-lg tracking-tight transition-colors group-hover:text-muted">
                {next!.title} →
              </span>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="font-mono text-[11px] uppercase tracking-wider text-muted">{title}</h3>
      <div className="mt-3 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

// The signal path through the project, as connected detection-style boxes.
function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-5 flex flex-wrap items-center gap-y-3">
      {steps.map((step, i) => (
        <li key={`${step}-${i}`} className="flex items-center">
          <span className="border border-foreground px-2.5 py-1.5 font-mono text-[11px]">{step}</span>
          {i < steps.length - 1 && (
            <span aria-hidden className="w-6 text-center font-mono text-[11px] text-muted">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function IconButton({
  label,
  onClick,
  sound,
  children,
}: {
  label: string;
  onClick: () => void;
  sound?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-sound={sound}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm text-muted transition-colors hover:bg-line hover:text-foreground"
    >
      {children}
    </button>
  );
}
