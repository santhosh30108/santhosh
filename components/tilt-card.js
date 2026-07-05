"use client";

import { useRef } from "react";
import { gsap } from "@/components/gsap";

// 3D tilt + pointer-tracked glare. Wraps any content.
export default function TiltCard({ className = "", max = 3, children, ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    gsap.to(el, {
      rotateY: (px - 0.5) * max,
      rotateX: (0.5 - py) * max,
      transformPerspective: 900,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power2.out" });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`glare will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
      {...rest}
    >
      {children}
    </div>
  );
}
