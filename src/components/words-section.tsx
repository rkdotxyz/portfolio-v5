import { talks, writing } from "@/content/profile";
import { DetectFrame } from "./detect-frame";
import { SectionLabel } from "./section-label";

const year = (date: string) => date.slice(-4);

// Writing and speaking as two compact lists, side by side on wide screens.
export function WordsSection() {
  return (
    <section id="writing" className="grid gap-16 border-b border-line px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 md:gap-12">
      <div>
        <SectionLabel title="Writing" />
        <ul className="mt-5">
          {writing.map((w) => (
            <li key={w.href}>
              <a
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative -mx-2 flex items-baseline gap-4 px-2 py-1.5 text-sm"
              >
                <DetectFrame />
                <span>{w.title}</span>
                <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-muted">{year(w.date)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SectionLabel title="Speaking" />
        <ul className="mt-5">
          {talks.map((t) => (
            <li key={t.title} className="flex items-baseline gap-4 py-1.5 text-sm">
              <span>
                {t.title} <span className="text-muted">· {t.where}</span>
              </span>
              <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-muted">{year(t.date)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
