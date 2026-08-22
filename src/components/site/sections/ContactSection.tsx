import { CONTACT } from "@/components/blueprint/data/contact";

/** Strip protocol / www from a URL for compact technical display. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "");
}

/**
 * 06 — CONTACT. The handoff: the visitor has inspected the system and now
 * has a clear way to initiate a real engagement.
 *
 * Uses only verified destinations (see data/contact.ts). The primary action
 * is the email when one is configured, otherwise the verified GitHub
 * profile. A secondary in-page reference to Projects supports conversion by
 * pointing back at the evidence. No phone, pricing, response-time or social
 * claims are fabricated.
 */
export function ContactSection() {
  const email = CONTACT.email;
  const github = CONTACT.github;

  return (
    <section id="contact" className="site-section" aria-labelledby="contact-title">
      <div className="site-section-gutter">
        <span className="site-section-index">06</span>
      </div>
      <div className="site-section-main">
        <p className="site-section-kicker">Contact</p>
        <h2 id="contact-title" className="site-section-title">
          Start a project.
        </h2>
        <div className="site-prose">
          <p className="site-lead">
            I&rsquo;m available for software and product development work — web,
            mobile, backend, APIs and automation. If you&rsquo;re planning a system,
            or need one built or rebuilt, this is where we begin.
          </p>
        </div>

        <div className="site-contact-actions">
          {email ? (
            <a className="site-contact-primary" href={`mailto:${email}`}>
              {email}
            </a>
          ) : github ? (
            <a
              className="site-contact-primary"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {displayUrl(github)}
            </a>
          ) : null}
          {email && github && (
            <a
              className="site-contact-secondary"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub — {displayUrl(github)}
            </a>
          )}
          <a className="site-contact-secondary" href="#projects">
            Review the evidence → Projects
          </a>
        </div>

        <dl className="site-contact-meta">
          <div className="site-contact-meta-row">
            <dt>Engagement</dt>
            <dd>Software &amp; product development</dd>
          </div>
          <div className="site-contact-meta-row">
            <dt>Scope</dt>
            <dd>Web · Mobile · Backend · APIs · Automation</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
