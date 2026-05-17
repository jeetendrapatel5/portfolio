export default function ButtonLink({ href, children, variant = "default" }) {
  return (
    <a className={`button ${variant === "ghost" ? "button--ghost" : ""} ${variant === "solid" ? "button--solid" : ""}`} href={href}>
      <span>{children}</span>
      <span className="button__arrow" aria-hidden="true">
        -&gt;
      </span>
    </a>
  );
}