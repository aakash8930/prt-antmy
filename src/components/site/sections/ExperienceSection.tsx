import { EXPERIENCE } from "@/components/blueprint/data/experience";
import { PROJECTS } from "@/components/blueprint/data/projects";

/**
 * 04 — EXPERIENCE. "Where has this engineer actually operated?"
 *
 * A technical record, not a résumé timeline: each entry is a documented
 * line item — number + role, then the organization and period, a short
 * factual summary, and SYSTEMS / PROJECTS metadata rows. It complements
 * Projects (context here, evidence there) rather than repeating it: a
 * project reference is rendered as a link to that project's own entry,
 * never as a restated description.
 */
export function ExperienceSection() {
  return (
    <section id="experience" className="site-section" aria-labelledby="experience-title">
      <div className="site-section-gutter">
        <span className="site-section-index">04</span>
      </div>
      <div className="site-section-main">
        <p className="site-section-kicker">Experience</p>
        <h2 id="experience-title" className="site-section-title">
          Where I&rsquo;ve worked.
        </h2>
        <div className="site-prose">
          <p className="site-lead site-muted">
            The organizations and contexts where I&rsquo;ve operated as an
            engineer — separate from the systems I&rsquo;ve built.
          </p>
        </div>

        {EXPERIENCE.length === 0 ? (
          <div className="site-placeholder">
            <span className="site-placeholder-tag">Awaiting verified information</span>
            <span>
              No employment records have been provided yet — organizations,
              roles and dates will be listed here.
            </span>
          </div>
        ) : (
          <ol className="site-experience">
            {EXPERIENCE.map((entry) => (
              <li key={entry.id} className="site-experience-entry">
                <div className="site-experience-head">
                  <span className="site-experience-number">{entry.number}</span>
                  <span className="site-experience-role">{entry.role}</span>
                </div>
                <h3 className="site-experience-org">{entry.organization}</h3>
                <p className="site-experience-period">{entry.period}</p>
                <p className="site-experience-summary">{entry.summary}</p>
                {entry.systems.length > 0 && (
                  <dl className="site-experience-systems">
                    <div className="site-experience-systems-row">
                      <dt>Systems</dt>
                      <dd>{entry.systems.join(" · ")}</dd>
                    </div>
                    {entry.projects && entry.projects.length > 0 && (
                      <div className="site-experience-systems-row">
                        <dt>Projects</dt>
                        <dd>
                          {entry.projects
                            .flatMap((pid) => {
                              const project = PROJECTS.find((p) => p.id === pid);
                              return project ? [project] : [];
                            })
                            .map((project, i) => (
                              <span key={project.id}>
                                {i > 0 && " · "}
                                <a href={`#project-${project.id}`}>
                                  {project.name}
                                </a>
                              </span>
                            ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
