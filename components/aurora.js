"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

// Flowing aurora: layered fbm noise ribbons tinted with the site accents.
const FRAG = `
precision highp float;
uniform vec2 r;
uniform float t;
uniform float dark;

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
    p = p * 2.03 + vec2(11.3, 7.7);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / r.xy;
  vec2 q = vec2(uv.x * r.x / r.y, uv.y);
  float T = t * 0.045;

  float n1 = fbm(q * 1.5 + vec2(T * 0.9, -T * 0.4));
  float n2 = fbm(q * 2.4 - vec2(T * 0.5, T * 0.7) + n1);
  float ribbon = smoothstep(0.28, 0.78, fbm(q * 1.2 + n2 + vec2(T * 0.3, 0.0)));

  vec3 indigo = vec3(0.42, 0.42, 0.98);
  vec3 cyan   = vec3(0.35, 0.85, 0.97);
  vec3 teal   = vec3(0.30, 0.86, 0.71);
  vec3 col = mix(indigo, cyan, n1);
  col = mix(col, teal, n2 * 0.55);

  float vign = smoothstep(1.25, 0.25, distance(uv, vec2(0.5, 0.62)));
  float strength = ribbon * vign;

  if (dark > 0.5) {
    vec3 base = vec3(0.024, 0.024, 0.043);
    gl_FragColor = vec4(base + col * strength * 0.34, 1.0);
  } else {
    vec3 base = vec3(0.949, 0.945, 0.925);
    gl_FragColor = vec4(base - (vec3(1.0) - col) * strength * 0.22, 1.0);
  }
}
`;

export default function Aurora({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

    const uRes = gl.getUniformLocation(prog, "r");
    const uTime = gl.getUniformLocation(prog, "t");
    const uDark = gl.getUniformLocation(prog, "dark");

    // Render at reduced resolution — the aurora is soft, nobody can tell.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.66;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, rect.width * dpr);
      canvas.height = Math.max(2, rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    let dark = document.documentElement.dataset.theme !== "light" ? 1 : 0;
    const mo = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme !== "light" ? 1 : 0;
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let raf = 0;
    let running = false;
    const t0 = performance.now();
    const frame = (now) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.uniform1f(uDark, dark);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Only render while on screen
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
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`h-full w-full ${className}`} />;
}
