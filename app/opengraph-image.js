import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.shortName} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0a0a10 0%, #121222 55%, #0a1a22 100%)",
          color: "#f0efeb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #22d3ee)",
              color: "#0a0a10",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            SK
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#8b8b97" }}>
            {profile.location}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#a5b4fc",
            }}
          >
            {profile.role} · {profile.companyShort}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(240,239,235,0.18)",
            paddingTop: 28,
            fontSize: 24,
            color: "#8b8b97",
          }}
        >
          <div style={{ display: "flex" }}>{profile.email}</div>
          <div style={{ display: "flex" }}>Full-Stack · React · Next.js</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
