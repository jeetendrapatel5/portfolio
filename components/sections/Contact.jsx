import ButtonLink from '@/components/ui/ButtonLink';

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <div data-reveal>
          <span className="section-kicker" data-index="05">
            Contact
          </span>
          <h2 className="section-title">Let&apos;s build something that feels inevitable.</h2>
          <p className="section-copy">
            I am available for freelance projects, product builds, and full-stack engineering roles where polish, clarity, and ownership matter.
          </p>
        </div>

        <div className="contact__actions" data-reveal style={{ "--delay": "120ms" }}>
          <ButtonLink href="/contact" variant="outline">
            Let's talk
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}