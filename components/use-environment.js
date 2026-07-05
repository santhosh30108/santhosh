"use client";

import { useEffect, useState } from "react";

// Time-of-day phase from the visitor's clock.
export function phaseFor(hour) {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 19) return "golden";
  if (hour >= 19 && hour < 21) return "dusk";
  return "night";
}

// WMO weather codes → simplified condition buckets.
function conditionFromCode(code) {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 95) return "storm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  return "clear";
}

export const CONDITION_LABELS = {
  clear: "Clear",
  partly: "Partly cloudy",
  cloudy: "Overcast",
  fog: "Mist",
  rain: "Rainfall",
  storm: "Thunderstorm",
  snow: "Snowfall",
};

export const PHASE_LABELS = {
  dawn: "Sunrise",
  day: "Daylight",
  golden: "Golden hour",
  dusk: "Dusk",
  night: "Night",
};

const CACHE_KEY = "wx-cache";
const CACHE_TTL = 30 * 60 * 1000;

// Local time phase always works; weather arrives if the visitor grants
// location (or a fresh cached reading exists). Denied/failed → null,
// and the sky falls back to a clear, time-appropriate scene.
export function useEnvironment() {
  const [phase, setPhase] = useState(null);
  const [condition, setCondition] = useState(null);

  useEffect(() => {
    // Preview override: ?sky=<phase>.<condition>, e.g. ?sky=night.storm
    const forced = new URLSearchParams(window.location.search).get("sky")?.split(".") ?? [];
    const tick = () =>
      setPhase(PHASE_LABELS[forced[0]] ? forced[0] : phaseFor(new Date().getHours()));
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 60 * 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const raf = requestAnimationFrame(() => {
      const forced = new URLSearchParams(window.location.search).get("sky")?.split(".") ?? [];
      if (CONDITION_LABELS[forced[1]]) {
        setCondition(forced[1]);
        return;
      }
      try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
          if (!cancelled) setCondition(cached.condition);
          return;
        }
      } catch {}

      if (!("geolocation" in navigator)) return;

      navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}&current=weather_code`
          );
          const json = await res.json();
          const cond = conditionFromCode(json?.current?.weather_code ?? 0);
          if (!cancelled) {
            setCondition(cond);
            try {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), condition: cond }));
            } catch {}
          }
        } catch {}
      },
        () => {},
        { timeout: 8000, maximumAge: CACHE_TTL }
      );
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return { phase, condition };
}
