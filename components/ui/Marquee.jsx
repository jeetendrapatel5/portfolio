import { useMemo } from 'react';
import { MARQUEE_SKILLS } from '@/data/portfolioData';

export default function Marquee() {
  const skills = useMemo(() => [...MARQUEE_SKILLS, ...MARQUEE_SKILLS, ...MARQUEE_SKILLS], []);

  return (
    <div className="marquee" aria-label="Technology stack marquee">
      <div className="marquee__track">
        {skills.map((skill, index) => (
          <span className="marquee__item" key={`${skill}-${index}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}