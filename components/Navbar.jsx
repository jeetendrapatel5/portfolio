export default function Navbar({ links, onThemeToggle, theme }) {
  const isDark = theme === "dark";

  return (
    <header className="site-nav" aria-label="Primary navigation">
      <a className="pl-5" href="#home" aria-label="Jeetendra Patel home">
        JP
      </a>

      <nav className="site-nav__links" aria-label="Portfolio sections">
        {links.map((link) => (
          <a className="site-nav__link" href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
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

        <a className="site-nav__status" href="#contact">
          Available
        </a>
      </div>
    </header>
  );
}
