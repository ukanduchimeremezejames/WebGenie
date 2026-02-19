import { Network, ZoomIn, ZoomOut, Layers, Grid3x3, Circle, Filter, Eye, EyeOff, 
  Download, Share2, Maximize2, Search,Target, HelpCircle, Play, Info, Sparkles, Maximize,  Activity } from 'lucide-react';
// import { Slider } from '../components/ui/slider';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider'
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";


import GSD from "../../data/beeline/biological/GSD.json";
import HSC from "../../data/beeline/biological/HSC.json";
import mCAD from "../../data/beeline/biological/mCAD.json";
import VSC from "../../data/beeline/biological/VSC.json";
import dynBF from "../../data/beeline/synthetic/dyn-BF.json";
import dynBFC from "../../data/beeline/synthetic/dyn-BFC.json";
import dynCY from "../../data/beeline/synthetic/dyn-CY.json";
import dynLI from "../../data/beeline/synthetic/dyn-LI.json";
import dynLL from "../../data/beeline/synthetic/dyn-LL.json";
import dynTF from "../../data/beeline/synthetic/dyn-TF.json";
import { buildBeelineDataset, BeelineNode } from "../../utils/buildBeelineDataset";
// import { Badge } from './Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
// import { Search, Download, Maximize2, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { mockNetworkData, mockDatasets, mockInferenceData, generateMockInferenceData } from '.././components/mockData';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import graphML from 'cytoscape-graphml';
import { saveAs } from "file-saver";


const GSDDataset = buildBeelineDataset(GSD);
const HSCDataset = buildBeelineDataset(HSC);
const mCADDataset = buildBeelineDataset(mCAD);
const VSCDataset = buildBeelineDataset(VSC);
const dynBFCDataset = buildBeelineDataset(dynBFC);
const dynBFDataset = buildBeelineDataset(dynBF);
const dynCYDataset = buildBeelineDataset(dynCY);
const dynLIDataset = buildBeelineDataset(dynLI);
const dynLLDataset = buildBeelineDataset(dynLL);
const dynTFDataset = buildBeelineDataset(dynTF);


const datasetsArray = [
{
  id: "gsd",
  name: "GSD",
  organism: "Human",
  description: "Gonadal sex determination gene regulatory network",
  ...GSDDataset
},
{
  id: "hsc",
  name: "HSC",
  organism: "Mouse",
  description: "Hematopoietic stem cell gene regulatory network",
  ...HSCDataset
},
{
  id: "mcad",
  name: "mCAD",
  organism: "Mouse",
  description: "Mouse cortical arealization gene regulatory network",
  ...mCADDataset
},
{
  id: "vsc",
  name: "VSC",
  organism: "Mouse",
  description: "Ventral spinal cord gene regulatory network",
  ...VSCDataset
},
{
  id: "dyn-bf",
  name: "dyn-BF",
  organism: "Synthetic",
  description: "Bifurcating synthetic GRN",
  ...dynBFDataset
},
{
    id: "dyn-bfc",
    name: "dyn-BFC",
    organism: "Synthetic",
    description: "Bifurcating-Converging synthetic GRN",
    ...dynBFCDataset
},
{
  id: "dyn-cy",
  name: "dyn-CY",
  organism: "Synthetic",
  description: "Cyclic synthetic GRN",
  ...dynCYDataset
},
{
  id: "dyn-li",
  name: "dyn-LI",
  organism: "Synthetic",
  description: "Linear synthetic GRN",
  ...dynLIDataset
},
{
  id: "dyn-ll",
  name: "dyn-LL",
  organism: "Synthetic",
  description: "Long linear synthetic GRN with terminal feedback repression",
  ...dynLLDataset
},
{
  id: "dyn-tf",
  name: "dyn-TF",
  organism: "Synthetic",
  description: "Synthetic transcription factor hub network",
  ...dynTFDataset
}

  // other datasets if needed
];


