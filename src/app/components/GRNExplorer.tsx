// // import CytoscapeComponent from "react-cytoscapejs";
// // import cytoscape from "cytoscape";
// // import fcose from "cytoscape-fcose";
// // import { useEffect, useRef } from "react";

// // cytoscape.use(fcose);

// // export default function GRNExplorer({ elements }) {
// //   const cyRef = useRef(null);

// //   return (
// //     <div className="w-full h-[700px] border rounded-lg shadow-md">
// //       <CytoscapeComponent
// //         cy={(cy) => {
// //           cyRef.current = cy;

// //           cy.on("tap", "node", (evt) => {
// //             console.log("Selected node:", evt.target.id());
// //           });

// //           cy.on("tap", "edge", (evt) => {
// //             console.log("Selected edge:", evt.target.data());
// //           });
// //         }}
// //         elements={elements}
// //         style={{ width: "100%", height: "100%" }}
// //         layout={{
// //           name: "fcose",
// //           randomize: true,
// //           nodeRepulsion: 6000
// //         }}
// //         stylesheet={[
// //           {
// //             selector: "node",
// //             style: {
// //               label: "data(label)",
// //               "background-color": "#1e90ff",
// //               "font-size": "10px",
// //             }
// //           },
// //           {
// //             selector: "edge",
// //             style: {
// //               width: "mapData(support_count, 1, 5, 1, 8)",
// //               "line-color": "mapData(consensus_score, 0.6, 0.9, #d1d5db, #000000)",
// //               "target-arrow-shape": "triangle",
// //               "target-arrow-color": "#000",
// //               "curve-style": "bezier",
// //             }
// //           }
// //         ]}
// //       />
// //     </div>
// //   );
// // }


// // components/GRNExplorer.tsx
// // import { useState } from "react";
// // import { useConsensusGRN, GRNEdge } from "../hooks/useConsensusGRN";
// // import { CytoscapeGraph } from "./CytoscapeGraph";
// // import { GRNControls } from "./GRNControls";
// // import { mockConsensusEdges } from "../data/mockEdges";

// // export const GRNExplorer = () => {
// //   const algorithms = ["GENIE3", "SCODE", "GRISLI"];

// //   const [selectedAlgorithms, setSelectedAlgorithms] = useState(algorithms);
// //   const [minSupport, setMinSupport] = useState(2);
// //   const [scoreThreshold, setScoreThreshold] = useState(0.5);

// //   const { cytoscapeElements } = useConsensusGRN(mockConsensusEdges as GRNEdge[], {
// //     selectedAlgorithms,
// //     minSupport,
// //     scoreThreshold
// //   });

// //   return (
// //     <div>
// //       <GRNControls
// //         algorithms={algorithms}
// //         selected={selectedAlgorithms}
// //         setSelected={setSelectedAlgorithms}
// //         minSupport={minSupport}
// //         setMinSupport={setMinSupport}
// //         scoreThreshold={scoreThreshold}
// //         setScoreThreshold={setScoreThreshold}
// //       />
// //       <CytoscapeGraph elements={cytoscapeElements} />
// //     </div>
// //   );
// // };


// // components/GRNExplorer.tsx
// // import React, { useRef } from "react";
// // import CytoscapeComponent from "react-cytoscapejs";
// // import { useConsensusGRN } from "../hooks/useConsensusGRN";
// // import cytoscape from "cytoscape";
// // import louvain from "cytoscape-louvain";

// // // Register Louvain
// // cytoscape.use(louvain);

// // export const GRNExplorer: React.FC = () => {
// //   const cyRef = useRef<cytoscape.Core | null>(null);
// //   const {
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
// //   } = useConsensusGRN();

// //   // Build Cytoscape elements dynamically
// //   const elements = [
// //     ...nodes.map(n => ({ data: { id: n.id, label: n.label, degree: n.degree } })),
// //     ...filteredEdges.map(e => ({
// //       data: {
// //         id: e.id,
// //         source: e.source,
// //         target: e.target,
// //         label: `${e.source} → ${e.target} (${e.support_count})`,
// //         support_count: e.support_count,
// //       },
// //     })),
// //   ];

