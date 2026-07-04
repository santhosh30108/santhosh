"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, EASE_IN_OUT } from "@/components/gsap";
import { profile } from "@/data/profile";

// Cinematic intro: counter climbs to 100 behind a masked name,
// then twin curtains part to reveal the hero. Once per session.
export default function Preloader() {
  const [active, setActive] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    let ctx;
    const raf = requestAnimationFrame(() => {
      try {
        if (sessionStorage.getItem("intro-seen")) return;
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setActive(true);
      document.documentElement.style.overflow = "hidden";

      requestAnimationFrame(() => {
        const root = rootRef.current;
        if (!root) return;
        const counter = root.querySelector("[data-counter]");
        const name = root.querySelectorAll("[data-name] .char");
        const line = root.querySelector("[data-line]");
        const panels = root.querySelectorAll("[data-panel]");
        const value = { n: 0 };

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              document.documentElement.style.overflow = "";
              setActive(false);
              window.dispatchEvent(new CustomEvent("intro:done"));
            },
          });
          tl.fromTo(name, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.045, ease: "power4.out" }, 0)
            .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0.1)
            .to(value, {
              n: 100,
              duration: 1.5,
              ease: "power2.inOut",
              onUpdate: () => {
                if (counter) counter.textContent = String(Math.round(value.n)).padStart(3, "0");
              },
            }, 0.1)
            .to(name, { yPercent: -110, duration: 0.7, stagger: 0.03, ease: "power3.in" }, "+=0.15")
            .to([counter?.parentElement, line], { opacity: 0, duration: 0.4 }, "<")
            .to(panels, {
              yPercent: -100,
              duration: 0.95,
              stagger: 0.08,
              ease: EASE_IN_OUT,
            }, "-=0.25");
        }, root);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    // Pages loaded mid-session skip the intro — still announce readiness
    // so hero entrance animations can key off a single event.
    if (!active) {
      const t = setTimeout(() => window.dispatchEvent(new CustomEvent("intro:done")), 60);
      return () => clearTimeout(t);
    }
  }, [active]);

  if (!active) return null;

  const name = profile.shortName.toUpperCase();

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80]" aria-hidden="true">
      <div data-panel className="absolute inset-x-0 top-0 h-1/2 bg-bg-2" />
      <div data-panel className="absolute inset-x-0 bottom-0 h-1/2 bg-bg-2" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        <p data-name className="char-line display text-4xl tracking-tight sm:text-6xl">
          {name.split("").map((c, i) => (
            <span key={i} className="char">
              {c === " " ? " " : c}
            </span>
          ))}
        </p>
        <div
          data-line
          className="h-px w-56 origin-left bg-gradient-to-r from-accent to-accent-2 sm:w-72"
        />
        <p className="font-mono text-sm text-muted">
          <span data-counter>000</span> / 100
        </p>
      </div>
    </div>
  );
}
