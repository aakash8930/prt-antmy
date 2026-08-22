import type { CSSProperties } from "react";
import {
  BUILD_GRAPH_STATES,
  resolveBuildGraph,
  type BuildGraphDefinition,
  type BuildGraphState,
  type GraphEdge,
  type GraphNode,
  type GraphNodeId,
  type GraphViewport,
} from "./model";

type BuildGraphCanvasProps = {
  state: BuildGraphState;
  instanceId: string;
  compact?: boolean;
  showStateLabel?: boolean;
  context?: {
    chapter?: string;
    annotations?: string[];
  };
};

const DEFINITIONS_BY_VIEWPORT: Record<
  GraphViewport,
  Map<BuildGraphState, BuildGraphDefinition>
> = {
  desktop: new Map(
    BUILD_GRAPH_STATES.map((state) => [state, resolveBuildGraph(state, "desktop")]),
  ),
  mobile: new Map(
    BUILD_GRAPH_STATES.map((state) => [state, resolveBuildGraph(state, "mobile")]),
  ),
};

function collectFallbackNodes(
  definitions: Map<BuildGraphState, BuildGraphDefinition>,
): Map<GraphNodeId, GraphNode> {
  const nodes = new Map<GraphNodeId, GraphNode>();
  for (const definition of definitions.values()) {
    for (const graphNode of definition.nodes) {
      if (!nodes.has(graphNode.id)) nodes.set(graphNode.id, graphNode);
    }
  }
  return nodes;
}

const FALLBACK_NODES_BY_VIEWPORT: Record<GraphViewport, Map<GraphNodeId, GraphNode>> = {
  desktop: collectFallbackNodes(DEFINITIONS_BY_VIEWPORT.desktop),
  mobile: collectFallbackNodes(DEFINITIONS_BY_VIEWPORT.mobile),
};

const ALL_NODE_IDS = Array.from(
  new Set([
    ...FALLBACK_NODES_BY_VIEWPORT.desktop.keys(),
    ...FALLBACK_NODES_BY_VIEWPORT.mobile.keys(),
  ]),
);

function nodeMap(definition: BuildGraphDefinition): Map<GraphNodeId, GraphNode> {
  return new Map(definition.nodes.map((node) => [node.id, node]));
}

function edgePath(edge: GraphEdge, nodes: Map<GraphNodeId, GraphNode>): string {
  const from = nodes.get(edge.from);
  const to = nodes.get(edge.to);
  if (!from || !to) return "";

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) < 12 || Math.abs(dy) < 12) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  if (edge.kind === "feedback") {
    const bendY = Math.max(from.y, to.y) + 70;
    return `M ${from.x} ${from.y} C ${from.x} ${bendY}, ${to.x} ${bendY}, ${to.x} ${to.y}`;
  }

  const middleX = from.x + dx * 0.52;
  return `M ${from.x} ${from.y} C ${middleX} ${from.y}, ${middleX} ${to.y}, ${to.x} ${to.y}`;
}

function NodeGlyph({ node, active }: { node: GraphNode; active: boolean }) {
  const width = node.width ?? 130;
  const height = node.detail ? 68 : 56;

  return (
    <g
      className={`lbg-node lbg-node--${node.type}${node.emphasis ? ` lbg-node--${node.emphasis}` : ""}${active ? " is-active" : ""}`}
      style={{
        "--node-x": `${active ? node.x : 600}px`,
        "--node-y": `${active ? node.y : 350}px`,
        "--node-scale": active ? 1 : 0.72,
      } as CSSProperties}
    >
      <rect x={-width / 2} y={-height / 2} width={width} height={height} rx="2" />
      <path className="lbg-node-notch" d={`M ${-width / 2} ${-height / 2 + 12} h 9 v -9`} />
      <circle className="lbg-node-port" cx={-width / 2} cy="0" r="3" />
      <circle className="lbg-node-port" cx={width / 2} cy="0" r="3" />
      <text className="lbg-node-label" textAnchor="middle" y={node.detail ? -3 : 4}>
        {node.label}
      </text>
      {node.detail && (
        <text className="lbg-node-detail" textAnchor="middle" y="17">
          {node.detail}
        </text>
      )}
      <text className="lbg-node-type" x={-width / 2 + 8} y={-height / 2 + 12}>
        {node.type.slice(0, 3).toUpperCase()}
      </text>
    </g>
  );
}