// //   // Style
// //   const stylesheet: cytoscape.Stylesheet[] = [
// //     {
// //       selector: "node",
// //       style: {
// //         label: "data(label)",
// //         width: "mapData(degree, 1, 5, 20, 60)",
// //         height: "mapData(degree, 1, 5, 20, 60)",
// //         backgroundColor: "#0074D9",
// //         color: "#fff",
// //         textValign: "center",
// //         textHalign: "center",
// //         fontSize: 12,
// //       },
// //     },
// //     {
// //       selector: "edge",
// //       style: {
// //         width: "mapData(support_count, 1, 3, 2, 6)",
// //         lineColor: "#FF4136",
// //         curveStyle: "bezier",
// //         label: "data(label)",
// //         fontSize: 10,
// //       },
// //     },
// //   ];

// //   const handleCyInit = (cy: cytoscape.Core) => {
// //     cyRef.current = cy;
// //     cy.on("tap", "node", evt => {
// //       console.log("Node clicked:", evt.target.data());
// //     });

// //     // Run Louvain clustering on filtered edges
// //     const clusters = cy.elements().louvain({ weight: "support_count" });
// //     clusters.forEach((cluster: any, idx: number) => {
// //       cluster.forEach((ele: any) => {
// //         if (ele.isNode()) ele.style("background-color", `hsl(${(idx * 60) % 360}, 70%, 50%)`);
// //       });
// //     });
// //   };

// //   return (
// //     <div>
// //       <div style={{ marginBottom: 12 }}>
// //         <label>
// //           Min Support:
// //           <input
// //             type="number"
// //             value={minSupport}
// //             onChange={e => setMinSupport(Number(e.target.value))}
// //             min={1}
// //             max={selectedAlgorithms.length}
// //           />
// //         </label>
// //         <label style={{ marginLeft: 12 }}>
// //           Score Threshold:
// //           <input
// //             type="number"
// //             value={scoreThreshold}
// //             onChange={e => setScoreThreshold(Number(e.target.value))}
// //             step={0.01}
// //             min={0}
// //             max={1}
// //           />
// //         </label>
// //         <label style={{ marginLeft: 12 }}>
// //           Top-N Edges:
// //           <input
// //             type="number"
// //             value={topN ?? ""}
// //             onChange={e => setTopN(e.target.value ? Number(e.target.value) : null)}
// //             min={1}
// //           />
// //         </label>
// //       </div>

// //       <CytoscapeComponent
// //         cy={handleCyInit}
// //         elements={elements}
// //         stylesheet={stylesheet}
// //         style={{ width: "100%", height: "600px" }}
// //         layout={{ name: "cose" }}
// //       />
// //     </div>
// //   );
// // };


// // components/GRNExplorer.tsx
// import React, { useRef, useEffect } from "react";
// import CytoscapeComponent from "react-cytoscapejs";
// import { useConsensusGRN } from "../hooks/useConsensusGRN";
// import cytoscape from "cytoscape";
// import louvain from "cytoscape-louvain";

// cytoscape.use(louvain);

// export const GRNExplorer: React.FC = () => {
//   const cyRef = useRef<cytoscape.Core | null>(null);
//   const {
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
//   } = useConsensusGRN();

//   const elements = [
//     ...nodes.map(n => ({ data: { id: n.id, label: n.label, degree: n.degree } })),
//     ...filteredEdges.map(e => ({
//       data: {
//         id: e.id,
//         source: e.source,
//         target: e.target,
//         label: `${e.source} → ${e.target} (${e.support_count})`,
//         support_count: e.support_count,
//         algorithms: e.algorithms,
//         tooltip: Object.entries(e.algorithms)
//           .map(([algo, score]) => `${algo}: ${score.toFixed(2)}`)
//           .join("\n"),
//       },
//     })),
//   ];

