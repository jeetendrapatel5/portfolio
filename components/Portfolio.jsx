"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "./Navbar";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const MARQUEE_SKILLS = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "Prisma ORM",
  "Redis",
  "Tailwind CSS",
  "Shadcn UI",
  "System Design",
];

const HERO_STATS = [
  { value: "01", label: "Product mindset" },
  { value: "12+", label: "Core technologies" },
  { value: "100%", label: "Full-stack ownership" },
];

const PROJECTS = [
  {
    number: "01",
    title: "Freeport",
    category: "SaaS Client Portal",
    year: "2026",
    status: "Product build",
    subtitle:
      "A client delivery system that makes freelance work feel calm, transparent, and premium from the first handoff.",
    story:
      "Freeport is shaped around trust: magic-link access, delivery milestones, decision history, invoice readiness, and clean project stories that clients can understand without a walkthrough.",
    signals: [
      "Designed the experience around client confidence, not internal admin screens.",
      "Built the architecture for secure handoffs, project state, billing flows, and durable records.",
      "Turns progress, approvals, and deliverables into a polished product narrative.",
    ],
    stack: ["Next.js", "PostgreSQL", "Prisma", "Redis", "Stripe", "Resend"],
    preview: "portal",
  },
  {
    number: "02",
    title: "Architecture Lab",
    category: "System Design Study",
    year: "2026",
    status: "Case study",
    subtitle:
      "A technical storytelling environment for designing, explaining, and stress-testing production web systems.",
    story:
      "The project maps product requirements into APIs, queues, cache strategy, database constraints, and failure paths so the system reads like a thoughtful engineering decision, not a pile of features.",
    signals: [
      "Documents the path from user journey to schema, service boundaries, and cache strategy.",
      "Highlights tradeoffs clearly for recruiters, founders, and engineering teams.",
      "Shows how frontend polish and backend reliability support the same business outcome.",
    ],
    stack: ["System Design", "Node.js", "Express.js", "Redis", "PostgreSQL"],
    preview: "map",
  },
  {
    number: "03",
    title: "Invoiced",
    category: "Payments Platform",
    year: "2025",
    status: "Shipped concept",
    subtitle:
      "A lightweight invoice and payment workflow for independent builders who need clarity without enterprise noise.",
    story:
      "Invoiced focuses on the practical details that make a tool feel reliable: clean invoice states, fast PDF generation, payment visibility, multi-currency thinking, and a UI that keeps money conversations professional.",
    signals: [
      "Built around real freelancer workflows: draft, send, follow up, settle, archive.",
      "Keeps financial state legible while leaving room for Stripe Connect and automation.",
      "Balances a minimalist interface with the operational detail users need.",
    ],
    stack: ["React", "Node.js", "Express.js", "Stripe", "PostgreSQL"],
    preview: "terminal",
  },
];

const SKILL_GROUPS = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Shadcn UI"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "Authentication", "Caching", "Background workflows"],
  },
  {
    title: "Data",
    items: ["PostgreSQL", "Prisma ORM", "Redis", "Schema design", "Query performance"],
  },
  {
    title: "Product Craft",
    items: ["System design", "UX thinking", "Performance", "Clean architecture", "Production polish"],
  },
];

const METHOD = [
  {
    title: "Clarify",
    text: "I start by turning vague requirements into a sharp product model, success criteria, and technical boundaries.",
  },
  {
    title: "Architect",
    text: "I map the data, routes, API contracts, states, and failure cases before the interface becomes expensive to change.",
  },
  {
    title: "Craft",
    text: "I build interfaces that feel precise, fast, and calm while keeping the code readable enough to keep evolving.",
  },
  {
    title: "Harden",
    text: "I look for the production details: loading states, empty states, accessibility, performance, and maintainable patterns.",
  },
];

const THEME_STORAGE_KEY = "jeetendra-portfolio-theme";

function useThemeMode() {
  const [theme, setTheme] = useState("dark");
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  const animationTimer = useRef(null);
  const hydrationFrame = useRef(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "light") {
      hydrationFrame.current = window.requestAnimationFrame(() => setTheme("light"));
    }

    return () => {
      if (hydrationFrame.current) window.cancelAnimationFrame(hydrationFrame.current);
      if (animationTimer.current) window.clearTimeout(animationTimer.current);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const themeColor = theme === "dark" ? "#050505" : "#f4f3ee";
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute("content", themeColor);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      return nextTheme;
    });

    setIsThemeAnimating(true);
    if (animationTimer.current) window.clearTimeout(animationTimer.current);
    animationTimer.current = window.setTimeout(() => setIsThemeAnimating(false), 820);
  };

  return { isThemeAnimating, theme, toggleTheme };
}

