/**
 * Minimal document footer — the "END OF SHEET" convention of an engineering
 * drawing. Deliberately free of any invented name or claims.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>SHEET 01 · SYSTEM VOLUME</span>
        <span>END OF SHEET</span>
      </div>
    </footer>
  );
}
