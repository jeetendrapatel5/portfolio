"use client";

/**
 * app/projects/page.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Standalone route at /projects. Gallery-style exhibit for all work.
 *
 * ARCHITECTURE NOTES (read before editing):
 *
 * 1. "use client" is required here because we call useGSAPMotion() directly.
 *    If your root layout.jsx already calls useGSAPMotion, remove the hook call
 *    below AND the "use client" directive — the page becomes a server component
 *    and the layout's single GSAP context handles all animation targets.
 *
 * 2. No new CSS is needed. Every class used here already exists in globals.css.
 *    Inline styles are only used for values the shared system doesn't cover:
 *    the oversized background number, and a few layout micro-adjustments.
 *
 * 3. For SEO, add a companion layout file at app/projects/layout.jsx:
 *      export const metadata = {
 *        title: "Projects · Jeetendra Patel",
 *        description: "Three full-stack systems built around a product spine."
 *      };
 *
 * 4. IMPORT PATH: adjust "@/hooks/useGSAPMotion" to wherever your hook lives.
 *    The pattern (dynamic import of GSAP inside useEffect) is unchanged.
 *
 * DATA FLOW:
 *   PROJECTS (array) ──► map ──► ProjectExhibit (article)
 *                                  ├── background number span (aria-hidden)
 *                                  ├── .project-card__body (text column)
 *                                  └── Preview component (visual column)
 *
 * The CSS alternates the two-column layout on even cards automatically:
 *   .project-card          → body left, preview right
 *   .project-card:nth-child(even) → column widths swap (CSS, no JS needed)
 */

import Link from "next/link";
import useGSAPMotion from "@/hooks/useGSAPMotion";
import useThemeMode from "@/hooks/useThemeMode";
import { PROJECTS } from "@/data/portfolioData";
import Cursor from "@/components/ui/Cursor.jsx";
import Navbar from "@/components/Navbar";
import { NAV_LINKS } from "@/data/portfolioData";
import ButtonLink from '@/components/ui/ButtonLink.jsx'
// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: PREVIEW WIDGETS
//
// These reproduce the animated preview panels from the homepage ProjectCard.
// The DOM structure MUST match globals.css exactly — the class names are
// what the CSS selectors and GSAP targets are written against.
//
// Full tree:
//   .project-preview              outer frame: 3D tilt + parallax + hover sheen
//     .preview-window             frosted-glass inner panel
//       .preview-window__bar      title bar: three dots + route label
//       [content area]            one of: .preview-flow / .preview-map / .preview-terminal
//       .preview-footer           three .preview-chip tags
//
// How GSAP touches these:
//   • yPercent parallax — gsap.to(".project-preview", { yPercent: -7 })
//   • 3D tilt          — pointermove sets --tilt-x / --tilt-y CSS vars
//   • hover sheen      — CSS ::after transition, no GSAP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PortalPreview — used for "Freeport" (preview: "portal")
 *
 * Shows three delivery milestone rows. Each row has:
 *   .preview-row       two-col grid: label | meter | status icon
 *   .preview-meter     animated progress bar via --meter CSS custom property
 *   .preview-status    right-aligned icon character
 *
 * The --meter value is read by .preview-meter::before { width: var(--meter) }
 * so each row can have a different fill percentage.
 */
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

/**
 * MapPreview — used for "Architecture Lab" (preview: "map")
 *
 * 3×2 grid of .preview-node boxes. Each node breathes (node-breathe
 * keyframe) with staggered animation-delay via CSS :nth-child selectors.
 * The two child <span> elements inside each node are the skeletal bars.
 */
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

        {/*
         * 6 nodes in a 3×2 grid (.preview-map uses grid-template-columns: repeat(3,1fr)).
         * Array.from({length: 6}) creates [undefined × 6]; we only need the index i
         * for the React key — the actual content is two skeletal bars.
         */}
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

/**
 * TerminalPreview — used for "Invoiced" (preview: "terminal")
 *
 * Three <span> elements inside .preview-terminal each get the
 * terminal-type keyframe (overflow: hidden + width: 0→100%) to simulate
 * a typewriter effect. CSS :nth-child adds animation-delay stagger.
 */
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

/**
 * Registry maps each project's preview string to its component.
 * New project types can be added here without touching ProjectExhibit.
 */
