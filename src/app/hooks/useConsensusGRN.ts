// // // hooks/useConsensusGRN.ts
// // import { useState, useMemo, useEffect } from "react";
// // import { computeNodeImportance, runLouvain } from "../utils/graphAnalytics";

// // export type GRNEdge = {
// //   id: string;
// //   source: string;
// //   target: string;
// //   algorithms: Record<string, number>; // algorithm -> score
// //   support_count: number;
// //   consensus_score: number;
// // };

// // export type ConsensusOptions = {
// //   selectedAlgorithms: string[];
// //   minSupport: number;
// //   scoreThreshold: number;
// //   topN?: number;
// // };

// // export function useConsensusGRN(edges: GRNEdge[], options: ConsensusOptions) {
// //   const { selectedAlgorithms, minSupport, scoreThreshold, topN } = options;

// //   // 1️⃣ Filter edges based on algorithms + thresholds
// //   const filteredEdges = useMemo(() => {
// //     return edges.filter(edge => {
// //       const supportingAlgos = Object.keys(edge.algorithms).filter(algo =>
// //         selectedAlgorithms.includes(algo)
// //       );
// //       return supportingAlgos.length >= minSupport && edge.consensus_score >= scoreThreshold;
// //     });
// //   }, [edges, selectedAlgorithms, minSupport, scoreThreshold]);

// //   // 2️⃣ Compute node importance from filtered edges
// //   const nodeImportance = useMemo(() => computeNodeImportance(filteredEdges), [filteredEdges]);

// //   // 3️⃣ Compute Louvain communities
// //   const communities = useMemo(() => runLouvain(filteredEdges), [filteredEdges]);

// //   // 4️⃣ Generate Cytoscape elements (nodes + edges)
// //   const cytoscapeElements = useMemo(() => {
// //     const nodesSet = new Set<string>();
// //     filteredEdges.forEach(e => {
// //       nodesSet.add(e.source);
// //       nodesSet.add(e.target);
// //     });

// //     const nodes = Array.from(nodesSet)
// //       .map(id => ({
// //         data: {
// //           id,
// //           label: id,
// //           size: 20 + (nodeImportance[id] || 0) * 5,
// //           community: communities[id] || 0
// //         }
// //       }));

// //     const edgesElements = filteredEdges.map(e => ({
// //       data: {
// //         id: e.id,
// //         source: e.source,
// //         target: e.target,
// //         support_count: e.support_count,
// //         consensus_score: e.consensus_score
// //       }
// //     }));

// //     return [...nodes, ...edgesElements];
// //   }, [filteredEdges, nodeImportance, communities]);

// //   return { filteredEdges, nodeImportance, communities, cytoscapeElements };
// // }


// // hooks/useConsensusGRN.ts
// // import { useMemo, useState } from "react";
// // import { mockConsensusEdges } from "../data/mockEdges";

// // export interface GRNEdge {
// //   id: string;
// //   source: string;
// //   target: string;
// //   algorithms: Record<string, number>;
// //   support_count: number;
// //   consensus_score: number;
// // }

// // export const useConsensusGRN = () => {
// //   const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(["GENIE3", "SCODE", "GRISLI"]);
// //   const [minSupport, setMinSupport] = useState(1);
// //   const [scoreThreshold, setScoreThreshold] = useState(0);
// //   const [topN, setTopN] = useState<number | null>(null);

// //   const filteredEdges: GRNEdge[] = useMemo(() => {
// //     let edges = mockConsensusEdges.filter(edge => {
// //       // Count how many selected algorithms support this edge
// //       const count = selectedAlgorithms.filter(algo => edge.algorithms[algo] !== undefined).length;
// //       return count >= minSupport && edge.consensus_score >= scoreThreshold;
// //     });

// //     // Apply Top-N if set
// //     if (topN !== null) {
// //       edges = [...edges].sort((a, b) => b.consensus_score - a.consensus_score).slice(0, topN);
// //     }

// //     return edges;
// //   }, [selectedAlgorithms, minSupport, scoreThreshold, topN]);

// //   // Compute node statistics based on filtered edges
// //   const nodes = useMemo(() => {
// //     const nodeMap: Record<string, { id: string; label: string; degree: number }> = {};
// //     filteredEdges.forEach(edge => {
// //       if (!nodeMap[edge.source]) nodeMap[edge.source] = { id: edge.source, label: edge.source, degree: 0 };
// //       if (!nodeMap[edge.target]) nodeMap[edge.target] = { id: edge.target, label: edge.target, degree: 0 };
// //       nodeMap[edge.source].degree += 1; // out-degree
// //       nodeMap[edge.target].degree += 1; // in-degree
// //     });
// //     return Object.values(nodeMap);
// //   }, [filteredEdges]);

// //   return {
// //     filteredEdges,
// //     nodes,
// //     selectedAlgorithms,
// //     setSelectedAlgorithms,
// //     minSupport,
// //     setMinSupport,
// //     scoreThreshold,
// //     setScoreThreshold,
// //     topN,
// //     setTopN,
// //   };
// // };

// // hooks/useConsensusGRN.ts
// import { useMemo, useState } from "react";
// import { mockConsensusEdges } from "../../data/mockEdges";

// export interface GRNEdge {
//   id: string;
//   source: string;
//   target: string;
//   algorithms: Record<string, number>;
//   support_count: number;
//   consensus_score: number;
// }

// export const useConsensusGRN = () => {
//   // Dynamically compute all algorithms from mock data
//   const allAlgorithms = useMemo(() => {
//     const algos = new Set<string>();
//     mockConsensusEdges.forEach(e => Object.keys(e.algorithms).forEach(a => algos.add(a)));
//     return Array.from(algos);
//   }, []);

