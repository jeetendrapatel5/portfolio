"use client";

import Link from "next/link";
import useGSAPMotion from "@/hooks/useGSAPMotion";
import useThemeMode from "@/hooks/useThemeMode";
import { PROJECTS } from "@/data/portfolioData";
import Cursor from "@/components/ui/Cursor.jsx";
import Navbar from "@/components/Navbar";
import { NAV_LINKS } from "@/data/portfolioData";
import ButtonLink from '@/components/ui/ButtonLink.jsx'
import Footer from "@/components/sections/Footer";
import PortalPreview from "@/components/project/PortalPreview";
import MapPreview from "@/components/project/MapPreview";
import TerminalPreview from "@/components/project/TerminalPreview";


const PREVIEW_REGISTRY = {
  portal: PortalPreview,
  map: MapPreview,
  terminal: TerminalPreview,
};

function ProjectExhibit({ project, index }) {
  const Preview = PREVIEW_REGISTRY[project.preview] ?? PortalPreview;

  return (
    <article
      className="project-card"
      data-reveal
      style={{ "--delay": `${index * 90}ms` }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          zIndex: 0,
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "clamp(5.5rem, 13vw, 11rem)",
          lineHeight: 1,
          letterSpacing: "-0.07em",
          color: "var(--faint)",
          pointerEvents: "none",
          userSelect: "none",
          transition: "color 0.55s var(--ease-out)",
        }}
      >
        {project.number}
      </span>

      <div
        className="project-card__body"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="project-card__meta">
          <span className="project-card__number">{project.number}</span>
          <span>{project.category}</span>
          <span aria-hidden="true">·</span>
          <span>{project.year}</span>
          <span aria-hidden="true">·</span>
          <span>{project.status}</span>
        </div>

        <h2 className="project-card__title">{project.title}</h2>
        <p className="project-card__subtitle">{project.subtitle}</p>
        <p className="project-card__story">{project.story}</p>

        <ul className="project-card__signals">
          {project.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>

        <ul className="tag-list">
          {project.stack.map((tech) => (
            <li key={tech} className="tag">{tech}</li>
          ))}
        </ul>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginTop: "0.75rem",
          }}
        >
          <ButtonLink href="https://opprine.vercel.app/" variant="outline">Open Link</ButtonLink>
        </div>
      </div>

      <Preview />
    </article>
  );
}

export default function ProjectsPage() {
  const { isThemeAnimating, theme, toggleTheme } = useThemeMode();

  useGSAPMotion();

  return (
    <>
      <div className={`portfolio-shell ${isThemeAnimating ? "theme-shifting" : ""}`} data-theme={theme}>
        <Cursor />
        <Navbar links={NAV_LINKS} onThemeToggle={toggleTheme} theme={theme} />
        <div className="intro-wipe">
          <span>Projects</span>
        </div>

        <div className="scroll-progress">
          <div className="scroll-progress__bar" />
        </div>

        <header className="section section--no-border" data-theme={theme}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <div className="section-header">
              <p className="section-kicker" data-index="01">
                Selected work
              </p>

              <h1 className="section-title">Projects.</h1>

              <p className="section-copy">
                Three systems shaped around a product spine each framed as a
                business problem, a technical architecture, and a crafted user
                experience. That is the difference between showing screens and
                showing judgment.
              </p>
            </div>

            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--quiet)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
              }}
            >
              {String(PROJECTS.length).padStart(2, "0")} projects
            </p>
          </div>
        </header>

        <section
          className="lg:px-16 sm:px-12 px-6"
          id="projects"
        >
          <div>
            {PROJECTS.map((project, i) => (
              <ProjectExhibit
                key={project.title}
                project={project}
                index={i}
              />
            ))}
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact__inner">
            {/* Left: invitation copy */}
            <div>
              <p className="section-kicker">
                What's next
              </p>

              <h2 className="section-title">Have a project in mind?</h2>

              <p className="section-copy">
                Let's talk about what you're building and whether I'm the right
                person to build it with you.
              </p>
            </div>

            {/* Right: action buttons */}
            <div className="contact__actions" data-reveal style={{ "--delay": "120ms" }}>
              <ButtonLink href="/contact" variant="outline">
                Get in touch
              </ButtonLink>
              <ButtonLink href="/" variant="outline">
                Back to home
              </ButtonLink>
            </div>

          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}