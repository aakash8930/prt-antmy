import { CAPABILITIES } from "@/components/blueprint/data/skills";
import { PROJECTS } from "@/components/blueprint/data/projects";

/**
 * 05 — SKILLS. A technical capability record: what I build with, grouped
 * into the engineering layers they actually serve.
 *
 * Reads the aggregated capability data (data/skills.ts) — itself derived
 * from the technologies already evidenced in techStack/projects/experience —
 * so nothing is invented and no proficiency level, year count or
 * certification is claimed. Project references are rendered as name links to
 * each project's own entry, never as restated descriptions.
 */
export function SkillsSection() {
  return (
    <section id="skills" className="site-section" aria-labelledby="skills-title">
      <div className="site-section-gutter">
        <span className="site-section-index">05</span>
      </div>
      <div className="site-section-main">
        <p className="site-section-kicker">Skills</p>
        <h2 id="skills-title" className="site-section-title">
          Capabilities, by layer.
        </h2>
        <div className="site-prose">
          <p className="site-lead site-muted">
            The tooling I work with, grouped by the engineering layer it
            serves — each evidenced by the projects and experience above.
          </p>
        </div>

        <ol className="site-skills">
          {CAPABILITIES.map((group) => (
            <li key={group.id} className="site-skill">
              <div className="site-skill-head">
                <span className="site-skill-number">{group.number}</span>
                <span className="site-skill-tag">{group.tag}</span>
              </div>
              <h3 className="site-skill-name">{group.name}</h3>
              <p className="site-skill-desc">{group.description}</p>
              <dl className="site-skill-spec">
                <div className="site-skill-spec-row">
                  <dt>Technologies</dt>
                  <dd>{group.technologies.join(" · ")}</dd>
                </div>
                {group.projectIds && group.projectIds.length > 0 && (
                  <div className="site-skill-spec-row">
                    <dt>Projects</dt>
                    <dd>
                      {group.projectIds
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
