"use client";

/**
 * app/technologies/page.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Standalone route at /technologies.
 *
 * DATA SOURCE
 *   All content comes from portfolioData.js → TECHNOLOGIES array.
 *   To add/remove a tech or change any detail: only touch portfolioData.js.
 *   This file is a pure rendering layer with zero hardcoded content.
 *
 * PAGE SECTIONS (in order)
 *   1. intro-wipe        — entrance overlay (CSS animation)
 *   2. scroll-progress   — thin fixed bar driven by --scroll-progress CSS var
 *   3. Page header       — kicker + "The stack." + copy + live stat counts
 *   4. Tech groups       — one .section per group, each with a section-grid:
 *                            left  → group kicker + headline
 *                            right → tech rows (.tech-row × items)
 *   5. Contact CTA       — inverted .contact section
 *   6. Footer
 *
 * RESPONSIVE STRATEGY (tech rows)
 *   Mobile  (< 48rem)  : name | level badge
 *   Tablet  (≥ 48rem)  : name | level badge | years
 *   Desktop (≥ 64rem)  : name | note | level badge | years
 *
 *   The note column turns a skills list into a skills STATEMENT.
 *   Each entry says not just "I know X" but "here is how I use X."
 *
 * LEVEL BADGE VISUAL SYSTEM
 *   Core       → bright border + muted-strong text  (clearly visible)
 *   Proficient → standard --line border + quiet text (normal)
 *   Familiar   → faint border + quiet text           (de-emphasised)
 *   All values use CSS vars → automatically correct in dark and light mode.
 *
 * ANIMATIONS (from useGSAPMotion)
 *   [data-reveal]     → scroll reveal: opacity + y + blur + clipPath
 *   .section-kicker   → slides in from x:-16
 *   .section-title    → character split cascade
 *   .footer           → fade up on enter
 */

