type SectionPlaceholderProps = {
  id: string;
  index: string;
  label: string;
  hint: string;
};

/**
 * A not-yet-implemented content section. Real anchor (so the Blueprint's
 * floor-plan navigation and the persistent SiteNav resolve to a real
 * heading), real heading for the document outline, and a clearly-marked
 * placeholder so nothing is silently presented as finished.
 */
export function SectionPlaceholder({
  id,
  index,
  label,
  hint,
}: SectionPlaceholderProps) {
  const titleId = `${id}-title`;
  return (
    <section id={id} className="site-section" aria-labelledby={titleId}>
      <div className="site-section-gutter">
        <span className="site-section-index">{index}</span>
      </div>
      <div className="site-section-main">
        <p className="site-section-kicker">{label}</p>
        <h2 id={titleId} className="site-section-title">
          {label}
        </h2>
        <p className="site-placeholder">
          <span className="site-placeholder-tag">Content placeholder</span>
          <span>{hint}</span>
        </p>
      </div>
    </section>
  );
}
