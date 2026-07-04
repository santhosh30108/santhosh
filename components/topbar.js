"use client";

import { useEffect, useRef, useState } from "react";
import Magnetic from "@/components/magnetic";
import ThemeToggle from "@/components/theme-toggle";
import { IconCommand } from "@/components/icons";
import { NAV_SECTIONS } from "@/components/sections-config";
import { profile } from "@/data/profile";

// Minimal glass top bar: monogram, live status, palette trigger, theme, menu.
// Section navigation lives in the chapter rail + command palette.
export default function Topbar({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [menuOpen]);

  return (
    <header ref={barRef} className="fixed inset-x-0 top-0 z-40">
      <div
        className={`transition-all duration-500 ${
          scrolled ? "glass border-b border-line" : ""
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-5 sm:h-[72px] sm:px-8"
        >
          <Magnetic strength={0.25}>
            <a
              href="#top"
              className="group flex items-center gap-3"
              aria-label="Back to top"
            >
              <span className="display flex h-9 w-9 items-center justify-center rounded-xl bg-fg text-sm text-bg transition-transform duration-300 group-hover:rotate-[-8deg]">
                {profile.initials}
              </span>
              <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-fg-soft sm:block">
                {profile.shortName}
              </span>
            </a>
          </Magnetic>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 font-mono text-[11px] uppercase tracking-widest text-muted transition-all duration-300 hover:border-accent hover:text-accent hover:bg-accent-soft sm:flex"
              aria-label="Open command palette"
            >
              <IconCommand className="h-3.5 w-3.5" />
              <span>⌘K</span>
            </button>
            <ThemeToggle />
            <button
              type="button"
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full border border-line-strong md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={`block h-px w-4 bg-fg transition-transform duration-300 ${
                  menuOpen ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-4 bg-fg transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        <div
          className={`md:hidden glass overflow-hidden border-b border-line transition-[max-height,opacity] duration-400 ${
            menuOpen ? "max-h-[26rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="px-5 py-4">
            {NAV_SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-4 rounded-lg px-3 py-3 text-lg font-medium text-fg-soft transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <span className="font-mono text-[11px] text-accent">{s.index}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
