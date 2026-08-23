import { CONTACT } from "@/components/blueprint/data/contact";

export function StoryFooter() {
  return (
    <footer id="contact" className="story-footer" aria-labelledby="contact-title">
      <div className="story-footer-handoff" aria-hidden="true">
        <span className="story-footer-handoff__line" />
        <span className="story-footer-handoff__port" />
        <span className="story-footer-handoff__label">System boundary / human contact</span>
      </div>
      <div className="story-footer-index" aria-hidden="true">HANDOFF / 10</div>
      <div className="story-footer-copy">
        <p className="chapter-kicker"><span>Contact</span></p>
        <h2 id="contact-title">The next problem can start here.</h2>
        <p>
          If you need a full-stack developer who can research the problem, work through the
          unknowns, and build across the system, send me an email.
        </p>
      </div>
      <div className="story-footer-actions">
        {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
        {CONTACT.github && (
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
            github.com/aakash8930 <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
      <p className="story-footer-note">Aakash Singh · Full-Stack Software Developer</p>
    </footer>
  );
}
