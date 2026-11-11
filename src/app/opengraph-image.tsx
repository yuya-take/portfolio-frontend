import { profile } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = `${profile.name} | ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// トップの墨流しに合わせた同心円。中心を少しずつずらして重ねる
const rings = [
  { rx: 34, ry: 28, dx: 0, dy: 0, strong: false },
  { rx: 74, ry: 62, dx: -4, dy: 4, strong: true },
  { rx: 118, ry: 98, dx: -10, dy: 8, strong: false },
  { rx: 168, ry: 140, dx: -18, dy: 14, strong: false },
  { rx: 226, ry: 188, dx: -30, dy: 20, strong: true },
  { rx: 292, ry: 244, dx: -46, dy: 28, strong: false },
  { rx: 368, ry: 308, dx: -66, dy: 36, strong: false },
];

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: 64,
        background: "#fff",
        color: "#111",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 30, color: "#666" }}>{profile.role}</div>
        <div style={{ display: "flex", fontSize: 76, letterSpacing: "-0.02em" }}>{profile.name}</div>
      </div>
      <div style={{ display: "flex", width: 420, height: 502, background: "#f5f5f3", overflow: "hidden" }}>
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: 画像として書き出される装飾 */}
        <svg width="420" height="502" viewBox="0 0 420 502" fill="none">
          <g transform="rotate(-18 230 230)">
            {rings.map((ring) => (
              <ellipse
                key={ring.rx}
                cx={230 + ring.dx}
                cy={230 + ring.dy}
                rx={ring.rx}
                ry={ring.ry}
                stroke="#111"
                strokeOpacity={ring.strong ? 0.85 : 0.3}
                strokeWidth={ring.strong ? 2 : 1.5}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>,
    size,
  );
}
