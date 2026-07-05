"use client";

import { useEffect, useState } from "react";

// Time-of-day phase from the visitor's clock:
// 6:00–8:59 dawn · 9:00–11:59 morning · 12:00–15:59 midday ·
// 16:00–18:29 golden · 18:30–5:59 night
export function phaseFor(date) {
  const m = date.getHours() * 60 + date.getMinutes();
  if (m >= 6 * 60 && m < 9 * 60) return "dawn";
  if (m >= 9 * 60 && m < 12 * 60) return "morning";
  if (m >= 12 * 60 && m < 16 * 60) return "midday";
  if (m >= 16 * 60 && m < 18 * 60 + 30) return "golden";
  return "night";
}

export const PHASE_LABELS = {
  dawn: "Early morning",
  morning: "Morning",
  midday: "Midday",
  golden: "Golden hour",
  night: "Night",
};

// The sky adapts purely to local time; a minute tick catches phase
// boundaries and the canvas crossfades to the new scene.
export function useEnvironment() {
  const [phase, setPhase] = useState(null);

  useEffect(() => {
    // Preview override: ?sky=<phase>, e.g. ?sky=night
    const forced = new URLSearchParams(window.location.search).get("sky")?.split(".")[0];
    const tick = () => setPhase(PHASE_LABELS[forced] ? forced : phaseFor(new Date()));
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 60 * 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return { phase };
}
