import { klay } from "cytoscape-klay";

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
export function computeModules(cy, degrees) {
  const result = {};
  const comps = cy.elements().components();

  comps.forEach((comp, idx) => {
    comp.nodes().forEach((n) => {
      result[n.id()] = idx;
    });
  });

  return result;
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
  selector: "edge",
  style: {
    width: "mapData(support_count, 1, 5, 1, 6)",
    "line-color": "#ccc",
    "target-arrow-shape": "triangle"
  }
},
{
  selector: "edge[support_count >= 3]",
  style: {
    "line-color": "#10B981"
  }
},
{
  selector: "edge[support_count = 2]",
  style: {
    "line-color": "#F59E0B"
  }
},
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