// ─── useGSAPMotion ─────────────────────────────────────────────
//
// This hook owns ALL animation on the page.
// It dynamically imports GSAP + ScrollTrigger (tree-shaken,
// only loaded client-side) so the Next.js server bundle stays clean.
//
// Responsibilities:
//   1. CSS variable tracking (scroll progress, hero parallax, pointer)
//   2. Hero entrance timeline — sequenced, staggered reveal
//   3. Section title character splits + rotateX cascade
//   4. ScrollTrigger-driven section reveals (replaces IntersectionObserver)
//   5. Stat counter animation
//   6. Magnetic button effect with elastic snap-back
//   7. Project preview parallax scrub
//   8. Stack rows slide-in from left with stagger
//   9. Method cards spring-in with back.out easing
//  10. Footer reveal

function useGSAPMotion() {
  useEffect(() => {
    // We collect cleanup functions so the useEffect return can
    // call them all in one place, even across sync and async work
    const cleanups = [];

    // ── 1. CSS variable tracking (no GSAP needed, pure rAF) ──────
    //
    // These drive CSS features that already exist:
    //   --scroll-progress → .scroll-progress__bar scaleX
    //   --hero-shift       → .hero__inner translateY (parallax)
    //   --hero-fade        → .hero__inner opacity
    //   --pointer-x/y      → .portfolio-shell radial-gradient spotlight

    const root = document.documentElement;
    let rafFrame = null;

    const updateScrollVars = () => {
      const maxScroll = Math.max(root.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(window.scrollY / maxScroll, 1);
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty("--hero-shift", `${Math.min(window.scrollY * 0.16, 92)}px`);
      root.style.setProperty("--hero-fade", Math.max(1 - window.scrollY / 780, 0.18).toFixed(3));
      rafFrame = null;
    };

    const scheduleScrollUpdate = () => {
      if (rafFrame) return;
      rafFrame = window.requestAnimationFrame(updateScrollVars);
    };

    updateScrollVars();
    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    window.addEventListener("resize", scheduleScrollUpdate);
    cleanups.push(() => {
      window.removeEventListener("scroll", scheduleScrollUpdate);
      window.removeEventListener("resize", scheduleScrollUpdate);
      if (rafFrame) window.cancelAnimationFrame(rafFrame);
    });

    const handlePointerMove = (e) => {
      root.style.setProperty("--pointer-x", `${e.clientX}px`);
      root.style.setProperty("--pointer-y", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    cleanups.push(() => window.removeEventListener("pointermove", handlePointerMove));

    // ── Smooth anchor navigation ──────────────────────────────────
    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    };
    anchors.forEach((a) => a.addEventListener("click", handleAnchorClick));
    cleanups.push(() => anchors.forEach((a) => a.removeEventListener("click", handleAnchorClick)));

    // ── 2–10. GSAP animations (async dynamic import) ──────────────
    //
    // Dynamic import keeps GSAP out of the Next.js server bundle
    // and out of the initial JS payload (loaded in parallel with
    // the first paint, not blocking it).

    const initGSAP = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // ── Detect reduced-motion preference ─────────────────────────
      // If the user has requested reduced motion (accessibility setting),
      // we skip all animations and immediately show everything.
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Create a GSAP context scoped to the whole page.
      // ctx.revert() on cleanup undoes every tween/ScrollTrigger inside.
      const ctx = gsap.context(() => {

        if (reducedMotion) {
          // Make everything immediately visible — respect the OS setting
          gsap.set("[data-reveal]", { opacity: 1, y: 0, clearProps: "all" });
          gsap.set(".hero__rule", { scaleX: 1, clearProps: "all" });
          gsap.set(".line-mask > span", { yPercent: 0, rotation: 0, clearProps: "all" });
          gsap.set(".hero__copy, .hero__actions, .hero__visual, .hero__stats, .scroll-cue", {
            opacity: 1, y: 0, clearProps: "all",
          });
          document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
          return; // stop here
        }

        // ═══════════════════════════════════════════════════════════
        // 2. HERO ENTRANCE TIMELINE
        //
        // The intro-wipe covers the viewport for ~1.53s (1.35s anim
        // + 0.18s delay). We start the hero timeline at delay:1.6 to
        // let the wipe fully exit before the name appears.
        //
        // Sequence:
        //   t=0    rule draws left→right  (expo.inOut feels mechanical/precise)
        //   t=0.3  meta labels fade up    (while rule is still drawing)
        //   t=0.3  name lines cascade up  (per-character-equivalent via line stagger)
        //   t=1.0  tagline copy fades up
        //   t=1.1  CTA buttons slide up with stagger
        //   t=1.15 system panel slides up
        //   t=1.3  stats grid bounces in  (back.out gives spring feel)
        //   t=1.5  scroll cue fades in
        // ═══════════════════════════════════════════════════════════

        const heroTL = gsap.timeline({ delay: 1.6 });

        heroTL
          // Horizontal rule — draws across like an architect's line
          .to(".hero__rule", {
            scaleX: 1,
            duration: 1.55,
            ease: "expo.inOut",
            transformOrigin: "left center",
          })

          // Meta labels (Full-stack developer · Goa, India · Product-minded...)
          // Stagger 0.06s per item so they ripple in left→right
          .to(
            ".hero__meta span",
            { opacity: 1, y: 0, stagger: 0.06, duration: 0.75, ease: "power3.out" },
            "-=1.25"
          )

          // Name lines — each line-mask clips the span below baseline,
          // so the slide-up looks like text emerging from the floor.
          // Spring easing (expo.out) gives that satisfying snap.
          .to(
            ".line-mask > span",
            {
              yPercent: 0,
              rotation: 0,
              stagger: 0.13,
              duration: 1.2,
              ease: "expo.out",
            },
            "-=1.15"
          )

          // Copy paragraph
          .to(".hero__copy", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.55")

          // CTA buttons — slight stagger so they don't feel like one blob
          .to(
            ".hero__actions > *",
            { opacity: 1, y: 0, stagger: 0.09, duration: 0.8, ease: "power3.out" },
            "-=0.75"
          )

          // System panel — floats up from below with slight delay relative to buttons
          .to(".hero__visual", { opacity: 1, y: 0, duration: 0.95, ease: "power3.out" }, "-=0.72")

          // Stats grid — back.out(1.2) creates a tiny overshoot,
          // like the grid settling into place
          .to(".hero__stats", { opacity: 1, y: 0, duration: 0.85, ease: "back.out(1.2)" }, "-=0.6")

          // Scroll cue — last thing to appear; subtle
          .to(".scroll-cue", { opacity: 0.55, duration: 0.65 }, "-=0.3");

        // ═══════════════════════════════════════════════════════════
        // 3. SECTION TITLE CHARACTER REVEALS
        //
        // We manually split each .section-title into .split-word
        // and .split-char spans (no SplitText needed).
        // Each char animates: yPercent 100→0 + rotateX -45→0
        // The overflow:hidden on .split-word clips the y travel,
        // creating a "characters rising from below the line" effect.
        // ═══════════════════════════════════════════════════════════

        document.querySelectorAll(".section-title").forEach((title) => {
          // Split text content into word→char DOM structure
          // Preserving whitespace: words are joined by &nbsp; spans
          const originalHTML = title.innerHTML;
          // Use textContent to get clean text (no nested HTML from prior runs)
          const words = title.textContent.split(" ").filter(Boolean);

          title.innerHTML = words
            .map(
              (word) =>
                `<span class="split-word">${word
                  .split("")
                  .map((ch) => `<span class="split-char">${ch}</span>`)
                  .join("")}</span>`
            )
            .join('<span style="display:inline;">&nbsp;</span>');

          // ScrollTrigger: animate chars when title enters viewport
          gsap.from(title.querySelectorAll(".split-char"), {
            yPercent: 100,        // starts below the .split-word clip boundary
            opacity: 0,
            rotateX: -45,         // tilted back → snaps forward
            stagger: 0.016,       // ~16ms between each character = smooth wave
            duration: 0.6,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: title,
              start: "top 88%",   // fires when top of title hits 88% down the viewport
              once: true,         // one-shot: never replays on scroll up/down
            },
          });
        });

        // ═══════════════════════════════════════════════════════════
        // 4. [DATA-REVEAL] SCROLL REVEALS
        //
        // Replaces the IntersectionObserver + .is-visible CSS system.
        // GSAP ScrollTrigger gives us:
        //   - Precise `start` control
        //   - Stagger via `--delay` CSS variable
        //   - filter:blur for glass-reveal effect (CSS couldn't stagger this)
        //   - once:true for one-shot (same behavior as before)
        // ═══════════════════════════════════════════════════════════

        gsap.utils.toArray("[data-reveal]").forEach((el) => {
          // Read the --delay custom property set inline: style={{ "--delay": "110ms" }}
          // parseFloat("110ms") → 110   /1000 → 0.11 seconds
          const delayMs = parseFloat(el.style.getPropertyValue("--delay")) || 0;

          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 36,
              filter: "blur(6px)",
              clipPath: "inset(0 0 16% 0)",
            },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              clipPath: "inset(0 0 0% 0)",
              duration: 0.95,
              delay: delayMs / 1000,
              ease: "power3.out",
              onStart: () => el.classList.add("is-visible"), // keep CSS hook
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

        // ═══════════════════════════════════════════════════════════
        // 5. STAT COUNTER ANIMATION
        //
        // Finds numbers inside .stat__value and counts up from 0.
        // Handles formats: "12+" "100%" "01" "3.2x" etc.
        // gsap.from({ val: 0 }, { val: N }) animates a plain object —
        // the `onUpdate` callback reads .val and writes to DOM each frame.
        // ═══════════════════════════════════════════════════════════

        document.querySelectorAll(".stat__value").forEach((stat) => {
          const originalText = stat.textContent.trim();
          // Match the first integer in the string
          const numMatch = originalText.match(/(\d+)/);
          if (!numMatch) return;

          const endVal = parseInt(numMatch[1], 10);
          const prefix = originalText.slice(0, numMatch.index);          // text before number
          const suffix = originalText.slice(numMatch.index + numMatch[0].length); // text after

          // Animate a plain object {val: 0} → {val: endVal}
          const counter = { val: 0 };
          gsap.to(counter, {
            val: endVal,
            duration: 1.9,
            ease: "power2.out",
            onUpdate() {
              stat.textContent = prefix + Math.round(counter.val) + suffix;
            },
            scrollTrigger: {
              trigger: stat,
              start: "top 88%",
              once: true,
            },
          });
        });

        // ═══════════════════════════════════════════════════════════
        // 7. PROJECT PREVIEW PARALLAX
        //
        // scrub: 1.5 → the animation lags 1.5s behind the scroll
        //   position, creating a smooth parallax without jerkiness.
        // yPercent: -8 → preview moves up 8% of its own height as
        //   it scrolls through the viewport.
        //
        // We skip this for the 3D tilt (handled below separately)
        // so they don't fight over the transform property.
        // Both use `perspective()` via CSS; GSAP adds yPercent on top.
        // ═══════════════════════════════════════════════════════════

        gsap.utils.toArray(".project-preview").forEach((preview) => {
          gsap.to(preview, {
            yPercent: -7,
            ease: "none",          // linear → scroll position directly maps to position
            scrollTrigger: {
              trigger: preview,
              start: "top bottom", // begins when preview top enters viewport bottom
              end: "bottom top",   // ends when preview bottom leaves viewport top
              scrub: 1.5,          // smoothed scrub
            },
          });
        });

        // ── Project preview 3D tilt (pointer tracking) ─────────────
        // CSS already supports --tilt-x/y via transform in .project-preview.
        // We use gsap.to() on the CSS vars for the leave reset so it's
        // smooth instead of jumping back instantly.
        document.querySelectorAll(".project-preview").forEach((preview) => {
          const onMove = (e) => {
            const rect = preview.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            preview.style.setProperty("--tilt-x", `${(x - 0.5) * 8}deg`);
            preview.style.setProperty("--tilt-y", `${(0.5 - y) * 7}deg`);
            preview.style.setProperty("--glow-x", `${x * 100}%`);
            preview.style.setProperty("--glow-y", `${y * 100}%`);
          };

          const onLeave = () => {
            // Animate CSS vars back to neutral — gsap can tween CSS custom
            // properties that contain a unit (deg) since GSAP 3.2
            gsap.to(preview, {
              "--tilt-x": "0deg",
              "--tilt-y": "0deg",
              duration: 0.65,
              ease: "power2.out",
            });
            preview.style.setProperty("--glow-x", "50%");
            preview.style.setProperty("--glow-y", "50%");
          };

          preview.addEventListener("pointermove", onMove);
          preview.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            preview.removeEventListener("pointermove", onMove);
            preview.removeEventListener("pointerleave", onLeave);
          });
        });

        // ═══════════════════════════════════════════════════════════
        // 8. STACK ROWS — SLIDE IN FROM LEFT WITH STAGGER
        //
        // Each .stack-row slides in from x:-28 with a 55ms stagger.
        // The delay is calculated inline (not via scrollTrigger stagger)
        // because each row has its own trigger (the row itself),
        // so we manually multiply index × 0.055.
        //
        // This creates a domino reveal down the list instead of all
        // rows firing at once when the section enters.
        // ═══════════════════════════════════════════════════════════

        gsap.utils.toArray(".stack-row").forEach((row, i) => {
          gsap.fromTo(
            row,
            { opacity: 0, x: -28 },
            {
              opacity: 1,
              x: 0,
              duration: 0.78,
              ease: "power3.out",
              delay: i * 0.055, // stagger multiplied by index
              scrollTrigger: {
                trigger: row,
                start: "top 91%",
                once: true,
              },
            }
          );
        });

        // ═══════════════════════════════════════════════════════════
        // 9. METHOD ITEMS — SPRING IN WITH BACK.OUT
        //
        // scale: 0.97 → 1 combined with y: 28 → 0 creates a "popping
        // forward" feel, like each card is pressing toward you.
        // back.out(1.3): slight overshoot then settles.
        // ═══════════════════════════════════════════════════════════

        gsap.utils.toArray(".method-item").forEach((item, i) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 28, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.78,
              ease: "back.out(1.3)",
              delay: i * 0.065,
              scrollTrigger: {
                trigger: item,
                start: "top 91%",
                once: true,
              },
            }
          );
        });

        // ═══════════════════════════════════════════════════════════
        // 10. PROOF ITEMS (about section grid cards) — STAGGER UP
        // ═══════════════════════════════════════════════════════════

        gsap.utils.toArray(".proof-item").forEach((item, i) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              delay: i * 0.08,
              scrollTrigger: {
                trigger: item,
                start: "top 91%",
                once: true,
              },
            }
          );
        });

        // ═══════════════════════════════════════════════════════════
        // 11. SECTION KICKERS — SLIDE IN FROM LEFT
        //
        // The kicker label (e.g. "01  About") slides in from x:-16
        // before the section title chars cascade in, establishing
        // the section's "address" before the content appears.
        // ═══════════════════════════════════════════════════════════

        gsap.utils.toArray(".section-kicker").forEach((kicker) => {
          gsap.fromTo(
            kicker,
            { opacity: 0, x: -16 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: kicker,
                start: "top 90%",
                once: true,
              },
            }
          );
        });

        // ═══════════════════════════════════════════════════════════
        // 12. FOOTER FADE UP
        // ═══════════════════════════════════════════════════════════

        gsap.from(".footer", {
          opacity: 0,
          y: 18,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer",
            start: "top 96%",
            once: true,
          },
        });

      }); // end gsap.context

      cleanups.push(() => ctx.revert());
    }; // end initGSAP

    initGSAP().catch(console.error);

    // Cleanup: all event listeners + GSAP context
    return () => cleanups.forEach((fn) => fn());
  }, []);
}

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const frame = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleMove = (event) => {
      mouse.current = { x: event.clientX, y: event.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX - 3}px, ${event.clientY - 3}px, 0)`;
      }
    };

    const handleOver = (event) => {
      const isInteractive = Boolean(event.target.closest('a, button, [data-cursor="focus"]'));
      document.body.classList.toggle("cursor-engaged", isInteractive);
    };

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.16;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x - 20}px, ${ring.current.y - 20}px, 0)`;
      }
      frame.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.body.classList.remove("cursor-engaged");
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <span className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <span className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}