import Link from "next/link";
import useGSAPMotion from "@/hooks/useGSAPMotion";
import useThemeMode from "@/hooks/useThemeMode";
import { TECHNOLOGIES, NAV_LINKS } from "@/data/portfolioData";
import ButtonLink from "@/components/ui/ButtonLink";
import Cursor from "@/components/ui/Cursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL BADGE STYLE HELPER
//
// Returns an inline style object for the level badge <span>.
// All colour values use CSS custom properties so they respond to the
// active [data-theme] attribute — no hardcoded hex anywhere.
//
// "Core"       → rgba(--fg-rgb, 0.42) border — noticeably brighter
// "Proficient" → var(--line) border          — standard system line
// "Familiar"   → rgba(--fg-rgb, 0.14) border — almost invisible, muted
// ─────────────────────────────────────────────────────────────────────────────
function getLevelBadgeStyle(level) {
    const BASE = {
        padding: "0.2rem 0.62rem",
        borderRadius: "999px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.63rem",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
        lineHeight: 1,
    };

    if (level === "Core") {
        return {
            ...BASE,
            border: "1px solid rgba(var(--fg-rgb), 0.42)",
            color: "var(--muted-strong)",
        };
    }
    if (level === "Proficient") {
        return {
            ...BASE,
            border: "1px solid var(--line)",
            color: "var(--quiet)",
        };
    }
    // Familiar
    return {
        ...BASE,
        border: "1px solid rgba(var(--fg-rgb), 0.15)",
        color: "var(--quiet)",
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// TECH ROW
//
// One row per technology item. Responsive column layout handled via the
// scoped <style> tag in the page root (see .tech-row definitions below).
//
// Column slots:
//   .tech-row__name   — always visible (mobile and up)
//   .tech-row__note   — only visible at ≥64rem (desktop)
//   level badge       — always visible (inline styled)
//   .tech-row__years  — only visible at ≥48rem (tablet and up)
//
// [data-reveal] + --delay
//   Each row reveals with a staggered delay. The delay is small (40ms)
//   so an entire group's rows cascade in quickly — it reads as a "list
//   populating" rather than a slow one-by-one reveal.
// ─────────────────────────────────────────────────────────────────────────────
function TechRow({ item, index }) {
    return (
        <div
            className="tech-row"
            data-reveal
            style={{ "--delay": `${index * 40}ms` }}
        >
            {/* Name — serif, weight 500, always visible */}
            <span className="tech-row__name">{item.name}</span>

            {/*
       * Note — only rendered in DOM at all sizes but CSS hides it on
       * mobile/tablet. It describes HOW the technology is used in
       * practice, which turns the page from a skills list into a
       * capability statement.
       */}
            <span className="tech-row__note">{item.note}</span>

            {/*
       * Level badge — inline styled via getLevelBadgeStyle().
       * Three visual weights (Core / Proficient / Familiar) create
       * an at-a-glance confidence map of the full stack.
       */}
            <span style={getLevelBadgeStyle(item.level)}>{item.level}</span>

            {/*
       * Years — mono, quiet, tablet and up only.
       * Provides concrete signal of depth without taking up space
       * on small screens where the name + level is enough.
       */}
            <span className="tech-row__years">{item.years}</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TECH GROUP
//
// One full .section per group. Uses .section-grid for the left/right split:
//   At ≥48rem: minmax(14rem, 0.42fr) [left] | minmax(0, 0.88fr) [right]
//
// Left column:
//   .section-kicker → "01  Frontend" (number prefix from data-index)
//   .story-lead     → group headline (large serif statement)
//
// Right column:
//   .stack-board    → provides border-top (top of list ruled line)
//   TechRow × items → each row has its own border-bottom
//
// [data-reveal] on the left column stagger:
//   Left column reveals first (--delay: 0ms).
//   TechRow items have their own [data-reveal] with 40ms stagger each.
// ─────────────────────────────────────────────────────────────────────────────
function TechGroup({ group }) {
    return (
        <section className="section">
            <div className="section-grid">

                {/* ── Left: group label + headline ─────────────────────────────── */}
                <div className="story-copy" data-reveal>
                    {/*
           * .section-kicker::before { content: attr(data-index) }
           * Renders: "01  Frontend" — number (faint) + label (quiet, mono)
           */}
                    <p className="section-kicker" data-index={group.kicker}>
                        {group.group}
                    </p>

                    {/*
           * .story-lead: var(--font-serif), var(--title-size), weight 500
           * letter-spacing: -0.045em, color: var(--white)
           * Each group's headline is a design statement, not a label.
           * "What the user sees, touches, and feels." is more memorable
           * than "Frontend technologies."
           */}
                    <p className="story-lead">{group.headline}</p>
                </div>

                {/* ── Right: tech rows ─────────────────────────────────────────── */}
                {/*
         * .stack-board provides:
         *   border-top: 1px solid var(--line)   ← top ruled line
         *   display: grid
         * Each .tech-row adds border-bottom so the list is fully ruled.
         */}
                <div className="stack-board">
                    {group.items.map((item, i) => (
                        <TechRow key={item.name} item={item} index={i} />
                    ))}
                </div>

            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function TechnologiesPage() {
    /*
     * Boot GSAP for this route.
     *
     * Selectors that fire on this page:
     *   [data-reveal]    → TechRow items + group left columns + header block
     *   .section-kicker  → slides in from x:-16 (group kickers + header kicker)
     *   .section-title   → character split cascade (page h1)
     *   .story-lead      → GSAP sees these as standard text, no split
     *   .footer          → fade up on enter
     *   --scroll-progress → scroll bar and any CSS vars that use it
     *
     * Selectors gracefully skipped (not on this page):
     *   .project-preview, .hero__rule, .stat__value, .method-item
     */

    const { isThemeAnimating, theme, toggleTheme } = useThemeMode();

    useGSAPMotion();

    // ── Compute level counts dynamically from the data ───────────────────────
    // These drive the stat strip in the page header.
    // If you add/remove a tech in portfolioData.js, the counts update automatically.
    const allItems = TECHNOLOGIES.flatMap((g) => g.items);
    const counts = {
        Core: allItems.filter((i) => i.level === "Core").length,
        Proficient: allItems.filter((i) => i.level === "Proficient").length,
        Familiar: allItems.filter((i) => i.level === "Familiar").length,
        total: allItems.length,
    };

    return (
        <>
            {/*
       * ── SCOPED STYLES ───────────────────────────────────────────────────
       * Three rules live here instead of globals.css because they are
       * scoped entirely to this page's .tech-row component.
       *
       * .tech-row
       *   Base grid: name | badge (2 columns). Mobile-first.
       *   Hover: padding-left nudge + subtle background lift.
       *   transition matches var(--ease-out) from the design system.
       *
       * .tech-row__name
       *   Serif, 1.05rem, weight 500, color: var(--white).
       *   Slightly smaller than .stack-row__title (1.7rem) — this is a
       *   dense list, not a billboard.
       *
       * .tech-row__note / .tech-row__years
       *   Hidden by default. Revealed at responsive breakpoints.
       *   Progressively enriches the layout as screen space allows.
       *
       * @media (min-width: 48rem) — tablet
       *   Adds years column (3-column grid).
       *
       * @media (min-width: 64rem) — desktop
       *   Adds note column (4-column grid). Note takes equal space to name.
       */}
            <style>{`
        .tech-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.75rem 1rem;
          padding: 0.95rem 0;
          border-bottom: 1px solid var(--line);
          align-items: center;
          transition:
            padding-left 0.38s var(--ease-out),
            background   0.38s var(--ease-out);
        }
        .tech-row:hover {
          padding-left: 0.65rem;
          background: rgba(var(--fg-rgb), 0.035);
        }
        .tech-row__name {
          color: var(--white);
          font-family: var(--font-serif);
          font-size: 1.05rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .tech-row__note {
          display: none;
          color: var(--muted);
          font-size: 0.86rem;
          font-weight: 300;
          line-height: 1.55;
        }
        .tech-row__years {
          display: none;
          color: var(--quiet);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }
        @media (min-width: 48rem) {
          .tech-row {
            grid-template-columns: 1fr auto auto;
            gap: 1.5rem;
          }
          .tech-row__years { display: block; }
        }
        @media (min-width: 64rem) {
          .tech-row {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr) auto auto;
            gap: 2rem;
          }
          .tech-row__note { display: block; }
        }
      `}</style>
            <div className={`portfolio-shell ${isThemeAnimating ? "theme-shifting" : ""}`} data-theme={theme}>
                <Cursor />
                <Navbar links={NAV_LINKS} onThemeToggle={toggleTheme} theme={theme} />

                {/* ── INTRO WIPE ───────────────────────────────────────────────────── */}
                <div className="intro-wipe">
                    <span>Technologies</span>
                </div>

                {/* ── SCROLL PROGRESS BAR ─────────────────────────────────────────── */}
                <div className="scroll-progress">
                    <div className="scroll-progress__bar" />
                </div>

                {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
                <header
                    className="section section--no-border"
                    style={{ paddingTop: "calc(var(--section-pad))" }}
                >

                    {/* Top row: header text left, total count right */}
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
                            {/*
             * data-index="03" → renders "03  The stack"
             * GSAP slides the kicker in from x:-16 on scroll enter.
             */}
                            <p className="section-kicker" data-index="03">
                                The stack
                            </p>

                            {/*
             * GSAP splits this into characters and animates each one:
             * yPercent 100→0, rotateX -45→0, stagger 16ms per char.
             * .split-word overflow:hidden clips the yPercent travel.
             */}
                            <h1 className="section-title">Technologies.</h1>

                            <p className="section-copy">
                                Every tool chosen for a reason. Every choice made with the
                                system in mind, not just the task at hand.
                            </p>
                        </div>

                        {/* Total count — museum catalog style, top-right */}
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
                            {String(counts.total).padStart(2, "0")} technologies
                        </p>
                    </div>

                    {/*
         * LEVEL COUNTS STRIP
         * Three stat-style figures showing how the stack is distributed:
         * how many are Core, Proficient, and Familiar.
         * Computed from TECHNOLOGIES data — updates automatically when
         * items are added or removed in portfolioData.js.
         *
         * Uses a flex row of stat blocks. Each block follows the same
         * typography pattern as .stat / .stat__value / .stat__label
         * from the hero section, but without using those classes
         * (to avoid inheriting hero-specific margin or size).
         */}
                    <div
                        data-reveal
                        style={{
                            display: "flex",
                            gap: "3rem",
                            flexWrap: "wrap",
                            marginTop: "2.75rem",
                            paddingTop: "2.5rem",
                        }}
                    >
                        {[
                            { label: "Core", count: counts.Core, note: "Daily-use, expert depth" },
                            { label: "Proficient", count: counts.Proficient, note: "Comfortable, multi-project" },
                            { label: "Familiar", count: counts.Familiar, note: "Working knowledge" },
                        ].map(({ label, count, note }) => (
                            <div key={label} style={{ display: "grid", gap: "0.4rem" }}>
                                {/*
               * The count number — display scale, serif.
               * var(--display-size) is the same variable as .section-title
               * so it fluid-scales: 3.5rem → 5.5rem across breakpoints.
               */}
                                <span
                                    style={{
                                        fontFamily: "var(--font-serif)",
                                        fontSize: "3.5rem",
                                        fontWeight: 500,
                                        letterSpacing: "-0.065em",
                                        lineHeight: 0.9,
                                        color: "var(--white)",
                                    }}
                                >
                                    {count}
                                </span>
                                {/* Label row: level name + description */}
                                <span
                                    style={{
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.7rem",
                                        color: "var(--quiet)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                    }}
                                >
                                    {label}
                                </span>
                                {/* Sub-label: what the level means */}
                                <span
                                    style={{
                                        fontSize: "0.82rem",
                                        fontWeight: 300,
                                        color: "var(--muted)",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {note}
                                </span>
                            </div>
                        ))}
                    </div>
                </header>

                {/* ── TECHNOLOGY GROUPS ───────────────────────────────────────────── */}
                {/*
       * One <TechGroup> per entry in TECHNOLOGIES.
       * Each renders its own <section className="section"> with a border-top.
       * The .section class provides: padding, border-top, scroll-margin-top.
       * Adding a group in portfolioData.js automatically adds a new section.
       */}
                {TECHNOLOGIES.map((group) => (
                    <TechGroup key={group.group} group={group} />
                ))}

                {/* ── CONTACT CTA ─────────────────────────────────────────────────── */}
                {/*
       * .contact: background var(--white), color var(--black).
       * In dark mode:  light bg, dark text — inverted against the page.
       * In light mode: dark bg, light text — still inverted.
       * Child class overrides (.contact .button, etc.) are in globals.css.
       */}
                <section className="contact" id="contact">
                    <div className="contact__inner">
                        <div>
                            <p className="section-kicker">
                                Build with this stack
                            </p>
                            <h2 className="section-title">Have a project in mind?</h2>
                            <p className="section-copy">
                                Every technology on this page has been used in production.
                                Let's put the right ones together for what you're building.
                            </p>
                        </div>

                        <div className="contact__actions" data-reveal>
                            <ButtonLink href="mailto:hello@jeetendra.dev" variant="outline">
                                Start a conversation
                            </ButtonLink>
                            <ButtonLink href="/services" variant="outline">
                                View services
                            </ButtonLink>
                        </div>
                    </div>
                </section>

                {/* ── FOOTER ──────────────────────────────────────────────────────── */}
                <Footer />
            </div>
        </>
    );
}