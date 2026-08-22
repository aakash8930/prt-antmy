import { AboutSection } from "./sections/AboutSection";
import { ArchitectureSection } from "./sections/ArchitectureSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ContactSection } from "./sections/ContactSection";

/**
 * The structural foundation of the content layer — the same six anchors the
 * Blueprint's floor plan (and the persistent SiteNav) resolve to, in the
 * same order. All six sections are implemented.
 */
export function SiteSections() {
  return (
    <div id="content" className="site-content">
      <AboutSection />
      <ArchitectureSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}
