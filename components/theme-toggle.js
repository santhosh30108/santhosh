"use client";

import { IconMoon, IconSun } from "@/components/icons";
import { toggleTheme, useTheme } from "@/components/use-theme";

export default function ThemeToggle({ className = "" }) {
  const theme = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-fg-soft transition-all duration-300 hover:border-accent hover:text-accent hover:bg-accent-soft ${className}`}
    >
      <span className="relative block h-[18px] w-[18px]">
        <IconSun
          className={`absolute inset-0 h-full w-full transition-all duration-500 ${
            theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
        <IconMoon
          className={`absolute inset-0 h-full w-full transition-all duration-500 ${
            theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
      </span>
    </button>
  );
}
