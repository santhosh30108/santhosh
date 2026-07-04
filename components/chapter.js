"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, EASE } from "@/components/gsap";

// Shared chapter heading: giant index watermark drifts on scroll,
// eyebrow line draws in, heading rises line-by-line.
export function ChapterHeading({ index, eyebrow, children, className = "" }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const root = ref.current;
      const heading = root.querySelector("[data-heading]");
      const rule = root.querySelector("[data-rule]");
      const mark = root.querySelector("[data-watermark]");

      gsap.fromTo(
        heading,
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: EASE,
          scrollTrigger: { trigger: root, start: "top 82%" },
        }
      );
      gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: root, start: "top 82%" },
        }
      );
      if (mark) {
        gsap.fromTo(
          mark,
          { yPercent: 30 },
          {
            yPercent: -30,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`relative mb-16 sm:mb-24 ${className}`}>
      <span
        data-watermark
        aria-hidden="true"
        className="watermark pointer-events-none absolute -top-24 right-0 select-none text-[9rem] sm:-top-32 sm:text-[15rem]"
      >
        {index}
      </span>
      <p className="mb-5 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        <span data-rule className="inline-block h-px w-12 origin-left bg-accent" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2
        data-heading
        className="display gsap-fallback max-w-4xl text-[10vw] leading-[1.02] sm:text-7xl md:text-8xl"
      >
        {children}
      </h2>
    </div>
  );
}

// Generic rise-on-enter for arbitrary blocks
export function Rise({ as: Tag = "div", delay = 0, y = 50, className = "", children, ...rest }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ref.current,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay,
          ease: EASE,
          scrollTrigger: { trigger: ref.current, start: "top 88%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={`gsap-fallback ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
