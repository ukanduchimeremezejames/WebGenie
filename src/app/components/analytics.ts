// analytics.ts
// Utility functions for GRN analytics & Cytoscape styling

import cytoscape from "cytoscape";


/* -----------------------------------------------------
   1. DEGREE CENTRALITY
----------------------------------------------------- */
// export function computeDegrees(edges: any[]) {
//   const degrees: Record<string, { in: number; out: number; total: number }> = {};

//   edges.forEach((edge) => {
//     const src = edge.source;
//     const tgt = edge.target;

//     if (!degrees[src]) degrees[src] = { in: 0, out: 0, total: 0 };
//     if (!degrees[tgt]) degrees[tgt] = { in: 0, out: 0, total: 0 };

//     degrees[src].out += 1;
//     degrees[tgt].in += 1;
//   });

//   Object.keys(degrees).forEach((node) => {
//     degrees[node].total = degrees[node].in + degrees[node].out;
//   });

//   // → Returns: { SOX2: { in: X, out: Y, total: Z }, ... }
//   return degrees;
// }

/* -----------------------------------------------------
   2. INFLUENCE SCORE
   Combines:
   - consensus score strength
   - support_count
   - # of outgoing regulatory effects
----------------------------------------------------- */
// export function computeInfluence(edges: any[]) {
//   const influence: Record<string, number> = {};

//   edges.forEach((edge) => {
//     const { source, consensus_score, support_count } = edge;

//     if (!influence[source]) influence[source] = 0;

//     // Influence = strength + support + connectivity
//     influence[source] += consensus_score * 1.5 + support_count * 0.8;
//   });

//   return influence; // { SOX2: 6.4, NANOG: 4.2, ... }
// }

/* -----------------------------------------------------
   3. MODULE DETECTION (Weakly connected components)
----------------------------------------------------- */
// export function computeModules(nodes: string[], edges: any[]) {
//   const adj: Record<string, string[]> = {};

//   nodes.forEach((n) => (adj[n] = []));
//   edges.forEach((e) => {
//     adj[e.source].push(e.target);
//     adj[e.target].push(e.source); // treat undirected for community detection
//   });

//   const visited = new Set<string>();
//   const modules: string[][] = [];

//   function dfs(node: string, group: string[]) {
//     visited.add(node);
//     group.push(node);
//     adj[node].forEach((nbr) => {
//       if (!visited.has(nbr)) dfs(nbr, group);
//     });
//   }

//   nodes.forEach((n) => {
//     if (!visited.has(n)) {
//       const group: string[] = [];
//       dfs(n, group);
//       modules.push(group);
//     }
//   });

//   return modules; // e.g. [ ["SOX2","OCT4","NANOG"], ["MYC","KLF4"] ]
// }

/* -----------------------------------------------------
   4. APPLY NODE STYLES
   Enhances visuals based on:
   - centrality
   - influence
----------------------------------------------------- */
// export function applyNodeStyles(cy: cytoscape.Core, degrees: any, influence: any) {
//   cy.nodes().forEach((node) => {
//     const id = node.data("id");

//     const deg = degrees[id]?.total ?? 0;
//     const infl = influence[id] ?? 0;

//     const size = 30 + deg * 3;
//     const color =
//       infl > 8
//         ? "#e63946" // strong influencer
//         : infl > 5
//         ? "#f4a261"
//         : "#457b9d";

//     node.style({
//       width: size,
//       height: size,
//       "background-color": color,
//       "border-width": 2,
//       "border-color": "#1d3557",
//       "font-size": 12,
//       color: "#ffffff",
//       label: id
//     });
//   });
// }

/* -----------------------------------------------------
   5. HIGHLIGHT NEIGHBORS (local exploration)
----------------------------------------------------- */
// export function highlightNeighbors(cy: cytoscape.Core, nodeId: string) {
//   cy.nodes().style("opacity", 0.15);
//   cy.edges().style("opacity", 0.1);

//   const node = cy.$(`#${nodeId}`);
//   const neighbors = node.closedNeighborhood();

//   neighbors.style("opacity", 1);
//   neighbors.edges().style("opacity", 1);

