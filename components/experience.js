"use client";

import { useRef } from "react";
import { ChapterHeading, Rise } from "@/components/chapter";
import { gsap, useGSAP } from "@/components/gsap";
import { experience } from "@/data/profile";

export default function Experience() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const line = ref.current.querySelector("[data-spine]");
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current.querySelector("[data-timeline]"),
            start: "top 70%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section id="experience" ref={ref} className="relative scroll-mt-20 bg-bg-2/60 py-28 sm:py-40">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8">
        <ChapterHeading index="02" eyebrow="Experience">
          Four years,
          <br />
          <span className="text-quiet">zero</span>{" "}
          <span className="font-serif italic font-normal lowercase text-iridescent">handoffs.</span>
        </ChapterHeading>

        <div data-timeline className="relative">
          <span
            data-spine
            aria-hidden="true"
            className="absolute left-[5px] top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-transparent sm:block"
          />

          <ol className="space-y-20 sm:space-y-28 sm:pl-16">
            {experience.map((job, i) => {
              return (
                <li key={`${job.company}-${job.role}`} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-16 top-3 hidden h-[11px] w-[11px] rounded-full sm:block ${
                      job.current ? "bg-accent shadow-[0_0_18px_var(--accent)]" : "border border-line-strong bg-bg"
                    }`}
                  />

                  <Rise className="relative max-w-4xl">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                      {job.period} · {job.location}
                      {job.current && (
                        <span className="ml-3 rounded-full bg-accent-soft px-2.5 py-1 text-[9px] font-semibold tracking-[0.2em] text-accent">
                          NOW
                        </span>
                      )}
                    </p>
                    <h3 className="display mt-4 text-3xl leading-[1.05] sm:text-4xl">
                      {job.role}
                    </h3>
                    <p className="mt-2 font-serif text-xl italic text-accent sm:text-2xl">
                      {job.company}
                    </p>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-soft sm:text-lg">
                      {job.summary}
                    </p>

                    <details className="group/details mt-5">
                      <summary
                        data-cursor="Open"
                        className="inline-flex cursor-pointer list-none items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-accent-2 [&::-webkit-details-marker]:hidden"
                      >
                        <span className="inline-block transition-transform duration-300 group-open/details:rotate-45">
                          +
                        </span>
                        Key contributions
                      </summary>
                      <ul className="mt-6 grid gap-4 border-l border-line pl-6 sm:gap-5">
                        {job.highlights.map((h, j) => (
                          <li
                            key={j}
                            className="relative max-w-2xl text-sm leading-relaxed text-fg-soft before:absolute before:-left-6 before:top-[0.6em] before:h-px before:w-3 before:bg-accent sm:text-base"
                          >
                            {h}
                          </li>
                        ))}
                      </ul>
                    </details>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors duration-300 hover:border-line-strong hover:text-fg-soft"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </Rise>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
