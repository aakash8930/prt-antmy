import type { StoryChapter as StoryChapterModel } from "@/content/story";
import { BuildGraph } from "./BuildGraph";

type StoryChapterProps = {
  chapter: StoryChapterModel;
  projectEntry?: boolean;
  integrated?: boolean;
};

export function StoryChapter({
  chapter,
  projectEntry = false,
  integrated = false,
}: StoryChapterProps) {
  const titleId = `${chapter.id}-title`;
  const content = (
    <div className="chapter-copy">
      <div className="chapter-heading">
        {chapter.layout === "hero" && (
          <div className="hero-identity">
            <h1>Aakash Singh</h1>
            <p>Full-Stack Software Developer</p>
          </div>
        )}
        <p className="chapter-kicker">
          <span>{chapter.number}</span>
          <span>{chapter.navLabel}</span>
        </p>
        <h2 id={titleId} tabIndex={-1}>{chapter.title}</h2>
        <p className="chapter-message">{chapter.message}</p>
      </div>

      <div className="chapter-prose">
        {chapter.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {chapter.quote && <blockquote>{chapter.quote}</blockquote>}

      <div className="evidence-record">
        <div className="evidence-record-head">
          <span>{chapter.evidenceLabel}</span>
          {chapter.status && <strong>{chapter.status}</strong>}
        </div>
        <ul>
          {chapter.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {chapter.links && (
          <div className="chapter-links">
            {chapter.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.label}
                {link.external && <span aria-hidden="true"> ↗</span>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const visual = (
    <BuildGraph
      state={chapter.visualState}
      title={chapter.visualTitle}
      description={chapter.visualDescription}
    />
  );

  return (
    <section
      id={chapter.id}
      className={`story-chapter story-chapter--${chapter.layout}${
        integrated ? " story-chapter--integrated" : ""
      }`}
      aria-labelledby={titleId}
      data-integrated-chapter={integrated ? "true" : undefined}
    >
      {projectEntry && <span id="projects" className="anchor-target" aria-hidden="true" />}
      {!integrated && (
        <div className="chapter-progress" aria-hidden="true">
          <span>{chapter.number}</span>
          <i />
          <span>09</span>
        </div>
      )}
      {integrated ? (
        content
      ) : chapter.layout === "diagram" || chapter.layout === "inspection" ? (
        <>
          {content}
          {visual}
        </>
      ) : chapter.layout === "record" || chapter.layout === "process" ? (
        <>
          {visual}
          {content}
        </>
      ) : (
        <>
          {content}
          {visual}
        </>
      )}
    </section>
  );
}
