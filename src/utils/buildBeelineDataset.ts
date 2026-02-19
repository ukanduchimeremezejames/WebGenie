// export interface BeelineEdge {
//   source: string;
//   target: string;
//   type: "activation" | "repression";
// }

// export interface BeelineNode {
//   id: string;
//   label: string;
//   importance: number;
// }

// export interface BeelineNode {
//   id: string;
//   label: string;
//   importance: number;
//   inDegree: number;
//   outDegree: number;
//   degree: number;
//   neighbors: string[];
//   activators: string[];
//   repressors: string[];
//   bestAlgo?: string;
//   bestMean?: number;
// }


// export function buildBeelineDataset(edges: BeelineEdge[]) {
//   const nodeMap = new Map<string, number>();

//   edges.forEach((edge) => {
//     nodeMap.set(edge.source, (nodeMap.get(edge.source) ?? 0) + 1);
//     nodeMap.set(edge.target, (nodeMap.get(edge.target) ?? 0) + 1);
//   });

//   const nodes: BeelineNode[] = Array.from(nodeMap.entries()).map(
//     ([id, degree]) => ({
//       id,
//       label: id,
//       importance: degree
//     })
//   );

//   return {
//     nodes,
//     edges
//   };
// }

export interface BeelineEdge {
  source: string;
  target: string;
  type: "activation" | "repression";
  bestAlgo?: string;
  bestMean?: number;
}

export interface BeelineNode {
  id: string;
  label: string;
  importance: number;
  inDegree?: number;
  outDegree?: number;
  degree?: number;
  neighbors?: string[];
  bestAlgo?: string;
  bestMean?: number;
}

const ALGORITHMS = ["GENIE3", "GRNBoost2", "PIDC"];

function addRandomInferenceToEdges(edges: BeelineEdge[]): BeelineEdge[] {
  return edges.map(edge => {
    const scores: Record<string, number> = {};
    ALGORITHMS.forEach(algo => {
      // realistic range 0.5–1.0
      scores[algo] = parseFloat((0.5 + Math.random() * 0.5).toFixed(3));
    });

    // pick best
    let bestAlgo = "";
    let bestMean = -Infinity;
    Object.entries(scores).forEach(([algo, score]) => {
      if (score > bestMean) {
        bestMean = score;
        bestAlgo = algo;
      }
    });

    return { ...edge, bestAlgo, bestMean };
  });
}

function addNodeInference(nodes: BeelineNode[], edges: BeelineEdge[]): BeelineNode[] {
  return nodes.map(node => {
    const relatedEdges = edges.filter(e => e.source === node.id || e.target === node.id);

    const algoSums: Record<string, number> = {};
    const algoCounts: Record<string, number> = {};

    relatedEdges.forEach(edge => {
      const { bestAlgo, bestMean } = edge;
      if (!bestAlgo || bestMean === undefined) return;
      algoSums[bestAlgo] = (algoSums[bestAlgo] ?? 0) + bestMean;
      algoCounts[bestAlgo] = (algoCounts[bestAlgo] ?? 0) + 1;
    });

    let nodeBestAlgo = "";
    let nodeBestMean = -Infinity;
    Object.keys(algoSums).forEach(algo => {
      const mean = algoSums[algo] / algoCounts[algo];
      if (mean > nodeBestMean) {
        nodeBestMean = mean;
        nodeBestAlgo = algo;
      }
    });

    return { ...node, bestAlgo: nodeBestAlgo, bestMean: parseFloat(nodeBestMean.toFixed(3)) };
  });
}

export function buildBeelineDataset(edges: BeelineEdge[]) {
  const nodeMap = new Map<string, number>();

  edges.forEach((edge) => {
    nodeMap.set(edge.source, (nodeMap.get(edge.source) ?? 0) + 1);
    nodeMap.set(edge.target, (nodeMap.get(edge.target) ?? 0) + 1);
  });

  const nodes: BeelineNode[] = Array.from(nodeMap.entries()).map(
    ([id, degree]) => ({
      id,
      label: id,
      importance: degree ?? 1
    })
  );

  // --- Step 1: Add neighbors & degree
  nodes.forEach(node => {
    node.neighbors = edges
      .filter(e => e.source === node.id || e.target === node.id)
      .map(e => (e.source === node.id ? e.target : e.source));
    node.degree = node.neighbors.length;
  });

  // --- Step 2: Add simulated inference for edges
  const edgesWithInference = addRandomInferenceToEdges(edges);

  // --- Step 3: Add node-level bestAlgo + bestMean
  const nodesWithInference = addNodeInference(nodes, edgesWithInference);

  return {
    nodes: nodesWithInference,
    edges: edgesWithInference
  };
}



// export function buildBeelineDataset(edges: BeelineEdge[]) {
//   const nodeMap = new Map<string, BeelineNode>();

//   function ensureNode(id: string) {
//     if (!nodeMap.has(id)) {
//       nodeMap.set(id, {
//         id,
//         label: id,
//         importance: 0,
//         inDegree: 0,
//         outDegree: 0,
//         degree: 0,
//         neighbors: [],
//         activators: [],
//         repressors: []
//       });
//     }
//     return nodeMap.get(id)!;
//   }

//   edges.forEach(edge => {
//     const source = ensureNode(edge.source);
//     const target = ensureNode(edge.target);

//     // Degrees
//     source.outDegree++;
//     target.inDegree++;

//     // Neighbor tracking
//     source.neighbors.push(target.id);
//     target.neighbors.push(source.id);

//     // Edge type tracking
//     if (edge.type === "activation") {
//       target.activators.push(source.id);
//     } else {
//       target.repressors.push(source.id);
//     }
//   });

//   // Final calculations
//   nodeMap.forEach(node => {
//     node.degree = node.inDegree + node.outDegree;
//     node.importance = node.degree; // or replace with centrality later
//   });

//   return {
//     nodes: Array.from(nodeMap.values()),
//     edges
//   };
// }
