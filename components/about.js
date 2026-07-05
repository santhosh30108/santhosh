"use client";

import { useRef } from "react";
import Counter from "@/components/counter";
import { ChapterHeading, Rise } from "@/components/chapter";
import { gsap, useGSAP } from "@/components/gsap";
import { education, profile } from "@/data/profile";

const MANIFESTO =
  "I believe great software is owned, not just written. For four years I've carried products end-to-end — architecture, build, tests, launch, and the long tail of optimisation — across CRM platforms, secure assessment engines, and ML-assisted learning tools used by millions of students.";

function ScrubWords({ text }) {
  return text.split(" ").map((w, i) => (
    <span key={i} className="w">
      {w}{" "}
    </span>
  ));
}

export default function About() {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const words = ref.current.querySelectorAll(".word-scrub .w");
      gsap.to(words, {
        opacity: 1,
        stagger: 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current.querySelector(".word-scrub"),
          start: "top 78%",
          end: "bottom 45%",
          scrub: 0.4,
        },
      });
    },
    { scope: ref }
  );

  return (
    <section id="about" ref={ref} className="relative scroll-mt-20 py-28 sm:py-40">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8">
        <ChapterHeading index="01" eyebrow="About">
          Owner,
          <br />
          not <span className="font-serif italic font-normal lowercase text-iridescent">renter.</span>
        </ChapterHeading>

        <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-24">
          <div>
            <p className="word-scrub max-w-3xl text-2xl font-medium leading-snug tracking-tight sm:text-3xl md:text-[2.6rem] md:leading-[1.2]">
              <ScrubWords text={MANIFESTO} />
            </p>

            <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {profile.stats.map((stat, i) => (
                <Rise
                  key={stat.label}
                  delay={i * 0.08}
                  className="group bg-bg p-6 transition-colors duration-500 hover:bg-bg-2 sm:p-8"
                >
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="display block text-4xl text-fg transition-colors duration-300 group-hover:text-accent sm:text-6xl"
                  />
                  <span className="mt-3 block font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted">
                    {stat.label}
                  </span>
                </Rise>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <Rise>
              <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                Education
              </h3>
              <ul className="space-y-6">
                {education.map((e) => (
                  <li key={e.school} className="group border-l border-line-strong pl-5 transition-colors duration-300 hover:border-accent">
                    <p className="text-base font-medium">{e.school}</p>
                    <p className="mt-1 text-sm text-fg-soft">{e.degree}</p>
                    <p className="mt-1.5 font-mono text-xs text-muted">{e.period}</p>
                  </li>
                ))}
              </ul>
            </Rise>

            <Rise delay={0.1}>
              <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                Speaks
              </h3>
              <ul className="flex flex-wrap gap-2">
                {profile.languages.map((l) => (
                  <li
                    key={l.name}
                    title={l.level}
                    className="rounded-full border border-line-strong px-4 py-2 text-sm text-fg-soft transition-all duration-300 hover:border-accent hover:text-fg hover:bg-accent-soft"
                  >
                    {l.name}
                  </li>
                ))}
              </ul>
            </Rise>

            <Rise delay={0.15}>
              <figure className="panel glare rounded-2xl p-7">
                <blockquote className="font-serif text-xl italic leading-relaxed text-fg-soft">
                  “Actively practicing data structures and algorithms — committed to clean,
                  efficient, maintainable code.”
                </blockquote>
                <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                  — the daily discipline
                </figcaption>
              </figure>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