//   node.style("background-color", "#ff006e");

//   return neighbors;
// }

// ----------------------
// Degree
// ----------------------
export function computeDegrees(edges) {
  const deg = {};
  edges.forEach((e) => {
    deg[e.source] = (deg[e.source] || 0) + 1;
    deg[e.target] = (deg[e.target] || 0) + 1;
  });
  return deg;
}

// ----------------------
// Influence = normalized degree
// ----------------------
export function computeInfluence(degrees) {
  const maxDeg = Math.max(...Object.values(degrees));
  const inf = {};

  Object.keys(degrees).forEach((id) => {
    inf[id] = degrees[id] / maxDeg;
  });

  return inf;
}

// ----------------------
// Community detection
// ----------------------
// export function computeModules(cy, degrees) {
//   const result = {};
//   const comps = cy.elements().components();

//   comps.forEach((comp, idx) => {
//     comp.nodes().forEach((n) => {
//       result[n.id()] = idx;
//     });
//   });

//   return result;
// }

// export function computeModules(cy) {
//   if (!cy || typeof cy.elements !== "function") {
//     console.error("computeModules: invalid cytoscape instance", cy);
//     return {};
//   }

//   const result = {};
//   const comps = cy.elements().components();

//   comps.forEach((comp, idx) => {
//     comp.nodes().forEach((n) => {
//       result[n.id()] = idx;
//     });
//   });

//   return result;
// }

export function computeModules(nodeIds: string[], edges: any[]) {
  const adj: Record<string, string[]> = {};

  nodeIds.forEach(id => adj[id] = []);

  edges.forEach(e => {
    adj[e.source].push(e.target);
    adj[e.target].push(e.source);
  });

  const visited = new Set<string>();
  const modules: Record<string, number> = {};
  let clusterId = 0;

  function dfs(node: string) {
    visited.add(node);
    modules[node] = clusterId;

    adj[node].forEach(nbr => {
      if (!visited.has(nbr)) dfs(nbr);
    });
  }

  nodeIds.forEach(n => {
    if (!visited.has(n)) {
      dfs(n);
      clusterId++;
    }
  });

  return modules;
}



// ----------------------
// Build Cytoscape elements
// ----------------------
export function buildCytoscapeElements(edges) {
  const nodes = {};
  edges.forEach((e) => {
    nodes[e.source] = true;
    nodes[e.target] = true;
  });

  const nodeList = Object.keys(nodes).map((id) => ({
    data: { id }
  }));

  const edgeList = edges.map((e) => ({
    data: {
      id: e.edge_id,
      source: e.source,
      target: e.target,
      consensus: e.consensus_score
    }
  }));

  return [...nodeList, ...edgeList];
}

// ----------------------
// Highlight neighbors
// ----------------------
export function highlightNeighbors(cy, id, hopDepth) {
  cy.elements().removeClass("highlighted");

  let current = cy.getElementById(id);
  current.addClass("highlighted");

  for (let i = 0; i < hopDepth; i++) {
    current = current.connectedEdges().connectedNodes();
    current.addClass("highlighted");
  }
}

// ----------------------
// Apply styles (size, color)
// ----------------------
export function applyNodeStyles(cy, degrees, influence, modules) {
  cy.nodes().forEach((n) => {
    const id = n.id();
    const deg = degrees[id] || 1;
    const inf = influence[id] || 0;

    n.style({
      width: 20 + deg * 2,
      height: 20 + deg * 2,
      "background-color": `hsl(${modules[id] * 50}, 70%, ${
        40 + inf * 40
      }%)`
    });
  });
}

// ----------------------
// Stylesheet
// ----------------------
export const cytoscapeStylesheet = [
  {
    selector: "node",
    style: {
      label: "data(id)",
      "font-size": 10,
      color: "#444"
    }
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "#999"
    }
  },
  {
    selector: ".highlighted",
    style: {
      "background-color": "#ff9800",
      "line-color": "#ff9800",
      "transition-property": "background-color, line-color",
      "transition-duration": "0.3s"
    }
  }
];