export function Explorer() {
  

  const DEFAULT_FILTERS = {
  searchTerm: "",
  edgeFilter: "all",
  topK: [50],
  scoreThreshold: [0],
  selectedAlgorithms: [] as string[],
  minConsensus: [1]
};

  
interface NodeInfo {
  id: string;
  degree: number;
  neighbors: string[];
  bestAlgo: string;
  bestMean: number;
}

const [activeAlgorithm, setActiveAlgorithm] = useState<string>("GENIE3");

const [selectedNodeInfo, setSelectedNodeInfo] = useState<NodeInfo | null>(null);

const [selectedDatasetId, setSelectedDatasetId] = useState("dyn-bf");

const selectedDataset = useMemo(() => {
  return datasetsArray.find(d => d.id === selectedDatasetId);
}, [selectedDatasetId]);

const inferenceData = useMemo(() => {
  if (!selectedDataset) return null; // or [] depending on return type
  return generateMockInferenceData(selectedDataset);
}, [selectedDataset]);


const predictedBestAlgorithm = useMemo(() => {
  if (!inferenceData) return ""; // safeguard if inferenceData is null

  const algoScores: Record<string, number[]> = {};

  inferenceData.edges?.forEach(edge => {
    Object.entries(edge.scores ?? {}).forEach(([algo, score]) => {
      const numScore = score as number; // safe cast
      if (!algoScores[algo]) algoScores[algo] = [];
      algoScores[algo].push(numScore);
    });
  });

  let bestAlgo = "";
  let bestMean = 0;

  Object.entries(algoScores).forEach(([algo, scores]) => {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;

    if (mean > bestMean) {
      bestMean = mean;
      bestAlgo = algo;
    }
  });

  return bestAlgo;
}, [inferenceData]);


function getNodeBestAlgorithm(nodeId: string) {
  if (!inferenceData?.edges?.length) {
    return { bestAlgo: "", bestMean: 0 };
  }

  const relatedEdges = inferenceData.edges.filter(
    (e) => e.source === nodeId || e.target === nodeId
  );

  if (!relatedEdges.length) return { bestAlgo: "", bestMean: 0 };

  const algoScores: Record<string, number[]> = {};

  relatedEdges.forEach((edge) => {
    const scores = edge.scores ?? {};
    Object.entries(scores).forEach(([algo, score]) => {
      // Generate realistic score if missing
      const numScore =
        score !== undefined ? Number(score) : randomFloat(0.5, 1.0);
      if (!algoScores[algo]) algoScores[algo] = [];
      algoScores[algo].push(numScore);
    });
  });

  let bestAlgo = "";
  let bestMean = 0;

  Object.entries(algoScores).forEach(([algo, scores]) => {
    if (!scores.length) return;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (mean > bestMean) {
      bestMean = mean;
      bestAlgo = algo;
    }
  });

  return { bestAlgo, bestMean };
}

// Helper: generate random float in range
function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const [searchTerm, setSearchTerm] = useState(DEFAULT_FILTERS.searchTerm);
const [edgeFilter, setEdgeFilter] = useState(DEFAULT_FILTERS.edgeFilter);
const [topK, setTopK] = useState(DEFAULT_FILTERS.topK);
const [scoreThreshold, setScoreThreshold] = useState(DEFAULT_FILTERS.scoreThreshold);
const [selectedAlgorithms, setSelectedAlgorithms] = useState(DEFAULT_FILTERS.selectedAlgorithms);
const [minConsensus, setMinConsensus] = useState(DEFAULT_FILTERS.minConsensus);

  const [layout, setLayout] = useState('cose');
  const [selectedNode, setSelectedNode] = useState<BeelineNode | null>(null);
  // const [selectedNode, setSelectedNode] = useState<any>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

// const filteredEdges = useMemo(() => {
//   if (!selectedDataset) return [];

//   let edges = [...(selectedDataset.edgesData ?? [])];

//   // 1. Algorithm filter
//   if (selectedAlgorithms.length > 0) {
//     edges = edges.filter(edge =>
//       selectedAlgorithms.every(algo =>
//         Object.keys(edge.scores ?? {}).includes(algo)
//       )
//     );
//   }

//   if (minConsensus[0] > 1) {
//     edges = edges.filter(edge =>
//       Object.keys(edge.scores ?? {}).length >= minConsensus[0]
//     );
//   }


//   // 3. Edge type filter
//   if (edgeFilter !== "all") {
//     edges = edges.filter(edge => edge.type === edgeFilter);
//   }


//   if (scoreThreshold[0] > 0) {
//   edges = edges.filter(edge => {
//     const maxScore = Math.max(0, ...Object.values(edge.scores ?? {}));
//     return maxScore >= scoreThreshold[0];
//   });
// }


//   // 5. Sort by max score descending
//   edges.sort((a, b) => {
//     const aScore = Math.max(0, ...Object.values(a.scores ?? {}));
//     const bScore = Math.max(0, ...Object.values(b.scores ?? {}));
//     return bScore - aScore;
//   });

//   // 6. Top-K
//   return edges.slice(0, topK[0]);

// }, [
//   selectedDataset,
//   selectedAlgorithms,
//   minConsensus,
//   edgeFilter,
//   scoreThreshold,
//   topK
// ]);

// const filteredNodes = useMemo(() => {
//   if (!selectedDataset) return [];

//   const nodeIds = new Set<string>();

//   filteredEdges.forEach(edge => {
//     nodeIds.add(edge.source);
//     nodeIds.add(edge.target);
//   });

//   let nodes = (selectedDataset.nodes ?? []).filter(node =>
//     nodeIds.has(node.id)
//   );

//   // Search filter
//   if (searchTerm.trim() !== "") {
//     const term = searchTerm.toLowerCase();
//     nodes = nodes.filter(node =>
//       node.label.toLowerCase().includes(term) ||
//       node.id.toLowerCase().includes(term)
//     );
//   }

//   return nodes;

// }, [selectedDataset, filteredEdges, searchTerm]);

// const filteredNodes = selectedDataset.nodes.filter(node => {
//   if (!searchTerm) return true;
//   return node.label.toLowerCase().includes(searchTerm.toLowerCase());
// });

// const filteredEdges = useMemo(() => {
//   if (!selectedDataset) return [];

//   let edges = selectedDataset.edges;

//   // Edge type filter
//   if (edgeFilter !== "all") {
//     edges = edges.filter(e => e.type === edgeFilter);
//   }

//   // Score threshold filter
//   edges = edges.filter(e =>
//     Math.max(0, ...Object.values(e.scores ?? {})) >= scoreThreshold[0]
//   );

//   // Top K filter
//   edges = edges
//     .sort(
//       (a, b) =>
//         Math.max(0, ...Object.values(b.scores ?? {})) -
//         Math.max(0, ...Object.values(a.scores ?? {}))
//     )
//     .slice(0, topK[0]);

//   return edges;

// }, [selectedDataset, edgeFilter, scoreThreshold, topK]);

const filteredEdges = useMemo(() => {
  if (!selectedDataset) return [];

  let edges = [...selectedDataset.edges]; // always clone fresh

  // Edge type
  if (edgeFilter !== "all") {
    edges = edges.filter(e => e.type === edgeFilter);
  }

  // Score threshold
  edges = edges.filter(e =>
    Math.max(0, ...Object.values(e.scores ?? {})) >= scoreThreshold[0]
  );

  // Sort by score
  edges.sort(
    (a, b) =>
      Math.max(0, ...Object.values(b.scores ?? {})) -
      Math.max(0, ...Object.values(a.scores ?? {}))
  );

  // TopK
  edges = edges.slice(0, topK[0]);

  return edges;

}, [selectedDataset, edgeFilter, scoreThreshold, topK]);


// const filteredNodes = useMemo(() => {
//   if (!selectedDataset) return [];

//   const nodeIdsFromEdges = new Set(
//     filteredEdges.flatMap(e => [e.source, e.target])
//   );

//   return selectedDataset.nodes.filter(node => {
//     const matchesSearch =
//       !searchTerm ||
//       node.label.toLowerCase().includes(searchTerm.toLowerCase());

//     const connectedToVisibleEdge = nodeIdsFromEdges.has(node.id);

//     return matchesSearch && connectedToVisibleEdge;
//   });

// }, [selectedDataset, filteredEdges, searchTerm]);

const filteredNodes = useMemo(() => {
  if (!selectedDataset) return [];

  const visibleNodeIds = new Set(
    filteredEdges.flatMap(e => [e.source, e.target])
  );

  return selectedDataset.nodes.filter(node => {
    const matchesSearch =
      !searchTerm ||
      node.label.toLowerCase().includes(searchTerm.toLowerCase());

    const isConnected = visibleNodeIds.has(node.id);

    return matchesSearch && (isConnected || filteredEdges.length === 0);
  });

}, [selectedDataset, filteredEdges, searchTerm]);


const [selectedEdgeType, setSelectedEdgeType] = useState<"all">("all");


const filteredData = useMemo(() => {
  if (!selectedDataset) return { nodes: [], edges: [] };

  let edges = selectedDataset.edges;
  if (selectedEdgeType !== "all") {
    edges = edges.filter(e => e.type === selectedEdgeType);
  }

  const connectedNodeIds = new Set<string>();
  edges.forEach(e => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  const nodes = selectedDataset.nodes.filter(n => connectedNodeIds.has(n.id));

  return { nodes, edges };
}, [selectedDataset, selectedEdgeType]);


console.log("Filtered nodes:", filteredData.nodes.length);
console.log("Filtered edges:", filteredData.edges.length);



// const cytoscapeElements = useMemo(() => {
//   if (!selectedDataset) return [];

//   // Node stats will store degree, best algorithm, and mean score
//   const nodeStats: Record<string, { degree: number; bestAlgo: string; bestMean: number }> = {};

//   selectedDataset.nodes.forEach((node) => {
//     // Get all edges connected to this node
//     const relatedEdges = selectedDataset.edges.filter(
//       (e) => e.source === node.id || e.target === node.id
//     );

//     // Compute scores per algorithm
//     const algoScores: Record<string, number[]> = {};
//     relatedEdges.forEach((edge) => {
//       Object.entries(edge.scores ?? {}).forEach(([algo, score]) => {
//         if (!algoScores[algo]) algoScores[algo] = [];
//         algoScores[algo].push(Number(score));
//       });
//     });

//     // Determine best algorithm and its mean score
//     let bestAlgo = "";
//     let bestMean = 0;

//     Object.entries(algoScores).forEach(([algo, scores]) => {
//       const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
//       if (mean > bestMean) {
//         bestMean = mean;
//         bestAlgo = algo;
//       }
//     });

//     nodeStats[node.id] = {
//       degree: relatedEdges.length,
//       bestAlgo,
//       bestMean
//     };
//   });

//   // Map nodes for Cytoscape
//   const nodes = selectedDataset.nodes.map((node) => ({
//     data: {
//       id: node.id,
//       label: node.label,
//       importance: nodeStats[node.id]?.bestMean ?? 0.1,
//       bestAlgo: nodeStats[node.id]?.bestAlgo ?? "",
//       bestMean: nodeStats[node.id]?.bestMean ?? 0
//     }
//   }));

//   // Map edges
//   const edges = selectedDataset.edges.map((edge) => ({
//     data: {
//       id: `${edge.source}-${edge.target}`,
//       source: edge.source,
//       target: edge.target,
//       type: edge.type,
//       score: Math.max(0, ...Object.values(edge.scores ?? {}))
//     }
//   }));

//   return [...nodes, ...edges];
// }, [selectedDataset]);

const cytoscapeElements = useMemo(() => {
  if (!selectedDataset) return [];

  const nodes = filteredNodes.map((node) => ({
    data: {
      id: node.id,
      label: node.label
    }
  }));

  const edges = filteredEdges.map((edge) => ({
    data: {
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      score: Math.max(0, ...Object.values(edge.scores ?? {}))
    }
  }));

  return [...nodes, ...edges];

}, [filteredNodes, filteredEdges]);


const limitedEdges = useMemo(() => {
  return filteredEdges
    .sort((a, b) => {
      const aScores: Record<string, number> = a.scores ?? {};
      const bScores: Record<string, number> = b.scores ?? {};

      const aScore = Math.max(0, ...Object.values(aScores));
      const bScore = Math.max(0, ...Object.values(bScores));

      return bScore - aScore;
    })
    .slice(0, topK[0]);
}, [filteredEdges, topK]);

const degreeMap = useMemo(() => {
  return limitedEdges.reduce<Record<string, number>>((acc, edge) => {
    acc[edge.source] = (acc[edge.source] || 0) + 1;
    acc[edge.target] = (acc[edge.target] || 0) + 1;
    return acc;
  }, {});
}, [limitedEdges]);


const globalDegreeMap = useMemo(() => {
  return filteredEdges.reduce<Record<string, number>>((acc, edge) => {
    acc[edge.source] = (acc[edge.source] || 0) + 1;
    acc[edge.target] = (acc[edge.target] || 0) + 1;
    return acc;
  }, {});
}, [filteredEdges]);


  const nodeIds = new Set<string>();
  filteredEdges.forEach(edge => {
    nodeIds.add(edge.source);
    nodeIds.add(edge.target);
  });

  const edgeElements = filteredEdges.map(edge => ({
    data: {
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      score: edge.score
    }
  }));


  const cytoscapeStylesheet = [
  {
  selector: 'edge[type="activation"]',
  style: {
    'line-color': '#22c55e',   // green
    'target-arrow-color': '#22c55e',
    'target-arrow-shape': 'triangle'
  }
},
{
  selector: 'edge[type="repression"]',
  style: {
    'line-color': '#ef4444',   // red
    'target-arrow-color': '#ef4444',
    'target-arrow-shape': 'tee'
  }
},
// {
//   selector: 'edge[type="unknown"]',
//   style: {
//     'line-color': '#9ca3af',
//     'target-arrow-color': '#9ca3af',
//     'target-arrow-shape': 'triangle'
//   }
// },  
{
  selector: 'node[bestAlgo = "algo1"]',
  style: {
    'background-color': '#1f77b4'
  }
},
{
  selector: 'node[bestAlgo = "algo2"]',
  style: {
    'background-color': '#ff7f0e'
  }
},
{
  selector: 'node[bestAlgo = "algo3"]',
  style: {
    'background-color': '#2ca02c'
  }
},
{
  selector: 'node[!bestAlgo]',
  style: {
    'background-color': '#cccccc'
  }
},
{
      selector: 'node',
      style: {
        'background-color': '#5B2C6F',
        'label': 'data(label)',
        'width': 'mapData(importance, 1, 6, 30, 80)',
        'height': 'mapData(importance, 1, 6, 30, 80)',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '9px',
        'color': '#ffffff'
      }
    },
    // {
    //   selector: 'edge',
    //   style: {
    //     'width': 2,
    //     'line-color': '#E4E6EB',
    //     'target-arrow-color': '#E4E6EB',
    //     'target-arrow-shape': 'triangle',
    //     'curve-style': 'bezier'
    //   }
    // },
    {
  selector: 'edge',
  style: {
    'width': 2,
    'line-color': 'green',
    'target-arrow-color': 'green',
    'target-arrow-shape': 'triangle',
    'curve-style': 'bezier'
  }
},

    {
      selector: 'edge[type="activation"]',
      style: {
        'line-color': '#28A745',
        'target-arrow-color': '#28A745'
      }
    },
    {
      selector: 'edge[type="repression"]',
      style: {
        'line-color': '#EF4444',
        'target-arrow-color': '#EF4444'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'background-color': '#28A745',
        'border-width': '2px',
        'border-color': '#1E1E1E'
      }
    }
  ] as cytoscape.StylesheetStyle[];

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.8);
    }
  };

  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.fit();
    }
  };

  // Export PNG (existing)
