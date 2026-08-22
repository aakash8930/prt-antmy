/**
 * 02 — ARCHITECTURE. Explains the engineering philosophy the Blueprint
 * represents, as a method rather than five cards. The Blueprint already
 * visualizes the five layers; this section is the reasoning behind them —
 * how a system actually gets approached, not another rendering of the
 * plates.
 */
export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="site-section"
      aria-labelledby="architecture-title"
    >
      <div className="site-section-gutter">
        <span className="site-section-index">02</span>
      </div>
      <div className="site-section-main">
        <p className="site-section-kicker">Architecture</p>
        <h2 id="architecture-title" className="site-section-title">
          The boundary is the design.
        </h2>
        <div className="site-prose">
          <p className="site-lead">
            I think of a system as five layers — data, backend, APIs,
            frontend, infrastructure — but the layers are shorthand. The
            architecture is the contract at each seam: what a layer owns,
            what it promises the layer above, and what it may assume about
            the layer below.
          </p>
        </div>
        <ol className="site-method">
          <li>
            <div>
              <span className="site-method-step">Specify</span>
              <p className="site-method-desc">
                Define the seams and their contracts before writing code. A
                layer is specified by its interface, not its implementation.
              </p>
            </div>
          </li>
          <li>
            <div>
              <span className="site-method-step">Separate</span>
              <p className="site-method-desc">
                Keep the layers independent enough that each can be reasoned
                about, tested, and changed in isolation.
              </p>
            </div>
          </li>
          <li>
            <div>
              <span className="site-method-step">Verify</span>
              <p className="site-method-desc">
                Prove each layer against real evidence — data, tests, running
                artifacts — not assumptions.
              </p>
            </div>
          </li>
          <li>
            <div>
              <span className="site-method-step">Reconcile</span>
              <p className="site-method-desc">
                Reintegrate the pieces into one system and confirm the
                assembled whole still holds.
              </p>
            </div>
          </li>
        </ol>
        <div className="site-prose" style={{ marginTop: "var(--site-space-6)" }}>
          <p className="site-muted">
            Across all five layers the rule is the same: a layer is judged by
            the contract it keeps, not the volume of code it contains.
          </p>
        </div>
      </div>
    </section>
  );
}
