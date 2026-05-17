import SectionHeader from "@/components/ui/SectionHeader";
import { METHOD } from "@/data/portfolioData";

export default function Method() {
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