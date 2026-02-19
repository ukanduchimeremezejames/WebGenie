import { Network, ZoomIn, ZoomOut, Download, Share2, Maximize2, Search,HelpCircle, Sparkles} from 'lucide-react';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider'
import dynBFC from "../../data/beeline/synthetic/dyn-BFC.json";
import { buildBeelineDataset } from "../../utils/buildBeelineDataset";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { mockNetworkData, mockDatasets, mockInferenceData, generateMockInferenceData } from '.././components/mockData';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import graphML from 'cytoscape-graphml';
import { saveAs } from "file-saver";

const dynBFCDataset = buildBeelineDataset(dynBFC);

const datasets = {
  refNetwork: {
    nodes: [
      { id: "n1", label: "Node 1" },
      { id: "n2", label: "Node 2" },
    ],
    edges: [{ id: "e1", source: "n1", target: "n2", type: "activation" }],
  },
  hsaNetwork: {
    nodes: [
      { id: "n3", label: "Node 3" },
      { id: "n4", label: "Node 4" },
    ],
    edges: [{ id: "e2", source: "n3", target: "n4", type: "repression" }],
  },
};

// const datasetsArray = [
//   { id: "refNetwork", name: "Reference Network", nodes: [], edges: [] },
//   { id: "hsaNetwork", name: "HSA Network", nodes: [], edges: [] }
// ];



// const datasets = [
//   {
//     id: "dyn-bfc",
//     name: "dyn-BFC",
//     organism: "Synthetic",
//     description: "Bifurcating-Converging synthetic GRN",
//     ...dynBFCDataset
//   }
// ];

// Outside your App function, so it’s not recreated on every render
// const datasets = {
//   refNetwork: {
//     nodes: [
//       { id: "n1", label: "Node 1" },
//       { id: "n2", label: "Node 2" }
//     ],
//     edges: [
//       { id: "e1", source: "n1", target: "n2", type: "activates" }
//     ]
//   },
//   hsaNetwork: {
//     nodes: [
//       { id: "n3", label: "Node 3" },
//       { id: "n4", label: "Node 4" }
//     ],
//     edges: [
//       { id: "e2", source: "n3", target: "n4", type: "inhibits" }
//     ]
//   }
// };

// export default function App() {
//   const [selectedDatasetId, setSelectedDatasetId] = useState("refNetwork");

//   // const activeDataset = datasets[selectedDatasetId];

//   // filteredData logic here...
// }


// const activeDataset = datasets[selectedDatasetId];

// const filteredData = useMemo(() => {
//   if (!activeDataset) return { nodes: [], edges: [] };

//   let edges = activeDataset.edges;
//   if (selectedEdgeType !== "all") {
//     edges = edges.filter(edge => edge.type === selectedEdgeType);
//   }

//   // Keep only nodes that are connected
//   const connectedNodeIds = new Set<string>();
//   edges.forEach(e => {
//     connectedNodeIds.add(e.source);
//     connectedNodeIds.add(e.target);
//   });

//   const nodes = activeDataset.nodes.filter(node =>
//     connectedNodeIds.has(node.id)
//   );

//   return { nodes, edges };
// }, [activeDataset, selectedEdgeType]);

// console.log("Active dataset:", activeDataset);
// console.log("Filtered nodes:", filteredData.nodes.length);
// console.log("Filtered edges:", filteredData.edges.length);

const datasetsArray = [
  {
    id: "dyn-bfc",
    name: "dyn-BFC Synthetic Network",
    nodes: dynBFCDataset.nodes,
    edges: dynBFCDataset.edges
  },
  {
    id: "refNetwork",
    name: "Reference Network",
    nodes: [], // you can keep mock data or real data here
    edges: []
  },
  {
    id: "hsaNetwork",
    name: "HSA Network",
    nodes: [],
    edges: []
  }
];



