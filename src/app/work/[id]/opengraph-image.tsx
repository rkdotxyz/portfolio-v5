import { ImageResponse } from "next/og";
import { caseStudies } from "@/content/case-studies";
import { work } from "@/content/work";
import { FG, MUTED, OG_SIZE, OgPage, OgTabs, ogImageData } from "@/lib/og";

// A share image per case study: title and summary, and the project's own
// picture inside its detection frame, tagged with the kinds of work.
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study on rkdotxyz";

export function generateStaticParams() {
  return work.filter((w) => w.category === "key-project" && caseStudies[w.id]).map((w) => ({ id: w.id }));
}

// The best still for a project: a video's poster, its card image, a photo
// from its gallery, or the first image in its write-up.
function stillFor(id: string) {
  const item = work.find((w) => w.id === id);
  const study = caseStudies[id];
  if (study?.hero?.poster) return study.hero.poster;
  if (item?.media?.type === "image") return item.media.src;
  const photo = study?.gallery?.find((m) => m.type === "image" && !m.src.endsWith(".svg"));
  if (photo) return photo.src;
  const fromBody = study?.body?.find((b) => b.kind === "media" && b.media.type === "image");
  return fromBody?.kind === "media" ? fromBody.media.src : undefined;
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = work.find((w) => w.id === id);
  const study = caseStudies[id];
  const still = await ogImageData(stillFor(id) ?? "");

  return new ImageResponse(
    (
      <OgPage>
        <div style={{ position: "absolute", left: 72, top: 64, display: "flex", fontSize: 24, color: MUTED }}>
          rkdotxyz · case study
        </div>
        <div style={{ position: "absolute", left: 72, top: 150, width: 470, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05, letterSpacing: -2 }}>{item?.title ?? id}</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, lineHeight: 1.35, color: MUTED }}>{study?.summary ?? ""}</div>
        </div>
        <div style={{ position: "absolute", right: 72, top: 140, display: "flex", flexDirection: "column" }}>
          <OgTabs labels={item?.tags ?? []} size={20} />
          <div style={{ display: "flex", width: 560, height: 380, border: `2px solid ${FG}`, background: "#111" }}>
            {still && (
              <img src={still} alt="" width={556} height={376} style={{ objectFit: "cover" }} />
            )}
          </div>
        </div>
      </OgPage>
    ),
    size,
  );
}
