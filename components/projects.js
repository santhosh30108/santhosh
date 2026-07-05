"use client";

import { useRef } from "react";
import TiltCard from "@/components/tilt-card";
import { ChapterHeading } from "@/components/chapter";
import { gsap, useGSAP } from "@/components/gsap";
import { IconSpark } from "@/components/icons";
import { scrollToSection } from "@/components/scroll-nav";
import { projects } from "@/data/profile";

const ACCENT_TEXT = {
  indigo: "text-indigo-400",
  cyan: "text-cyan-400",
  violet: "text-violet-400",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
};

function WorkCard({ project, index }) {
  return (
    <TiltCard
      data-cursor="Case study"
      className="panel flex h-full min-h-[420px] flex-col justify-between rounded-3xl p-7 sm:min-h-[480px] sm:p-10"
    >
      <div>
        <div className="flex items-baseline justify-between gap-6">
          <span className="font-mono text-xs text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {project.org}
          </span>
        </div>
        <p className={`mt-6 font-mono text-[11px] uppercase tracking-[0.25em] ${ACCENT_TEXT[project.accent] ?? "text-accent"}`}>
          {project.kind}
        </p>
        <h3 className="display mt-2 text-2xl leading-[1.05] sm:text-4xl">
          {project.title}
        </h3>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-soft sm:text-base">
          {project.description}
        </p>
      </div>

      <div>
        <p className="mt-6 flex items-start gap-3 border-t border-line pt-5 text-sm leading-relaxed sm:text-base">
          <IconSpark className={`mt-0.5 h-4 w-4 shrink-0 ${ACCENT_TEXT[project.accent] ?? "text-accent"}`} />
          <span className="text-fg-soft">{project.impact}</span>
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-surface-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </TiltCard>
  );
}

export default function Projects() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = ref.current.querySelector("[data-track]");
        const pinArea = ref.current.querySelector("[data-pin]");
        const progress = ref.current.querySelector("[data-progress]");
        const HEADER = 72;
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinArea,
            // pin below the fixed header so the gallery never slides under it
            start: `top ${HEADER}px`,
            // travel the gallery in ~70% of its pixel width — brisker, less scrolling
            end: () => `+=${Math.round(getDistance() * 0.7)}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progress) progress.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        return () => tween.scrollTrigger?.kill();
      });
    },
    { scope: ref }
  );

  return (
    <section id="work" ref={ref} className="relative scroll-mt-20 py-20 sm:py-28 lg:pb-0">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8">
        <ChapterHeading index="03" eyebrow="Selected work">
          Systems in
          <br />
          <span className="font-serif italic font-normal lowercase text-iridescent">production.</span>
        </ChapterHeading>
        <p className="-mt-8 mb-4 max-w-xl text-base leading-relaxed text-fg-soft sm:mb-0 sm:text-lg">
          Platforms serving millions of learners. Internal and proprietary — the case
          studies live here. <span className="hidden font-mono text-xs uppercase tracking-widest text-muted lg:inline">Keep scrolling — the gallery moves sideways.</span>
        </p>
      </div>

      {/* Desktop: pinned horizontal gallery. Mobile: vertical stack. */}
      <div data-pin className="lg:flex lg:h-[calc(100vh-72px)] lg:flex-col lg:justify-center">
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:max-w-none lg:px-0">
          <div
            data-track
            className="mt-10 grid gap-6 sm:mt-12 lg:mt-0 lg:flex lg:w-max lg:items-stretch lg:gap-8 lg:pl-[max(1.25rem,calc((100vw-1600px)/2+2rem))] lg:pr-24"
          >
            {projects.map((project, i) => (
              <div key={project.title} className="lg:w-[560px] lg:shrink-0 xl:w-[620px]">
                <WorkCard project={project} index={i} />
              </div>
            ))}

            <div className="hidden items-center lg:flex lg:w-[420px] lg:shrink-0">
              <div className="px-10">
                <p className="display text-4xl leading-[1.05] text-quiet">
                  More in the pipeline
                </p>
                <p className="mt-6 max-w-xs text-fg-soft">
                  New systems ship every quarter. Ask me what I&apos;m building right now.
                </p>
                <a
                  href="#contact"
                  onClick={(e) => {
                    if (scrollToSection("contact")) e.preventDefault();
                  }}
                  className="link-sweep mt-6 inline-block font-mono text-xs uppercase tracking-[0.25em] text-accent"
                >
                  Get in touch →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 hidden w-full max-w-[1600px] px-8 lg:block">
          <div className="h-px w-full bg-line">
            <div
              data-progress
              className="h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2"
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Scroll to travel the gallery
          </p>
        </div>
      </div>
    </section>
  );
}
