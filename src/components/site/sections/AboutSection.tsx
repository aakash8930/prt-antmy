/**
 * 01 — ABOUT. Answers, concisely, who this engineer is, what they build,
 * and what kind of problems they solve. Grounded in the Blueprint's own
 * system model (data → backend → APIs → frontend → infrastructure) and the
 * tech evidenced in data/techStack.ts — no invented biography, no
 * "passionate developer with N years" boilerplate. Anything genuinely
 * missing (primary focus, location, current work) is a marked placeholder.
 */
export function AboutSection() {
  return (
    <section id="about" className="site-section" aria-labelledby="about-title">
      <div className="site-section-gutter">
        <span className="site-section-index">01</span>
      </div>
      <div className="site-section-main">
        <p className="site-section-kicker">About</p>
        <h2 id="about-title" className="site-section-title">
          Systems, end to end.
        </h2>
        <div className="site-prose">
          <p className="site-lead">
            I&rsquo;m Aakash Singh. I build full-stack systems from the data layer
            up — storage, services, the APIs between them, the interface, and
            the infrastructure that keeps them running.
          </p>
          <p>
            The drawing at the top of this page isn&rsquo;t decoration. It&rsquo;s the
            model I design against: a system that gets specified, separated,
            inspected, and reassembled — because the hard part of most
            software isn&rsquo;t the code, it&rsquo;s the seam where two layers have to
            agree.
          </p>
          <p className="site-muted">
            The problems I gravitate toward are the ones where that agreement
            is load-bearing — where data, runtime, and interface have to keep
            a contract under real conditions, and where an unstated assumption
            becomes an incident. I&rsquo;d rather make a seam explicit and testable
            than smooth it over.
          </p>
        </div>
        <dl className="site-spec">
          <div className="site-spec-row">
            <dt>Stack</dt>
            <dd>
              <span className="site-stack-group">Node.js · NestJS · Python</span>{" — "}
              <span className="site-stack-group">React · TypeScript · React Native</span>{" — "}
              <span className="site-stack-group">MongoDB · PostgreSQL</span>{" — "}
              <span className="site-stack-group">Docker</span>
            </dd>
          </div>
          <div className="site-spec-row">
            <dt>Focus</dt>
            <dd>
              I build full-stack web and mobile systems, with a focus on
              backend architecture, APIs, automation, and AI-assisted product
              development. I work across the stack to turn product
              requirements into reliable, production-ready software.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
