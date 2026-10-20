import { about } from "@/content/profile";
import { SectionLabel } from "./section-label";
import { ToolkitTreemap } from "./toolkit-treemap";

export function AboutSection() {
  return (
    <section id="about" className="border-b border-line px-4 py-20 sm:px-6 sm:py-28">
      <SectionLabel title="About" />

      <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <div>
          <h2 className="max-w-2xl text-2xl font-medium leading-snug tracking-tight sm:text-4xl sm:leading-tight">
            {about.statement}
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-muted">
            {about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <dl className="self-end border-t border-line">
          {about.facts.map((f) => (
            <div key={f.label} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-3.5">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted sm:text-xs">{f.label}</dt>
              <dd className="text-sm">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Headline numbers. */}
      <dl className="mt-14 grid grid-cols-2 border-l border-t border-line sm:mt-20 md:grid-cols-4">
        {about.stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse justify-end border-b border-r border-line p-4 sm:p-6">
            <dt className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted sm:text-[11px]">{s.label}</dt>
            <dd className="text-3xl font-medium tracking-tight sm:text-5xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-20 sm:mt-28">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-medium tracking-tight sm:text-xl">Toolkit</h3>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted sm:text-xs">
            Area is how much each tool is used
          </p>
        </div>
        <ToolkitTreemap />
      </div>
    </section>
  );
}
