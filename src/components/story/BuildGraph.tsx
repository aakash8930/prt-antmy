import type { ReactNode } from "react";
import type { VisualState } from "@/content/story";

type BuildGraphProps = {
  state: VisualState;
  title: string;
  description: string;
};

type GraphNode = {
  label: string;
  note?: string;
  tone?: "accent" | "external" | "unfinished" | "historical";
};

function Node({ label, note, tone }: GraphNode) {
  return (
    <div className={`graph-node${tone ? ` graph-node--${tone}` : ""}`}>
      <span>{label}</span>
      {note && <small>{note}</small>}
    </div>
  );
}

function Flow({ nodes, className = "" }: { nodes: GraphNode[]; className?: string }) {
  return (
    <div className={`graph-flow ${className}`}>
      {nodes.map((node, index) => (
        <div className="graph-flow-step" key={`${node.label}-${index}`}>
          <Node {...node} />
          {index < nodes.length - 1 && <span className="graph-arrow" aria-hidden="true">→</span>}
        </div>
      ))}
    </div>
  );
}

function CurrentSystem() {
  return (
    <>
      <p className="graph-coordinate">CURRENT CAPABILITY / SIMPLIFIED</p>
      <Flow
        nodes={[
          { label: "Interface", note: "web · mobile" },
          { label: "API", note: "contract" },
          { label: "Service", note: "logic" },
          { label: "Data", note: "state" },
        ]}
      />
      <div className="graph-trace" aria-hidden="true"><span /></div>
      <p className="graph-redline">A working path is visible from the first frame.</p>
    </>
  );
}

function FirstTools() {
  return (
    <div className="graph-split graph-split--tools">
      <div>
        <p className="graph-coordinate">INPUT / FIRST TOOLS</p>
        <Flow
          className="graph-flow--stack"
          nodes={[{ label: "HTML" }, { label: "CSS" }, { label: "JavaScript" }]}
        />
      </div>
      <div className="browser-shell">
        <div className="browser-chrome"><i /><i /><i /></div>
        <div className="browser-content">
          <span>□ Todo</span>
          <span className="tic-grid">× ○ ×<br />○ × ○<br />○ × ×</span>
          <span>Basic websites</span>
        </div>
      </div>
    </div>
  );
}

function SpotifyAssets() {
  return (
    <div className="graph-split graph-split--spotify">
      <div className="browser-shell browser-shell--player">
        <div className="browser-chrome"><i /><i /><i /></div>
        <div className="player-disc" aria-hidden="true" />
        <strong>Spotify clone</strong>
        <span className="player-track">01:42 ━━━━━━━ 03:18</span>
        <span className="player-controls">◀　▶　▶</span>
      </div>
      <div className="asset-tree">
        <p className="graph-coordinate">PROJECT TREE</p>
        <code>/src</code>
        <code className="asset-folder">└─ /assets</code>
        <code>　 ├─ track-01</code>
        <code>　 ├─ track-02</code>
        <code>　 └─ track-03</code>
        <span className="asset-path">assets → player</span>
        <span className="missing-layer">API / BACKEND — NOT PRESENT</span>
      </div>
    </div>
  );
}

function BellyBasketSystem() {
  return (
    <div className="system-map system-map--bellybasket">
      <Node label="Frontend" note="customer surface" />
      <Node label="Admin" note="operational surface" />
      <Node label="Backend" note="shared system core" tone="accent" />
      <Node label="Razorpay" note="external contract" tone="external" />
      <Node label="Location" note="coordinates" />
      <Node label="Maps" note="interpretation" />
      <Node label="Live tracking" note="changing state" />
      <span className="system-map-lines" aria-hidden="true" />
    </div>
  );
}

function ClientConstraints() {
  const records = [
    ["01", "BellyBasket", "delivery system"],
    ["02", "UltraCoreWood", "product presentation"],
    ["03", "Makhana Health King", "commerce"],
    ["04", "PhonePe Autopay", "payment contract"],
    ["05", "SAP HANA automation", "business integration"],
    ["06", "Preschool platform", "role-based software"],
  ];
  return (
    <div className="work-orders">
      <p className="graph-coordinate">INCOMING REQUIREMENTS / ENGINEERING WORKBENCH</p>
      {records.map(([number, name, constraint]) => (
        <div className="work-order" key={number}>
          <span>{number}</span>
          <strong>{name}</strong>
          <small>{constraint}</small>
        </div>
      ))}
      <div className="workbench-output">UNDERSTAND → BUILD → DELIVER</div>
    </div>
  );
}

