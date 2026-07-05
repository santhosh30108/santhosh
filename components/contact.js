"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Magnetic from "@/components/magnetic";
import { Rise } from "@/components/chapter";
import { gsap, useGSAP } from "@/components/gsap";
import { IconCheck, IconCopy, IconDownload, IconLinkedIn, IconPhone } from "@/components/icons";
import { profile } from "@/data/profile";

function subscribeMinute(cb) {
  const id = setInterval(cb, 1000 * 15);
  return () => clearInterval(id);
}
function getISTTime() {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function LocalClock() {
  const time = useSyncExternalStore(subscribeMinute, getISTTime, () => "");
  return <span suppressHydrationWarning>{time || "—"}</span>;
}

export default function Contact() {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-talk]",
        { y: 40, opacity: 0.4 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: "top 35%",
            scrub: 0.5,
          },
        }
      );
    },
    { scope: ref }
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative flex min-h-svh scroll-mt-20 flex-col justify-center overflow-hidden bg-bg-2/60 py-28 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[880px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse, var(--glow-1), var(--glow-2) 55%, transparent 75%)" }}
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-8">
        <span
          aria-hidden="true"
          className="absolute right-5 top-0 hidden select-none font-mono text-sm tracking-[0.2em] text-muted/70 sm:right-8 sm:block"
        >
          / 06
        </span>
        <p className="mb-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="inline-block h-px w-10 bg-accent" aria-hidden="true" />
          Contact
        </p>

        <h2 data-talk className="display leading-[1.05]">
          <span className="block text-[9vw] sm:text-6xl md:text-7xl">Let&apos;s build</span>
          <span className="block text-[9vw] sm:text-6xl md:text-7xl">
            something{" "}
            <span className="font-serif italic font-normal text-iridescent">great.</span>
          </span>
        </h2>

        <Rise className="mt-12 sm:mt-16">
          <p className="max-w-lg text-base leading-relaxed text-fg-soft sm:text-lg">
            Open to senior engineering roles, ambitious products, and good conversations.
            One email starts all three.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="link-sweep mt-8 inline-block break-all text-xl font-medium tracking-tight text-fg transition-colors duration-300 hover:text-accent sm:text-2xl md:text-3xl"
          >
            {profile.email}
          </a>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <button
                type="button"
                onClick={copyEmail}
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                {copied ? <IconCheck className="h-4 w-4 text-emerald-400" /> : <IconCopy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy address"}
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resume}
                download="Santhosh-Kumar-Resume.pdf"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                <span className="btn-fill" aria-hidden="true" />
                <IconDownload className="h-4 w-4" />
                <span>Résumé — PDF</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                <IconLinkedIn className="h-4 w-4" />
                LinkedIn
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={`tel:${profile.phoneHref}`}
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                <IconPhone className="h-4 w-4" />
                {profile.phone}
              </a>
            </Magnetic>
          </div>
        </Rise>

        <Rise delay={0.1}>
          <div className="mt-20 grid gap-6 border-t border-line pt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-muted sm:grid-cols-3">
            <span>
              Local time — <LocalClock /> IST
            </span>
            <span className="sm:text-center">{profile.location}</span>
            <span className="sm:text-right">Response within 24h, usually faster</span>
          </div>
        </Rise>
      </div>
    </section>
  );
}
