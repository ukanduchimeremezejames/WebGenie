// utils/graphAnalytics.ts
import { GRNEdge } from "../hooks/useConsensusGRN";
import louvain from "graphology-communities-louvain";
import Graph from "graphology";

export function computeNodeImportance(edges: GRNEdge[]) {
  const degree: Record<string, number> = {};
  edges.forEach(e => {
    degree[e.source] = (degree[e.source] || 0) + 1;
    degree[e.target] = (degree[e.target] || 0) + 1;
  });
  return degree;
}

// Louvain community detection
export function runLouvain(edges: GRNEdge[]): Record<string, number> {
  const graph = new Graph({ type: "directed" });

  edges.forEach(e => {
    if (!graph.hasNode(e.source)) graph.addNode(e.source);
    if (!graph.hasNode(e.target)) graph.addNode(e.target);
    graph.addEdge(e.source, e.target, { weight: e.consensus_score });
  });

  const communities = louvain.assign(graph, { attributes: { community: "community" } });

  // Output: { nodeId: communityId }
  const result: Record<string, number> = {};
  graph.forEachNode((node, attr) => {
    result[node] = attr.community;
  });

  return result;
}
