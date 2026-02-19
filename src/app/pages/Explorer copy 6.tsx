import { Network, ZoomIn, ZoomOut, Layers, Grid3x3, Circle, Filter, Eye, EyeOff, 
  Download, Share2, Maximize2, Search,Target, HelpCircle, Play, Info, Sparkles, Maximize,  Activity } from 'lucide-react';
// import { Slider } from '../components/ui/slider';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useGRN } from "../hooks/useGRN";
import { useGraphData } from "../hooks/useGraphData";
import GRNExplorer from "../components/GRNExplorer";
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
// import { Badge } from './Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
// import { Search, Download, Maximize2, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { mockNetworkData } from '.././components/mockData';
// import mockEdges from "../../../src/data/mockEdges.json";
import { useNetworkAnalytics } from "../hooks/useNetworkAnalytics";
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import GraphML from 'cytoscape-graphml';
import { saveAs } from "file-saver";
import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import type { Stylesheet } from "cytoscape";

// analytics helpers
import {
  computeDegrees,
  computeInfluence,
  computeModules,
  applyNodeStyles,
  highlightNeighbors,
  buildCytoscapeElements,
  cytoscapeStylesheet
} from "../components/analytics";


const mockEdges = [
  {
    edge_id: "SOX2__NANOG",
    source: "SOX2",
    target: "NANOG",
    supporting_algorithms: ["GENIE3", "GRNBoost2", "SCODE"],
    scores_by_algorithm: { GENIE3: 0.84, GRNBoost2: 0.81, SCODE: 0.79 },
    support_count: 3,
    consensus_score: 0.813,
  },
  {
    edge_id: "SOX2__OCT4",
    source: "SOX2",
    target: "OCT4",
    supporting_algorithms: ["GENIE3", "SCENIC", "GRISLI"],
    scores_by_algorithm: { GENIE3: 0.86, SCENIC: 0.82, GRISLI: 0.8 },
    support_count: 3,
    consensus_score: 0.827,
  },
  {
    edge_id: "OCT4__NANOG",
    source: "OCT4",
    target: "NANOG",
    supporting_algorithms: ["GENIE3", "GRNBoost2", "PIDC", "SCODE"],
    scores_by_algorithm: {
      GENIE3: 0.83,
      GRNBoost2: 0.8,
      PIDC: 0.76,
      SCODE: 0.78,
    },
    support_count: 4,
    consensus_score: 0.793,
  },
  {
    edge_id: "KLF4__SOX2",
    source: "KLF4",
    target: "SOX2",
    supporting_algorithms: ["GENIE3", "SCENIC"],
    scores_by_algorithm: { GENIE3: 0.77, SCENIC: 0.74 },
    support_count: 2,
    consensus_score: 0.755,
  },
  {
    edge_id: "MYC__SOX2",
    source: "MYC",
    target: "SOX2",
    supporting_algorithms: ["GRNBoost2", "GRISLI", "SINCERITIES"],
    scores_by_algorithm: { GRNBoost2: 0.75, GRISLI: 0.72, SINCERITIES: 0.7 },
    support_count: 3,
    consensus_score: 0.723,
  },
  {
    edge_id: "MYC__OCT4",
    source: "MYC",
    target: "OCT4",
    supporting_algorithms: ["GENIE3", "GRNVBEM"],
    scores_by_algorithm: { GENIE3: 0.74, GRNVBEM: 0.71 },
    support_count: 2,
    consensus_score: 0.725,
  },
];


const runLouvain = () => {
  if (!cyRef.current) return;
  const cy = cyRef.current;

  // 1. Build graphology
  const graph = new Graph();

  cy.nodes().forEach(n => graph.addNode(n.id()));

  cy.edges().forEach(e =>
    graph.addEdge(e.source().id(), e.target().id())
  );

  // 2. Run Louvain
  const assignments = louvain(graph);

  // assignments: { nodeId: communityId, ... }
  console.log("Louvain:", assignments);

  // 3. Apply back to Cytoscape
  Object.entries(assignments).forEach(([nodeId, community]) => {
    const color = clusterColor(parseInt(community));
    cy.getElementById(nodeId).style({
      "background-color": color,
    });
  });
};

