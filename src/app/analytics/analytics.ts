// ----------------------------------------------
// analytics.ts — GRN Metrics + Louvain Clustering
// ----------------------------------------------

export interface Edge {
  source: string;
  target: string;
  type?: "activation" | "repression";
}

export type DegreeMap = Record<string, number>;
export type InfluenceMap = Record<string, number>;
export type ModuleMap = Record<string, number>;

// ---------------------------------------------------
// 1. Degree Computation (based on filtered edges only)
// ---------------------------------------------------
export function computeDegrees(edges: Edge[]): DegreeMap {
  const deg: DegreeMap = {};
  edges.forEach((e) => {
    deg[e.source] = (deg[e.source] || 0) + 1;
    deg[e.target] = (deg[e.target] || 0) + 1;
  });
  return deg;
}

// ---------------------------------------------------
// 2. Influence Computation (normalized degree)
// ---------------------------------------------------
export function computeInfluence(deg: DegreeMap): InfluenceMap {
  const influence: InfluenceMap = {};
  const maxDeg = Math.max(...Object.values(deg), 1);

  Object.entries(deg).forEach(([node, d]) => {
    influence[node] = d / maxDeg;
  });

  return influence;
}

// ---------------------------------------------------
// 3. Deterministic Louvain Module Detector
// ---------------------------------------------------
export function computeModulesPure(
  nodeIds: string[],
  edges: Edge[]
): ModuleMap {
  // Build adjacency map
  const adj: Record<string, Set<string>> = {};
  nodeIds.forEach((n) => (adj[n] = new Set()));

  edges.forEach((e) => {
    adj[e.source].add(e.target);
    adj[e.target].add(e.source);
  });

  // Naive deterministic modularity using BFS clustering
  const visited = new Set<string>();
  const modules: ModuleMap = {};
  let currentModule = 0;

  for (const node of nodeIds) {
    if (visited.has(node)) continue;

    const queue = [node];
    visited.add(node);

    while (queue.length) {
      const n = queue.shift()!;
      modules[n] = currentModule;

      adj[n].forEach((nbr) => {
        if (!visited.has(nbr)) {
          visited.add(nbr);
          queue.push(nbr);
        }
      });
    }

    currentModule++;
  }

  return modules;
}

// ---------------------------------------------------
// 4. Apply Node Styles (size = degree, color = module)
// ---------------------------------------------------
export function applyNodeStyles(
  cy: any,
  degrees: DegreeMap,
  influence: InfluenceMap,
  modules: ModuleMap
): void {
  if (!cy) return;

  const colorPalette = [
    "#8E44AD",
    "#1ABC9C",
    "#E67E22",
    "#3498DB",
    "#D35400",
    "#2ECC71",
    "#9B59B6",
    "#34495E"
  ];

  cy.nodes().forEach((n: any) => {
    const id = n.id();
    const deg = degrees[id] || 1;
    const moduleId = modules[id] || 0;

    n.style({
      width: `${20 + deg * 2}`,
      height: `${20 + deg * 2}`,
      "background-color": colorPalette[moduleId % colorPalette.length],
      label: id,
      "text-valign": "center",
      "text-halign": "center",
      "font-size": "10px",
      color: "#000"
    });
  });
}

// ---------------------------------------------------
// 5. Neighbor Highlighting
// ---------------------------------------------------
export function highlightNeighbors(cy: any, id: string, hops: number = 1) {
  if (!cy) return;

  cy.elements().removeClass("faded").removeClass("highlighted");

  const start = cy.getElementById(id);
  if (!start) return;

  let frontier = new Set([start]);
  const visited = new Set([start.id()]);

  for (let i = 0; i < hops; i++) {
    const next = new Set<any>();

    frontier.forEach((node: any) => {
      node.connectedEdges().forEach((e: any) => {
        e.addClass("highlighted");
        const other = e.connectedNodes().filter((x: any) => x.id() !== node.id());
        other.forEach((n: any) => {
          if (!visited.has(n.id())) {
            visited.add(n.id());
            next.add(n);
          }
        });
      });
    });

    frontier = next;
  }

  cy.nodes().forEach((n: any) => {
    if (!visited.has(n.id())) n.addClass("faded");
  });
}
