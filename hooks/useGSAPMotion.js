import { useEffect, useRef, useState } from "react";

export default function useGSAPMotion() {
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
          .to(".hero__copy", { opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }, "-=0.55")

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