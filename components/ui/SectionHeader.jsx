export default function SectionHeader({ index, kicker, title, copy }) {
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