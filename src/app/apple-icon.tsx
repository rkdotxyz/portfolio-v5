import { ImageResponse } from "next/og";

// Home-screen icon: the detection box and its label tab, tagged "rk".
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#000", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 62,
            width: 120,
            height: 88,
            border: "6px solid #f5f5f5",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 24,
            height: 44,
            padding: "0 14px",
            background: "#f5f5f5",
            color: "#000",
            fontSize: 30,
            display: "flex",
            alignItems: "center",
          }}
        >
          rk
        </div>
      </div>
    ),
    size,
  );
}
