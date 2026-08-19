import { FLOOR_PLAN_ZONES } from "@/components/blueprint/constants/geometry";

/**
 * The floor plan's persistent afterlife: once the visitor scrolls past the
 * blueprint centerpiece, this sticky bar is what the six zones become for
 * the rest of the normal page. Same six destinations, same order, plain
 * HTML — no dependency on the SVG/animation having run at all, so it works
 * identically under prefers-reduced-motion or JS-disabled rendering.
 */
export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Site sections">
      <div className="site-nav-inner">
        <span className="site-nav-mark">SHEET 01</span>
        <ul className="site-nav-list">
          {FLOOR_PLAN_ZONES.map((zone) => (
            <li key={zone.id}>
              <a href={zone.href}>{zone.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