//   const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(allAlgorithms);
//   const [minSupport, setMinSupport] = useState(1);
//   const [scoreThreshold, setScoreThreshold] = useState(0);
//   const [topN, setTopN] = useState<number | null>(null);

//   const filteredEdges: GRNEdge[] = useMemo(() => {
//     let edges = mockConsensusEdges.filter(edge => {
//       const count = selectedAlgorithms.filter(algo => edge.algorithms[algo] !== undefined).length;
//       return count >= minSupport && edge.consensus_score >= scoreThreshold;
//     });

//     if (topN !== null) {
//       edges = [...edges].sort((a, b) => b.consensus_score - a.consensus_score).slice(0, topN);
//     }

//     return edges;
//   }, [selectedAlgorithms, minSupport, scoreThreshold, topN]);

//   const nodes = useMemo(() => {
//     const nodeMap: Record<string, { id: string; label: string; degree: number }> = {};
//     filteredEdges.forEach(edge => {
//       if (!nodeMap[edge.source]) nodeMap[edge.source] = { id: edge.source, label: edge.source, degree: 0 };
//       if (!nodeMap[edge.target]) nodeMap[edge.target] = { id: edge.target, label: edge.target, degree: 0 };
//       nodeMap[edge.source].degree += 1;
//       nodeMap[edge.target].degree += 1;
//     });
//     return Object.values(nodeMap);
//   }, [filteredEdges]);

//    // Compute top regulators based on outDegree
// //   const topRegulators = useMemo(() => {
// //     return [...nodes].sort((a, b) => b.degree - a.degree).slice(0, 5);
// //   }, [nodes]);

// const topRegulators = useMemo(() => {
//     return [...nodes].sort((a, b) => b.outDegree - a.outDegree).slice(0, 5);
//   }, [nodes]);

//   return {
//     filteredEdges,
//     nodes,
//     selectedAlgorithms,
//     setSelectedAlgorithms,
//     allAlgorithms,
//     minSupport,
//     setMinSupport,
//     scoreThreshold,
//     setScoreThreshold,
//     topN,
//     setTopN,
//   };

  
// const edgeColorMap = useMemo(() => {
//   const colors = ["#FF4136", "#FF851B", "#2ECC40", "#0074D9", "#B10DC9"];
//   return filteredEdges.map((edge) => {
//     const supportCount = Object.keys(edge.algorithms).length;
//     // Color index = supportCount - 1 (clamped)
//     const colorIndex = Math.min(supportCount - 1, colors.length - 1);
//     return { edgeId: `${edge.source}_${edge.target}`, color: colors[colorIndex] };
//   });
// }, [filteredEdges]);

// // components/GRNExplorer.tsx
// const stylesheet: cytoscape.Stylesheet[] = [
//   {
//     selector: "node",
//     style: {
//       label: "data(label)",
//       width: "mapData(degree, 1, 5, 20, 60)",
//       height: "mapData(degree, 1, 5, 20, 60)",
//       backgroundColor: (ele) =>
//         topRegulators.find((n) => n.id === ele.id()) ? "#FFDC00" : "#0074D9",
//       color: "#fff",
//       textValign: "center",
//       textHalign: "center",
//       fontSize: 12,
//     },
//   },
//   {
//     selector: "edge",
//     style: {
//       width: "mapData(support_count, 1, 3, 2, 6)",
//       lineColor: (ele) => {
//         const colorObj = edgeColorMap.find((c) => c.edgeId === ele.id());
//         return colorObj ? colorObj.color : "#AAAAAA";
//       },
//       curveStyle: "bezier",
//       label: "data(label)",
//       fontSize: 10,
//     },
//   },
// ];
// };


import { useState, useMemo } from "react";
import { louvain } from "graphology-communities-louvain";

export interface EdgeData {
  source: string;
  target: string;
  algorithms: Record<string, number>; // algorithm -> score
}

interface UseConsensusGRNProps {
  edges: EdgeData[];
  selectedAlgorithms: string[];
  minSupport?: number; // k edges supported by ≥k algorithms
}

export function useConsensusGRN({ edges, selectedAlgorithms, minSupport = 2 }: UseConsensusGRNProps) {
  const [thresholdScore, setThresholdScore] = useState(0);

  const filteredEdges = useMemo(() => {
    return edges.filter((edge) => {
      const supportedAlgos = Object.keys(edge.algorithms).filter((algo) =>
        selectedAlgorithms.includes(algo)
      );
      const supportCount = supportedAlgos.length;
      const passesSupport = supportCount >= minSupport;
      const passesScore = supportedAlgos.every((algo) => edge.algorithms[algo] >= thresholdScore);
      return passesSupport && passesScore;
    });
  }, [edges, selectedAlgorithms, minSupport, thresholdScore]);

  // Compute node degrees for sizing
  const nodeDegrees = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEdges.forEach((edge) => {
      map[edge.source] = (map[edge.source] || 0) + 1;
      map[edge.target] = (map[edge.target] || 0) + 1;
    });
    return map;
  }, [filteredEdges]);

  // Louvain clustering for nodes
  const clusters = useMemo(() => {
    try {
      // Convert filteredEdges to graphology format
      const Graph = require("graphology");
      const g = new Graph();
      filteredEdges.forEach((edge) => {
        if (!g.hasNode(edge.source)) g.addNode(edge.source);
        if (!g.hasNode(edge.target)) g.addNode(edge.target);
        g.addEdge(edge.source, edge.target);
      });
      return louvain.assign(g); // Returns node -> community mapping
    } catch (err) {
      console.error("Louvain clustering failed", err);
      return {};
    }
  }, [filteredEdges]);

  return { filteredEdges, nodeDegrees, clusters, thresholdScore, setThresholdScore };
}