function CraveCartRebuild() {
  return (
    <div className="rebuild-map">
      <div className="legacy-system">
        <p className="graph-coordinate">INHERITED / INSPECT</p>
        <Node label="Flutter" tone="historical" />
        <span className="graph-arrow graph-arrow--down">↓</span>
        <Node label="PHP / Laravel" tone="historical" />
        <span className="inspection-mark">BUG FIXING</span>
      </div>
      <span className="rebuild-arrow" aria-hidden="true">→</span>
      <div className="shared-system">
        <p className="graph-coordinate">REBUILT / SHARED MODEL</p>
        <div className="role-grid">
          <Node label="Customer" />
          <Node label="Admin" />
          <Node label="Partner" />
          <Node label="Rider" />
        </div>
        <span className="graph-arrow graph-arrow--down">↓</span>
        <Node label="Node.js backend" note="one shared system" tone="accent" />
        <small className="shared-stack">React · React Native</small>
      </div>
    </div>
  );
}

function GenkoLearning() {
  return (
    <div className="loop-map loop-map--learning">
      <p className="graph-coordinate">LEARNER FLOW / ITERATIVE</p>
      <div className="loop-track">
        <Node label="Course" />
        <Node label="Write" />
        <Node label="Listen" />
        <Node label="Quiz" />
        <Node label="AI interaction" />
        <Node label="Continue" tone="unfinished" note="still developing" />
      </div>
      <span className="loop-return">progress informs the next step ↺</span>
    </div>
  );
}

function AiJudgment() {
  return (
    <div className="judgment-map">
      <div className="proposal-stack">
        <Node label="AI systems" note="possible approaches" tone="external" />
        <Node label="Documentation" note="constraints" tone="external" />
        <Node label="Running code" note="actual behavior" tone="external" />
      </div>
      <span className="graph-arrow">→</span>
      <Node label="Engineering judgment" note="understand · compare · inspect" tone="accent" />
      <span className="graph-arrow">→</span>
      <div className="decision-stack">
        <Node label="Accept" />
        <Node label="Revise" />
        <Node label="Reject" />
      </div>
    </div>
  );
}

function QuantxPipeline() {
  return (
    <div className="quantx-map">
      <p className="graph-coordinate">EXPERIMENT / NO PROFITABILITY CLAIM</p>
      <Flow
        nodes={[
          { label: "Market", note: "information" },
          { label: "Analysis" },
          { label: "Model", note: "XGBoost · LSTM", tone: "unfinished" },
          { label: "Decision" },
          { label: "Risk", note: "gate", tone: "accent" },
          { label: "Action / no action" },
        ]}
      />
      <div className="experiment-branches">
        <span>branch A / investigate</span>
        <span>branch B / unresolved</span>
        <span>branch C / continue testing</span>
      </div>
    </div>
  );
}

function BuildLoop() {
  return (
    <div className="loop-map loop-map--build">
      <p className="graph-coordinate">CURRENT METHOD / NON-LINEAR</p>
      <div className="loop-track">
        <Node label="Idea" />
        <Node label="Research" />
        <Node label="Experiment" />
        <Node label="Build" tone="accent" />
        <Node label="Break" />
        <Node label="Research again" />
        <Node label="Try another approach" />
        <Node label="Debug" />
        <Node label="Build further" tone="unfinished" />
      </div>
      <span className="loop-return">AI + other tools can enter throughout the loop ↺</span>
    </div>
  );
}

const graphByState: Record<VisualState, () => ReactNode> = {
  "current-system": CurrentSystem,
  "first-tools": FirstTools,
  "spotify-assets": SpotifyAssets,
  "bellybasket-system": BellyBasketSystem,
  "client-constraints": ClientConstraints,
  "cravecart-rebuild": CraveCartRebuild,
  "genko-learning": GenkoLearning,
  "ai-judgment": AiJudgment,
  "quantx-pipeline": QuantxPipeline,
  "build-loop": BuildLoop,
};

export function BuildGraph({ state, title, description }: BuildGraphProps) {
  const Graph = graphByState[state];

  return (
    <figure className={`build-graph build-graph--${state}`} aria-labelledby={`${state}-caption`}>
      <div className="graph-frame" aria-hidden="true">
        <span className="graph-corner graph-corner--tl" />
        <span className="graph-corner graph-corner--tr" />
        <span className="graph-corner graph-corner--bl" />
        <span className="graph-corner graph-corner--br" />
        <Graph />
      </div>
      <figcaption id={`${state}-caption`}>
        <span>{title}</span>
        {description}
      </figcaption>
    </figure>
  );
}
