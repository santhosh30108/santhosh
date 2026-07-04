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
  return (
    <>
      <SiteShell>
        <Hero />
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