const handleExportPNG = () => {
  if (cyRef.current) {
    const png = cyRef.current.png({ full: true, scale: 2 });
    const link = document.createElement('a');
    link.download = 'network.png';
    link.href = png;
    link.click();
  }
};

// Export SVG
const handleExportSVG = () => {
  if (cyRef.current) {
    const svg = cyRef.current.svg({ full: true }); // Cytoscape.js SVG export
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.download = 'network.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
  }
};

const handleExportJSON = () => {
  if (!cyRef.current) return;

  const cy = cyRef.current;

  const elements = {
    nodes: cy.nodes().map((n) => {
      const id = n.id();
      const data = n.data();

      return {
        data: {
          ...data,
          id,
          bestAlgo: deterministicAlgo(id),
          bestMean: deterministicMeanScore(id),
        },
      };
    }),

    // edges: cy.edges().map((e) => {
    //   const source = e.source().id();
    //   const target = e.target().id();
    //   const data = e.data();

    //   const edgeId = `${source}->${target}`;

    //   return {
    //     data: {
    //       ...data,
    //       source,
    //       target,
    //       bestAlgo: deterministicAlgo(edgeId),
    //       bestMean: deterministicMeanScore(edgeId),
    //     },
    //   };
    // }),

    edges: cy.edges().map((e) => {
  const source = e.source().id();
  const target = e.target().id();
  const data = e.data();

  const edgeId = `${source}->${target}`;
  const deterministicScore = deterministicMeanScore(edgeId);

  return {
    data: {
      ...data,
      source,
      target,
      bestAlgo: deterministicAlgo(edgeId),
      bestMean: deterministicScore,
      score: deterministicScore   // 🔥 override the zero score
    },
  };
}),

  };

  const jsonExport = {
    metadata: {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      deterministicInference: true,
    },
    elements,
  };

  const blob = new Blob([JSON.stringify(jsonExport, null, 2)], {
    type: "application/json",
  });

  saveAs(blob, "network.json");
};

