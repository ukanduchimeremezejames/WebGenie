import { Network, ZoomIn, ZoomOut, Layers, Grid3x3, Circle, Filter, Eye, EyeOff, 
  Download, Share2, Maximize2, Search,Target, HelpCircle, Play, Info, Sparkles, Maximize,  Activity } from 'lucide-react';
// import { Slider } from '../components/ui/slider';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider'

// import { Badge } from './Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
// import { Search, Download, Maximize2, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { mockNetworkData, mockDatasets, mockInferenceData, generateMockInferenceData } from '.././components/mockData';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import graphML from 'cytoscape-graphml';
import { saveAs } from "file-saver";

export function Explorer() {
  
interface NodeInfo {
  id: string;
  degree: number;
  neighbors: string[];
  bestAlgo: string;
  bestMean: number;
}

const [selectedNodeInfo, setSelectedNodeInfo] = useState<NodeInfo | null>(null);

const [selectedDatasetId, setSelectedDatasetId] = useState("hESC");

const selectedDataset = mockDatasets.find(
  d => d.id === selectedDatasetId
)!;
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

const inferenceData = useMemo(() => {
  return generateMockInferenceData(selectedDataset);
}, [selectedDataset]);

const predictedBestAlgorithm = useMemo(() => {
  const algoScores: Record<string, number[]> = {};

  inferenceData.edges.forEach(edge => {
    Object.entries(edge.scores).forEach(
      ([algo, score]: [string, number]) => {
        if (!algoScores[algo]) algoScores[algo] = [];
        algoScores[algo].push(score);
      }
    );
  });

  let bestAlgo = "";
  let bestMean = 0;

  Object.entries(algoScores).forEach(([algo, scores]) => {
    const mean =
      scores.reduce((a, b) => a + b, 0) / scores.length;

    if (mean > bestMean) {
      bestMean = mean;
      bestAlgo = algo;
    }
  });

  return bestAlgo;
}, [inferenceData]);


function getNodeBestAlgorithm(nodeId: string) {
  const relatedEdges = inferenceData.edges.filter(
    e => e.source === nodeId || e.target === nodeId
  );

  const algoScores: Record<string, number[]> = {};

  relatedEdges.forEach(edge => {
    Object.entries(edge.scores).forEach(
      ([algo, score]: [string, number]) => {
        if (!algoScores[algo]) algoScores[algo] = [];
        algoScores[algo].push(score);
      }
    );
  });

  let bestAlgo = "";
  let bestMean = 0;

  Object.entries(algoScores).forEach(([algo, scores]) => {
    const mean =
      scores.reduce((a, b) => a + b, 0) / scores.length;

    if (mean > bestMean) {
      bestMean = mean;
      bestAlgo = algo;
    }
  });

  return { bestAlgo, bestMean };
}


const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
const [minConsensus, setMinConsensus] = useState([1]); // default 2-3

  const [searchTerm, setSearchTerm] = useState('');
  const [edgeFilter, setEdgeFilter] = useState('all');
  const [topK, setTopK] = useState([100]);
  const [scoreThreshold, setScoreThreshold] = useState([0.5]);
  const [layout, setLayout] = useState('cose');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  // const filteredEdges = mockNetworkData.edges.filter(edge => {
  //   const matchesType = edgeFilter === 'all' || edge.type === edgeFilter;
  //   const matchesScore = edge.weight >= scoreThreshold[0];
  //   return matchesType && matchesScore;
  // }).slice(0, topK[0]);

  
  // const filteredEdges = mockInferenceData.edges.filter(edge => {

  //   const supportingAlgos = Object.keys(edge.scores);

  //   // Reverse filtering:
  //   // Show edges supported by ALL selected algorithms
  //   const matchesAlgorithmSelection =
  //     selectedAlgorithms.length === 0 ||
  //     selectedAlgorithms.every(algo => supportingAlgos.includes(algo));

  //   const matchesConsensus =
  //     supportingAlgos.length >= minConsensus[0];

  //   const matchesScore =
  //     Math.max(...Object.values(edge.scores)) >= scoreThreshold[0];
    
  //   const matchesType =
  //   edgeFilter === 'all' || edge.type === edgeFilter;


  //   return matchesAlgorithmSelection && matchesConsensus && matchesScore &&
  //   matchesType;

  // });

  const filteredEdges = useMemo(() => {
    return mockInferenceData.edges.filter(edge => {
      const supportingAlgos = Object.keys(edge.scores);

      // 1️⃣ Algorithm filtering (ALL selected must support edge)
      const matchesAlgorithmSelection =
        selectedAlgorithms.length === 0 ||
        selectedAlgorithms.every(algo => supportingAlgos.includes(algo));

      // 2️⃣ Consensus threshold
      const matchesConsensus =
        supportingAlgos.length >= minConsensus[0];

      // 3️⃣ Score threshold
      const maxScore = Math.max(...Object.values(edge.scores));
      const matchesScore =
        maxScore >= scoreThreshold[0];

      // 4️⃣ Edge type filtering
      const matchesType =
        edgeFilter === 'all' || edge.type === edgeFilter;

      return (
        matchesAlgorithmSelection &&
        matchesConsensus &&
        matchesScore &&
        matchesType
      );
    });
  }, [
    selectedAlgorithms,
    minConsensus,
    scoreThreshold,
    edgeFilter
  ]);

  const limitedEdges = useMemo(() => {
  return filteredEdges
    .sort((a, b) => {
      const aScore = Math.max(...Object.values(a.scores));
      const bScore = Math.max(...Object.values(b.scores));
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


//   const degreeMap = useMemo(() => {
//   return limitedEdges.reduce<Record<string, number>>((acc, edge) => {
//     acc[edge.source] = (acc[edge.source] || 0) + 1;
//     acc[edge.target] = (acc[edge.target] || 0) + 1;
//     return acc;
//   }, {});
// }, [limitedEdges]);


  const nodeIds = new Set<string>();
  filteredEdges.forEach(edge => {
    nodeIds.add(edge.source);
    nodeIds.add(edge.target);
  });

  // const filteredNodes = mockNetworkData.nodes.filter(node =>
  //   nodeIds.has(node.id) &&
  //   (searchTerm === '' || node.label.toLowerCase().includes(searchTerm.toLowerCase()))
  // );

  const filteredNodes = Array.from(nodeIds).map(id => {
  const existing = mockNetworkData.nodes.find(n => n.id === id);

  return existing ?? {
    id,
    label: id,
    score: 0
  };
}).filter(node =>
  searchTerm === '' ||
  node.label.toLowerCase().includes(searchTerm.toLowerCase())
);


// const degreeMap: Record<string, number> = {};

// filteredEdges.forEach(edge => {
//   degreeMap[edge.source] = (degreeMap[edge.source] || 0) + 1;
//   degreeMap[edge.target] = (degreeMap[edge.target] || 0) + 1;
// });




  const cytoscapeElements = [
    ...filteredNodes.map(node => ({
      data: {
        id: node.id,
        label: node.label,
        score: node.score,
        degree: degreeMap[node.id] || 1
      }
    })),
    // ...filteredEdges.map((edge, idx) => ({
    //   data: {
    //     id: `edge-${idx}`,
    //     source: edge.source,
    //     target: edge.target,
    //     weight: edge.weight,
    //     type: edge.type
    //   }
    // }))

    ...filteredEdges.map(edge => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        consensus: Object.keys(edge.scores).length,
        scores: edge.scores
      }

    }))

  ];




  const cytoscapeStylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#5B2C6F',
        'label': 'data(label)',
        'width': 'mapData(degree, 1, 10, 30, 80)',
        'height': 'mapData(degree, 1, 10, 30, 80)',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '10px',
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
    'width': 'mapData(consensus, 1, 4, 2, 8)',
    'line-color': '#9CA3AF',
    'target-arrow-shape': 'triangle'
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
  const [selectedEdge, setSelectedEdge] = useState<any>(null);
  const [showHelpPanel, setShowHelpPanel] = useState(true);

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
        {/* <Badge variant="default">
          Dataset: hESC v2.1.0
        </Badge> */}
        <Select
  value={selectedDatasetId}
  onValueChange={setSelectedDatasetId}
>
  <SelectTrigger className="w-[220px]">
    <SelectValue placeholder="Select dataset" />
  </SelectTrigger>

  <SelectContent>
    {mockDatasets.map(dataset => (
      <SelectItem key={dataset.id} value={dataset.id}>
        {dataset.name} ({dataset.organism})
      </SelectItem>
    ))}
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


{/* Header */}
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Network Explorer</h1>
          <p className="text-muted-foreground">
            Interactive exploration of gene regulatory network predictions
          </p>
        </div> */}

        {/* Info Banner */}
        {/* <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-3">
            <Network className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">How to Explore This Network</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Click nodes</strong> to see gene annotations and regulatory relationships</li>
                <li>• <strong>Use the search bar</strong> to find specific genes like SOX2, OCT4, or NANOG</li>
                <li>• <strong>Adjust score threshold</strong> to focus on high-confidence edges</li>
                <li>• <strong>Toggle 'TF-only View'</strong> to see the transcription factor network</li>
              </ul>
            </div>
          </div>
        </div> */}

        <div id="search" className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* <Card>
            <CardHeader>Algorithm Recommendation</CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                Recommended: {predictedBestAlgorithm}
              </p>
              <p className="text-sm text-muted-foreground">
                Based on mean edge confidence across inferred network.
              </p>
            </CardContent>
          </Card> */}

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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                <span className="text-muted-foreground">Nodes</span>
                <span className="text-foreground">{filteredNodes.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Edges</span>
                <span className="text-foreground">{filteredEdges.length}</span>
              </div>
            </div>

            <div>
              <label className="text-sm mb-2 block">Select Inference Algorithms</label>
              <div className="space-y-2">
                {mockInferenceData.algorithms.map(algo => (
                  <label key={algo} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedAlgorithms.includes(algo)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAlgorithms([...selectedAlgorithms, algo]);
                        } else {
                          setSelectedAlgorithms(
                            selectedAlgorithms.filter(a => a !== algo)
                          );
                        }
                      }}
                    />
                    {algo}
                  </label>
                ))}
              </div>

              <div>
                <label className="text-sm mb-2 block">
                  Minimum Algorithm Consensus: {minConsensus[0]}
                </label>
                <Slider
                  value={minConsensus}
                  onValueChange={setMinConsensus}
                  min={1}
                  max={mockInferenceData.algorithms.length}
                  step={1}
                />
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
                  // cy.on('tap', 'node', (evt) => {
                  //   const node = evt.target;
                  //   setSelectedNode(node.data());
                  // });

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

          {/* {selectedNodeInfo && (
  <Card className="p-4 mt-4">
    <h3 className="font-semibold text-lg">
      Gene: {selectedNodeInfo.id}
    </h3>

    <p>Degree: {selectedNodeInfo.degree}</p>

    <p>
      Best Algorithm: {selectedNodeInfo.bestAlgo}
    </p>

    <p>
      Mean Score: {selectedNodeInfo.bestMean.toFixed(3)}
    </p>

    <p className="mt-2 text-sm">
      Neighbors: {selectedNodeInfo.neighbors.join(", ")}
    </p>
  </Card>
)} */}

