import About from "@/components/about";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Honors from "@/components/honors";
import Marquee from "@/components/marquee";
import Projects from "@/components/projects";
import SiteShell from "@/components/site-shell";
import Skills from "@/components/skills";

const MARQUEE_ITEMS = [
  "Full-Stack Engineer",
  "React",
  "Next.js",
  "Systems Ownership",
  "Ed-Tech at Scale",
];

export default function Home() {
  return (
    <>
      <SiteShell>
        <Hero />
        <div className="border-y border-line bg-bg-2/60">
          <Marquee items={MARQUEE_ITEMS} speed={40} />
        </div>
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Honors />
        <Contact />
      </SiteShell>
      <Footer />
    </>
  );
}
