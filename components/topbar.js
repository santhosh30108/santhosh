"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme-toggle";
import { IconCommand } from "@/components/icons";
import { scrollToSection } from "@/components/scroll-nav";
import { NAV_SECTIONS } from "@/components/sections-config";
import { profile } from "@/data/profile";

export default function Topbar({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`transition-all duration-500 ${
          scrolled ? "glass border-b border-line" : ""
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-6 px-5 sm:h-[72px] sm:px-8"
        >
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label="Back to top"
          >
            <span className="display flex h-9 w-9 items-center justify-center rounded-xl bg-fg text-sm text-bg transition-transform duration-300 group-hover:rotate-[-8deg]">
              {profile.initials}
            </span>
            <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-fg-soft lg:block">
              {profile.shortName}
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={(e) => {
                      if (scrollToSection(s.id)) e.preventDefault();
                    }}
                    className={`relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300 lg:px-4 ${
                      isActive
                        ? "text-fg"
                        : "text-muted hover:text-fg"
                    }`}
                  >
                    {s.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 bottom-0.5 h-px bg-accent transition-transform duration-300 lg:inset-x-4 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                      style={{ transformOrigin: "left" }}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

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
                  onClick={(e) => {
                    if (scrollToSection(s.id)) e.preventDefault();
                    setMenuOpen(false);
                  }}
                  className={`flex items-baseline gap-4 rounded-lg px-3 py-3 text-lg font-medium transition-colors hover:bg-surface-2 ${
                    active === s.id ? "text-fg" : "text-fg-soft"
                  }`}
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
