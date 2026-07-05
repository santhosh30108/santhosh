"use client";

import { useEffect, useState } from "react";
import ChapterRail from "@/components/chapter-rail";
import CommandPalette from "@/components/command-palette";
import Cursor from "@/components/cursor";
import Preloader from "@/components/preloader";
import ScrollProgress from "@/components/scroll-progress";
import Topbar from "@/components/topbar";

export default function SiteShell({ children }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[99] focus:rounded-lg focus:bg-bg-2 focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
      >
        Skip to content
      </a>
      <Preloader />
      <ScrollProgress />
      <Cursor />
      <Topbar onOpenPalette={() => setPaletteOpen(true)} />
      <ChapterRail />
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
      <main id="main" className="relative">
        {children}
      </main>
    </div>
  );
}
