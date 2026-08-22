"use client";

import Link from "next/link";
import { useState } from "react";
import { BuildGraphCanvas } from "./BuildGraphCanvas";
import {
  BUILD_GRAPH_STATE_GUIDE,
  type BuildGraphState,
} from "./model";

export function BuildGraphLab() {
  const [state, setState] = useState<BuildGraphState>("current");
  const active = BUILD_GRAPH_STATE_GUIDE.find((item) => item.state === state)!;

  return (
    <main className="graph-lab">
      <header className="graph-lab-header">
        <Link href="/" className="graph-lab-back">← Static story</Link>
        <p className="graph-lab-kicker">Phase 2 / Visual prototype only</p>
        <h1>The Living Build Graph</h1>
        <p className="graph-lab-intro">
          A semantic topology for showing how an application grows into a system—and how
          research, tools, and judgment turn possibilities into working software.
        </p>
      </header>

      <section className="graph-lab-controls" aria-labelledby="state-control-title">
        <div>
          <p className="graph-lab-label">Developer control</p>
          <h2 id="state-control-title">Choose a semantic state</h2>
        </div>
        <div className="graph-state-buttons" role="group" aria-label="Build graph state">
          {BUILD_GRAPH_STATE_GUIDE.map((item) => (
            <button
              key={item.state}
              type="button"
              className={item.state === state ? "is-active" : ""}
              aria-pressed={item.state === state}
              onClick={() => setState(item.state)}
            >
              <span>{item.index}</span>
              {item.shortName ?? item.name}
            </button>
          ))}
        </div>
        <p className="graph-state-announcement" aria-live="polite">
          <span>State {active.index}</span>
          <strong>{active.name}</strong>
          {active.description}
        </p>
      </section>

      <section className="composition-study composition-study--type" aria-labelledby="type-study-title">
        <div className="composition-number">COMPOSITION / 01</div>
        <div className="type-study-copy">
          <p className="graph-lab-label">Typography-integrated</p>
          <h2 id="type-study-title">A system is more than one screen.</h2>
          <p>
            The graph occupies the same field as the proposition. Text establishes the idea;
            topology makes the relationship visible.
          </p>
        </div>
        <BuildGraphCanvas
          state={state}
          instanceId="type-study"
          context={{
            chapter: "PROTOTYPE CONTEXT",
            annotations: [active.thesis.toUpperCase()],
          }}
        />
      </section>

      <section className="composition-study composition-study--wide" aria-labelledby="wide-study-title">
        <div className="composition-study-head">
          <div>
            <p className="graph-lab-label">Full-width diagrammatic</p>
            <h2 id="wide-study-title">Let the relationship become the content.</h2>
          </div>
          <p>
            This mode gives architecture enough space to explain itself without becoming a
            permanent visual column.
          </p>
        </div>
        <BuildGraphCanvas state={state} instanceId="wide-study" />
      </section>

      <section className="composition-study composition-study--inline" aria-labelledby="inline-study-title">
        <div className="composition-number">COMPOSITION / 03</div>
        <article>
          <p className="graph-lab-label">Embedded in the narrative</p>
          <h2 id="inline-study-title">The diagram interrupts only when the relationship matters.</h2>
          <p>
            A project can begin as one interface. The work changes when several independent
            responsibilities have to agree.
          </p>
          <BuildGraphCanvas state={state} instanceId="inline-study" compact />
          <p>
            The story then resumes with a concrete consequence: architecture is no longer a
            label for the stack; it is the agreement between these parts.
          </p>
        </article>
      </section>

      <section className="graph-state-guide" aria-labelledby="state-guide-title">
        <p className="graph-lab-label">Semantic fallback</p>
        <h2 id="state-guide-title">What the four states must communicate</h2>
        <ol>
          {BUILD_GRAPH_STATE_GUIDE.map((item) => (
            <li key={item.state}>
              <span>{item.index}</span>
              <div>
                <h3>{item.name}</h3>
                <strong>{item.thesis}</strong>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