export function Explorer() {

  // --- Dataset Selection ---
  // const [selectedDatasetId, setSelectedDatasetId] = useState("refNetwork");

  const [selectedDatasetId, setSelectedDatasetId] = useState("dyn-bfc");

const selectedDataset = useMemo(() => {
  return datasetsArray.find(d => d.id === selectedDatasetId);
}, [selectedDatasetId]);


  const activeDataset = datasets[selectedDatasetId];

  // --- Filtering ---
  const [selectedEdgeType, setSelectedEdgeType] = useState<"all" | "activation" | "repression">("all");

  // const filteredData = useMemo(() => {
  //   if (!activeDataset) return { nodes: [], edges: [] };

  //   let edges = activeDataset.edges;
  //   if (selectedEdgeType !== "all") {
  //     edges = edges.filter((e) => e.type === selectedEdgeType);
  //   }

  //   // Keep only nodes connected to filtered edges
  //   const connectedNodeIds = new Set<string>();
  //   edges.forEach((e) => {
  //     connectedNodeIds.add(e.source);
  //     connectedNodeIds.add(e.target);
  //   });

  //   const nodes = activeDataset.nodes.filter((n) => connectedNodeIds.has(n.id));

  //   return { nodes, edges };
  // }, [activeDataset, selectedEdgeType]);

  // --- Cytoscape Elements ---
  
  const filteredData = useMemo(() => {
  if (!activeDataset) return { nodes: [], edges: [] };

  let edges = activeDataset.edges;
  if (selectedEdgeType !== "all") {
    edges = edges.filter((e) => e.type === selectedEdgeType);
  }

  const connectedNodeIds = new Set<string>();
  edges.forEach((e) => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  const nodes = activeDataset.nodes.filter((n) =>
    connectedNodeIds.has(n.id)
  );

  return { nodes, edges };
}, [activeDataset, selectedEdgeType]);

  
  const cytoscapeElements = useMemo(() => {
    if (!filteredData.nodes.length) return [];

    const degreeMap: Record<string, number> = {};
    filteredData.edges.forEach((edge) => {
      degreeMap[edge.source] = (degreeMap[edge.source] || 0) + 1;
      degreeMap[edge.target] = (degreeMap[edge.target] || 0) + 1;
    });

    const nodes = filteredData.nodes.map((n) => ({
      data: { id: n.id, label: n.label, importance: degreeMap[n.id] ?? 1 },
    }));

    const edges = filteredData.edges.map((e) => ({
      data: { id: e.id, source: e.source, target: e.target, type: e.type },
    }));

    return [...nodes, ...edges];
  }, [filteredData]);

  // --- Cytoscape Reference and Layout ---
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [layout, setLayout] = useState<"cose" | "grid" | "circle">("cose");

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.layout({ name: layout }).run();
    }
  }, [layout, filteredData]);

  // --- Styles ---
  const cytoscapeStylesheet: cytoscape.StylesheetStyle[] = [
    {
      selector: "node",
      style: {
        label: "data(label)",
        width: "mapData(importance, 1, 3, 30, 60)",
        height: "mapData(importance, 1, 3, 30, 60)",
        "background-color": "#5B2C6F",
        "text-valign": "center",
        "text-halign": "center",
        "color": "#fff",
        "font-size": "12px",
      },
    },
    {
      selector: 'edge[type="activation"]',
      style: { "line-color": "#22c55e", "target-arrow-color": "#22c55e", "target-arrow-shape": "triangle" },
    },
    {
      selector: 'edge[type="repression"]',
      style: { "line-color": "#ef4444", "target-arrow-color": "#ef4444", "target-arrow-shape": "tee" },
    },
  ];

  // const [selectedDataset, setSelectedDataset] = useState("refNetwork");
  // const [selectedEdgeType, setSelectedEdgeType] = useState("all");
  // const [selectedEdgeType, setSelectedEdgeType] = useState<
//   "all" | "activation" | "repression"
// >("all");

const currentDataset = activeDataset;

if (!currentDataset) return <div>No dataset selected</div>;

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

