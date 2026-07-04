"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/components/gsap";

// Custom cursor: crisp dot + lagging ring. Ring morphs and shows a label
// over elements with [data-cursor="View"], grows over links/buttons.
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });

    let seen = false;
    const onMove = (e) => {
      if (!seen) {
        seen = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY, opacity: 1 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const INTERACTIVE = "a, button, [role='button'], input, textarea, summary, [data-cursor]";
    const onOver = (e) => {
      const el = e.target.closest(INTERACTIVE);
      if (!el) return;
      const text = el.dataset?.cursor;
      if (text && label) {
        label.textContent = text;
        gsap.to(ring, { scale: 3.2, backgroundColor: "var(--fg)", duration: 0.35, ease: "power3.out" });
        gsap.to(label, { opacity: 1, duration: 0.25 });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      } else {
        gsap.to(ring, { scale: 1.9, duration: 0.35, ease: "power3.out" });
      }
    };
    const onOut = (e) => {
      const el = e.target.closest(INTERACTIVE);
      if (!el) return;
      gsap.to(ring, { scale: 1, backgroundColor: "transparent", duration: 0.35, ease: "power3.out" });
      if (label) gsap.to(label, { opacity: 0, duration: 0.2 });
      gsap.to(dot, { opacity: 1, duration: 0.2 });
    };

    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.18 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25 });
    const onLeaveDoc = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    const onEnterDoc = () => gsap.to([dot, ring], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeaveDoc);
    document.documentElement.addEventListener("pointerenter", onEnterDoc);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeaveDoc);
      document.documentElement.removeEventListener("pointerenter", onEnterDoc);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[94] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong opacity-0"
      >
        <span
          ref={labelRef}
          className="font-mono text-[3.5px] font-medium uppercase tracking-widest text-bg opacity-0"
        >
          View
        </span>
      </div>
    </>
  );
}
