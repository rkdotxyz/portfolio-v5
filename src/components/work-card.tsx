import Image from "next/image";
import { CATEGORY_LABEL, type Category, type WorkItem } from "@/content/work";
import { DetectFrame } from "./detect-frame";

const ASPECT: Record<Category, string> = {
  "key-project": "aspect-[16/10]",
  "side-project": "aspect-[4/3]",
  exploration: "aspect-square",
};
const RATIO: Record<Category, number> = { "key-project": 16 / 10, "side-project": 4 / 3, exploration: 1 };

// Rendered height of a card at a given width: border, media, caption. Key
// projects run their media edge to edge; other cards sit it in 8px padding.
// Keep in sync with the classes below; the canvas uses it for layout and the minimap.
export const cardHeight = (category: Category, width: number) =>
  category === "key-project" ? 2 + (width - 2) / RATIO[category] + 40 : 2 + 16 + (width - 18) / RATIO[category] + 32;

const SHORT: Record<Category, string> = { "key-project": "key", "side-project": "side", exploration: "exp" };

// A card of work on the canvas. Key projects carry an always-on detection
// frame tagged with the kinds of work; other cards get one on hover (or press,
// on touch) tagged with their category.
export function WorkCard({ item, active }: { item: WorkItem; active: boolean }) {
  const isKey = item.category === "key-project";
  return (
    <article data-active={active} data-sound-hover className="group relative">
      <div className={`border border-line bg-surface ${isKey ? "" : "p-2"}`}>
        <div className={`relative overflow-hidden bg-black ${ASPECT[item.category]}`}>
          {isKey ? (
            <>
              {/* Hover: the media wakes up and a scan line sweeps down and back
                  across its full width, as if the detector is reading the card. */}
              <div className="absolute inset-0 brightness-75 transition-[scale,filter] duration-500 ease-out group-hover:scale-[1.04] group-hover:brightness-110">
                <WorkMedia item={item} />
              </div>
              {/* A soft glow band with the line at its centre, so it reads the
                  same moving down or up. */}
              <span
                aria-hidden
                className="key-scan pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-foreground/[0.16] to-transparent opacity-0 group-hover:opacity-100"
              >
                <span className="absolute inset-x-0 top-1/2 h-px bg-foreground/90 shadow-[0_0_10px_1px_rgb(245_245_245/0.45)]" />
              </span>
            </>
          ) : (
            <WorkMedia item={item} />
          )}
        </div>
        <div className={`flex items-center justify-between gap-2 ${isKey ? "h-10 px-3" : "h-8 px-1 pt-1"}`}>
          <h3 className={`truncate ${isKey ? "text-base" : "text-sm"}`}>{item.title}</h3>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
            {isKey ? (
              <>
                <span className="group-hover:hidden">{item.year}</span>
                <span className="hidden text-foreground group-hover:inline">View case study →</span>
              </>
            ) : (
              (item.year ?? SHORT[item.category])
            )}
          </span>
        </div>
      </div>

      {isKey && item.tags ? (
        <DetectFrame visible label={item.tags} />
      ) : (
        <DetectFrame label={CATEGORY_LABEL[item.category]} />
      )}
    </article>
  );
}

export function WorkMedia({ item, sizes = "320px" }: { item: WorkItem; sizes?: string }) {
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
      sizes={sizes}
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
