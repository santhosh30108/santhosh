"use client";

import { gsap, ScrollTrigger, EASE_IN_OUT, prefersReducedMotion } from "@/components/gsap";

// Sections use scroll-mt-20 (5rem) for native anchor jumps; mirror it here.
const OFFSET = 80;

// Entrance tweens are one-shot ScrollTriggers, and an instant anchor jump
// consumes every tween it flies past while nothing is on screen — a later
// visit then finds the section already in its final state. Re-arm the target
// section's tweens and glide there instead, so arrival always plays the same
// entrance a normal first scroll shows.
//
// Returns false under reduced motion (caller should let the native jump
// happen — the entrance tweens are disabled there anyway).
export function scrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return false;
  if (prefersReducedMotion()) return false;

  const armed = ScrollTrigger.getAll().filter(
    (st) => st.animation && !st.vars.scrub && st.trigger && target.contains(st.trigger)
  );
  for (const st of armed) st.animation.pause(0);

  // Scrolling down, ScrollTrigger re-fires onEnter mid-glide and resumes the
  // tweens itself. Scrolling up it never does (enterBack doesn't play), so
  // anything still parked at 0 whose start line is behind us must be played
  // here — including when the glide is cut short — or it stays invisible.
  const settle = () => {
    for (const st of armed) {
      if (st.animation.paused() && st.animation.totalProgress() === 0 && st.start <= window.scrollY) {
        st.animation.restart(true);
      }
    }
  };

  const y = Math.max(0, window.scrollY + target.getBoundingClientRect().top - OFFSET);
  gsap.killTweensOf(window);
  gsap.to(window, {
    scrollTo: { y, autoKill: true },
    duration: gsap.utils.clamp(0.6, 1.4, Math.abs(y - window.scrollY) / 2600),
    ease: EASE_IN_OUT,
    onComplete: settle,
    onInterrupt: settle,
  });

  history.pushState(null, "", `#${id}`);
  return true;
}