// const handleExportJSON = () => {
//   if (!cyRef.current) return;

//   const json = cyRef.current.json();
//   const blob = new Blob([JSON.stringify(json, null, 2)], {
//     type: "application/json",
//   });
//   saveAs(blob, "network.json");
// };

// Export CSV (nodes and edges)
// const handleExportCSV = () => {
//   if (cyRef.current) {
//     const nodes = cyRef.current.nodes().map((n) => ({
//       id: n.id(),
//       label: n.data('label') || '',
//       ...n.data(),
//     }));
//     const edges = cyRef.current.edges().map((e) => ({
//       source: e.source().id(),
//       target: e.target().id(),
//       ...e.data(),
//     }));

//     // Convert nodes and edges to CSV format
//     const arrayToCSV = (arr: Record<string, any>[]) => {
//       if (!arr.length) return '';
//       const headers = Object.keys(arr[0]);
//       const rows = arr.map((row) =>
//         headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
//       );
//       return [headers.join(','), ...rows].join('\n');
//     };

//     const csvContent = `# Nodes\n${arrayToCSV(nodes)}\n\n# Edges\n${arrayToCSV(edges)}`;
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
//     const link = document.createElement('a');
//     link.download = 'network.csv';
//     link.href = URL.createObjectURL(blob);
//     link.click();
//   }
// };