//   // const stylesheet: cytoscape.Stylesheet[] = [
//   //   {
//   //     selector: "node",
//   //     style: {
//   //       label: "data(label)",
//   //       width: "mapData(degree, 1, 5, 20, 60)",
//   //       height: "mapData(degree, 1, 5, 20, 60)",
//   //       backgroundColor: "#0074D9",
//   //       color: "#fff",
//   //       textValign: "center",
//   //       textHalign: "center",
//   //       fontSize: 12,
//   //     },
//   //   },
//   //   {
//   //     selector: "edge",
//   //     style: {
//   //       width: "mapData(support_count, 1, 3, 2, 6)",
//   //       lineColor: "#FF4136",
//   //       curveStyle: "bezier",
//   //       label: "data(label)",
//   //       fontSize: 10,
//   //     },
//   //   },
//   // ];

  
// const stylesheet: cytoscape.Stylesheet[] = [
//   {
//     selector: "node",
//     style: {
//       label: "data(label)",
//       width: "mapData(degree, 1, 5, 20, 60)",
//       height: "mapData(degree, 1, 5, 20, 60)",
//       backgroundColor: (ele) =>
//         topRegulators.find(n => n.id === ele.id()) ? "#FFDC00" : "#0074D9", // highlight top regulators
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
//       lineColor: "#FF4136",
//       curveStyle: "bezier",
//       label: "data(label)",
//       fontSize: 10,
//     },
//   },
// ];

//   const handleCyInit = (cy: cytoscape.Core) => {
//     cyRef.current = cy;

//     // Node click
//     cy.on("tap", "node", evt => console.log("Node clicked:", evt.target.data()));

//     // Edge hover tooltip
//     cy.on("mouseover", "edge", evt => {
//       const edge = evt.target;
//       const tooltip = edge.data("tooltip");
//       edge.qtip({
//         content: tooltip,
//         show: { event: evt.type, ready: true },
//         hide: { event: "mouseout unfocus" },
//         style: { classes: "qtip-bootstrap", tip: { width: 10, height: 10 } },
//       });
//     });

//     // Louvain clustering
//     const clusters = cy.elements().louvain({ weight: "support_count" });
//     clusters.forEach((cluster: any, idx: number) => {
//       cluster.forEach((ele: any) => {
//         if (ele.isNode()) ele.style("background-color", `hsl(${(idx * 60) % 360}, 70%, 50%)`);
//       });
//     });
//   };

//   return (
//     <div>
//       // inside GRNExplorer component JSX
// <div style={{ marginTop: 12 }}>
//   <button
//     onClick={() => {
//       const csvRows = [
//         ["source", "target", "support_count", "algorithms", "consensus_score"],
//         ...filteredEdges.map(e => [
//           e.source,
//           e.target,
//           e.support_count,
//           Object.entries(e.algorithms)
//             .map(([algo, score]) => `${algo}:${score.toFixed(2)}`)
//             .join("|"),
//           e.consensus_score.toFixed(2),
//         ]),
//       ].map(row => row.join(","));
//       const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
//       const encodedUri = encodeURI(csvContent);
//       const link = document.createElement("a");
//       link.setAttribute("href", encodedUri);
//       link.setAttribute("download", "filtered_grn.csv");
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }}
//   >
//     Export CSV
//   </button>

//   <button
//     onClick={() => {
//       const jsonData = JSON.stringify(filteredEdges, null, 2);
//       const blob = new Blob([jsonData], { type: "application/json" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "filtered_grn.json";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }}
//     style={{ marginLeft: 12 }}
//   >
//     Export JSON
//   </button>
// </div>

// <div style={{ marginTop: 12 }}>
//   <strong>Edge Support Legend:</strong>
//   <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#FF4136" }}></div> 1 algorithm
//     </div>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#FF851B" }}></div> 2 algorithms
//     </div>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#2ECC40" }}></div> 3 algorithms
//     </div>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#0074D9" }}></div> 4 algorithms
//     </div>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#B10DC9" }}></div> ≥5 algorithms
//     </div>
//   </div>
// </div>


//       <div style={{ marginBottom: 12 }}>
//         <label>Min Support:
//           <input type="number" value={minSupport} onChange={e => setMinSupport(Number(e.target.value))} min={1} max={allAlgorithms.length} />
//         </label>
//         <label style={{ marginLeft: 12 }}>Score Threshold:
//           <input type="number" value={scoreThreshold} onChange={e => setScoreThreshold(Number(e.target.value))} step={0.01} min={0} max={1} />
//         </label>
//         <label style={{ marginLeft: 12 }}>Top-N Edges:
//           <input type="number" value={topN ?? ""} onChange={e => setTopN(e.target.value ? Number(e.target.value) : null)} min={1} />
//         </label>
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <strong>Select Algorithms:</strong>
//         {allAlgorithms.map(algo => (
//           <label key={algo} style={{ marginLeft: 12 }}>
//             <input
//               type="checkbox"
//               checked={selectedAlgorithms.includes(algo)}
//               onChange={e => {
//                 if (e.target.checked) setSelectedAlgorithms([...selectedAlgorithms, algo]);
//                 else setSelectedAlgorithms(selectedAlgorithms.filter(a => a !== algo));
//               }}
//             />
//             {algo}
//           </label>
//         ))}
//       </div>