const [selectedNodeInfo, setSelectedNodeInfo] = useState<NodeInfo | null>(null);

// const [selectedDatasetId, setSelectedDatasetId] = useState("hESC");

// const selectedDataset = useMemo(() => {
//   return mockDatasets.find(d => d.id === selectedDatasetId);
// }, [selectedDatasetId]);

// const selectedDataset = mockDatasets.find(
//   d => d.id === selectedDatasetId
// )!;
// const inferenceData = useMemo(() => generateMockInferenceData(), []);

// const predictedBestAlgorithm = useMemo(() => {
//   const algoScores: Record<string, number[]> = {};

//   inferenceData.edges.forEach(edge => {
//     Object.entries(edge.scores as Record<string, number>)
//   .forEach(([algo, score]) => {
//       if (!algoScores[algo]) algoScores[algo] = [];
//       algoScores[algo].push(score);
//     });
//   });

//   let bestAlgo = "";
//   let bestMean = 0;

//   Object.entries(algoScores).forEach(([algo, scores]) => {
//     const mean =
//       scores.reduce((a, b) => a + b, 0) / scores.length;

//     if (mean > bestMean) {
//       bestMean = mean;
//       bestAlgo = algo;
//     }
//   });

//   return bestAlgo;
// }, [inferenceData]);

// const predictedBestAlgorithm = useMemo(() => {
//   const algoScores: Record<string, number[]> = {};

//   inferenceData.edges.forEach(edge => {
//     Object.entries(edge.scores).forEach(
//       ([algo, score]: [string, number]) => {
//         if (!algoScores[algo]) algoScores[algo] = [];
//         algoScores[algo].push(score);
//       }
//     );
//   });

//   let bestAlgo = "";
//   let bestMean = 0;

//   Object.entries(algoScores).forEach(([algo, scores]) => {
//     const mean =
//       scores.reduce((a, b) => a + b, 0) / scores.length;

//     if (mean > bestMean) {
//       bestMean = mean;
//       bestAlgo = algo;
//     }
//   });

//   return bestAlgo;
// }, [inferenceData]);

// const inferenceData = useMemo(() => {
//   return generateMockInferenceData(selectedDataset);
// }, [selectedDataset]);

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

  // const [layout, setLayout] = useState('cose');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  // const cyRef = useRef<cytoscape.Core | null>(null);

// const filteredData = useMemo(() => {
//   if (!selectedDataset) {
//     return { nodes: [], edges: [] };
//   }

//   const allNodes = selectedDataset.nodes ?? [];
//   const allEdges = selectedDataset.edgesData ?? [];

//   let edges = [...allEdges];

//   // ---------------------------
//   // 1️⃣ Filter by selected algorithms
//   // ---------------------------
//   if (selectedAlgorithms.length > 0) {
//     edges = edges.filter(edge =>
//       selectedAlgorithms.some(algo =>
//         edge.algorithms?.includes(algo)
//       )
//     );
//   }

//   // ---------------------------
//   // 2️⃣ Consensus filter
//   // ---------------------------
//   edges = edges.filter(
//     edge => (edge.algorithms?.length ?? 0) >= minConsensus[0]
//   );

//   // ---------------------------
//   // 3️⃣ Edge type filter
//   // ---------------------------
// if (selectedEdgeType !== "all") {
//   edges = edges.filter(edge =>
//     (edge.type ?? "unknown") === selectedEdgeType
//   );
// }


//   // ---------------------------
//   // 4️⃣ Score threshold filter
//   // ---------------------------
//   edges = edges.filter(
//     edge => (edge.score ?? 0) >= scoreThreshold[0]
//   );

//   // ---------------------------
//   // 5️⃣ Search filter (node-based)
//   // ---------------------------
//   if (searchTerm.trim() !== "") {
//     const term = searchTerm.toLowerCase();

//     edges = edges.filter(edge =>
//       edge.source.toLowerCase().includes(term) ||
//       edge.target.toLowerCase().includes(term)
//     );
//   }

