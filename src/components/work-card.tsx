import Image from "next/image";
import { CATEGORY_LABEL, type Category, type WorkItem } from "@/content/work";

const ASPECT: Record<Category, string> = {
  "key-project": "aspect-[16/10]",
  project: "aspect-[4/3]",
  exploration: "aspect-square",
};
const RATIO: Record<Category, number> = { "key-project": 16 / 10, project: 4 / 3, exploration: 1 };

// Rendered height of a card at a given width: border + padding, media, caption.
// Keep in sync with the classes below; the canvas uses it for layout and the minimap.
export const cardHeight = (category: Category, width: number) =>
  2 + 16 + (width - 18) / RATIO[category] + 32;

// A card of work on the canvas. Hover (or press, on touch) frames the whole
// card in a MediaPipe-style detection box with a labelled tag.
export function WorkCard({ item, active }: { item: WorkItem; active: boolean }) {
  return (
    <article data-active={active} className="group relative">
      <div className="border border-line bg-surface p-2">
        <div className={`relative overflow-hidden bg-black ${ASPECT[item.category]}`}>
          <WorkMedia item={item} />
        </div>
        <div className="flex h-8 items-center justify-between gap-2 px-1 pt-1">
          <h3 className="truncate text-sm">{item.title}</h3>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
            {item.year ?? "exp"}
          </span>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 scale-[1.03] border border-foreground opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-data-[active=true]:scale-100 group-data-[active=true]:opacity-100"
      >
        <Corner className="-left-px -top-px border-l-2 border-t-2" />
        <Corner className="-right-px -top-px border-r-2 border-t-2" />
        <Corner className="-bottom-px -left-px border-b-2 border-l-2" />
        <Corner className="-bottom-px -right-px border-b-2 border-r-2" />
        <span className="absolute -left-px bottom-full mb-1 whitespace-nowrap bg-foreground px-1.5 py-1 font-mono text-[10px] leading-none text-background">
          {CATEGORY_LABEL[item.category]} {item.confidence.toFixed(2)}
        </span>
      </div>
    </article>
  );
}

function Corner({ className }: { className: string }) {
  return <span className={`absolute h-3 w-3 border-foreground ${className}`} />;
}

function WorkMedia({ item }: { item: WorkItem }) {
  const { media } = item;
  if (!media) return <GenerativePlaceholder seed={item.id} />;

  if (media.type === "video") {
    return (
      <video
        src={media.src}
        autoPlay
        muted
        loop
        playsInline
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover grayscale"
      />
    );
  }
  return (
    <Image
      src={media.src}
      alt={media.alt ?? item.title}
      fill
      sizes="320px"
      draggable={false}
      unoptimized={media.src.endsWith(".gif")}
      className="object-cover grayscale"
    />
  );
}

// Monochrome animated pattern standing in for real media.
const PATTERNS = ["gen-rings", "gen-stripes", "gen-dots", "gen-sweep"] as const;

function GenerativePlaceholder({ seed }: { seed: string }) {
  const n = [...seed].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return <div aria-hidden className={`absolute inset-0 ${PATTERNS[n % PATTERNS.length]}`} />;
}
