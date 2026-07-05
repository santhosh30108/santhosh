"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/use-theme";

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

// One adaptive sky: gradient + sun/moon glow + fbm clouds + stars +
// rain streaks + snow + fog + lightning flash. Every layer is gated by a
// uniform so scenes crossfade by lerping parameters on the CPU.
const FRAG = `
precision highp float;
uniform vec2 r;
uniform float t;
uniform vec3 uTop, uBot, uGlow, uCloudCol;
uniform vec2 uSun;
uniform float uCloud, uStars, uRain, uSnow, uFog, uFlash;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.02 + vec2(13.7, 7.3);
    a *= 0.5;
  }
  return v;
}

float snowLayer(vec2 p) {
  vec2 id = floor(p);
  vec2 f = fract(p) - 0.5;
  float h = hash(id);
  f += 0.3 * vec2(sin(h * 6.28 + t * 0.7), cos(h * 6.28 + t * 0.5));
  float d = length(f);
  return smoothstep(0.055, 0.012, d) * step(0.7, h);
}

void main() {
  vec2 uv = gl_FragCoord.xy / r.xy;
  vec2 q = vec2(uv.x * r.x / r.y, uv.y);

  // base gradient
  vec3 col = mix(uBot, uTop, pow(uv.y, 0.85));

  // sun / moon bloom
  vec2 sunQ = vec2(uSun.x * r.x / r.y, uSun.y);
  float sd = distance(q, sunQ);
  col += uGlow * exp(-sd * sd * 7.0) * 0.55;
  col += uGlow * exp(-sd * sd * 60.0) * 0.35;

  // stars (kept out of cloud cover, upper sky only)
  float starMask = uStars * smoothstep(0.3, 0.65, uv.y);
  if (starMask > 0.002) {
    vec2 sp = q * 110.0;
    vec2 sid = floor(sp);
    float sh = hash(sid);
    float star = step(0.992, sh) * smoothstep(0.35, 0.0, length(fract(sp) - 0.5));
    float tw = 0.55 + 0.45 * sin(t * 2.2 + sh * 40.0);
    col += vec3(0.9, 0.94, 1.0) * star * tw * starMask;
  }

  // clouds — two drifting fbm layers
  float n1 = fbm(vec2(q.x * 1.4 + t * 0.012, uv.y * 3.2));
  float n2 = fbm(vec2(q.x * 2.6 - t * 0.008, uv.y * 5.0) + 4.7);
  float n = n1 * 0.65 + n2 * 0.35;
  float cov = smoothstep(1.0 - uCloud * 0.85, 1.25 - uCloud * 0.85, n);
  col = mix(col, uCloudCol * (0.72 + 0.28 * n), cov * 0.92);

  // rain — faint diagonal streaks
  if (uRain > 0.002) {
    float streak = pow(noise(vec2(uv.x * 110.0 - uv.y * 26.0, uv.y * 2.5 - t * 3.6)), 8.0);
    float streak2 = pow(noise(vec2(uv.x * 70.0 - uv.y * 16.0, uv.y * 2.0 - t * 2.5) + 9.1), 8.0);
    col += vec3(0.45, 0.55, 0.68) * (streak + streak2 * 0.6) * uRain * 0.16;
  }

  // snow — two parallax layers of small flakes
  if (uSnow > 0.002) {
    float sf = snowLayer(q * 14.0 + vec2(t * 0.05, -t * 0.3))
             + snowLayer(q * 26.0 + vec2(-t * 0.04, -t * 0.5)) * 0.6;
    col += vec3(0.9, 0.93, 1.0) * sf * uSnow * 0.8;
  }

  // fog — low-frequency drifting veil
  if (uFog > 0.002) {
    float fgn = fbm(q * 1.1 + vec2(t * 0.01, 0.0));
    col = mix(col, mix(uBot, vec3(0.62), 0.35), uFog * (0.3 + 0.45 * fgn));
  }

  // lightning — brief global lift, strongest in the clouds
  col += uFlash * vec3(0.8, 0.87, 1.05) * (0.3 + cov * 0.7);

  gl_FragColor = vec4(col, 1.0);
}
`;

// ---- scene construction -------------------------------------------------

const PHASES = {
  dawn:   { top: [0.17, 0.23, 0.40], bot: [0.86, 0.60, 0.38], glow: [1.0, 0.72, 0.45], sun: [0.28, 0.22], stars: 0.12 },
  day:    { top: [0.30, 0.50, 0.78], bot: [0.66, 0.79, 0.92], glow: [1.0, 0.96, 0.84], sun: [0.74, 0.80], stars: 0.0 },
  golden: { top: [0.24, 0.25, 0.46], bot: [0.90, 0.56, 0.32], glow: [1.0, 0.66, 0.36], sun: [0.70, 0.24], stars: 0.04 },
  dusk:   { top: [0.10, 0.11, 0.27], bot: [0.42, 0.30, 0.50], glow: [0.76, 0.56, 0.76], sun: [0.30, 0.20], stars: 0.45 },
  night:  { top: [0.012, 0.018, 0.055], bot: [0.05, 0.08, 0.16], glow: [0.62, 0.72, 0.90], sun: [0.76, 0.78], stars: 1.0 },
};

const CONDITIONS = {
  clear:  { cloud: 0.10, rain: 0, snow: 0, fog: 0, dim: 1.0, desat: 0.0, storm: false },
  partly: { cloud: 0.38, rain: 0, snow: 0, fog: 0, dim: 0.96, desat: 0.08, storm: false },
  cloudy: { cloud: 0.85, rain: 0, snow: 0, fog: 0, dim: 0.78, desat: 0.4, storm: false },
  fog:    { cloud: 0.45, rain: 0, snow: 0, fog: 0.75, dim: 0.85, desat: 0.45, storm: false },
  rain:   { cloud: 0.92, rain: 0.75, snow: 0, fog: 0.12, dim: 0.62, desat: 0.5, storm: false },
  storm:  { cloud: 1.0, rain: 1.0, snow: 0, fog: 0.1, dim: 0.45, desat: 0.55, storm: true },
  snow:   { cloud: 0.6, rain: 0, snow: 0.8, fog: 0.15, dim: 0.9, desat: 0.35, storm: false },
};