function ScrollProgress() {
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" />
    </div>
  );
}

function ButtonLink({ href, children, variant = "default" }) {
  return (
    <a className={`button ${variant === "ghost" ? "button--ghost" : ""} ${variant === "solid" ? "button--solid" : ""}`} href={href}>
      <span>{children}</span>
      <span className="button__arrow" aria-hidden="true">
        -&gt;
      </span>
    </a>
  );
}

function SectionHeader({ index, kicker, title, copy }) {
  return (
    <header className="section-header" data-reveal>
      <span className="section-kicker" data-index={index}>
        {kicker}
      </span>
      <h2 className="section-title">{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-label="Jeetendra Patel portfolio introduction">
      <div className="hero__inner">
        <h1 className="hero__title  flex flex-col" aria-label="Jeetendra Patel">
          <span>Jeetendra</span>
          <span className="word-outline">Patel</span>

        </h1>
        <div className="flex gap-3 text-2xl">
          <span>Full-Stack Developer</span>
          <span> | </span>
          <span>Product-Minded Engineering</span>
        </div>


        <div className="hero__bottom">
          <div>
            <p className="hero__copy">
              I build <strong>precise full-stack products</strong> where the interface, API, database, and system design all feel like one clean decision.
            </p>

            <div className="flex gap-3 items-center">
              <ButtonLink href="#projects">Explore work</ButtonLink>
              <ButtonLink href="#contact" variant="ghost">
                Start a conversation
              </ButtonLink>
            </div>
          </div>

          <div className="hero__visual" data-cursor="focus">
            <SystemPanel />
          </div>
        </div>

        <div className="hero__stats mb-20">
          {HERO_STATS.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="stat__value">{stat.value}</span>
              <span className="stat__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <span className="scroll-cue" aria-hidden="true">
        Scroll
      </span>
    </section>
  );
}

function SystemPanel() {
  return (
    <div className="system-panel" aria-label="Animated full-stack system preview">
      <div className="system-panel__top">
        <div className="system-panel__lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>Production flow</span>
      </div>

      <div className="system-panel__grid">
        {[
          ["UI", "React", "State"],
          ["API", "Node", "Auth"],
          ["Data", "Prisma", "SQL"],
        ].map(([label, a, b]) => (
          <div className="system-node" key={label}>
            <span className="system-node__label">{label}</span>
            <span className="system-node__line">{a}</span>
            <span className="system-node__line">{b}</span>
          </div>
        ))}
      </div>

      <div className="system-panel__footer">
        {["request", "cache", "database"].map((route) => (
          <div className="system-route" key={route}>
            <span>{route}</span>
            <span className="system-route__bar" />
            <span>ok</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Marquee() {
  const skills = useMemo(() => [...MARQUEE_SKILLS, ...MARQUEE_SKILLS, ...MARQUEE_SKILLS], []);

  return (
    <div className="marquee" aria-label="Technology stack marquee">
      <div className="marquee__track">
        {skills.map((skill, index) => (
          <span className="marquee__item" key={`${skill}-${index}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <div className="section-grid">
        <SectionHeader
          index="01"
          kicker="About"
          title="Quiet confidence, serious execution."
          copy="I care about the invisible parts of a product as much as the visible ones: naming, state, schema, performance, and the little interactions that make software feel trustworthy."
        />

        <div className="story-copy">
          <p className="story-lead" data-reveal>
            I am Jeetendra Patel, a full-stack developer who turns product ideas into refined, production-minded web experiences.
          </p>
          <p data-reveal style={{ "--delay": "110ms" }}>
            My work sits at the intersection of design taste and engineering discipline. I can move from product strategy to React interfaces, from Node APIs to PostgreSQL schemas, and from cache strategy to polished interaction details without losing the thread.
          </p>
          <p data-reveal style={{ "--delay": "190ms" }}>
            The result is software that feels considered: fast enough to trust, elegant enough to remember, and structured enough to grow after the first launch.
          </p>

          <div className="proof-grid" data-reveal style={{ "--delay": "270ms" }}>
            <div className="proof-item">
              <span className="proof-item__label">For clients</span>
              <p className="proof-item__text">A builder who can own the entire product surface and communicate clearly along the way.</p>
            </div>
            <div className="proof-item">
              <span className="proof-item__label">For teams</span>
              <p className="proof-item__text">Readable code, clean boundaries, and pragmatic decisions that make collaboration easier.</p>
            </div>
            <div className="proof-item">
              <span className="proof-item__label">For users</span>
              <p className="proof-item__text">Interfaces that feel deliberate, responsive, and calm under real-world use.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section projects" id="projects">
      <SectionHeader
        index="02"
        kicker="Selected work"
        title="Projects with a product spine."
        copy="Each piece is framed as a business problem, a technical system, and a crafted user experience. That is the difference between showing screens and showing judgment."
      />

      <div className="project-list">
        {PROJECTS.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.title} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <article className="project-card" data-reveal style={{ "--delay": `${index * 95}ms` }}>
      <ProjectPreview type={project.preview} title={project.title} />

      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="project-card__number">{project.number}</span>
          <span>{project.category}</span>
          <span>{project.year}</span>
          <span>{project.status}</span>
        </div>

        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__subtitle">{project.subtitle}</p>
        <p className="project-card__story">{project.story}</p>

        <ul className="project-card__signals" aria-label={`${project.title} highlights`}>
          {project.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>

        <ul className="tag-list" aria-label={`${project.title} technology stack`}>
          {project.stack.map((tag) => (
            <li className="tag" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ProjectPreview({ type, title }) {
  return (
    <div className={`project-preview project-preview--${type}`} data-cursor="focus" aria-label={`${title} visual preview`}>
      <div className="preview-window">
        <div className="preview-window__bar">
          <div className="preview-window__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span>{title}</span>
        </div>

        {type === "portal" ? <PortalPreview /> : null}
        {type === "map" ? <MapPreview /> : null}
        {type === "terminal" ? <TerminalPreview /> : null}

        <div className="preview-footer" aria-hidden="true">
          <span className="preview-chip">fast</span>
          <span className="preview-chip">clean</span>
          <span className="preview-chip">secure</span>
        </div>
      </div>
    </div>
  );
}

function PortalPreview() {
  return (
    <div className="preview-flow" aria-hidden="true">
      {[
        ["brief", "signed", "72%"],
        ["decision", "ready", "54%"],
        ["invoice", "sent", "86%"],
      ].map(([label, status, width]) => (
        <div className="preview-row" key={label}>
          <span>{label}</span>
          <span className="preview-meter" style={{ "--meter": width }} />
          <span className="preview-status">{status}</span>
        </div>
      ))}
    </div>
  );
}

function MapPreview() {
  return (
    <div className="preview-map" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="preview-node" key={index}>
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}

function TerminalPreview() {
  return (
    <div className="preview-terminal" aria-hidden="true">
      <span>$ create invoice --client premium</span>
      <span>$ sync payment_state --stripe</span>
      <span>$ ship clean handoff --done</span>
    </div>
  );
}

function Skills() {
  return (
    <section className="section" id="skills">
      <div className="section-grid">
        <SectionHeader
          index="03"
          kicker="Stack"
          title="A stack chosen for speed and staying power."
          copy="The tools are modern, but the taste is simple: clear boundaries, strong data modeling, fast interfaces, and enough system thinking to keep products reliable."
        />

        <div className="stack-board" data-reveal>
          {SKILL_GROUPS.map((group) => (
            <div className="stack-row" key={group.title}>
              <h3 className="stack-row__title">{group.title}</h3>
              <ul className="stack-row__items tag-list">
                {group.items.map((item) => (
                  <li className="tag" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section className="section section--no-border" id="method">
      <SectionHeader
        index="04"
        kicker="Method"
        title="How I make the work feel premium."
        copy="Premium is not decoration. It is what happens when product thinking, engineering judgment, and interaction craft are all held to the same standard."
      />

      <div className="method-list" data-reveal>
        {METHOD.map((item, index) => (
          <article className="method-item" key={item.title}>
            <span className="method-item__index">0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <div data-reveal>
          <span className="section-kicker" data-index="05">
            Contact
          </span>
          <h2 className="section-title">Let&apos;s build something that feels inevitable.</h2>
          <p className="section-copy">
            I am available for freelance projects, product builds, and full-stack engineering roles where polish, clarity, and ownership matter.
          </p>
        </div>

        <div className="contact__actions" data-reveal style={{ "--delay": "120ms" }}>
          <ButtonLink href="mailto:hello@jeetendrapatel.dev" variant="solid">
            Email Jeetendra
          </ButtonLink>
          <ButtonLink href="#projects">Review work</ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>Jeetendra Patel / Full-stack developer</span>
      <span>Designed and built with intent / 2026</span>
    </footer>
  );
}

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