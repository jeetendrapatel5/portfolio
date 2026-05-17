import { useEffect, useRef, useState } from "react";

const THEME_STORAGE_KEY = "jeetendra-portfolio-theme";

export default function useThemeMode() {
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