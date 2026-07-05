"use client";

import { useEffect, useState } from "react";
import { ChapterHeading, Rise } from "@/components/chapter";
import { ScrollTrigger } from "@/components/gsap";
import { skills } from "@/data/profile";

function levelLabel(level) {
  if (level >= 90) return "Expert";
  if (level >= 82) return "Advanced";
  return "Proficient";
}

const GROUP_NOTES = {
  "Frontend Engineering":
    "The craft I ship daily — component systems, rendering discipline, and interfaces that survive webviews, exams, and scale.",
  "Platform & Backend":
    "APIs and systems thinking: search, CRM lifecycles, payments, and the architecture decisions that keep platforms fast.",
  "Quality & Reliability":
    "Playwright suites, integration coverage, and exam-grade security — the invisible work that makes products trustworthy.",
  "Data & Systems":
    "Python, ML foundations, DSA practice, and an electrical engineer's comfort with the metal underneath.",
};

export default function Skills() {
  const [open, setOpen] = useState(0);

  // data-cursor labels flip with React state — tell the cursor to re-read
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cursor:refresh"));
  }, [open]);

  return (
    <section id="skills" className="relative scroll-mt-20 bg-bg-2/60 py-28 sm:py-40">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8">
        <ChapterHeading index="04" eyebrow="Capabilities">
          Depth over
          <br />
          <span className="font-serif italic font-normal lowercase text-iridescent">breadth.</span>
        </ChapterHeading>

        <div className="overflow-hidden rounded-3xl border border-line">
          {skills.map((group, gi) => {
            const isOpen = open === gi;
            return (
              <Rise key={group.group} delay={gi * 0.05}>
                <div
                  className="skill-row border-b border-line last:border-b-0"
                  data-open={isOpen ? "true" : undefined}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(isOpen ? -1 : gi);
                      // let the height transition finish, then re-measure scroll positions
                      setTimeout(() => ScrollTrigger.refresh(), 560);
                    }}
                    aria-expanded={isOpen}
                    data-cursor={isOpen ? "Close" : "Open"}
                    className="flex w-full items-center justify-between gap-6 px-5 py-7 text-left sm:px-10 sm:py-9"
                  >
                    <span className="flex items-baseline gap-5 sm:gap-8">
                      <span className="font-mono text-xs text-accent">0{gi + 1}</span>
                      <span className="display text-2xl leading-[1.05] sm:text-3xl md:text-4xl">
                        {group.group}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`display shrink-0 text-2xl text-muted transition-transform duration-500 sm:text-3xl ${
                        isOpen ? "rotate-45 text-accent" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-8 px-5 pb-9 sm:grid-cols-[1fr_1.4fr] sm:gap-14 sm:px-10 sm:pb-12">
                        <p className="max-w-md text-sm leading-relaxed text-fg-soft sm:text-base">
                          {GROUP_NOTES[group.group]}
                        </p>
                        <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
                          {group.items.map((skill, si) => (
                            <li
                              key={skill.name}
                              className="flex items-baseline justify-between gap-4 border-b border-line pb-3"
                              style={{
                                transition: `opacity .5s ease ${si * 60 + 120}ms, transform .5s cubic-bezier(0.22,1,0.36,1) ${si * 60 + 120}ms`,
                                opacity: isOpen ? 1 : 0,
                                transform: isOpen ? "none" : "translateY(12px)",
                              }}
                            >
                              <span className="text-sm font-medium sm:text-base">{skill.name}</span>
                              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                                {levelLabel(skill.level)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}
