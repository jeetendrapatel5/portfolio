import { useEffect, useRef, useState } from "react";

export default function Cursor() {
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