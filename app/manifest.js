import { profile } from "@/data/profile";

export default function manifest() {
  return {
    name: `${profile.shortName} — ${profile.role}`,
    short_name: profile.shortName,
    description: profile.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a10",
    theme_color: "#0a0a10",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
