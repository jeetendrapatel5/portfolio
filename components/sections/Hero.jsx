import { HERO_STATS } from '@/data/portfolioData.js'
import ButtonLink from '@/components/ui/ButtonLink.jsx'

export default function Hero() {
  return (
    <section className="hero" id="home" aria-label="Jeetendra Patel portfolio introduction">
      <div className="hero__inner">
        <h1 className="hero__title flex flex-col" aria-label="Jeetendra Patel">
          <span className="relative inline-block">
            Jeetendr<span className="relative inline-block">a<span className="absolute md:top-2 lg:top-2 left-2/2 -translate-x-0/4 lg:w-4.5 lg:h-4.5 md:w-3.5 md:h-3.5 w-3 h-3 rounded-full bg-amber-500" style={{ backgroundColor: '#4FFF00' }} aria-hidden="true" /></span>
          </span>
          <span className="word-outline">Patel</span>

        </h1>
        <div className="hero__disciplines" aria-label="Areas of expertise">
          <span>Full-Stack Engineering</span>
          <span className="hero__disc-sep" aria-hidden="true">·</span>
          <span>Product Design</span>
          <span className="hero__disc-sep" aria-hidden="true">·</span>
          <span>System Architecture</span>
        </div>

        <div>
          <div>
            <p className="hero__copy">
              I build precise full-stack products where the interface, API, database, and system design all feel like one clean decision.
            </p>

            <div className="flex gap-3 items-center justify-center">
              <ButtonLink href="#projects">Explore work</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Start a conversation
              </ButtonLink>
            </div>
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