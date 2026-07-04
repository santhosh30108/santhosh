import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-2/60">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-4 px-5 py-8 font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:flex-row sm:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="flex items-center gap-2">
          <span className="display text-xs text-fg">{profile.initials}</span>— designed &amp; engineered by hand
        </span>
        <a href="#top" className="link-sweep text-fg-soft">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
