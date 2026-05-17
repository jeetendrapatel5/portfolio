"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Method from "@/components/sections/Method";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/ui/Marquee";

import Cursor from "@/components/ui/Cursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/Navbar";

import useThemeMode from "@/hooks/useThemeMode";
import useGSAPMotion from "@/hooks/useGSAPMotion";

import { NAV_LINKS } from "@/data/portfolioData";

export default function Portfolio() {
  const { isThemeAnimating, theme, toggleTheme } = useThemeMode();
  useGSAPMotion();

  return (
    <div className={`portfolio-shell ${isThemeAnimating ? "theme-shifting" : ""}`} data-theme={theme}>
      <div className="intro-wipe" aria-hidden="true">
        <span>Jeetendra Patel</span>
      </div>
      <div className="theme-flash" aria-hidden="true" />
      <ScrollProgress />
      <Cursor />
      <Navbar links={NAV_LINKS} onThemeToggle={toggleTheme} theme={theme} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Skills />
        <Method />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}