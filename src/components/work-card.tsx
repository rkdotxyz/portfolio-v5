import Image from "next/image";
import { CATEGORY_LABEL, type Category, type WorkItem } from "@/content/work";
import { DetectFrame } from "./detect-frame";
import { YouTubeEmbed } from "./youtube-embed";

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

// Which way a card's callout points, so it opens toward the middle of the view.
export type CalloutDirection = { x: "left" | "right"; y: "up" | "down" };

// A card of work on the canvas. Key projects carry an always-on detection
// frame tagged with the kinds of work, and open their case study. Other cards
// get a frame on hover (or tap, on touch) tagged with their category, and a
// callout with a short description. `scale` is the canvas zoom, so the
// callout can stay the same size on screen.
export function WorkCard({
  item,
  active,
  callout = { x: "right", y: "up" },
  scale = 1,
}: {
  item: WorkItem;
  active: boolean;
  callout?: CalloutDirection;
  scale?: number;
}) {
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

      {!isKey && item.about && <Callout item={item} direction={callout} scale={scale} />}
    </article>
  );
}

// Leader line: a 60° rise off the card's corner, then a run out to the box.
const RISE = { x: 24, y: 42 };
const RUN = 36;

// A description pinned to the card by a leader line, like an annotation on a
// detection. Drawn from the frame's top corner (bottom, near the top of the
// view) and counter-scaled so it reads the same at any zoom.
function Callout({ item, direction, scale }: { item: WorkItem; direction: CalloutDirection; scale: number }) {
  const sx = direction.x === "right" ? 1 : -1;
  const sy = direction.y === "up" ? -1 : 1;
  const end = { x: sx * (RISE.x + RUN), y: sy * RISE.y };
  const show = "opacity-0 group-hover:opacity-100 group-data-[active=true]:opacity-100";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-20"
      style={{
        // A zero-size anchor on the frame's corner, the card's outer edge.
        width: 0,
        height: 0,
        left: direction.x === "right" ? "100%" : 0,
        top: direction.y === "up" ? 0 : "100%",
        transform: `scale(${1 / scale})`,
        transformOrigin: "0 0",
      }}
    >
      <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
        <polyline
          points={`0,0 ${sx * RISE.x},${sy * RISE.y} ${end.x},${end.y}`}
          pathLength={1}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={1}
          className="transition-[stroke-dashoffset] duration-300 ease-out [stroke-dasharray:1] [stroke-dashoffset:1] group-hover:[stroke-dashoffset:0] group-data-[active=true]:[stroke-dashoffset:0]"
        />
        <circle cx={0} cy={0} r={2.5} fill="var(--foreground)" className={`transition-opacity duration-150 ${show}`} />
      </svg>
      <div
        className={`absolute w-60 border border-foreground bg-background transition-opacity duration-200 group-hover:delay-150 group-data-[active=true]:delay-150 ${show}`}
        style={{
          [direction.x === "right" ? "left" : "right"]: Math.abs(end.x),
          top: end.y,
          transform: "translateY(-50%)",
        }}
      >
        <p className="bg-foreground px-2 py-[5px] font-mono text-[13px] leading-none text-background">{item.title}</p>
        <p className="px-3 pt-2.5 text-[13px] leading-snug">{item.about}</p>
        {item.tools && item.tools.length > 0 ? (
          <p className="px-3 pb-2.5 pt-2 font-mono text-[11px] leading-snug text-muted">{item.tools.join(" · ")}</p>
        ) : (
          <div className="h-2.5" />
        )}
      </div>
    </div>
  );
}

export function WorkMedia({
  item,
  sizes = "320px",
  fit = "cover",
}: {
  item: WorkItem;
  sizes?: string;
  fit?: "cover" | "contain";
}) {
  const fitClass = fit === "cover" ? "object-cover" : "object-contain";
  const { media } = item;
  if (!media) return <GenerativePlaceholder seed={item.id} />;

  if (media.type === "youtube") return <YouTubeEmbed id={media.src} title={media.alt ?? item.title} />;
  if (media.type === "video" && media.controls) {
    return (
      <video
        src={media.src}
        poster={media.poster}
        controls
        playsInline
        preload="metadata"
        aria-label={media.alt ?? item.title}
        className={`absolute inset-0 h-full w-full ${fitClass}`}
      />
    );
  }
  if (media.type === "video") {
    return (
      <video
        src={media.src}
        autoPlay
        muted
        loop
        playsInline
        draggable={false}
        className={`absolute inset-0 h-full w-full ${fitClass}`}
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
      // GIFs would lose their animation and SVGs can't be optimised.
      unoptimized={/\.(gif|svg)$/i.test(media.src)}
      className={fitClass}
    />
  );
}

// Monochrome animated pattern standing in for real media.
const PATTERNS = ["gen-rings", "gen-stripes", "gen-dots", "gen-sweep"] as const;

function GenerativePlaceholder({ seed }: { seed: string }) {
  const n = [...seed].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return <div aria-hidden className={`absolute inset-0 ${PATTERNS[n % PATTERNS.length]}`} />;
}