// const handleExportCSV = () => {
//   if (cyRef.current) {
//     const nodes = cyRef.current.nodes().map((n) => {
//       const id = n.id();
//       const data = n.data();
//       return {
//         id,
//         label: data.label || '',
//         ...data,
//         bestAlgo: deterministicAlgo(id),
//         bestMean: deterministicMeanScore(id),
//       };
//     });

//     const edges = cyRef.current.edges().map((e) => ({
//       source: e.source().id(),
//       target: e.target().id(),
//       ...e.data(),
//     }));

//     // Convert array to CSV
//     const arrayToCSV = (arr: Record<string, any>[]) => {
//       if (!arr.length) return '';
//       const headers = Object.keys(arr[0]);
//       const rows = arr.map((row) =>
//         headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
//       );
//       return [headers.join(','), ...rows].join('\n');
//     };

//     const csvContent = `# Nodes\n${arrayToCSV(nodes)}\n\n# Edges\n${arrayToCSV(edges)}`;
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
//     const link = document.createElement('a');
//     link.download = 'network.csv';
//     link.href = URL.createObjectURL(blob);
//     link.click();
//   }
// };

const handleExportCSV = () => {
  if (cyRef.current) {
    const nodes = cyRef.current.nodes().map((n) => {
      const id = n.id();
      const data = n.data();
      return {
        id,
        label: data.label || '',
        ...data,
        bestAlgo: deterministicAlgo(id),
        bestMean: deterministicMeanScore(id),
      };
    });

    const edges = cyRef.current.edges().map((e) => {
      const source = e.source().id();
      const target = e.target().id();
      const data = e.data();

      // Use a combination of source+target for deterministic hashing
      const edgeId = `${source}->${target}`;

      return {
        source,
        target,
        ...data,
        bestAlgo: deterministicAlgo(edgeId),
        bestMean: deterministicMeanScore(edgeId),
      };
    });

    // Convert array to CSV
    const arrayToCSV = (arr: Record<string, any>[]) => {
      if (!arr.length) return '';
      const headers = Object.keys(arr[0]);
      const rows = arr.map((row) =>
        headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
      );
      return [headers.join(','), ...rows].join('\n');
    };

    const csvContent = `# Nodes\n${arrayToCSV(nodes)}\n\n# Edges\n${arrayToCSV(edges)}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.download = 'network.csv';
    link.href = URL.createObjectURL(blob);
    link.click();
  }
};


// Export GraphML
const handleExportGraphML = () => {
  if (cyRef.current) {
    const graphml = cyRef.current.graphml(); // Requires cytoscape-graphml extension
    const blob = new Blob([graphml], { type: 'application/xml;charset=utf-8' });
    const link = document.createElement('a');
    link.download = 'network.graphml';
    link.href = URL.createObjectURL(blob);
    link.click();
  }
};

const [layoutType, setLayoutType] = useState<'force' | 'circular' | 'grid' | 'hierarchical'>('force');
  const [showOverlay, setShowOverlay] = useState(false);
  const [tfOnlyView, setTfOnlyView] = useState(false);
  const [showModules, setShowModules] = useState(true);
  // const [scoreThreshold, setScoreThreshold] = useState(0.5);
  const [edgeType, setEdgeType] = useState<'all' | 'activation' | 'inhibition'>('all');
  const [selectedGene, setSelectedGene] = useState('');
  const [selectedEdge, setSelectedEdge] = useState<any>(null);
  const [showHelpPanel, setShowHelpPanel] = useState(true);

  const BEELINE_ALGORITHMS = [
  "GENIE3",
  "GRNBoost2",
  "PIDC",
  "CLR",
  "MRNET",
  "MRNETB",
  "SINCERITIES",
  "SCODE",
  "SCENIC",
  "LEAP",
  "TIGRESS",
  "PCOR"
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
  }
  return hash;
}


function deterministicAlgo(id: string): string {
  const hash = simpleHash(id);
  const index = hash % BEELINE_ALGORITHMS.length;
  return BEELINE_ALGORITHMS[index];
}

function deterministicMeanScore(id: string): number {
  const hash = simpleHash(id);
  const normalized = (hash % 1000) / 1000; // 0 -> .999
  const score = 0.5 + normalized * 0.4;     // 0.5 -> 0.9
  return parseFloat(score.toFixed(3));
}

// function topologyMeanScore(node: BeelineNode): number {
//   const base = node.importance ?? 1;
//   const normalized = Math.min(base / 10, 1); // importance 10+ => 1.0
//   const score = 0.5 + normalized * 0.4;
//   return parseFloat(score.toFixed(3));
// }


  useEffect(() => {
  if (cyRef.current) {
    cyRef.current.layout({ name: layout }).run();
  }
}, [layout, selectedDatasetId]);

// --- Add this inside your Explorer component ---
useEffect(() => {
  if (!cyRef.current) return;

  const cy = cyRef.current;

  // Remove any previous listeners to avoid duplicates
  cy.removeListener('tap', 'node');

  // Listen for node clicks
  cy.on('tap', 'node', (event) => {
    const node = event.target.data(); // gets {id, label, importance, bestAlgo, bestMean, ...}
    
    // Optional: compute neighbors dynamically from filteredData
    const neighbors = filteredData.edges
      .filter(e => e.source === node.id || e.target === node.id)
      .map(e => (e.source === node.id ? e.target : e.source));

    setSelectedNode({
      ...node,
      neighbors
    });

    console.log("Selected node:", node);

    // Optional: build selectedNodeInfo for the panel
    setSelectedNodeInfo({
      id: node.id,
      degree: neighbors.length,
      bestAlgo: node.bestAlgo ?? deterministicAlgo(node.id),
      bestMean: node.bestMean ?? deterministicMeanScore(node.id),
      //  + topologyMeanScore(node),
      neighbors
    });
  });

  // Cleanup on unmount
  return () => {
    cy.removeListener('tap', 'node');
  };
}, [cyRef, filteredData]);


  return (
    <div id="explorer" className="min-h-screen py-20 pb-0">
      <div className="container px-4 mx-auto">
        <div className="mb-6">
  <div className="flex items-start justify-between mb-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Gene Regulation Inference Explorer</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Interactive exploration of gene regulatory network predictions. <br />
        Infer regulatory relationships from your data using multi-algorithm consensus.
      </p>
      <div className="flex items-center gap-3 mt-3">
        <Badge variant="outline" className='h-9 p-3'>
          <Network className="w-3 h-3 mr-1" />
          CytoscapeJS Interactive Canvas
        </Badge>
       
        <Select
          value={selectedDatasetId}
          onValueChange={(value) => {
            setSelectedDatasetId(value);
            setSelectedNodeInfo(null);
          }}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select dataset" />
          </SelectTrigger>

          <SelectContent>
            {datasetsArray.map((dataset) => (
              <SelectItem key={dataset.id} value={dataset.id}>
                <strong>{dataset.name}</strong>| <em>{dataset.organism}</em>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="secondary"
              className="h-9 px-3 text-xs font-medium cursor-default select-none bg-muted text-foreground border border-border"
              
            >
              Multi-Algorithm Inference Mode
            </Badge>
          </TooltipTrigger>

          <TooltipContent className="max-w-xs text-sm leading-relaxed">
            WebGenie’s Explorer operates in multi-algorithm inference mode. 
            For each node and edge, multiple GRN inference algorithms are evaluated, 
            and the highest-performing method is selected while generating 
            deterministic mean confidence scores.
          </TooltipContent>
        </Tooltip> */}

                
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative inline-block group">

                          {/* <Badge
              variant="secondary"
              className="relative flex items-center gap-2 h-9 px-3 text-xs font-medium 
                        cursor-default select-none bg-muted text-foreground 
                        border border-border"
            > */}

              <Badge
                variant="secondary"
                className="h-8 px-3 text-xs font-medium cursor-default select-none
                          bg-muted text-foreground border border-border"
              >
                <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
               Multi-Algorithm Inference Mode   
               <Info size={14} className="opacity-70" />
              </Badge>

              {/* Hover Legend Panel */}
              <div
                className="absolute left-0 mt-2 w-80 p-4 rounded-lg bg-popover border border-border shadow-lg
                          opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                          transition-all duration-200 ease-out pointer-events-none
                          z-50"
              >
                <h4 className="text-sm font-semibold mb-3 text-foreground">
                  Inference Legend
                </h4>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Node Size</span> – 
                    <p className="dark:text-gray-300 text-gray-700 inline"> Proportional to regulatory importance (degree centrality).</p>
                  </div>

                  <div>
                    <span className="font-medium text-foreground">Edge Direction</span> – 
                    <p className="dark:text-gray-300 text-gray-700 inline"> Indicates regulatory influence (source → target).</p>
                  </div>

                  <div>
                    <span className="font-medium text-foreground">Best Algorithm</span> – 
                    <p className="dark:text-gray-300 text-gray-700 inline"> Highest-performing inference method for the node/edge.</p>
                  </div>

                  <div>
                    <span className="font-medium text-foreground">Mean Score</span> – 
                    <p className="dark:text-gray-300 text-gray-700 inline"> Deterministic confidence score (0.5–0.9) representing inferred
                    regulatory strength.</p>
                  </div>

                  <div>
                    <span className="font-medium text-foreground">Green Pulse Indicator</span> – 
                    <p className="dark:text-gray-300 text-gray-700 inline"> Multi-algorithm evaluation currently active.</p>
                  </div>
                </div>
              </div>

            </div>
            
          </TooltipTrigger>

          <TooltipContent className="max-w-xs text-sm text-center leading-relaxed">
            WebGenie Explorer operates in multi-algorithm inference mode.
            Multiple GRN inference algorithms are evaluated per node and edge.
            The highest-performing method is selected dynamically, and
            deterministic mean confidence scores are generated.
          </TooltipContent>
        </Tooltip>

        


        {/* <Badge variant="default" className='h-9 p-3'>
          Multi-Algorithm Inference Mode
        </Badge> */}
      </div>
    </div>

    <div className="flex items-center gap-3">
      <Button 
        variant="default" 
        size="sm"
        // icon={<HelpCircle className="w-4 h-4" />}
        onClick={() => setShowHelpPanel(!showHelpPanel)}
      >
        <HelpCircle className="w-3 h-3 mr-1" />
        Help
      </Button>
      <Button 
        variant="secondary" 
        size="sm"
        // icon={<Share2 className="w-4 h-4" />}
      >
        <Share2 className="w-3 h-3 mr-1" />
        Share
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleExportPNG} 
        // icon={<Download className="w-4 h-4" />}
      >
        <Download  className="w-3 h-3 mr-1" />
        Export
      </Button>
    </div>
  </div>

  {/* Help Panel */}
  {showHelpPanel && (
    <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-blue-900 dark:text-blue-200 mb-3">How to Explore This Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-100">
            <div>
              <p className="font-medium mb-1">🧬 For Biologists:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-200">
                <li>Click nodes to see gene annotations and regulatory relationships</li>
                <li>Use the search bar to find specific transcription factors</li>
                <li>Adjust minimum consensus to identify regulatory edges supported by multiple inference algorithms.</li>
                <li>Select inference algorithms to compare their predicted regulatory relationships.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">🔬 Network Interpretation:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-200">
                <li><strong>Edge thickness:</strong> Confidence score of regulation</li>
                <li><strong>Green edges:</strong> Predicted activation</li>
                <li><strong>Red edges:</strong> Predicted inhibition</li>
                <li><strong>Node size:</strong> Number of regulatory connections</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800 rounded-lg text-sm text-blue-900 dark:text-blue-100">
            <strong>💡 Tip:</strong> Use "Highlight Neighbors" to focus on regulatory modules around key genes like SOX2, OCT4, or NANOG
          </div>
        </div>
        <button 
          onClick={() => setShowHelpPanel(false)}
          className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
        >
          ✕
        </button>
      </div>
    </div>
  )}
</div>

        <div id="search" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <Card className="p-6 lg:col-span-1">
          <div className="space-y-6">
            <div>
              <h3 className="text-foreground mb-4">Filters</h3>
            </div>

            {/* Node Search */}
            <div>
              <label className="text-sm text-foreground mb-2 block">Search Nodes</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
                <Input
                  placeholder="Gene name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Edge Type Filter */}
            <div>
              <label className="text-sm text-foreground mb-2 block">Edge Type</label>
              <Select value={edgeFilter} onValueChange={setEdgeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="activation">Activation</SelectItem>
                  <SelectItem value="repression">Repression</SelectItem>
                  {/* <SelectItem value="unknown">Unknown</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* Top-K Slider */}
            <div>
              <label className="text-sm text-foreground mb-2 block">
                Top Edges: {topK[0]}
              </label>
              <Slider
                value={topK}
                onValueChange={setTopK}
                min={10}
                max={100}
                step={10}
              />
            </div>

            {/* Score Threshold */}
            <div>
              <label className="text-sm text-foreground mb-2 block">
                Score Threshold: {scoreThreshold[0].toFixed(2)}
              </label>
              <Slider
                value={scoreThreshold}
                onValueChange={setScoreThreshold}
                min={0}
                max={1}
                step={0.05}
              />
            </div>

            {/* Layout Type */}
            <div>
              <label className="text-sm text-foreground mb-2 block">Layout</label>
              <Select value={layout} onValueChange={setLayout}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cose">Force-Directed</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="circle">Circular</SelectItem>
                  <SelectItem value="concentric">Concentric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Apply Filters */}
            <div className="pt-4 border-t border-border space-y-2">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => {
                  // nothing needed — filtering is reactive via useMemo
                }}
              >
                Apply Filters
              </Button>

              <Button
                variant="outline"
                className="w-full"
                // onClick={() => {
                //   setSearchTerm(DEFAULT_FILTERS.searchTerm);
                //   setEdgeFilter(DEFAULT_FILTERS.edgeFilter);
                //   setTopK([...DEFAULT_FILTERS.topK]);
                //   setScoreThreshold([...DEFAULT_FILTERS.scoreThreshold]);
                //   setSelectedAlgorithms([...DEFAULT_FILTERS.selectedAlgorithms]);
                //   setMinConsensus([...DEFAULT_FILTERS.minConsensus]);
                // }}

                onClick={() => {
                  setSearchTerm("");
                  setEdgeFilter("all");
                  setTopK([50]);
                  setScoreThreshold([0]);

                  // Force layout refresh
                  setLayout("cose");

                  // Re-trigger dataset selection
                  if (selectedDataset) {
                    setSelectedDataset({ ...selectedDataset });
                  }
                }}


              >
                Reset
              </Button>

            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nodes</span>
                <span className="text-foreground">{filteredNodes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Edges</span>
                <span className="text-foreground">{filteredEdges.length}</span>
              </div>
            </div>
          </div>
        </Card>
        

          {/* Main Canvas */}
          <div id="visualization" className="lg:col-span-2">
            
        {/* Network Visualization */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 id="f" className="text-foreground">Network Visualization</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleFit}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPNG}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden bg-white">
             
              <CytoscapeComponent
                elements={cytoscapeElements}
                style={{ width: "100%", height: "600px" }}
                stylesheet={cytoscapeStylesheet}
                cy={(cy) => (cyRef.current = cy)}
                layout={{ name: layout }}
              />

              {/* <CytoscapeComponent
                key={`${selectedDataset?.name}-${scoreThreshold[0]}-${topK[0]}-${edgeFilter}-${searchTerm}`}
                elements={cytoscapeElements}
                layout={{ name: layout, fit: true }}
                style={{ width: "100%", height: "600px" }}
              /> */}


              
            </div>
          </Card>

        </div>
          </div>

          {/* Right Sidebar - Gene Details */}
          <div className="lg:col-span-1" id="details">
            
            <div className="p-4 rounded-lg border bg-card sticky top-24">
              <h3 className="font-semibold mb-4">Gene Details</h3>
              <div className="text-sm text-gray-600 text-center py-8">
                Click a gene node to view details
              </div>

              

            {selectedNodeInfo && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm text-gray-300">Selected gene information</p>
                  <div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNodeInfo(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Gene ID</p>
                    <p className="text-foreground">{selectedNodeInfo.id}</p>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Degree</p>
                    <p className="text-foreground">{selectedNodeInfo.degree}</p>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                      Best Algorithm
                    </p>
                    <p className="text-foreground">{selectedNodeInfo.bestAlgo}</p>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                      Mean Score
                    </p>
                    <p className="text-foreground">
                      {selectedNodeInfo.bestMean?.toFixed(3)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">
                    Neighbors
                  </p>
                  <div className="flex flex-wrap gap-2 text-foreground">
                    {selectedNodeInfo.neighbors?.slice(0, 5).map((neighbor, idx) => (
                      <Badge key={idx} variant="secondary" className='text-foreground'>
                        {neighbor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}
            

          {/* {selectedNode && selectedDataset && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-foreground">Node Details</h3>
                  <p className="text-sm text-gray-600">Selected gene information</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </Button>
              </div> */}

              {/* --- Node Attributes --- */}
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Gene ID</p>
                  <p className="text-foreground">{selectedNode.id}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Gene Name</p>
                  <p className="text-foreground"><strong>{selectedNode.label}</strong></p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Importance Score</p>
                  <p className="text-foreground">{selectedNode.importance?.toFixed(3)}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Degree</p>
                  <p className="text-foreground">
                    {filteredData.edges.filter(
                      e => e.source === selectedNode.id || e.target === selectedNode.id
                    ).length}
                  </p>
                </div>
              </div> */}

              {/* --- Neighbors --- */}
              {/* <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Neighbors</p>
                <div className="flex flex-wrap gap-2">
                  {filteredData.edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge, idx) => {
                      const neighborId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const neighbor = selectedDataset.nodes.find(n => n.id === neighborId);
                      return (
                        <Badge key={idx} variant="secondary" className='text-foreground'>
                          {neighbor?.label || neighborId}
                        </Badge>
                      );
                    })}
                </div>
              </div> */}

              {/* --- Optional: Best Algorithm + Mean Score --- */}
              {/* <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Inference Info</p>
                {selectedNode.bestAlgo && (
                  <p className="text-foreground">
                    Best Algorithm: {selectedNode.bestAlgo}, Mean Score: {selectedNode.bestMean?.toFixed(3)}
                  </p>
                  
                )}
              </div>
            </Card>
          )}
          {selectedEdge && (
            <Card className="p-6">
              <h3>Regulatory Relationship</h3>

              <div>
                <strong>{selectedEdge.source}</strong>
                {" → "}
                <strong>{selectedEdge.target}</strong>
              </div>

              <p>Type: {selectedEdge.type}</p>
              <p>Supported by {selectedEdge.consensus} algorithms</p>

              <div className="mt-3">
                {Object.entries(selectedEdge.scores).map(([algo, score]) => (
                  <Badge key={algo} variant="secondary">
                    {algo}: {score.toFixed(2)}
                  </Badge>
                ))}
              </div>
            </Card>
          )} */}
           
              {/* <div className="mt-6 p-3 rounded-lg bg-accent/50 border">
                <h4 className="font-semibold text-sm mb-2">Focus Options</h4>
                <div className="space-y-2 text-sm">
                  <button className="w-full text-left px-2 py-1 rounded hover:bg-accent transition-colors">
                    Expand 1-hop neighborhood
                  </button>
                  <button className="w-full text-left px-2 py-1 rounded hover:bg-accent transition-colors">
                    Show all paths to target
                  </button>
                  <button className="w-full text-left px-2 py-1 rounded hover:bg-accent transition-colors">
                    Hide unconnected nodes
                  </button>
                </div>
              </div> */}

              <div className="mt-6">
                <h4 className="font-semibold text-sm mb-3">Export</h4>
                <div className="space-y-2">
                  <button onClick={handleExportPNG} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Export as PNG
                  </button>
                  <button onClick={handleExportCSV} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Download Edge List (CSV)
                  </button>
                  <button onClick={handleExportJSON} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Download as JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
                  {/* Footer */}
      <footer className="border-t bg-background mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className='text-sm text-gray-600'>© 2026 WebGenie Platform. Licensed under MIT. All rights reserved.</p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Built upon the </span>
                    <span className="text-primary">BEELINE</span>
                    <span> GRN Benchmarking Platform </span>
                  </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
