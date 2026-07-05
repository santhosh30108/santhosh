"use client";

import { useRef } from "react";
import Sky from "@/components/sky";
import { gsap, useGSAP } from "@/components/gsap";
import { IconArrowUpRight, IconDownload } from "@/components/icons";
import { CONDITION_LABELS, PHASE_LABELS, useEnvironment } from "@/components/use-environment";
import { profile } from "@/data/profile";

function Chars({ text }) {
  return text.split("").map((c, i) => (
    <span key={i} className="char">
      {c === " " ? " " : c}
    </span>
  ));
}

export default function Hero() {
  const ref = useRef(null);
  const roleRef = useRef(null);
  const { phase, condition } = useEnvironment();

  useGSAP(
    () => {
      const root = ref.current;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const chars1 = root.querySelectorAll("[data-l1] .char");
      const chars2 = root.querySelectorAll("[data-l2] .char");
      const meta = root.querySelectorAll("[data-meta]");

      gsap.set([chars1, chars2], { yPercent: 115 });
      gsap.set(meta, { y: 26, opacity: 0 });

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline();
        tl.to(chars1, { yPercent: 0, duration: 1.15, stagger: 0.05, ease: "power4.out" }, 0)
          .to(chars2, { yPercent: 0, duration: 1.15, stagger: 0.04, ease: "power4.out" }, 0.18)
          .to(meta, { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: "power3.out" }, 0.75);

        // Rotate through real designations, decoding from glyphs into text
        const roles = profile.roles;
        let i = 0;
        const cycle = () => {
          if (!roleRef.current) return;
          gsap.to(roleRef.current, {
            duration: 1.4,
            scrambleText: {
              text: roles[i % roles.length],
              chars: "▮▯◆◇/\\_",
              speed: 0.4,
            },
            onComplete: () => {
              gsap.delayedCall(2.4, () => {
                i += 1;
                cycle();
              });
            },
          });
        };
        gsap.delayedCall(0.9, cycle);
      };

      window.addEventListener("intro:done", play, { once: true });
      // Safety: if the event never arrives, play anyway.
      const failsafe = gsap.delayedCall(4.5, play);

      // Scroll parallax: title drifts up slower, veil fades in
      gsap.to("[data-parallax='title']", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-parallax='veil']", {
        opacity: 0.85,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "75% top", scrub: true },
      });

      return () => {
        window.removeEventListener("intro:done", play);
        failsafe.kill();
      };
    },
    { scope: ref }
  );

  const summaryLead = profile.summary.split(". ")[0] + ".";
  const skyLabel = phase
    ? condition
      ? `${CONDITION_LABELS[condition]} · ${PHASE_LABELS[phase]}`
      : PHASE_LABELS[phase]
    : "";

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0">
        <Sky phase={phase} condition={condition} />
      </div>
      {/* readability scrims — content zone stays anchored to the page bg */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-bg via-bg/55 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg/50 to-transparent"
      />
      <div
        data-parallax="veil"
        aria-hidden="true"
        className="absolute inset-0 bg-bg opacity-0"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 pt-32 sm:px-8 sm:pb-14">
        <div data-parallax="title">
          <h1
            className="display select-none uppercase"
            style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            <span data-l1 className="char-line block text-[clamp(3rem,9vw,8rem)] leading-[0.95]">
              <Chars text="S K Santhosh" />
            </span>
            <span
              data-l2
              className="char-line block text-[clamp(3rem,9vw,8rem)] leading-[0.95] text-quiet"
            >
              <Chars text="Kumar" />
            </span>
          </h1>
        </div>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <div data-meta className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
              <span ref={roleRef} className="inline-block">
                {profile.roles[0]}
              </span>
            </p>
            <p className="mt-4 text-base leading-relaxed text-fg-soft sm:text-lg">
              {summaryLead}
            </p>
          </div>

          <div data-meta className="flex flex-wrap items-center gap-4">
            <a
              href="#work"
              data-cursor="Explore"
              className="btn-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium"
            >
              <span className="btn-fill" aria-hidden="true" />
              <span>View the work</span>
              <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={profile.resume}
              download="Santhosh-Kumar-Resume.pdf"
              className="btn-ghost group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium"
            >
              <IconDownload className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
              Résumé
            </a>
          </div>
        </div>

        <div
          data-meta
          className="mt-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:text-[11px]"
        >
          <span>{profile.location}</span>
          {skyLabel ? (
            <span className="hidden sm:block" title="The sky above adapts to your local time and weather">
              {skyLabel}
            </span>
          ) : null}
          <a href="#about" className="link-sweep flex items-center gap-2 text-fg-soft">
            Scroll
            <span style={{ animation: "float-slow 2.6s ease-in-out infinite" }} aria-hidden="true">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
