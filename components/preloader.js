"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, EASE_IN_OUT } from "@/components/gsap";
import { profile } from "@/data/profile";

// Brief, quiet intro: the name rises, a rule draws, the veil parts.
// Once per session.
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
        const name = root.querySelectorAll("[data-name] .char");
        const line = root.querySelector("[data-line]");
        const panels = root.querySelectorAll("[data-panel]");

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              document.documentElement.style.overflow = "";
              setActive(false);
              window.dispatchEvent(new CustomEvent("intro:done"));
            },
          });
          tl.fromTo(name, { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.035, ease: "power4.out" }, 0)
            .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0.1)
            .to(name, { yPercent: -110, duration: 0.55, stagger: 0.02, ease: "power3.in" }, "+=0.2")
            .to(line, { opacity: 0, duration: 0.3 }, "<")
            .to(panels, {
              yPercent: -100,
              duration: 0.85,
              stagger: 0.07,
              ease: EASE_IN_OUT,
            }, "-=0.2");
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

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-7">
        <p data-name className="char-line display text-3xl tracking-tight sm:text-5xl">
          {name.split("").map((c, i) => (
            <span key={i} className="char">
              {c === " " ? " " : c}
            </span>
          ))}
        </p>
        <div data-line className="h-px w-48 origin-left bg-accent sm:w-64" />
      </div>
    </div>
  );
}
