// data/mockEdges.ts

import { GRNEdge } from "../hooks/useConsensusGRN";

// Mock genes
const genes = ["SOX2", "NANOG", "POU5F1", "KLF4", "MYC", "GATA6", "CDX2", "TBXT", "EOMES"];

// Mock algorithms
const algorithms = ["GENIE3", "SCODE", "GRISLI"];

// Helper to generate random score
const randomScore = (min = 0.5, max = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));

// Generate random edges with per-algorithm scores
export const mockConsensusEdges: GRNEdge[] = [];

let edgeId = 0;
for (let i = 0; i < genes.length; i++) {
  for (let j = 0; j < genes.length; j++) {
    if (i === j) continue;

    // Randomly decide if this edge exists
    if (Math.random() < 0.3) continue;

    const algosForEdge: Record<string, number> = {};
    algorithms.forEach(algo => {
      if (Math.random() > 0.4) {
        algosForEdge[algo] = randomScore();
      }
    });

    const support_count = Object.keys(algosForEdge).length;
    if (support_count === 0) continue;

    const consensus_score =
      Object.values(algosForEdge).reduce((a, b) => a + b, 0) / support_count;

    mockConsensusEdges.push({
      id: `e${edgeId++}`,
      source: genes[i],
      target: genes[j],
      algorithms: algosForEdge,
      support_count,
      consensus_score: parseFloat(consensus_score.toFixed(2)),
    });
  }
}
