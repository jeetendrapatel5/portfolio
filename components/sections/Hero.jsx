import { HERO_STATS } from '@/data/portfolioData.js'
import ButtonLink from '@/components/ui/ButtonLink.jsx'
import SystemPanel from '@/components/ui/SystemPanel.jsx'

export default function Hero() {
  return (
    <section className="hero" id="home" aria-label="Jeetendra Patel portfolio introduction">
      <div className="hero__inner">
        <h1 className="hero__title  flex flex-col" aria-label="Jeetendra Patel">
          <span>Jeetendra</span>
          <span className="word-outline">Patel</span>

        </h1>
        <div className="flex gap-3 text-2xl">
          <span>Full-Stack Developer</span>
          <span> | </span>
          <span>Product-Minded Engineering</span>
        </div>


        <div className="hero__bottom">
          <div>
            <p className="hero__copy">
              I build <strong>precise full-stack products</strong> where the interface, API, database, and system design all feel like one clean decision.
            </p>

            <div className="flex gap-3 items-center">
              <ButtonLink href="#projects">Explore work</ButtonLink>
              <ButtonLink href="#contact" variant="ghost">
                Start a conversation
              </ButtonLink>
            </div>
          </div>

          <div className="hero__visual" data-cursor="focus">
            <SystemPanel />
          </div>
        </div>

        <div className="hero__stats mb-20">
          {HERO_STATS.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="stat__value">{stat.value}</span>
              <span className="stat__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <span className="scroll-cue" aria-hidden="true">
        Scroll
      </span>
    </section>
  );
}