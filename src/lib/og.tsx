import type { ReactNode } from "react";

// Shared pieces for the generated share images (opengraph-image.tsx files):
// the site's dot grid and detection-frame motif, drawn for next/og.

export const OG_SIZE = { width: 1200, height: 630 };
export const FG = "#f5f5f5";
export const MUTED = "#8a8a8a";

// The black page with its dot grid.
export function OgPage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#000",
        backgroundImage: "radial-gradient(circle, #2a2a2a 1.5px, transparent 1.6px)",
        backgroundSize: "28px 28px",
        color: FG,
      }}
    >
      {children}
    </div>
  );
}

// Solid white label tabs, flush on a frame's top-left edge.
export function OgTabs({ labels, size = 22 }: { labels: string[]; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {labels.map((l) => (
        <div key={l} style={{ background: FG, color: "#000", fontSize: size, padding: `${size * 0.3}px ${size * 0.5}px`, lineHeight: 1 }}>
          {l}
        </div>
      ))}
    </div>
  );
}

// Fetches an image (local path under /public or a URL) as a data URI that
// next/og can draw; undefined if it can't be read.
export async function ogImageData(src: string): Promise<string | undefined> {
  try {
    let buf: ArrayBuffer;
    let type = /\.png$/i.test(src) ? "image/png" : "image/jpeg";
    if (src.startsWith("/")) {
      const { readFile } = await import("node:fs/promises");
      const { join } = await import("node:path");
      const file = await readFile(join(process.cwd(), "public", src));
      buf = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
    } else {
      const res = await fetch(src);
      if (!res.ok) return undefined;
      type = res.headers.get("content-type") ?? type;
      buf = await res.arrayBuffer();
    }
    return `data:${type};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return undefined;
  }
}
