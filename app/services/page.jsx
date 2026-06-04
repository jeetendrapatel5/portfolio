"use client";

import Link from "next/link";
import useGSAPMotion from "@/hooks/useGSAPMotion";
import useThemeMode from "@/hooks/useThemeMode";
import { SERVICES, METHOD, NAV_LINKS } from "@/data/portfolioData";
import ButtonLink from "@/components/ui/ButtonLink";
import Cursor from "@/components/ui/Cursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";

function ServiceRow({ service, index }) {
  return (
    <article
      className="project-card"
      data-reveal
      style={{
        "--delay": `${index * 85}ms`,
        gridTemplateColumns: "1fr",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-0.15em",
          right: 0,
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "clamp(6rem, 14vw, 12rem)",
          lineHeight: 1,
          letterSpacing: "-0.07em",
          color: "var(--faint)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
          transition: "color 0.55s var(--ease-out)",
        }}
      >
        {service.number}
      </span>

      <div style={{ position: "relative", zIndex: 1, display: "grid", gap: "1.5rem" }}>
          
          <div style={{ display: "grid", gap: "0.75rem" }}>

          <div className="project-card__meta">
            <span className="project-card__number">{service.number}</span>
            <span aria-hidden="true">·</span>
            <span>{service.category}</span>
            <span
              style={{
                marginLeft: "auto",
                padding: "0.2rem 0.72rem",
                border: "1px solid var(--line)",
                borderRadius: "999px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "var(--quiet)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {service.rate}
            </span>
          </div>

          <h2 className="project-card__title">{service.title}</h2>

          {/*
           * One-liner tagline
           * .project-card__subtitle: muted-strong color, 1.03rem, line-height 1.7
           */}
          <p className="project-card__subtitle">{service.tagline}</p>
        </div>

        {/* ── BODY: DESCRIPTION LEFT + DELIVERABLES RIGHT ────────────────── */}
        {/*
         * Two-column grid on desktop, single column on mobile.
         *
         * CSS-in-JS media queries aren't available inline, so we use a
         * CSS custom property trick: the grid gets a minmax column that
         * collapses to 1fr when the container is narrow.
         *
         * gridTemplateColumns: "minmax(0,1fr) minmax(0,0.72fr)"
         *   Left column (description + tags): grows to fill available space
         *   Right column (deliverables): slightly narrower at 0.72fr
         *
         * On mobile, both columns collapse to single-row because the
         * container width doesn't satisfy the minmax min. We add a
         * className "services-body" which we target in a <style> tag below.
         */}
        <div className="services-body">

          {/* Left: description + tech tags */}
          <div style={{ display: "grid", gap: "1.25rem", alignContent: "start" }}>
            <p className="project-card__story">{service.description}</p>

            {/*
             * Tech tags
             * .tag-list: flex, flex-wrap, gap:0.48rem, list-style:none
             * .tag: pill with border, mono, quiet color
             * On .project-card:hover: .tag gets brighter border + bg
             */}
            <ul className="tag-list">
              {service.tags.map((tech) => (
                <li key={tech} className="tag">{tech}</li>
              ))}
            </ul>
          </div>

          {/* Right: deliverables list */}
          {/*
           * .project-card__signals: grid, gap:0.7rem, list-style:none
           * Each li has a CSS ::before circle bullet and
           * grid-template-columns: 1.35rem 1fr for clean bullet alignment.
           */}
          <ul className="project-card__signals" style={{ alignContent: "start" }}>
            {service.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  /*
   * useGSAPMotion boots the shared animation system.
   *
   * Selectors that WILL fire on this page:
   *   [data-reveal]     → each ServiceRow article + process header
   *   .section-kicker   → slides in from x:-16
   *   .section-title    → character split cascade
   *   .method-item      → spring-in scale animation (process section)
   *   .footer           → fade up on enter
   *   --scroll-progress → scroll bar tracks page position
   *   --pointer-x/y     → available if any element uses the spotlight
   *
   * Selectors that will NOT fire (safely skipped by GSAP):
   *   .project-preview, .hero__rule, .stat__value, .stack-row
   */
  const { isThemeAnimating, theme, toggleTheme } = useThemeMode();
  useGSAPMotion();

  return (
    <>
      {/*
       * ── SCOPED RESPONSIVE STYLE ────────────────────────────────────────────
       * This <style> block handles the .services-body two-column breakpoint.
       *
       * Why not globals.css?
       *   This rule is scoped to one page. Putting it here keeps globals.css
       *   clean and makes it obvious what layout belongs to what page.
       *
       * Why not Tailwind?
       *   We're already in a mixed system (CSS vars + globals.css + Tailwind).
       *   A single <style> tag for one layout rule is the least-invasive approach.
       *
       * How it works:
       *   .services-body renders as single column by default.
       *   At 60rem (960px), it becomes a two-column grid:
       *     left column: description + tags  (minmax(0, 1fr))
       *     right column: deliverables list  (minmax(0, 0.72fr))
       */}
      <Cursor />
      <style>{`
        .services-body {
          display: grid;
          gap: 1.5rem;
        }
        @media (min-width: 60rem) {
          .services-body {
            grid-template-columns: minmax(0, 1fr) minmax(0, 0.72fr);
            gap: 3rem;
            align-items: start;
          }
        }
      `}</style>

      {/*
       * ── INTRO WIPE ────────────────────────────────────────────────────────
       * CSS @keyframes intro-wipe: scaleY(1→0), transform-origin: top.
       * Peels upward, revealing the page beneath.
       * "Services" label is briefly visible during the peel — announces the page.
       */}
      <div className="intro-wipe">
        <span>Services</span>
      </div>
      <Navbar links={NAV_LINKS} onThemeToggle={toggleTheme} theme={theme} />

      {/*
       * ── SCROLL PROGRESS BAR ───────────────────────────────────────────────
       * position:fixed, 2px tall, z-index:300.
       * useGSAPMotion writes --scroll-progress (0→1) via rAF on every scroll.
       * CSS reads: transform: scaleX(var(--scroll-progress)), origin: left.
       */}
      <div className="scroll-progress">
        <div className="scroll-progress__bar" />
      </div>

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      {/*
       * Extra paddingTop = section-pad + 5rem nav clearance.
       * calc() reads the CSS variable at render time — works in both modes.
       * .section--no-border removes the border-top from the base .section rule.
       */}
    <header
        className="section section--no-border portfolio-shell"
        style={{ paddingTop: "calc(var(--section-pad))" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          {/* Left: kicker + title + copy */}
          <div className="section-header">
            {/*
             * .section-kicker::before { content: attr(data-index) }
             * Renders as: "02    What I offer"
             * GSAP slides this in from x:-16 when it enters the viewport.
             */}
            <p className="section-kicker" data-index="02">
              What I offer
            </p>

            {/*
             * .section-title triggers GSAP character split:
             * Each character rises from yPercent:100 with rotateX:-45→0.
             * .split-word (overflow:hidden) clips the travel so chars appear
             * to emerge from below the baseline.
             */}
            <h1 className="section-title">Services.</h1>

            <p className="section-copy">
              Focused engagements with clear scope and clean deliverables.
              Whether you need a complete product or a specific layer of the
              stack I bring the same precision to every part of the system.
            </p>
          </div>

          {/*
           * Service count — catalog-style badge, top-right.
           * String().padStart(2,"0") → "05". Zero-padded to match the row numbers.
           * whiteSpace:nowrap prevents wrapping on narrow viewports.
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
            {String(SERVICES.length).padStart(2, "0")} services
          </p>
        </div>

        {/*
         * Animated rule — draws left→right as the intro wipe exits.
         * @keyframes draw-line: scaleX(0→1), transformOrigin: left.
         * delay:1.8s ensures the wipe (~1.5s) has fully exited first.
         */}
        <div
          aria-hidden="true"
          style={{
            height: "1px",
            marginTop: "3rem",
            background: "var(--line)",
            transformOrigin: "left",
            transform: "scaleX(0)",
            animation: "draw-line 1.4s var(--ease-in-out) 1.8s forwards",
          }}
        />
      </header>

      {/* ── SERVICES LIST ────────────────────────────────────────────────── */}
      {/*
       * Bare section — no .projects class (that class removes padding-bottom
       * and is semantically tied to the projects section).
       * margin-top:3rem creates breathing room between header and first row.
       * The SERVICES array drives all content — add/remove in portfolioData.js.
       */}
      <section className="lg:px-16 sm:px-12 px-6">
        <div style={{ display: "grid", marginTop: "1rem" }}>
          {SERVICES.map((service, i) => (
            <ServiceRow key={service.number} service={service} index={i} />
          ))}
        </div>
      </section>

      {/* ── PROCESS SECTION ──────────────────────────────────────────────── */}
      {/*
       * "How I work" — reuses the METHOD array and .method-item/.method-list
       * pattern from the homepage. Zero new CSS needed.
       *
       * .method-list at 60rem+: grid-template-columns: repeat(4, 1fr)
       * Each .method-item: min-height:12rem, padding:1.25rem, background:black
       * On hover: translateY(-0.35rem) + background:black-soft
       *
       * GSAP step 9 targets .method-item:
       *   fromTo { opacity:0, y:28, scale:0.97 } → { opacity:1, y:0, scale:1 }
       *   ease: "back.out(1.3)" — slight overshoot, settles with spring feel
       *   delay: i * 0.065 — stagger per item
       */}
      <section className="section">
        {/* Section header — [data-reveal] for the block, GSAP reveals on scroll */}
        <div data-reveal>
          <p className="section-kicker" >
            How I work
          </p>
          <h2 className="section-title">The process.</h2>
          <p className="section-copy">
            Every engagement follows the same four-phase loop. It keeps
            decisions visible, reversals rare, and the final product clean.
          </p>
        </div>

        {/*
         * .method-list: grid, gap:5px, border-radius:8px, overflow:hidden
         * At 60rem+: 4 equal columns
         * Each .method-item is a card with mono index, serif title, light body
         */}
        <div className="method-list">
          {METHOD.map((step, i) => (
            <div key={step.title} className="method-item">
              {/*
               * .method-item__index: mono, 0.74rem, quiet color
               * Renders as "01", "02", "03", "04"
               */}
              <span className="method-item__index">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* serif, 2rem, weight 600 */}
              <h3>{step.title}</h3>
              {/* muted color, weight 300, line-height 1.75 */}
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ENGAGEMENT DETAILS STRIP ─────────────────────────────────────── */}
      {/*
       * Quick-scan row of practical information for a potential client:
       * what types of work, where, what timezone, current status.
       *
       * Reuses .proof-grid + .proof-item — the same pattern the about section
       * uses for proof-of-work cards. Three columns on tablet+.
       *
       * .proof-item: min-height:8rem, padding:1.25rem, background:black
       * .proof-item:hover: background:black-soft
       * .proof-item__label: mono, 0.72rem, uppercase, quiet color
       * .proof-item__text: muted-strong, line-height:1.65
       *
       * Each item is [data-reveal] with staggered --delay so they cascade in.
       */}
      <section className="section">
        <div data-reveal>
          <p className="section-kicker">
            Working with me
          </p>
          <h2 className="section-title">The details.</h2>
        </div>

        <div className="proof-grid">
          {[
            {
              label: "Engagement types",
              text: "Fixed-scope projects, hourly retainers, and ongoing technical partnerships. Async-first with structured weekly updates.",
            },
            {
              label: "Location & timezone",
              text: "Based in Goa, India (IST, UTC+5:30). Available for async collaboration globally and live calls during business hours.",
            },
            {
              label: "Current availability",
              text: "Open to new projects. Typical lead time is one to two weeks. Limited spots — priority given to product builds.",
            },
            {
              label: "How to start",
              text: "Send a short brief: what you're building, the problem it solves, and your rough timeline. I'll respond within 24 hours.",
            },
            {
              label: "What I don't do",
              text: "Maintenance-only contracts, WordPress, or work without a defined scope. I build new things, not fix poorly built ones.",
            },
            {
              label: "Communication",
              text: "English. Loom for async walkthroughs, Google Meet or Zoom for live calls, email or Linear for project tracking.",
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className="proof-item"
              data-reveal
              style={{ "--delay": `${i * 60}ms` }}
            >
              <span className="proof-item__label">{item.label}</span>
              <p className="proof-item__text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────────────────── */}
      {/*
       * .contact: inverted section — background:var(--white), color:var(--black)
       *
       * In dark mode:  --white = #f7f7f7 (light bg),  --black = #050505 (dark text)
       * In light mode: --white = #050505 (dark bg),   --black = #f4f3ee (light text)
       *
       * The section always looks "opposite" to the rest of the page.
       * All child class overrides (.contact .button, .contact .section-title, etc.)
       * are already defined in globals.css — zero extra CSS needed.
       *
       * .contact__inner at 60rem+: grid-template-columns: 1fr auto
       * (text left, buttons right)
       */}
      <section className="contact" id="contact">
        <div className="contact__inner">
          <div>
            <p className="section-kicker">
              Ready to build
            </p>
            <h2 className="section-title">Let's talk scope.</h2>
            <p className="section-copy">
              Send a brief description of what you need the problem, the
              product, and the timeline. I'll tell you honestly whether I'm
              the right fit.
            </p>
          </div>

          {/*
           * ButtonLink with variant="solid" → adds .button--solid class.
           * In .contact: .contact .button--solid { color: var(--white) }
           * On hover fill sweeps → text becomes var(--black).
           * ButtonLink with variant="ghost" → .button--ghost, muted border.
           */}
          <div className="contact__actions" data-reveal style={{ "--delay": "120ms" }}>
            <ButtonLink href="mailto:hello@jeetendra.dev" variant="ghost">
              Send a brief
            </ButtonLink>
            <ButtonLink href="/projects" variant="ghost">
              View projects
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      {/*
       * .footer: flex, justify-content:space-between, mono, 0.74rem, uppercase
       * GSAP step 12 fades it up when it enters the viewport.
       * new Date().getFullYear() auto-updates the year on build.
       */}
      <Footer />
    </>
  );
}