const clusterColor = (cluster) => {
  const palette = [
    "#EF4444", "#3B82F6", "#10B981", "#F59E0B",
    "#8B5CF6", "#EC4899", "#14B8A6", "#F43F5E",
  ];
  return palette[cluster % palette.length];
};

export const Explorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [edgeFilter, setEdgeFilter] = useState('all');
  const [topK, setTopK] = useState([100]);
  const [scoreThreshold, setScoreThreshold] = useState([0.5]);
  const [layout, setLayout] = useState('cose');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const filteredEdges = mockNetworkData.edges.filter(edge => {
    const matchesType = edgeFilter === 'all' || edge.type === edgeFilter;
    const matchesScore = edge.weight >= scoreThreshold[0];
    return matchesType && matchesScore;
  }).slice(0, topK[0]);

  // const nodeIds = new Set<string>();
  // filteredEdges.forEach(edge => {
  //   nodeIds.add(edge.source);
  //   nodeIds.add(edge.target);
  // });

  // const nodeIds = Array.from(
  // new Set(mockEdges.flatMap(e => [e.source, e.target]))
  // );

  const nodeIds = new Set(
  mockEdges.flatMap(e => [e.source, e.target])
  );


const mods = computeModules(nodeIds, mockEdges);


  const filteredNodes = mockNetworkData.nodes.filter(node =>
    nodeIds.has(node.id) &&
    (searchTerm === '' || node.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // const cytoscapeElements = [
  //   ...filteredNodes.map(node => ({
  //     data: {
  //       id: node.id,
  //       label: node.label,
  //       score: node.score
  //     }
  //   })),
  //   ...filteredEdges.map((edge, idx) => ({
  //     data: {
  //       id: `edge-${idx}`,
  //       source: edge.source,
  //       target: edge.target,
  //       weight: edge.weight,
  //       type: edge.type
  //     }
  //   }))
  // ];
  
const cytoscapeElements = useMemo(() => {
    return buildCytoscapeElements(filteredEdges);
  }, [filteredEdges]);

  const handleCyInit = (cy) => {
    cyRef.current = cy;

    cy.on("tap", "node", (evt) => {
      const id = evt.target.id();
      highlightNeighbors(cy, id, hopDepth);
      setSelectedNode(evt.target.data());
    });
  };

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() + 0.2);
  const handleZoomOut = () =>
    cyRef.current?.zoom(Math.max(cyRef.current.zoom() - 0.2, 0.1));
  const handleFit = () => cyRef.current?.fit();

  const handleExportPNG = () => {
    if (!cyRef.current) return;
    const png = cyRef.current.png({ full: true, scale: 2 });
    const a = document.createElement("a");
    a.href = png;
    a.download = "network.png";
    a.click();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Shareable link copied.");
  };

  // const { degrees, influence, modules } = useNetworkAnalytics(
  //   cyRef,
  //   filteredEdges,
  //   hopDepth
  // );
  const cytoscapeStylesheet: Stylesheet[] = [
    {
      selector: 'node',
      style: {
        'background-color': '#5B2C6F',
        'label': 'data(label)',
        'width': '40px',
        'height': '40px',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '10px',
        'color': '#1E1E1E'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#E4E6EB',
        'target-arrow-color': '#E4E6EB',
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
        'border-width': '3px',
        'border-color': '#1E1E1E'
      }
    }
  ];

  // const handleZoomIn = () => {
  //   if (cyRef.current) {
  //     cyRef.current.zoom(cyRef.current.zoom() * 1.2);
  //   }
  // };

  // const handleZoomOut = () => {
  //   if (cyRef.current) {
  //     cyRef.current.zoom(cyRef.current.zoom() * 0.8);
  //   }
  // };

  // const handleFit = () => {
  //   if (cyRef.current) {
  //     cyRef.current.fit();
  //   }
  // };

  // Export PNG (existing)
// const handleExportPNG = () => {
//   if (cyRef.current) {
//     const png = cyRef.current.png({ full: true, scale: 2 });
//     const link = document.createElement('a');
//     link.download = 'network.png';
//     link.href = png;
//     link.click();
//   }
// };

// const handleExportJSON = () => {
//     if (!cy.current) return;
//     const json = cy.current.json();
//     const blob = new Blob([JSON.stringify(json, null, 2)], {
//       type: "application/json",
//     });
//     saveAs(blob, "network.json");
//   };

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
  const [edgeType, setEdgeType] = useState<'all' | 'activation' | 'inhibition'>('all');
  const [selectedGene, setSelectedGene] = useState('');
  const [showHelpPanel, setShowHelpPanel] = useState(true);

//   const handleShare = async () => {
//   const shareUrl = window.location.href;
//   const shareData = {
//     title: 'WebGenie Network Explorer',
//     text: 'Explore this gene regulatory network on WebGenie',
//     url: shareUrl,
//   };

//   if (navigator.share) {
//     try {
//       await navigator.share(shareData);
//     } catch (err) {
//       console.warn('Share canceled or failed', err);
//     }
//   } else {
//     // Fallback
//     const encodedUrl = encodeURIComponent(shareUrl);
//     const encodedText = encodeURIComponent(shareData.text);

//     const fallbackWindow = window.open(
//       '',
//       'share',
//       'width=480,height=360'
//     );

//     if (fallbackWindow) {
//       fallbackWindow.document.write(`
//         <html>
//           <head>
//             <title>Share</title>
//             <style>
//               body { font-family: sans-serif; padding: 20px; }
//               button, a {
//                 display: block;
//                 width: 100%;
//                 margin: 10px 0;
//                 padding: 10px;
//                 text-align: center;
//                 border-radius: 6px;
//                 border: 1px solid #ccc;
//                 text-decoration: none;
//                 color: black;
//               }
//             </style>
//           </head>
//           <body>
//             <h3>Share this Network</h3>
//             <a href="https://wa.me/?text=${encodedText}%20${encodedUrl}" target="_blank">WhatsApp</a>
//             <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank">Facebook</a>
//             <a href="https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}" target="_blank">X / Twitter</a>
//             <button onclick="navigator.clipboard.writeText('${shareUrl}')">
//               Copy Link
//             </button>
//           </body>
//         </html>
//       `);
//     }
//   }
// };

const getBestFitAlgorithms = (node: any) => {
  if (!node) return [];

  const score = node.score ?? 0;

  if (score > 0.8) {
    return ['GENIE3', 'GRNBoost2'];
  }
  if (score > 0.5) {
    return ['PIDC', 'SCENIC'];
  }
  return ['Correlation', 'Mutual Information'];
};

const [hopDepth, setHopDepth] = useState(1);
const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

// const [degrees, setDegrees] = useState({});
// const [influence, setInfluence] = useState({});
// const [modules, setModules] = useState({});
const [degrees, setDegrees] = useState<Record<string, number>>({});
const [influence, setInfluence] = useState<Record<string, number>>({});
const [modules, setModules] = useState<Record<string, number>>({});

const [showInfluencePanel, setShowInfluencePanel] = useState(false);

// useEffect(() => {
//     if (!cyRef.current) return;

//     const deg = computeDegrees(filteredEdges);
//     const inf = computeInfluence(deg);
//     const mods = computeModules(cyRef.current, deg);

//     setDegrees(deg);
//     setInfluence(inf);
//     setModules(mods);

//     // applyNodeStyles(cyRef.current, deg, inf, mods);
//     applyNodeStyles(cyRef.current, degrees, influence, modules);

//   }, [filteredEdges, hopDepth]);

useEffect(() => {
  if (!cyRef.current) return;

  const deg = computeDegrees(filteredEdges);
  const inf = computeInfluence(deg);

  const nodeIds = Array.from(
    new Set(filteredEdges.flatMap(e => [e.source, e.target]))
  );
  const mods = computeModules(nodeIds, filteredEdges);

  setDegrees(deg);
  setInfluence(inf);
  setModules(mods);

  applyNodeStyles(cyRef.current, deg, inf, mods);

}, [filteredEdges, hopDepth]);


  const cytoscapeInit = (cyInstance) => {
    if (!cyRef.current) {
      cyRef.current = cyInstance;

      cyInstance.on("tap", "node", (evt) => {
        const id = evt.target.id();
        highlightNeighbors(cyInstance, id, hopDepth);
        setSelectedNode(evt.target.data());
      });
    }
  };

  return (
    <div id="explorer" className="min-h-screen py-20 pb-0">
      <div className="container px-4 mx-auto">
        <div className="mb-6">
  <div className="flex items-start justify-between mb-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Network Explorer</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Interactive exploration of gene regulatory network predictions
      </p>
      <div className="flex items-center gap-3 mt-3">
        <Badge variant="outline">
          <Network className="w-3 h-3 mr-1" />
          CytoscapeJS Interactive Canvas
        </Badge>
        <Badge variant="default">
          Dataset: hESC v2.1.0
        </Badge>
        <Badge variant="default">
          Algorithm: GENIE3 v1.12.0
        </Badge>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {/* <Button
        variant="outline"
        className="text-sm px-3 py-1"
        onClick={runLouvain}
      >
        Detect Communities
      </Button> */}

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
  onClick={handleShare}
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
                <li>Adjust score threshold to focus on high-confidence edges</li>
                <li>Toggle "TF-only View" to see transcription factor networks</li>
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


{/* Header */}
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Network Explorer</h1>
          <p className="text-gray-700">
            Interactive exploration of gene regulatory network predictions
          </p>
        </div> */}

        {/* Info Banner */}
        {/* <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-3">
            <Network className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">How to Explore This Network</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <strong>Click nodes</strong> to see gene annotations and regulatory relationships</li>
                <li>• <strong>Use the search bar</strong> to find specific genes like SOX2, OCT4, or NANOG</li>
                <li>• <strong>Adjust score threshold</strong> to focus on high-confidence edges</li>
                <li>• <strong>Toggle 'TF-only View'</strong> to see the transcription factor network</li>
              </ul>
            </div>
          </div>
        </div> */}

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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700" />
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
                  <SelectItem value="unknown">Unknown</SelectItem>
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
              <Button className="w-full bg-primary hover:bg-primary/90">
                Apply Filters
              </Button>
              <Button variant="outline" className="w-full">
                Reset
              </Button>
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Nodes</span>
                <span className="text-foreground">{filteredNodes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Edges</span>
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
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden bg-white">

              {/* ==== ADVANCED ANALYTICS TOOLBAR ==== */}
              {analyticsEnabled && (
                <div className="flex items-center gap-3 p-3 mb-3 bg-gray-50 rounded-lg border border-gray-200">

                  {/* 1-hop / 2-hop */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-800 font-medium">Neighborhood:</span>
                    <button
                      onClick={() => setHopDepth(1)}
                      className={`px-2 py-1 text-sm rounded 
                        ${hopDepth === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                      1-hop
                    </button>
                    <button
                      onClick={() => setHopDepth(2)}
                      className={`px-2 py-1 text-sm rounded 
                        ${hopDepth === 2 ? "bg-blue-600 text-white" : "bg-secondary text-white"}`}
                    >
                      2-hop
                    </button>
                  </div>

    {/* Recompute modules */}
    {/* <button
      onClick={() => {
        if (!cyRef.current) return;
        const m = computeModules(cyRef.current);
        setModules(m);
        applyNodeStyles(cyRef.current, degrees, influence, m);
      }}
      className="px-2 py-1 text-sm bg-gray-800 text-white rounded"
    >
      Recompute Modules
    </button> */}

    <button
  onClick={() => {
    if (!cyRef.current) return;

    // --- Extract unique node IDs ---
    const nodeIds = [...new Set(mockEdges.flatMap(e => [e.source, e.target]))];

    // --- Recompute modules ---
    const m = computeModules(nodeIds, mockEdges);

    // --- Update state ---
    setModules(m);

    // --- Reapply styling with new module assignments ---
    applyNodeStyles(cyRef.current, degrees, influence, modules);
  }}
  className="px-2 py-1 text-sm bg-gray-800 text-white rounded"
>
  Recompute Modules
</button>


    {/* Influence / Degrees (Right panel toggle) */}
    <button
      onClick={() => setShowInfluencePanel((prev) => !prev)}
      className="px-2 py-1 text-sm text-gray-800 bg-gray-200 rounded"
    >
      Influence Scores
    </button>

    {showInfluencePanel && (
      <div className="mt-4 p-3 bg-gray-100 rounded border">
        <h4 className="font-semibold mb-2">Influence Scores</h4>
        <ul className="text-sm space-y-1">
          {Object.entries(influence).map(([gene, score]) => (
            <li key={gene}>
              <span className="font-medium">{gene}</span>: {score.toFixed(3)}
            </li>
          ))}
        </ul>
      </div>
    )}

  </div>
)}

              {/* <CytoscapeComponent
               
                elements={cytoscapeElements}
                style={{ width: '100%', height: '600px' }}
                stylesheet={cytoscapeStylesheet}
                layout={{ name: layout }}
                // cy={(cy) => {
                //   cyRef.current = cy;
                //   cy.on('tap', 'node', (evt) => {
                //     const node = evt.target;
                //     setSelectedNode(node.data());
                //   });
                // }}

                cy={(cy) => {
                  cyRef.current = cy;

                  // --- Compute analytics from filtered edges ---
                  const deg = computeDegrees(mockEdges);
                  const inf = computeInfluence(mockEdges);
                  // const mods = computeModules(cy);
                  const nodeIds = [...new Set(mockEdges.flatMap(e => [e.source, e.target]))];
                  const mods = computeModules(nodeIds, mockEdges);

                  setDegrees(deg);
                  setInfluence(inf);
                  setModules(mods);

                  // Apply node size + color
                  applyNodeStyles(cy, deg, inf);

                  // Node click = highlight neighbors
                  cy.on('tap', 'node', (evt) => {
                    const id = evt.target.id();
                    highlightNeighbors(cy, id);
                    setSelectedNode(evt.target.data());
                  });
                }}

              /> */}

              {/* <CytoscapeComponent
                cy={(cyInstance) => {
                  if (!cyRef.current) {
                    cyRef.current = cyInstance;

                    // Attach event listeners once
                    cyInstance.on("tap", "node", (evt) => {
                      highlightNeighbors(cyInstance, evt.target.id(), hopDepth);
                      setSelectedNode(evt.target.data());
                    });
                  }
                }}
              /> */}
              {/* <CytoscapeComponent
                elements={cytoscapeElements}
                style={{ width: '100%', height: '600px' }}
                stylesheet={cytoscapeStylesheet}
                layout={{ name: layout }}
                cy={cytoscapeInit}
              />   */}
              
                <CytoscapeComponent
                  cy={handleCyInit}
                  elements={cytoscapeElements}
                  style={{ width: "100%", height: "600px" }}
                  stylesheet={cytoscapeStylesheet}
                  layout={{ name: layout }}
                />
            </div>
          </Card>

          {/* Node Inspector */}
      {selectedNode && (
        <Card className="p-4">
          <h3 className="font-medium mb-2">Node Inspector</h3>

          <div className="mb-2">
            <p>
              <strong>ID:</strong> {selectedNode.id}
            </p>
          </div>

          <div className="space-y-1">
            <p>
              <strong>Degree:</strong> {degrees[selectedNode.id]}
            </p>
            <p>
              <strong>Influence:</strong>{" "}
              {influence[selectedNode.id]?.toFixed(3)}
            </p>
            <p>
              <strong>Module:</strong> {modules[selectedNode.id]}
            </p>
          </div>
        </Card>
      )}

          {/* Node Details Panel */}
          {selectedNode && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-foreground">Node Details</h3>
                  <p className="text-sm text-gray-700">Selected gene information</p>
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
                  <p className="text-xs text-gray-700 mb-1">Gene ID</p>
                  <p className="text-foreground">{selectedNode.id}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-700 mb-1">Gene Name</p>
                  <p className="text-foreground">{selectedNode.label}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-700 mb-1">Importance Score</p>
                  <p className="text-foreground">{selectedNode.score?.toFixed(3)}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-700 mb-1">Degree</p>
                  <p className="text-foreground">
                    {filteredEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg col-span-1">
                  <p className="text-xs text-gray-700 mb-2">
                    Best-fit Algorithms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getBestFitAlgorithms(selectedNode).map((algo) => (
                      <Badge key={algo} variant="outline">
                        {algo}
                      </Badge>
                    ))}
                  </div>
                </div>
                    <div className=" p-4 bg-secondary rounded-lg">
                <p className="text-xs text-gray-700 mb-2">Neighbors</p>
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
              </div>
              
              
            </Card>
          )}
        </div>
          </div>

          {/* Right Sidebar - Gene Details */}
          <div className="lg:col-span-1" id="details">
            <div className="p-4 rounded-lg border bg-card sticky top-24">
              <h3 className="font-semibold mb-4">Gene Details</h3>
              <div className="text-sm text-gray-700 text-center py-8">
                Click a gene node to view details
              </div>

              
          {/* Node Details Panel */}
          {selectedNode && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-foreground">Node Details</h3>
                  <p className="text-sm text-gray-700">Selected gene information</p>
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
                  <p className="text-xs text-gray-700 mb-1">Gene ID</p>
                  <p className="text-foreground">{selectedNode.id}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-700 mb-1">Gene Name</p>
                  <p className="text-foreground">{selectedNode.label}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-700 mb-1">Importance Score</p>
                  <p className="text-foreground">{selectedNode.score?.toFixed(3)}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-gray-700 mb-1">Degree</p>
                  <p className="text-foreground">
                    {filteredEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-secondary rounded-lg col-span-2">
  <p className="text-xs text-gray-700 mb-2">
    Best-fit Algorithms
  </p>
  <div className="flex flex-wrap gap-2">
    {getBestFitAlgorithms(selectedNode).map((algo) => (
      <Badge key={algo} variant="outline">
        {algo}
      </Badge>
    ))}
  </div>
</div>


              <div className=" p-4 bg-secondary rounded-lg">
                <p className="text-xs text-gray-700 mb-2">Neighbors</p>
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

      {/* -------------------- LANDINGPAGE FOOTER -------------------- */}
            {/* <footer className="bg-gray-900 text-gray-300 py-12 mt-10">
              <div className="max-w-[1400px] mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white">WebGenie</div>
                        <div className="text-xs text-gray-400">Benchmarking Platform</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Research-grade GRN inference benchmarking and visualization for evaluating
                    gene regulatory network inference algorithms on single-cell data.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-white mb-4">Platform</h5>
                    <ul className="space-y-2 text-sm">
                      <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                      <li><a href="/datasets" className="hover:text-white transition-colors">Datasets</a></li>
                      <li><a href="/compare" className="hover:text-white transition-colors">Algorithms</a></li>
                      <li><a href="/upload" className="hover:text-white transition-colors">Upload</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-white mb-4">Resources</h5>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                      <li><a href="https://github.com/Murali-group/Beeline" className="hover:text-white transition-colors">GitHub</a></li>
                      <li><a href="https://github.com/ukanduchimeremezejames/WebgenieDark" className="hover:text-white transition-colors">Contact</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-white mb-4">Subscribe</h5>
                    <p className="text-sm text-gray-400 mb-2">Get updates about new datasets and algorithms</p>
                    <form className="flex gap-2">
                      <input type="email" placeholder="Email" className="flex-1 p-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm" />
                      <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm hover:bg-purple-700 transition-colors">Subscribe</button>
                    </form>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6 text-center text-sm">
                  © 2026 WebGenie | Built on the BEELINE Platform. All rights reserved.
                </div>
              </div>
            </footer> */}

                  {/* Footer */}
      <footer className="border-t bg-background mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className='text-sm text-gray-700'>© 2026 WebGenie Platform. Licensed under MIT. All rights reserved.</p>
                  <p className="flex items-center gap-2 text-sm text-gray-700">
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