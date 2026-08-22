import {
  PROJECTS,
  ARCHITECTURE_LABEL,
} from "@/components/blueprint/data/projects";

/**
 * Strip protocol / www / trailing slash from a URL for compact, technical
 * display — the full href is always preserved on the link itself.
 */
function displayUrl(url: string): string {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
}

/**
 * 03 — PROJECTS. The evidence layer: "what have I actually built?"
 *
 * Renders the real project data from data/projects.ts (the same single
 * source the Blueprint's EVIDENCE/PROOF phases read), so the two never
 * drift apart. No cards, no screenshots, no invented claims — each project
 * is presented as a documented system: number + type, then the name and
 * description as the dominant content, with system/stack/role as secondary
 * mono metadata and real LIVE/SOURCE links when they exist.
 *
 * Every optional field (role, liveUrl, githubUrl, systemNarrative) is
 * rendered only when present; when absent the row is omitted entirely — the
 * Projects section contains no placeholder text.
 */
export function ProjectsSection() {
  return (
    <section id="projects" className="site-section" aria-labelledby="projects-title">
      <div className="site-section-gutter">
        <span className="site-section-index">03</span>
      </div>
      <div className="site-section-main">
        <p className="site-section-kicker">Projects</p>
        <h2 id="projects-title" className="site-section-title">
          What I&rsquo;ve built.
        </h2>
        <div className="site-prose">
          <p className="site-lead site-muted">
            Documented below as evidence — what each system does, how it is
            structured, and what it runs on.
          </p>
        </div>

        <ol className="site-projects">
          {PROJECTS.map((project) => (
            <li key={project.id} className="site-project">
              <div className="site-project-head">
                <span className="site-project-number">{project.number}</span>
                <span className="site-project-type">{project.category}</span>
              </div>
              <h3 id={`project-${project.id}`} className="site-project-name">
                {project.name}
              </h3>
              <p className="site-project-desc">{project.description}</p>
              {project.systemNarrative && (
                <p className="site-project-narrative">{project.systemNarrative}</p>
              )}
              <dl className="site-project-spec">
                <div className="site-project-spec-row">
                  <dt>System</dt>
                  <dd>{ARCHITECTURE_LABEL[project.architectureArea]}</dd>
                </div>
                <div className="site-project-spec-row">
                  <dt>Stack</dt>
                  <dd>{project.technologies.join(" · ")}</dd>
                </div>
                {project.role && (
                  <div className="site-project-spec-row">
                    <dt>Role</dt>
                    <dd>{project.role}</dd>
                  </div>
                )}
                {project.liveUrl && (
                  <div className="site-project-spec-row">
                    <dt>Live</dt>
                    <dd>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {displayUrl(project.liveUrl)}
                      </a>
                    </dd>
                  </div>
                )}
                {project.githubUrl && (
                  <div className="site-project-spec-row">
                    <dt>Source</dt>
                    <dd>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {displayUrl(project.githubUrl)}
                      </a>
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
