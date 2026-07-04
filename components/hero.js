"use client";

import { useRef } from "react";
import Aurora from "@/components/aurora";
import Magnetic from "@/components/magnetic";
import { gsap, useGSAP } from "@/components/gsap";
import { IconArrowUpRight, IconDownload } from "@/components/icons";
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
  const scrambleRef = useRef(null);

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

        // Cycle roles with a scramble decode
        const roles = profile.roles;
        let i = 0;
        const cycle = () => {
          gsap.to(scrambleRef.current, {
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

      // Scroll parallax: title drifts up slower, meta fades
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

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <div className="absolute inset-0">
        <Aurora />
      </div>
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div
        data-parallax="veil"
        aria-hidden="true"
        className="absolute inset-0 bg-bg opacity-0"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-10 pt-32 sm:px-8 sm:pb-14">
        <div data-parallax="title">
          <p
            data-meta
            className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-fg-soft sm:text-xs"
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute h-full w-full rounded-full bg-emerald-400"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availability} — {profile.role} @ {profile.companyShort}
          </p>

          <h1
            className="display select-none uppercase"
            style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            <span data-l1 className="char-line block text-[clamp(3rem,9vw,8rem)] leading-[0.95]">
              <Chars text="Santhosh" />
            </span>
            <span
              data-l2
              className="char-line block text-[clamp(3rem,9vw,8rem)] leading-[0.95] text-stroke"
            >
              <Chars text="Kumar" />
            </span>
          </h1>
        </div>

        <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <div data-meta className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
              <span ref={scrambleRef}>{profile.roles[0]}</span>
            </p>
            <p className="mt-4 text-base leading-relaxed text-fg-soft sm:text-lg">
              I design, build, and optimise scalable systems for millions of learners —
              owning products from{" "}
              <em className="font-serif italic text-fg">architecture</em> to{" "}
              <em className="font-serif italic text-fg">launch</em>.
            </p>
          </div>

          <div data-meta className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#work"
                data-cursor="Explore"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium"
              >
                <span className="btn-fill" aria-hidden="true" />
                <span>View the work</span>
                <IconArrowUpRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resume}
                download="Santhosh-Kumar-Resume.pdf"
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium"
              >
                <IconDownload className="h-4 w-4" />
                Résumé
              </a>
            </Magnetic>
          </div>
        </div>

        <div
          data-meta
          className="mt-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:text-[11px]"
        >
          <span>{profile.location}</span>
          <span className="hidden sm:block">Est. 2022 — shipping since</span>
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
