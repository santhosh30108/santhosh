"use client";

import { useRef } from "react";
import { gsap, useGSAP, EASE } from "@/components/gsap";

// Shared chapter heading: eyebrow rule draws in, heading rises gently.
export function ChapterHeading({ index, eyebrow, children, className = "" }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const root = ref.current;
      const heading = root.querySelector("[data-heading]");
      const rule = root.querySelector("[data-rule]");

      gsap.fromTo(
        heading,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: EASE,
          scrollTrigger: { trigger: root, start: "top 82%" },
        }
      );
      gsap.fromTo(
        rule,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: root, start: "top 82%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`relative mb-16 sm:mb-24 ${className}`}>
      <span
        aria-hidden="true"
        className="absolute right-0 top-1 hidden select-none font-mono text-sm tracking-[0.2em] text-muted/70 sm:block"
      >
        / {index}
      </span>
      <p className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        <span data-rule className="inline-block h-px w-10 origin-left bg-accent" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2
        data-heading
        className="display gsap-fallback max-w-3xl text-[9vw] leading-[1.05] sm:text-6xl md:text-7xl"
      >
        {children}
      </h2>
    </div>
  );
}

// Generic rise-on-enter for arbitrary blocks
export function Rise({ as: Tag = "div", delay = 0, y = 36, className = "", children, ...rest }) {
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
          duration: 0.9,
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
