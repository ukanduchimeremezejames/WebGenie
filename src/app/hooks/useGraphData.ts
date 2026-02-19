// export function useGraphData(
//   edges,
//   selectedAlgorithms,
//   minSupport
// ) {
//   // FILTER EDGES
//   const filtered = edges.filter(e => {
//     const supportOK = e.support_count >= minSupport;

//     const algOK =
//       selectedAlgorithms.length === 0 ||
//       selectedAlgorithms.every(a =>
//         e.supporting_algorithms.includes(a)
//       );

//     return supportOK && algOK;
//   });

//   // COMPUTE NODE DEGREE
//   const degree = {};
//   filtered.forEach(e => {
//     degree[e.source] = (degree[e.source] || 0) + 1;
//     degree[e.target] = (degree[e.target] || 0) + 1;
//   });

//   const nodes = Object.keys(degree);

//   // NODE COLOR GROUP BASED ON DEGREE
//   function nodeColor(d) {
//     if (d >= 4) return "#ef4444"; // red
//     if (d >= 3) return "#f97316"; // orange
//     if (d >= 2) return "#3b82f6"; // blue
//     return "#6b7280"; // gray
//   }

//   // FORMAT CYTOSCAPE ELEMENTS
//   const elements = [
//     ...nodes.map(g => ({
//       data: {
//         id: g,
//         label: g,
//         size: 20 + degree[g] * 5,
//         color: nodeColor(degree[g])
//       }
//     })),
//     ...filtered.map(e => ({
//       data: {
//         id: e.edge_id,
//         source: e.source,
//         target: e.target,
//         support_count: e.support_count,
//         consensus_score: e.consensus_score
//       }
//     }))
//   ];

//   return {
//     elements,
//     filteredEdgeCount: filtered.length,
//     nodeCount: nodes.length
//   };
// }


export function useGraphData(edges, selectedAlgorithms, minSupport) {
  const filtered = edges.filter(e => {
    const matchesK = e.support_count >= minSupport;
    const matchesAlgorithms = selectedAlgorithms.every(a =>
      e.supporting_algorithms.includes(a)
    );
    return matchesK && matchesAlgorithms;
  });

  const nodes = new Set();

  filtered.forEach(e => {
    nodes.add(e.source);
    nodes.add(e.target);
  });

  return {
    elements: [
      ...Array.from(nodes).map(g => ({
        data: { id: g, label: g }
      })),
      ...filtered.map(e => ({
        data: {
          id: e.edge_id,
          source: e.source,
          target: e.target,
          support_count: e.support_count,
          consensus_score: e.consensus_score
        }
      }))
    ],
    edgeCount: filtered.length,
    nodeCount: nodes.size
  };
}
