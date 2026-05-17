import SectionHeader from "@/components/ui/SectionHeader";

export default function About() {
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