const PREVIEW_REGISTRY = {
  portal: PortalPreview,
  map: MapPreview,
  terminal: TerminalPreview,
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: PROJECT EXHIBIT
//
// One exhibit renders one project. It composes:
//
//   <article .project-card>           ← two-column grid; handles hover state
//     <span [background number]>      ← gallery catalog index (aria-hidden)
//     <div .project-card__body>       ← text column: meta → title → story → CTA
//     <PreviewComponent />            ← animated visual column
//
// CSS rules that activate automatically on this structure:
//   .project-card:hover .project-card__title  → translateX(0.42rem)
//   .project-card:hover .project-preview      → border brightens + sheen passes
//   .project-card:hover .tag                  → border and text brighten
//   .project-card:nth-child(even)             → column widths swap (visual rhythm)
//
// [data-reveal] with --delay:
//   GSAP's step 4 in useGSAPMotion reads data-reveal elements and animates each
//   from { opacity: 0, y: 36, filter: blur(6px), clipPath: inset(...) } → visible.
//   The --delay CSS custom property is read by GSAP as delayMs/1000 seconds,
//   so each exhibit enters slightly after the previous one (stagger without JS loop).
// ─────────────────────────────────────────────────────────────────────────────

function ProjectExhibit({ project, index }) {
  // Resolve the preview component; fall back to PortalPreview if type is unknown
  const Preview = PREVIEW_REGISTRY[project.preview] ?? PortalPreview;

  return (
    <article
      className="project-card"
      data-reveal
      style={{ "--delay": `${index * 90}ms` }}
    >
      {/*
       * GALLERY INDEX NUMBER
       * ──────────────────────────────────────────────────────────────────────
       * This span sits absolute behind the card, showing the project number
       * ("01", "02", "03") at display scale. It is the single detail that
       * makes the layout read like a museum catalog entry rather than a list.
       *
       * Why aria-hidden? The number is purely decorative — it duplicates
       * information already in .project-card__meta, so screen readers
       * should skip it.
       *
       * Why clamp? The font size must scale with the viewport:
       *   clamp(5.5rem, 13vw, 11rem)
       *   └── minimum 5.5rem on narrow phones
       *       grows proportionally at 13vw through mid sizes
       *       caps at 11rem on large screens
       *
       * Why --faint color? At rest it's barely visible (rgba fg at 16%).
       * On dark backgrounds it creates a subtle texture; in light mode
       * it's equally understated. This is intentional — it shouldn't
       * compete with the title.
       */}
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

      {/* ── Text body ──────────────────────────────────────────────────── */}
      {/*
       * position: relative + zIndex: 1 keeps the body content layered
       * above the absolute background number. Without this, the background
       * number (z:0) would compete for click targets.
       */}
      <div
        className="project-card__body"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/*
         * Catalog metadata row
         * Shows: number · category · year · status
         * .project-card__number uses --faint (very subtle)
         * The rest use --quiet (slightly more visible)
         * The · separators use aria-hidden so screen readers skip them
         */}
        <div className="project-card__meta">
          <span className="project-card__number">{project.number}</span>
          <span aria-hidden="true">·</span>
          <span>{project.category}</span>
          <span aria-hidden="true">·</span>
          <span>{project.year}</span>
          <span aria-hidden="true">·</span>
          <span>{project.status}</span>
        </div>

        {/*
         * Project title
         * Uses var(--title-size) — a fluid font size defined in globals.css:
         *   mobile:  2.45rem
         *   tablet:  3.25rem
         *   desktop: 4rem
         *
         * On hover, CSS adds translateX(0.42rem) — a subtle rightward drift
         * that signals interactivity without being loud.
         *
         * GSAP's character-split animation targets this via .section-title…
         * wait, actually .project-card__title is NOT .section-title, so GSAP
         * won't split it into characters. That's correct — section titles get
         * the character animation, project card titles get the CSS translateX.
         */}
        <h2 className="project-card__title">{project.title}</h2>

        {/*
         * One-liner — the product's value in a single sentence.
         * Uses --muted-strong (more visible than --muted) because this is
         * the first thing a visitor should read after the title.
         */}
        <p className="project-card__subtitle">{project.subtitle}</p>

        {/*
         * Narrative — what shaped the architectural and design decisions.
         * Uses --muted (less emphasis) and font-weight: 300 (light) so it
         * reads as context rather than a headline.
         */}
        <p className="project-card__story">{project.story}</p>

        {/*
         * Signal list — three specific, concrete observations.
         * The CSS uses a custom bullet: a small circle with border via ::before,
         * grid-template-columns: 1.35rem 1fr, so the bullet and text align cleanly.
         * list-style: none removes the default browser bullet.
         */}
        <ul className="project-card__signals">
          {project.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>

        {/*
         * Tech stack pills
         * .tag-list is display:flex flex-wrap gap:0.48rem list-style:none
         * .tag is the pill: border-radius:999px, border:1px solid --line
         * On card hover, CSS brightens the tags (border-color + color + background)
         */}
        <ul className="tag-list">
          {project.stack.map((tech) => (
            <li key={tech} className="tag">{tech}</li>
          ))}
        </ul>

        {/*
         * Call to action
         * Points to #contact on THIS page (the CTA section below).
         * .button uses the fill-sweep hover: ::before scaleX(0→1) on hover.
         * .button:hover { color: var(--black) } so text inverts when filled.
         */}
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

      {/* ── Preview visual ──────────────────────────────────────────────── */}
      {/*
       * Preview sits in the second grid column.
       * For even cards: CSS sets .project-card:nth-child(even) .project-preview
       * { order: 2 }, but column widths swap, creating the visual alternation.
       * GSAP attaches yPercent parallax and pointer 3D tilt to .project-preview
       * automatically because it targets the class name globally.
       */}
      <Preview />
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const { isThemeAnimating, theme, toggleTheme } = useThemeMode();
  /*
   * useGSAPMotion boots the entire animation system for this route:
   *
   *   1. CSS var tracking (--scroll-progress, --hero-shift, --pointer-x/y)
   *   2. Smooth anchor navigation for all a[href^="#"] links
   *   3. Hero entrance timeline — targets .hero__rule, .line-mask > span, etc.
   *      (these class names don't exist on this page, so those tweens are no-ops)
   *   4. [data-reveal] scroll reveals — DOES fire on this page's articles
   *   5. Stat counters — no .stat__value on this page, skipped gracefully
   *   6. Project preview parallax + 3D tilt — fires on all .project-preview
   *   7. Stack rows (.stack-row) — not on this page, skipped
   *   8. Method items (.method-item) — not on this page, skipped
   *   9. Section kickers (.section-kicker) — fires on header and CTA
   *  10. Footer fade (.footer) — fires on the footer below
   *
   * Summary: GSAP gracefully skips selectors it can't find.
   * Only items 1, 2, 4, 6, 9, 10 actively animate on this page.
   */
  useGSAPMotion();

  return (
    <>
      {/*
       * ── INTRO WIPE ──────────────────────────────────────────────────────
       * Full-viewport white overlay. CSS @keyframes intro-wipe animates
       * scaleY(1 → 0) with transform-origin: top, so it peels upward.
       * "forwards" keeps it at scaleY(0) after the animation finishes.
       *
       * Purpose: covers any layout flash that occurs while GSAP does its
       * async dynamic import of the library. By the time the wipe exits
       * (~1.5s), GSAP has already processed all class names.
       *
       * The text "Projects" is visible briefly as the wipe plays — it
       * announces the page to the visitor.
       */}
      <div className={`portfolio-shell ${isThemeAnimating ? "theme-shifting" : ""}`} data-theme={theme}>
        <Cursor />
        <Navbar links={NAV_LINKS} onThemeToggle={toggleTheme} theme={theme} />
        <div className="intro-wipe">
          <span>Projects</span>
        </div>

        {/*
       * ── SCROLL PROGRESS BAR ─────────────────────────────────────────────
       * 2px bar at the very top of the viewport (position: fixed via CSS).
       * useGSAPMotion drives --scroll-progress via requestAnimationFrame:
       *   const progress = scrollY / (scrollHeight - innerHeight)
       *   root.style.setProperty("--scroll-progress", progress)
       * The CSS then reads it: transform: scaleX(var(--scroll-progress))
       */}
        <div className="scroll-progress">
          <div className="scroll-progress__bar" />
        </div>

        {/*
       * ── PAGE HEADER ─────────────────────────────────────────────────────
       *
       * Uses .section for padding (var(--section-pad) + var(--site-pad)).
       * The extra paddingTop adds room for the fixed nav above.
       * .section--no-border removes the border-top from the base .section rule.
       *
       * Layout: flex row (header text | project count) that wraps on mobile.
       * align-items: flex-end aligns the count to the bottom of the h1.
       */}
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
            {/* Left column: section identifier + headline + copy */}
            <div className="section-header">
              {/*
             * .section-kicker
             * CSS: .section-kicker::before { content: attr(data-index) }
             * So data-index="01" renders as: "01    Selected work"
             * The faint number prefix is a design-system convention
             * used across all sections.
             *
             * GSAP step 9 targets .section-kicker and slides it in from x:-16.
             */}
              <p className="section-kicker" data-index="01">
                Selected work
              </p>

              {/*
             * .section-title — GSAP step 3 targets this.
             * GSAP splits the text into .split-word > .split-char spans,
             * then animates each char: yPercent 100→0, rotateX -45→0.
             * The .split-word has overflow: hidden which clips the yPercent
             * travel so chars appear to rise from below the baseline.
             * perspective: 600px on .section-title enables the rotateX.
             *
             * Using h1 here because this is the page's primary heading.
             */}
              <h1 className="section-title">Projects.</h1>

              {/*
             * .section-copy — light, airy body copy.
             * font-weight: 300, line-height: 1.8, color: --muted
             * max-width: 34rem prevents it from stretching too wide.
             */}
              <p className="section-copy">
                Three systems shaped around a product spine — each framed as a
                business problem, a technical architecture, and a crafted user
                experience. That is the difference between showing screens and
                showing judgment.
              </p>
            </div>

            {/*
           * Project count — top-right, museum catalog style.
           * String().padStart(2,"0") formats: 3 → "03". Gives it a
           * zero-padded, archival feel that matches the mono font.
           * whiteSpace: nowrap prevents wrapping on narrow viewports.
           */}
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

        {/*
       * ── PROJECT EXHIBITS ────────────────────────────────────────────────
       *
       * .projects { padding-bottom: 0 } — defined in globals.css,
       * removes the bottom padding so the contact section sits flush.
       *
       * .project-list { display: grid; margin-top: 3rem }
       * Single column on mobile; the .project-card handles two-column layout
       * internally at 60rem+ breakpoint.
       *
       * id="projects" enables smooth scroll from nav links (#projects).
       */}
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

        {/*
       * ── CONTACT CTA ─────────────────────────────────────────────────────
       *
       * .contact is an INVERTED section: background: var(--white), color: var(--black).
       * In dark mode, --white is #f7f7f7 (near-white) — high contrast against the
       * dark page. In light mode, --white is #050505 (near-black) — also high contrast.
       *
       * globals.css provides child-class overrides for this inversion:
       *   .contact .section-kicker  → rgba(bg, 0.62)
       *   .contact .section-title   → var(--black)  [which is the page bg color]
       *   .contact .section-copy    → rgba(bg, 0.62)
       *   .contact .button          → border-color adjusted, fill inverted
       *   .contact .button--solid   → fill sweeps to white
       *
       * .contact__inner at 60rem+ becomes a 2-column grid: [1fr auto]
       * so the text sits left and the buttons stack right.
       *
       * id="contact" so the "Discuss this project" buttons above scroll here.
       */}
        <section className="contact" id="contact">
          <div className="contact__inner">
            {/* Left: invitation copy */}
            <div>
              {/*
             * data-index="→" renders the arrow as the faint kicker prefix.
             * This breaks the numeric pattern (01, 02...) intentionally —
             * the arrow signals "forward" and "next step."
             */}
              <p className="section-kicker" data-index="→">
                What's next
              </p>

              {/*
             * h2 (not h1) — this is a secondary heading on the page.
             * Uses h2 with .section-title class for visual scale without
             * wrong document outline semantics.
             */}
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

        {/*
       * ── FOOTER ──────────────────────────────────────────────────────────
       *
       * .footer: flex, justify-content: space-between, font-mono, font-size: 0.74rem
       * color: --quiet, text-transform: uppercase, border-top: 1px solid --line
       *
       * GSAP step 12 (footer fade) targets this element:
       *   gsap.from(".footer", { opacity: 0, y: 18, ... })
       * It fires when the footer enters the viewport, so it's always fresh.
       */}
        <footer className="footer">
          <span>© {new Date().getFullYear()} Jeetendra Patel</span>
          <span>Full-stack developer · Goa, India</span>
          <Link href="/" style={{ color: "inherit" }}>
            jeetendra.dev
          </Link>
        </footer>
      </div>
    </>
  );
}