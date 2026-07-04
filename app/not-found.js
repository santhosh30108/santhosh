import Link from "next/link";
import { profile } from "@/data/profile";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--glow-1) 0%, var(--glow-2) 45%, transparent 70%)",
        }}
      />

      <div className="relative z-10 animate-rise">
        <p className="font-serif italic text-[7rem] leading-none text-gradient sm:text-[10rem]">
          404
        </p>
        <div className="mx-auto mt-6 w-full max-w-md rounded-xl border border-line-strong bg-surface p-4 text-left font-mono text-xs shadow-lg sm:text-sm">
          <p className="text-muted">
            <span className="text-emerald-500">$</span> GET {`{requested_route}`}
          </p>
          <p className="mt-1.5 text-rose-500">Error: route not found in this portfolio</p>
          <p className="mt-1.5 text-muted">
            <span className="text-emerald-500">$</span> suggestion: try the homepage —{" "}
            <span className="text-accent">everything good lives there</span>
          </p>
        </div>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">
          This page wandered off.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-soft sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist — but {profile.firstName}&apos;s work
          is just one click away.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
          >
            <span className="btn-fill" aria-hidden="true" />
            <span>Back to home</span>
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
          >
            Report a broken link
          </a>
        </div>
      </div>
    </div>
  );
}
