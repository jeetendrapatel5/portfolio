import SectionHeader from '@/components/ui/SectionHeader';
import { SKILL_GROUPS } from '@/data/portfolioData';

export default function Skills() {
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