{selectedNodeInfo && (
  <Card className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-foreground">Gene Details</h3>
        <p className="text-sm text-muted-foreground">
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
        <p className="text-xs text-muted-foreground mb-1">Gene ID</p>
        <p className="text-foreground">{selectedNodeInfo.id}</p>
      </div>

      <div className="p-4 bg-secondary rounded-lg">
        <p className="text-xs text-muted-foreground mb-1">Degree</p>
        <p className="text-foreground">{selectedNodeInfo.degree}</p>
      </div>

      <div className="p-4 bg-secondary rounded-lg">
        <p className="text-xs text-muted-foreground mb-1">
          Best Algorithm
        </p>
        <p className="text-foreground">{selectedNodeInfo.bestAlgo}</p>
      </div>

      <div className="p-4 bg-secondary rounded-lg">
        <p className="text-xs text-muted-foreground mb-1">
          Mean Score
        </p>
        <p className="text-foreground">
          {selectedNodeInfo.bestMean?.toFixed(3)}
        </p>
      </div>
    </div>

    <div className="mt-4 p-4 bg-secondary rounded-lg">
      <p className="text-xs text-muted-foreground mb-2">
        Neighbors
      </p>
      <div className="flex flex-wrap gap-2">
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
                  <p className="text-sm text-muted-foreground">Selected gene information</p>
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
                  <p className="text-xs text-muted-foreground mb-1">Gene ID</p>
                  <p className="text-foreground">{selectedNode.id}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Gene Name</p>
                  <p className="text-foreground">{selectedNode.label}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Importance Score</p>
                  <p className="text-foreground">{selectedNode.score?.toFixed(3)}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Degree</p>
                  <p className="text-foreground">
                    {filteredEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Neighbors</p>
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
              <div className="text-sm text-muted-foreground text-center py-8">
                Click a gene node to view details
              </div>

              
          {/* Node Details Panel */}
          {selectedNode && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-foreground">Node Details</h3>
                  <p className="text-sm text-muted-foreground">Selected gene information</p>
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
                  <p className="text-xs text-muted-foreground mb-1">Gene ID</p>
                  <p className="text-foreground">{selectedNode.id}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Gene Name</p>
                  <p className="text-foreground">{selectedNode.label}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Importance Score</p>
                  <p className="text-foreground">{selectedNode.score?.toFixed(3)}</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Degree</p>
                  <p className="text-foreground">
                    {filteredEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Neighbors</p>
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
            <p className='text-sm text-muted-foreground'>© 2026 WebGenie Platform. Licensed under MIT. All rights reserved.</p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
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
