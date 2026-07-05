"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { scrollToSection } from "@/components/scroll-nav";
import { NAV_SECTIONS } from "@/components/sections-config";
import { IconArrowUpRight, IconCheck, IconCommand, IconCopy, IconDownload, IconMail, IconMoon, IconSearch, IconSpark, IconSun } from "@/components/icons";
import { toggleTheme, useTheme } from "@/components/use-theme";
import { profile } from "@/data/profile";

// Rendered only while open (mounted by SiteShell), so all state is
// naturally fresh on every open.
export default function CommandPalette({ onClose }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const theme = useTheme();

  const commands = useMemo(() => {
    const nav = NAV_SECTIONS.map((s) => ({
      id: `nav-${s.id}`,
      group: "Navigate",
      label: s.label,
      hint: `Jump to ${s.label}`,
      icon: IconArrowUpRight,
      run: () => {
        if (!scrollToSection(s.id)) document.getElementById(s.id)?.scrollIntoView();
      },
    }));
    return [
      ...nav,
      {
        id: "theme",
        group: "Actions",
        label: "Toggle theme",
        hint: theme === "dark" ? "Switch to light" : "Switch to dark",
        icon: theme === "dark" ? IconSun : IconMoon,
        keepOpen: true,
        run: toggleTheme,
      },
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        icon: copied ? IconCheck : IconCopy,
        keepOpen: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {}
        },
      },
      {
        id: "email",
        group: "Actions",
        label: "Send an email",
        hint: profile.email,
        icon: IconMail,
        run: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
      {
        id: "resume",
        group: "Actions",
        label: "Download résumé",
        hint: "PDF",
        icon: IconDownload,
        run: () => window.open(profile.resume, "_blank"),
      },
      {
        id: "linkedin",
        group: "Connect",
        label: "Open LinkedIn",
        hint: profile.linkedinHandle,
        icon: IconSpark,
        run: () => window.open(profile.linkedin, "_blank", "noopener"),
      },
    ];
  }, [copied, theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const c of filtered) {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group).push(c);
    }
    return [...map.entries()];
  }, [filtered]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const runCommand = useCallback(
    (cmd) => {
      cmd.run();
      if (!cmd.keepOpen) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[index];
        if (cmd) runCommand(cmd);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, index, onClose, runCommand]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[14vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fade"
        style={{ animationDuration: "0.25s" }}
      />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl animate-rise"
        style={{ animationDuration: "0.3s" }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <IconSearch className="h-4 w-4 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Type a command or search…"
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted"
            aria-label="Search commands"
          />
          <span className="kbd shrink-0">esc</span>
        </div>
        <div ref={listRef} className="max-h-[46vh] overflow-y-auto p-2">
          {groups.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">
              No results for “{query}”
            </p>
          ) : (
            groups.map(([group, cmds]) => (
              <div key={group} className="mb-1">
                <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {group}
                </p>
                {cmds.map((cmd) => {
                  flatIndex += 1;
                  const i = flatIndex;
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      type="button"
                      data-active={i === index}
                      onMouseEnter={() => setIndex(i)}
                      onClick={() => runCommand(cmd)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        i === index ? "bg-accent-soft text-fg" : "text-fg-soft"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${i === index ? "text-accent" : "text-muted"}`} />
                      <span className="flex-1">{cmd.label}</span>
                      <span className="max-w-[45%] truncate font-mono text-[11px] text-muted">
                        {cmd.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="kbd">↑↓</span> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="kbd">↵</span> select
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <IconCommand className="h-3 w-3" />K to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
