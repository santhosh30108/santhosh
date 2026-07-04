"use client";

import { useEffect, useState } from "react";
import { NAV_SECTIONS } from "@/components/sections-config";

// Fixed right-edge chapter navigation: index ticks that expand into labels.
export default function ChapterRail() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Chapters"
      className={`fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-500 lg:block ${
        active === "work" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <ul className="flex flex-col items-end gap-1">
        {NAV_SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-3 py-1.5"
              >
                <span
                  className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${
                    isActive
                      ? "translate-x-0 text-fg opacity-100"
                      : "translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`block h-px transition-all duration-500 ${
                    isActive
                      ? "w-10 bg-accent"
                      : "w-5 bg-line-strong group-hover:w-8 group-hover:bg-fg-soft"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