//   // ---------------------------
//   // 6️⃣ Sort by score descending
//   // ---------------------------
//   edges.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

//   // ---------------------------
//   // 7️⃣ Top-K limit
//   // ---------------------------
//   edges = edges.slice(0, topK[0]);

//   // ---------------------------
//   // 8️⃣ Derive visible nodes
//   // ---------------------------
//   const visibleNodeIds = new Set<string>();
//   edges.forEach(edge => {
//     visibleNodeIds.add(edge.source);
//     visibleNodeIds.add(edge.target);
//   });

//   let nodes = allNodes.filter(node =>
//     visibleNodeIds.has(node.id)
//   );

//   // Optional: keep searched nodes even if isolated
//   if (searchTerm.trim() !== "") {
//     const term = searchTerm.toLowerCase();
//     const searchedNodes = allNodes.filter(node =>
//       node.label.toLowerCase().includes(term)
//     );
//     searchedNodes.forEach(node => visibleNodeIds.add(node.id));
//     nodes = allNodes.filter(node =>
//       visibleNodeIds.has(node.id)
//     );
//   }

//   return { nodes, edges };

// }, [
//   selectedDataset,
//   searchTerm,
//   edgeFilter,
//   topK,
//   scoreThreshold,
//   selectedAlgorithms,
//   minConsensus
// ]);

console.log("Filtered nodes:", filteredData.nodes.length);
console.log("Filtered edges:", filteredData.edges.length);

// const cytoscapeElements = useMemo(() => {
//   if (!filteredData.nodes.length) return [];

//   // Build degree map from filtered edges
//   const degreeMap: Record<string, number> = {};

//   filteredData.edges.forEach(edge => {
//     degreeMap[edge.source] = (degreeMap[edge.source] || 0) + 1;
//     degreeMap[edge.target] = (degreeMap[edge.target] || 0) + 1;
//   });

//   const nodeElements = filteredData.nodes.map(node => ({
//     data: {
//       id: node.id,
//       label: node.label ?? node.id,
//       importance: degreeMap[node.id] ?? 1
//     }
//   }));

//   const edgeElements = filteredData.edges.map(edge => ({
//     data: {
//       id: `${edge.source}-${edge.target}`,
//       source: edge.source,
//       target: edge.target,
//       type: edge.type ?? "unknown",
//       score: edge.score ?? 0
//     }
//   }));

//   return [...nodeElements, ...edgeElements];

// }, [filteredData]);



//   const cytoscapeStylesheet = [
//   {
//   selector: "node",
//   style: {
//     label: "data(label)",
//     width: "mapData(importance, 1, 6, 30, 80)",
//     height: "mapData(importance, 1, 6, 30, 80)"
//   }
// },
// {
//   selector: 'edge[type="activation"]',
//   style: {
//     lineColor: "#22c55e",
//     targetArrowColor: "#22c55e",
//     targetArrowShape: "triangle"
//   }
// },
// {
//   selector: 'edge[type="repression"]',
//   style: {
//     lineColor: "#ef4444",
//     targetArrowColor: "#ef4444",
//     targetArrowShape: "tee"
//   }
// },
// {
//   selector: 'edge[type="activation"]',
//   style: {
//     'line-color': '#22c55e',   // green
//     'target-arrow-color': '#22c55e',
//     'target-arrow-shape': 'triangle'
//   }
// },
// {
//   selector: 'edge[type="repression"]',
//   style: {
//     'line-color': '#ef4444',   // red
//     'target-arrow-color': '#ef4444',
//     'target-arrow-shape': 'tee'
//   }
// },
// {
//   selector: 'edge[type="unknown"]',
//   style: {
//     'line-color': '#9ca3af',
//     'target-arrow-color': '#9ca3af',
//     'target-arrow-shape': 'triangle'
//   }
// },  
// {
//   selector: 'node[bestAlgo = "algo1"]',
//   style: {
//     'background-color': '#1f77b4'
//   }
// },
// {
//   selector: 'node[bestAlgo = "algo2"]',
//   style: {
//     'background-color': '#ff7f0e'
//   }
// },
// {
//   selector: 'node[bestAlgo = "algo3"]',
//   style: {
//     'background-color': '#2ca02c'
//   }
// },
// {
//   selector: 'node[!bestAlgo]',
//   style: {
//     'background-color': '#cccccc'
//   }
// },
// {
//       selector: 'node',
//       style: {
//         'background-color': '#5B2C6F',
//         'label': 'data(label)',
//         'width': 'mapData(importance, 0, 1, 20, 80)',
//         'height': 'mapData(importance, 0, 1, 20, 80)',
//         'text-valign': 'center',
//         'text-halign': 'center',
//         'font-size': '12px',
//         'color': '#ffffff'
//       }
//     },
//     {
//   selector: 'edge',
//   style: {
//     'width': 2,
//     'line-color': 'green',
//     'target-arrow-color': 'green',
//     'target-arrow-shape': 'triangle',
//     'curve-style': 'bezier'
//   }
// },

