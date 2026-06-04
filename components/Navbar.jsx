"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Navbar({ links, onThemeToggle, theme }) {
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef(null);
  const pathName = usePathname();

  const isActive = (href) => {
    if(!href.startsWith('/')) return false;
    return pathName === href;
  }

  /* ── scroll shadow ───────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── lock body scroll when drawer open ───────────────── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* ── close on Escape ─────────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`site-nav${scrolled ? " site-nav--scrolled" : ""}`}
        aria-label="Primary navigation"
      >
        {/* ── Brand ──────────────────────────────────────── */}
        <a className="site-nav__brand" href="/" aria-label="Jeetendra Patel home">
          JP
        </a>

        {/* ── Desktop links ──────────────────────────────── */}
        <nav className="site-nav__links" aria-label="Portfolio sections">
          {links.map((link) => (
            
            <a className={`site-nav__link${isActive(link.href) ? " site-nav__link--active" : ""}`} href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Desktop actions ────────────────────────────── */}
        <div className="site-nav__actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={onThemeToggle}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            aria-pressed={isDark}
          >
            <span className="theme-toggle__track" aria-hidden="true">
              <span className="theme-toggle__orb" />
            </span>
            <span className="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
          </button>

          {/* ── Hamburger (mobile only) ─────────────────── */}
          <button
            className={`nav-burger${open ? " nav-burger--open" : ""}`}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            <span className="nav-burger__bar" />
            <span className="nav-burger__bar" />
            <span className="nav-burger__bar" />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer overlay ─────────────────────────── */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`nav-drawer${open ? " nav-drawer--open" : ""}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* backdrop */}
        <div className="nav-drawer__backdrop" onClick={close} aria-hidden="true" />

        <nav className="nav-drawer__panel" aria-label="Mobile navigation">

          {/* panel header */}
          <div className="nav-drawer__header">
            <a className="site-nav__brand" href="#home" onClick={close} tabIndex={open ? 0 : -1}>
              JP
            </a>
            <button
              className="nav-drawer__close"
              type="button"
              onClick={close}
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* big links */}
          <ul className="nav-drawer__links" role="list">
            {links.map((link, i) => (
              <li
                key={link.href}
                className="nav-drawer__item"
                style={{ "--i": i }}
              >
                <a
                  className={`nav-drawer__link${isActive(link.href) ? " nav-drawer__link--active" : ""}`}
                  href={link.href}
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="nav-drawer__num">0{i + 1}</span>
                  {link.label}
                  <svg className="nav-drawer__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          {/* drawer footer */}
          <div className="nav-drawer__footer">
            <button
              className="theme-toggle"
              type="button"
              onClick={onThemeToggle}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              aria-pressed={isDark}
              tabIndex={open ? 0 : -1}
            >
              <span className="theme-toggle__track" aria-hidden="true">
                <span className="theme-toggle__orb" />
              </span>
              <span className="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
            </button>

          </div>
        </nav>
      </div>
    </>
  );
}