//       <CytoscapeComponent
//         cy={handleCyInit}
//         elements={elements}
//         stylesheet={stylesheet}
//         style={{ width: "100%", height: "600px" }}
//         layout={{ name: "cose" }}

        
//       />

//       <div style={{ marginTop: 12 }}>
//   <strong>Edge Support Legend:</strong>
//   <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#FF4136" }}></div> 1 algorithm
//     </div>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#FF851B" }}></div> 2 algorithms
//     </div>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#2ECC40" }}></div> 3 algorithms
//     </div>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#0074D9" }}></div> 4 algorithms
//     </div>
//     <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
//       <div style={{ width: 20, height: 2, backgroundColor: "#B10DC9" }}></div> ≥5 algorithms
//     </div>
//   </div>
// </div>



//     </div>
//   );
// };

import React, { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useConsensusGRN, EdgeData } from "../hooks/useConsensusGRN";

interface GRNExplorerProps {
  edges: EdgeData[];
  selectedAlgorithms: string[];
  minSupport?: number;
  layout?: string;
}

export default const GRNExplorer: React.FC<GRNExplorerProps> = ({
  edges,
  selectedAlgorithms,
  minSupport = 2,
  layout = "cose",
}) => {
  const cyRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const { filteredEdges, nodeDegrees, clusters } = useConsensusGRN({
    edges,
    selectedAlgorithms,
    minSupport,
  });

  // Convert to Cytoscape elements
  const cytoscapeElements = [
    // nodes
    ...Array.from(
      new Set(filteredEdges.flatMap((e) => [e.source, e.target]))
    ).map((id) => ({
      data: {
        id,
        label: id,
        size: 10 + (nodeDegrees[id] || 0) * 2,
        cluster: clusters[id] || 0,
      },
    })),
    // edges
    ...filteredEdges.map((e) => ({
      data: {
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        algorithms: e.algorithms,
        supportCount: Object.keys(e.algorithms).length,
      },
    })),
  ];

  // Stylesheet with color by support
  const cytoscapeStylesheet = [
    {
      selector: "node",
      style: {
        label: "data(label)",
        width: "data(size)",
        height: "data(size)",
        backgroundColor: "mapData(cluster, 0, 5, #FF4136, #0074D9)",
        color: "#000",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": 10,
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": (ele: any) => {
          const support = ele.data("supportCount");
          if (support === 1) return "#FF4136";
          if (support === 2) return "#FF851B";
          if (support === 3) return "#2ECC40";
          if (support === 4) return "#0074D9";
          return "#B10DC9";
        },
      },
    },
  ];

  const handleCyInit = (cy: any) => {
    cyRef.current = cy;

    cy.on("tap", "node", (evt: any) => {
      setSelectedNode(evt.target.data());
    });

    // Edge hover tooltip
    cy.on("mouseover", "edge", (evt: any) => {
      const edge = evt.target;
      const algoList = Object.entries(edge.data("algorithms"))
        .map(([algo, score]) => `${algo}:${score.toFixed(2)}`)
        .join(", ");
      edge.qtip({
        content: algoList,
        show: { event: evt.type },
        hide: { event: "mouseout" },
        position: { my: "top center", at: "bottom center" },
      });
    });
  };

  return (
    <div>
      <CytoscapeComponent
        cy={handleCyInit}
        elements={cytoscapeElements}
        style={{ width: "100%", height: "600px" }}
        stylesheet={cytoscapeStylesheet}
        layout={{ name: layout }}
      />

      {/* Edge support legend */}
      <div style={{ marginTop: 12 }}>
        <strong>Edge Support Legend:</strong>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          {[1, 2, 3, 4, "≥5"].map((n, idx) => {
            const colors = ["#FF4136", "#FF851B", "#2ECC40", "#0074D9", "#B10DC9"];
            return (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 20, height: 2, backgroundColor: colors[idx] }}></div>{" "}
                {n} algorithm{n !== 1 ? "s" : ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
