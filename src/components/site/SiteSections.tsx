import { PROJECTS, ARCHITECTURE_LABEL } from "@/components/blueprint/data/projects";
import { TECH_STACK } from "@/components/blueprint/data/techStack";
import { PLATE_ORDER } from "@/components/blueprint/constants/geometry";

/**
 * The real destinations the floor plan points at. Content here is
 * deliberately minimal scaffolding, not a finished page — PROJECTS and
 * SKILLS pull from the same data/ config the blueprint itself uses (see
 * data/projects.ts, data/techStack.ts) so the two never drift apart.
 * ABOUT / EXPERIENCE / CONTACT are placeholders — replace the copy marked
 * below with real content.
 */
export function SiteSections() {
  return (
    <div className="site-sections">
      <section id="about" className="site-section">
        <h2 className="site-section-heading">01 / About</h2>
        {/* Placeholder — replace with a real bio. */}
        <p className="site-section-body">
          I design and build full-stack systems end to end — data layer, backend
          services, APIs, frontend, and the infrastructure that runs them.
        </p>
      </section>

      <section id="architecture" className="site-section">
        <h2 className="site-section-heading">02 / Architecture</h2>
        <p className="site-section-body">
          The blueprint above is how I actually think about a system: five
          layers, each with a clear boundary to the next.
        </p>
        <dl className="site-tech-list">
          {PLATE_ORDER.map((id) => (
            <div key={id} className="site-tech-row">
              <dt>{TECH_STACK[id].heading}</dt>
              <dd>{TECH_STACK[id].items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="projects" className="site-section">
        <h2 className="site-section-heading">03 / Projects</h2>
        <ul className="site-project-list">
          {PROJECTS.map((project) => (
            <li key={project.id} className="site-project-row">
              <span className="site-project-name">{project.name}</span>
              <span className="site-project-meta">
                {project.category} — {ARCHITECTURE_LABEL[project.architectureArea]}
              </span>
              <p className="site-project-desc">{project.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="skills" className="site-section">
        <h2 className="site-section-heading">04 / Skills</h2>
        <dl className="site-tech-list">
          {PLATE_ORDER.map((id) => (
            <div key={id} className="site-tech-row">
              <dt>{id.toUpperCase()}</dt>
              <dd>{TECH_STACK[id].items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="experience" className="site-section">
        <h2 className="site-section-heading">05 / Experience</h2>
        {/* Placeholder — replace with a real work-history list. */}
        <p className="site-section-body">
          Work history goes here — roles, companies, dates.
        </p>
      </section>

      <section id="contact" className="site-section">
        <h2 className="site-section-heading">06 / Contact</h2>
        {/* Placeholder — replace with real contact details. */}
        <p className="site-section-body">
          Reach out at <a href="mailto:hello@example.com">hello@example.com</a>.
        </p>
      </section>
    </div>
  );
}