function GraphSvg({
  state,
  viewport,
  showStateLabel,
}: {
  state: BuildGraphState;
  viewport: GraphViewport;
  showStateLabel: boolean;
}) {
  const active = DEFINITIONS_BY_VIEWPORT[viewport].get(state)!;
  const activeNodes = nodeMap(active);
  const fallbackNodes = FALLBACK_NODES_BY_VIEWPORT[viewport];
  const allDefinitions = Array.from(DEFINITIONS_BY_VIEWPORT[viewport].values());

  const isMobile = viewport === "mobile";
  const canvasWidth = isMobile ? 390 : 1200;
  const canvasHeight = active.canvasHeight ?? (isMobile ? 930 : 700);
  const viewBox = `0 0 ${canvasWidth} ${canvasHeight}`;

  return (
    <svg
      className={`lbg-svg lbg-svg--${viewport}`}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={`lbg-grid-${viewport}`} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" className="lbg-grid-line" />
        </pattern>
        <marker
          id={`lbg-arrow-${viewport}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="lbg-arrow-head" />
        </marker>
      </defs>

      <rect width="100%" height="100%" className="lbg-canvas-bg" />
      <rect width="100%" height="100%" fill={`url(#lbg-grid-${viewport})`} />

      <g className="lbg-registration">
        <path d={isMobile ? "M 18 32 h 24 M 30 20 v 24" : "M 24 32 h 26 M 37 19 v 26"} />
        <path d={isMobile ? "M 348 32 h 24 M 360 20 v 24" : "M 1150 32 h 26 M 1163 19 v 26"} />
      </g>

      <text x={isMobile ? 20 : 38} y={isMobile ? 58 : 67} className="lbg-sheet-label">
        {active.annotation}
      </text>
      {showStateLabel && (
        <text x={isMobile ? 370 : 1162} y={isMobile ? 58 : 67} textAnchor="end" className="lbg-sheet-index">
          STATE {active.index}
        </text>
      )}

      {active.groups && (
        <g className="lbg-groups" key={`groups-${state}-${viewport}`}>
          {active.groups.map((group) => (
            <g key={group.id} className={`lbg-group lbg-group--${group.tone ?? "default"}`}>
              <rect x={group.x} y={group.y} width={group.width} height={group.height} rx="2" />
              <text x={group.x + 12} y={group.y + 18}>{group.label}</text>
              <path d={`M ${group.x} ${group.y + 28} h 28`} />
            </g>
          ))}
        </g>
      )}

      <g className="lbg-edges">
        {allDefinitions.flatMap((definition) => {
          const nodes = nodeMap(definition);
          return definition.edges.map((edge) => (
            <path
              key={`${definition.state}-${edge.id}`}
              d={edgePath(edge, nodes)}
              className={`lbg-edge lbg-edge--${edge.kind ?? "primary"}${definition.state === state ? " is-active" : ""}`}
              markerEnd={`url(#lbg-arrow-${viewport})`}
            />
          ));
        })}
      </g>

      <g className="lbg-nodes">
        {ALL_NODE_IDS.map((id) => {
          const graphNode = activeNodes.get(id) ?? fallbackNodes.get(id);
          if (!graphNode) return null;
          return <NodeGlyph key={id} node={graphNode} active={activeNodes.has(id)} />;
        })}
      </g>

      <g className="lbg-events">
        {active.events.map((event) => {
          const from = activeNodes.get(event.from);
          const to = activeNodes.get(event.to);
          if (!from || !to) return null;
          return (
            <circle
              key={`${state}-${event.id}`}
              r="5"
              className="lbg-event"
              style={{
                "--event-from-x": `${from.x}px`,
                "--event-from-y": `${from.y}px`,
                "--event-to-x": `${to.x}px`,
                "--event-to-y": `${to.y}px`,
                "--event-delay": `${event.delay ?? 0}s`,
                transform: `translate(${to.x}px, ${to.y}px)`,
              } as CSSProperties}
            />
          );
        })}
      </g>

      {active.callouts && (
        <g className="lbg-callouts" key={`callouts-${state}-${viewport}`}>
          {active.callouts.map((callout) => (
            <g
              key={callout.id}
              className={`lbg-callout lbg-callout--${callout.tone ?? "muted"}`}
              transform={`translate(${callout.x} ${callout.y})`}
            >
              <line x1="-12" x2="12" y1="-9" y2="-9" />
              <text textAnchor={callout.x > canvasWidth * 0.72 ? "end" : callout.x < canvasWidth * 0.28 ? "start" : "middle"}>
                {callout.text}
              </text>
            </g>
          ))}
        </g>
      )}

      <g className="lbg-axis-note">
        <line x1={isMobile ? 20 : 38} x2={isMobile ? 370 : 1162} y1={canvasHeight - 35} y2={canvasHeight - 35} />
        <text x={isMobile ? 20 : 38} y={canvasHeight - 16}>SEMANTIC STATE → GEOMETRY → CONNECTION → EMPHASIS</text>
      </g>
    </svg>
  );
}

export function BuildGraphCanvas({
  state,
  instanceId,
  compact = false,
  showStateLabel = true,
  context,
}: BuildGraphCanvasProps) {
  const definition = resolveBuildGraph(state, "desktop");
  const captionId = `${instanceId}-caption`;

  return (
    <figure
      className={`living-build-graph${compact ? " living-build-graph--compact" : ""}`}
      data-state={state}
      aria-labelledby={captionId}
    >
      <div className="lbg-frame">
        <GraphSvg state={state} viewport="desktop" showStateLabel={showStateLabel} />
        <GraphSvg state={state} viewport="mobile" showStateLabel={showStateLabel} />
        {(context?.chapter || (context?.annotations && context.annotations.length > 0)) && (
          <div className="lbg-context" aria-hidden="true">
            {context.chapter && <span>{context.chapter}</span>}
            {context.annotations?.map((annotation) => (
              <mark key={annotation}>{annotation}</mark>
            ))}
          </div>
        )}
      </div>
      <figcaption id={captionId}>
        <span>
          {showStateLabel ? `State ${definition.index} · ` : ""}{definition.name}
        </span>
        <strong>{definition.thesis}</strong>
        <p>{definition.description}</p>
      </figcaption>
    </figure>
  );
}
