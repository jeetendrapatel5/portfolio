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

function PortalPreview() {
  const ROWS = [
    { label: "Design brief", pct: "82%", status: "✓" },
    { label: "Prototype v2", pct: "61%", status: "→" },
    { label: "Final assets", pct: "38%", status: "○" },
  ];

  return (
    <div className="project-preview">
      <div className="preview-window">
        {/* Title bar: the three dots are purely decorative (CSS draws them as circles) */}
        <div className="preview-window__bar">
          <div className="preview-window__dots">
            <span /><span /><span />
          </div>
          <span>freeport / portal</span>
        </div>

        {/* Milestone delivery rows — float-row animation staggers them */}
        <div className="preview-flow">
          {ROWS.map(({ label, pct, status }) => (
            <div key={label} className="preview-row" style={{ "--meter": pct }}>
              <span>{label}</span>
              <div className="preview-meter" />
              <span className="preview-status">{status}</span>
            </div>
          ))}
        </div>

        {/* Status chips at the bottom */}
        <div className="preview-footer">
          {["Milestone", "Approved", "Invoice"].map((chip) => (
            <span key={chip} className="preview-chip">{chip}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapPreview() {
  return (
    <div className="project-preview">
      <div className="preview-window">
        <div className="preview-window__bar">
          <div className="preview-window__dots">
            <span /><span /><span />
          </div>
          <span>system / architecture</span>
        </div>

        <div className="preview-map">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="preview-node">
              <span /><span />
            </div>
          ))}
        </div>

        <div className="preview-footer">
          {["Cache", "Queue", "API"].map((chip) => (
            <span key={chip} className="preview-chip">{chip}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TerminalPreview() {
  return (
    <div className="project-preview">
      <div className="preview-window">
        <div className="preview-window__bar">
          <div className="preview-window__dots">
            <span /><span /><span />
          </div>
          <span>invoiced / cli</span>
        </div>

        <div className="preview-terminal">
          <span>$ create-invoice --client acme --amount 4200</span>
          <span>→ stripe: payment_intent created</span>
          <span>✓ invoice #INV-0042 sent via email</span>
        </div>

        <div className="preview-footer">
          {["Draft", "Sent", "Paid"].map((chip) => (
            <span key={chip} className="preview-chip">{chip}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

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
          top: "-0.2em",
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
          <span aria-hidden="true">·</span>
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
          <ButtonLink href="/" variant="outline">Open Link</ButtonLink>
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

        <header className="section h-screen section--no-border" data-theme={theme}>
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
              <ButtonLink href="mailto:hello@jeetendra.dev" variant="outline">
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