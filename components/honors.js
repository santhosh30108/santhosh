"use client";

import TiltCard from "@/components/tilt-card";
import { ChapterHeading, Rise } from "@/components/chapter";
import { IconAward, IconBook, IconCert } from "@/components/icons";
import { awards, certifications, publication } from "@/data/profile";

export default function Honors() {
  return (
    <section id="honors" className="relative scroll-mt-20 py-28 sm:py-40">
      <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8">
        <ChapterHeading index="05" eyebrow="Honors — receipts included">
          Proof of
          <br />
          <span className="font-serif italic font-normal lowercase text-iridescent">craft.</span>
        </ChapterHeading>

        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Rise className="mb-8 flex items-center gap-3">
              <IconAward className="h-5 w-5 text-accent-3" />
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Awards &amp; recognition
              </h3>
            </Rise>
            <ol>
              {awards.map((award, i) => (
                <Rise as="li" key={award.title} delay={Math.min(i * 0.06, 0.25)}>
                  <div className="group flex items-baseline gap-6 border-b border-line py-6 transition-colors duration-300 hover:border-line-strong sm:gap-10">
                    <span className="display shrink-0 text-2xl text-stroke transition-colors duration-300 group-hover:text-accent-3 sm:text-4xl" style={{ WebkitTextStroke: "1px var(--line-strong)" }}>
                      {award.year}
                    </span>
                    <div>
                      <p className="text-base font-medium leading-snug sm:text-lg">{award.title}</p>
                      <p className="mt-1.5 text-sm text-muted">{award.detail}</p>
                    </div>
                  </div>
                </Rise>
              ))}
            </ol>

            <Rise delay={0.2} className="mt-10">
              <TiltCard className="panel rounded-2xl p-7">
                <div className="flex items-start gap-4">
                  <IconBook className="mt-1 h-5 w-5 shrink-0 text-accent-2" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                      Published research
                    </p>
                    <p className="mt-2 font-serif text-xl italic leading-snug sm:text-2xl">
                      “{publication.title}”
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Rise>
          </div>

          <div>
            <Rise className="mb-8 flex items-center gap-3">
              <IconCert className="h-5 w-5 text-accent" />
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Certifications
              </h3>
            </Rise>
            <div className="grid gap-4">
              {certifications.map((cert, i) => (
                <Rise key={cert.title} delay={Math.min(i * 0.06, 0.25)}>
                  <TiltCard max={4} className="panel group rounded-2xl px-6 py-5 sm:px-8 sm:py-6">
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <p className="text-base font-medium leading-snug sm:text-lg">{cert.title}</p>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
                          {cert.issuer}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="display text-xl text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                      >
                        →
                      </span>
                    </div>
                  </TiltCard>
                </Rise>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
