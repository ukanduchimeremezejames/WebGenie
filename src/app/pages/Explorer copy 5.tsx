import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { Core } from "cytoscape";

import {
  computeDegrees,
  computeInfluence,
  computeModules,
  applyNodeStyles,
  highlightNeighbors,
} from "../components/analytics"; // adjust path

// -----------------------------
// Types
// -----------------------------

type Edge = {
  source: string;
  target: string;
  score?: number;
};

type ExplorerProps = {
  mockEdges: Edge[];
};

// -----------------------------
// Explorer Component
// -----------------------------

// export default function Explorer({ mockEdges }: ExplorerProps) {
// export default function Explorer({ mockEdges }: ExplorerProps) {
export default function Explorer({ mockEdges = [] }: Partial<ExplorerProps>) {
  const cyRef = useRef<Core | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const [graphElements, setGraphElements] = useState<any[]>([]);
  const [scoreThreshold, setScoreThreshold] = useState<number>(0.5);
  const [layout, setLayout] = useState<string>("cose");
  const [hopDepth, setHopDepth] = useState<number>(1);

  const [degrees, setDegrees] = useState<Record<string, number>>({});
  const [influence, setInfluence] = useState<Record<string, number>>({});
  const [modules, setModules] = useState<Record<string, number>>({});
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // -----------------------------
  // Mode Detection
  // -----------------------------

  const isGraphMLMode = graphElements.length > 0;

  // -----------------------------
  // Filtered Edges (Mock Mode)
  // -----------------------------

  const filteredEdges = useMemo(() => {
    return mockEdges.filter(e => (e.score ?? 1) >= scoreThreshold);
  }, [mockEdges, scoreThreshold]);

  // -----------------------------
  // Convert Mock Edges to Cytoscape Elements
  // -----------------------------

  const mockElements = useMemo(() => {
    const nodes = new Set<string>();
    filteredEdges.forEach(e => {
      nodes.add(e.source);
      nodes.add(e.target);
    });

    return [
      ...Array.from(nodes).map(id => ({
        data: { id, label: id },
      })),
      ...filteredEdges.map((e, i) => ({
        data: {
          id: `e-${i}`,
          source: e.source,
          target: e.target,
          score: e.score,
        },
      })),
    ];
  }, [filteredEdges]);

  // -----------------------------
  // Active Elements
  // -----------------------------

  const elements = isGraphMLMode ? graphElements : mockElements;

  // -----------------------------
  // Analytics Pipeline
  // -----------------------------

  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cyRef.current;

    let edges: Edge[];
    let nodeIds: string[];

    if (isGraphMLMode) {
      edges = cy.edges().map(e => ({
        source: e.source().id(),
        target: e.target().id(),
      }));

      nodeIds = cy.nodes().map(n => n.id());
    } else {
      edges = filteredEdges;
      nodeIds = Array.from(
        new Set(edges.flatMap(e => [e.source, e.target]))
      );
    }

    const deg = computeDegrees(edges);
    const inf = computeInfluence(deg);
    const mods = computeModules(nodeIds, edges);

    setDegrees(deg);
    setInfluence(inf);
    setModules(mods);

    applyNodeStyles(cy, deg, inf, mods);

  }, [filteredEdges, graphElements, hopDepth]);

  // -----------------------------
  // GraphML Loader
  // -----------------------------

  const loadGraphML = useCallback(async (file: File) => {
    const text = await file.text();

    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../workers/graphmlWorker.ts", import.meta.url),
        { type: "module" }
      );
    }

    workerRef.current.postMessage(text);

    workerRef.current.onmessage = (event) => {
      setGraphElements(event.data);
    };
  }, []);

  // -----------------------------
  // Cytoscape Stylesheet
  // -----------------------------

  const stylesheet = useMemo(() => [
    {
      selector: "node",
      style: {
        label: "data(label)",
        "font-size": 10,
        width: 20,
        height: 20,
        "background-color": "#3b82f6",
      },
    },
    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": "#ccc",
      },
    },
    {
      selector: ".highlight",
      style: {
        "background-color": "#f97316",
      },
    },
  ], []);

  // -----------------------------
  // Layout Selection
  // -----------------------------

  const layoutConfig = useMemo(() => {
    if (isGraphMLMode) {
      return { name: "preset" }; // safest for large GraphML
    }

    return {
      name: layout,
      animate: false,
    };
  }, [isGraphMLMode, layout]);

  // -----------------------------
  // Render
  // -----------------------------

  return (
    <div className="flex gap-6">

      {/* Sidebar */}
      <div className="w-64 space-y-4">

        <div>
          <label className="text-sm font-medium">Score Threshold</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={scoreThreshold}
            onChange={e => setScoreThreshold(Number(e.target.value))}
            disabled={isGraphMLMode}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Hop Depth</label>
          <input
            type="number"
            value={hopDepth}
            min={1}
            max={5}
            onChange={e => setHopDepth(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Layout</label>
          <select
            value={layout}
            onChange={e => setLayout(e.target.value)}
            disabled={isGraphMLMode}
          >
            <option value="cose">COSE</option>
            <option value="grid">Grid</option>
            <option value="circle">Circle</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Load GraphML</label>
          <input
            type="file"
            accept=".graphml"
            onChange={e => {
              if (e.target.files?.[0]) {
                loadGraphML(e.target.files[0]);
              }
            }}
          />
        </div>

        {selectedNode && (
          <div className="text-xs mt-4 p-2 border rounded">
            <div><strong>ID:</strong> {selectedNode.id}</div>
            <div><strong>Degree:</strong> {degrees[selectedNode.id] ?? 0}</div>
            <div><strong>Influence:</strong> {influence[selectedNode.id] ?? 0}</div>
            <div><strong>Module:</strong> {modules[selectedNode.id] ?? "-"}</div>
          </div>
        )}

      </div>

      {/* Graph Area */}
      <div className="flex-1 h-[700px] border rounded">

        <CytoscapeComponent
          cy={(cy) => {
            if (!cyRef.current) {
              cyRef.current = cy;

              cy.on("tap", "node", (evt) => {
                const node = evt.target;
                setSelectedNode(node.data());
                highlightNeighbors(cy, node.id(), hopDepth);
              });
            }
          }}
          elements={elements}
          stylesheet={stylesheet}
          layout={layoutConfig}
          style={{ width: "100%", height: "100%" }}
        />

      </div>
    </div>
  );
}
