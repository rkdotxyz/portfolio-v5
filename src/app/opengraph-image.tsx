import { ImageResponse } from "next/og";
import { FG, MUTED, OG_SIZE, OgPage, OgTabs } from "@/lib/og";

// The share image for the site: the name inside a detection frame.
export const alt = "rkdotxyz: Rama Krushna Behera, creative technologist";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgPage>
        <div style={{ position: "absolute", left: 96, top: 170, display: "flex", flexDirection: "column" }}>
          <OgTabs labels={["creative technologist", "digital × physical"]} size={24} />
          <div
            style={{
              display: "flex",
              border: `2px solid ${FG}`,
              padding: "28px 48px 40px 40px",
              fontSize: 150,
              letterSpacing: -6,
              lineHeight: 1,
            }}
          >
            rkdotxyz
          </div>
        </div>
        <div style={{ position: "absolute", left: 96, bottom: 72, display: "flex", fontSize: 28, color: MUTED }}>
          Rama Krushna Behera · MSc Interactive Media Technology, KTH Stockholm
        </div>
      </OgPage>
    ),
    size,
  );
}
