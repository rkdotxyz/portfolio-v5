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
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">{about.body}</p>
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
