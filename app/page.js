import fs from "node:fs";
import path from "node:path";
import About from "@/components/about";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Honors from "@/components/honors";
import Projects from "@/components/projects";
import SiteShell from "@/components/site-shell";
import Skills from "@/components/skills";

export default function Home() {
  // Skip the portrait <img> entirely until a photo lands in /public —
  // avoids a guaranteed 404 request on every page load.
  const hasPortrait = fs.existsSync(path.join(process.cwd(), "public", "portrait.jpg"));

  return (
    <>
      <SiteShell>
        <Hero />
        <About hasPortrait={hasPortrait} />
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