function mix3(a, b, k) {
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}
function desaturate(c, k) {
  const l = c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;
  return mix3(c, [l, l, l], k);
}

// Order: top(3) bot(3) glow(3) cloudCol(3) sun(2) cloud stars rain snow fog → 19
function sceneParams(phase, condition, dark) {
  const p = PHASES[phase] ?? PHASES.night;
  const c = CONDITIONS[condition] ?? CONDITIONS.clear;

  let top = desaturate(p.top, c.desat).map((v) => v * c.dim);
  let bot = desaturate(p.bot, c.desat).map((v) => v * c.dim);
  let glow = p.glow.map((v) => v * (c.storm ? 0.25 : c.dim));
  let cloudCol = mix3(mix3(bot, [1, 1, 1], phase === "night" ? 0.12 : 0.55), [0.06, 0.07, 0.1], c.storm ? 0.75 : 0);

  // Blend toward the page background so the sky reads as ambience,
  // not a photo. Dark theme sits deeper; light theme stays airy.
  const base = dark ? [0.024, 0.024, 0.043] : [0.949, 0.945, 0.925];
  const seat = dark ? 0.52 : 0.3;
  top = mix3(top, base, seat);
  bot = mix3(bot, base, seat * 0.8);
  cloudCol = mix3(cloudCol, base, seat * 0.7);
  glow = glow.map((v) => v * (dark ? 0.75 : 0.9));

  const stars = p.stars * (1 - c.cloud * 0.9);
  return {
    arr: [...top, ...bot, ...glow, ...cloudCol, ...p.sun, c.cloud, stars, c.rain, c.snow, c.fog],
    storm: c.storm,
    glowCss: glow,
    topCss: top,
  };
}

export default function Sky({ phase, condition }) {
  const canvasRef = useRef(null);
  const targetRef = useRef(null);
  const stormRef = useRef(false);
  const theme = useTheme();

  // Recompute target scene + ambient page tint whenever inputs change.
  useEffect(() => {
    if (!phase) return;
    const dark = theme !== "light";
    const scene = sceneParams(phase, condition ?? "clear", dark);
    targetRef.current = scene.arr;
    stormRef.current = scene.storm;

    const [gr, gg, gb] = scene.glowCss;
    const [tr, tg, tb] = scene.topCss;
    const root = document.documentElement;
    root.style.setProperty("--glow-1", `rgba(${Math.round(gr * 255)}, ${Math.round(gg * 255)}, ${Math.round(gb * 255)}, ${dark ? 0.16 : 0.2})`);
    root.style.setProperty("--glow-2", `rgba(${Math.round(tr * 255)}, ${Math.round(tg * 255)}, ${Math.round(tb * 255)}, ${dark ? 0.1 : 0.12})`);
  }, [phase, condition, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    for (const name of ["r", "t", "uTop", "uBot", "uGlow", "uCloudCol", "uSun", "uCloud", "uStars", "uRain", "uSnow", "uFog", "uFlash"]) {
      U[name] = gl.getUniformLocation(prog, name);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.66;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, rect.width * dpr);
      canvas.height = Math.max(2, rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    // Start on the current target (no fade from black).
    const cur = new Float32Array(targetRef.current ?? sceneParams("night", "clear", true).arr);

    let flash = 0;
    let nextFlash = performance.now() + 4000 + Math.random() * 6000;
    let raf = 0;
    let running = false;
    const t0 = performance.now();

    const draw = (now) => {
      const tgt = targetRef.current;
      if (tgt) {
        const k = reduced ? 1 : 0.025;
        for (let i = 0; i < cur.length; i++) cur[i] += (tgt[i] - cur[i]) * k;
      }

      if (stormRef.current && now > nextFlash) {
        flash = 0.55 + Math.random() * 0.45;
        nextFlash = now + 3500 + Math.random() * 8000;
      }
      flash *= 0.9;

      gl.uniform2f(U.r, canvas.width, canvas.height);
      gl.uniform1f(U.t, (now - t0) / 1000);
      gl.uniform3f(U.uTop, cur[0], cur[1], cur[2]);
      gl.uniform3f(U.uBot, cur[3], cur[4], cur[5]);
      gl.uniform3f(U.uGlow, cur[6], cur[7], cur[8]);
      gl.uniform3f(U.uCloudCol, cur[9], cur[10], cur[11]);
      gl.uniform2f(U.uSun, cur[12], cur[13]);
      gl.uniform1f(U.uCloud, cur[14]);
      gl.uniform1f(U.uStars, cur[15]);
      gl.uniform1f(U.uRain, cur[16]);
      gl.uniform1f(U.uSnow, cur[17]);
      gl.uniform1f(U.uFog, cur[18]);
      gl.uniform1f(U.uFlash, flash);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now) => {
      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!running && !reduced) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) {
      // Static, scene-appropriate frame; redraw only when the scene changes.
      draw(performance.now());
      const redraw = setInterval(() => draw(performance.now()), 2000);
      window.addEventListener("resize", resize);
      return () => {
        clearInterval(redraw);
        window.removeEventListener("resize", resize);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    const io = new IntersectionObserver(
      (entries) => (entries[0].isIntersecting ? start() : stop()),
      { threshold: 0.01 }
    );
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />;
}