//     {
//       selector: 'edge[type="activation"]',
//       style: {
//         'line-color': '#28A745',
//         'target-arrow-color': '#28A745'
//       }
//     },
//     {
//       selector: 'edge[type="repression"]',
//       style: {
//         'line-color': '#EF4444',
//         'target-arrow-color': '#EF4444'
//       }
//     },
//     {
//       selector: 'node:selected',
//       style: {
//         'background-color': '#28A745',
//         'border-width': '3px',
//         'border-color': '#1E1E1E'
//       }
//     }
//   ] as cytoscape.StylesheetStyle[];

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

// -------------------- New Export Handlers --------------------

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

  const json = cyRef.current.json();
  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, "network.json");
};

// Export CSV (nodes and edges)
const handleExportCSV = () => {
  if (cyRef.current) {
    const nodes = cyRef.current.nodes().map((n) => ({
      id: n.id(),
      label: n.data('label') || '',
      ...n.data(),
    }));
    const edges = cyRef.current.edges().map((e) => ({
      source: e.source().id(),
      target: e.target().id(),
      ...e.data(),
    }));

    // Convert nodes and edges to CSV format
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
  // const [edgeType, setEdgeType] = useState<'all' | 'activation' | 'inhibition'>('all');
  const [selectedGene, setSelectedGene] = useState('');
  const [selectedEdge, setSelectedEdge] = useState<any>(null);
  const [showHelpPanel, setShowHelpPanel] = useState(true);

  useEffect(() => {
  if (cyRef.current) {
    cyRef.current.layout({ name: layout }).run();
  }
}, [layout, selectedDatasetId]);

console.log("Active dataset:", activeDataset);
console.log("Nodes:", activeDataset?.nodes?.length);
console.log("Edges:", activeDataset?.edges?.length);
console.log("Filtered nodes:", filteredData.nodes.length);
console.log("Filtered edges:", filteredData.edges.length);

console.log("dynBFCDataset:", dynBFCDataset);

console.log("Selected dataset:", activeDataset);


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
            {datasetsArray.map(d => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))
            }
                      </SelectContent>
        </Select>

        <Badge variant="default" className='h-9 p-3'>
          Multi-Algorithm Inference Mode
        </Badge>
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
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-100 font-medium text-gray-700"
                value={selectedEdgeType}
                onChange={(e) =>
                  setSelectedEdgeType(e.target.value as "all" | "activation" | "repression")
                }
              >
                <option value="all">All Types</option>
                <option value="activation">Activation</option>
                <option value="repression">Repression</option>
              </select>

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
                onClick={() => {
                  setSearchTerm(DEFAULT_FILTERS.searchTerm);
                  setSelectedEdgeType("all");   // FIX
                  setTopK([...DEFAULT_FILTERS.topK]);
                  setScoreThreshold([...DEFAULT_FILTERS.scoreThreshold]);
                  setSelectedAlgorithms([]);
                  setMinConsensus([1]);
                }}


              >
                Reset
              </Button>

            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nodes</span>
                <span className="text-foreground">{filteredData.nodes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Edges</span>
                <span className="text-foreground">{filteredData.edges.length}</span>
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
                style={{ width: '100%', height: '600px' }}
                stylesheet={cytoscapeStylesheet}
                layout={{ name: layout }}
                cy={(cy) => {
                  cyRef.current = cy;
                  cy.on("tap", "node", evt => {
                    const node = evt.target;
                    const nodeId = node.id();

                    const neighbors = node.neighborhood("node").map(n => n.id());

                    const degree = node.degree();

                    const { bestAlgo, bestMean } =
                      getNodeBestAlgorithm(nodeId);

                    setSelectedNodeInfo({
                      id: nodeId,
                      degree,
                      neighbors,
                      bestAlgo,
                      bestMean
                    });
                  });

                }}
              />
              
            </div>
          </Card>

{selectedNodeInfo && (
  <Card className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-foreground">Gene Details</h3>
        <p className="text-sm text-gray-600">
          Selected gene information
        </p>
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
          <Badge key={idx} variant="secondary">
            {neighbor}
          </Badge>
        ))}
      </div>
    </div>
  </Card>
)}


          {/* Node Details Panel */}
          {selectedNode && (
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Gene ID</p>
                  <p className="text-foreground">{selectedNode.id}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Gene Name</p>
                  <p className="text-foreground">{selectedNode.label}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Importance Score</p>
                  <p className="text-foreground">{selectedNode.score?.toFixed(3)}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Degree</p>
                  <p className="text-foreground">
                    {filteredData.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Neighbors</p>
                <div className="flex flex-wrap gap-2">
                  {filteredData
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .slice(0, 5)
                    .map((edge, idx) => {
                      const neighborId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const neighbor = mockNetworkData.nodes.find(n => n.id === neighborId);
                      return (
                        <Badge key={idx} variant="secondary">
                          {neighbor?.label || neighborId}
                        </Badge>
                      );
                    })}
                </div>
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
          )}

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
      <div>
        {/* <h3 className="text-foreground">Gene Details</h3> */}
        {/* <p className="text-sm text-gray-600">
          Selected gene information
        </p> */}
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
          <Badge key={idx} variant="secondary">
            {neighbor}
          </Badge>
        ))}
      </div>
    </div>
  </Card>
)}
              
          {/* Node Details Panel */}
          {selectedNode && (
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Gene ID</p>
                  <p className="text-foreground">{selectedNode.id}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Gene Name</p>
                  <p className="text-foreground">{selectedNode.label}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Importance Score</p>
                  <p className="text-foreground">{selectedNode.score?.toFixed(3)}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Degree</p>
                  <p className="text-foreground">
                    {filteredEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Neighbors</p>
                <div className="flex flex-wrap gap-2">
                  {filteredEdges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .slice(0, 5)
                    .map((edge, idx) => {
                      const neighborId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const neighbor = mockNetworkData.nodes.find(n => n.id === neighborId);
                      return (
                        <Badge key={idx} variant="secondary">
                          {neighbor?.label || neighborId}
                        </Badge>
                      );
                    })}
                </div>
              </div>
            </Card>
          )}

              <div className="mt-6 p-3 rounded-lg bg-accent/50 border">
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
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-sm mb-3">Export</h4>
                <div className="space-y-2">
                  <button onClick={handleExportPNG} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Export as PNG
                  </button>
                  {/* <button onClick={handleExportSVG} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Export as SVG
                  </button> */}
                  <button onClick={handleExportCSV} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Download Edge List (CSV)
                  </button>
                  <button onClick={handleExportJSON} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Download as JSON
                  </button>
                  {/* <button onClick={handleExportJSON} className="px-3 py-2 bg-primary text-white rounded">
                    JSON
                  </button> */}
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
