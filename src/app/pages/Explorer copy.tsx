import { Network, ZoomIn, ZoomOut, Search, Maximize2, Share2, Maximize, Download, Filter, Play, Activity } from 'lucide-react';
// import { Slider } from '../components/ui/slider';
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
// import { Search, Download, Maximize2, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import { mockNetworkData } from '.././components/mockData';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import GraphML from 'cytoscape-graphml';
import JSZip from "jszip";
import { saveAs } from "file-saver";
export function Explorer() {
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

  const nodeIds = new Set<string>();
  filteredEdges.forEach(edge => {
    nodeIds.add(edge.source);
    nodeIds.add(edge.target);
  });

  const filteredNodes = mockNetworkData.nodes.filter(node =>
    nodeIds.has(node.id) &&
    (searchTerm === '' || node.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const cytoscapeElements = [
    ...filteredNodes.map(node => ({
      data: {
        id: node.id,
        label: node.label,
        score: node.score
      }
    })),
    ...filteredEdges.map((edge, idx) => ({
      data: {
        id: `edge-${idx}`,
        source: edge.source,
        target: edge.target,
        weight: edge.weight,
        type: edge.type
      }
    }))
  ];

  const cytoscapeStylesheet: cytoscape.Stylesheet[] = [
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
// const handleExportPNG = () => {
//   if (cyRef.current) {
//     const png = cyRef.current.png({ full: true, scale: 2 });
//     const link = document.createElement('a');
//     link.download = 'network.png';
//     link.href = png;
//     link.click();
//   }
// };

// -------------------- New Export Handlers --------------------

// Export SVG
// const handleExportSVG = () => {
//   if (cyRef.current) {
//     const svg = cyRef.current.svg({ full: true }); // Cytoscape.js SVG export
//     const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
//     const link = document.createElement('a');
//     link.download = 'network.svg';
//     link.href = URL.createObjectURL(blob);
//     link.click();
//   }
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

// Export GraphML
// const handleExportGraphML = () => {
//   if (cyRef.current) {
//     const graphml = cyRef.current.graphml(); // Requires cytoscape-graphml extension
//     const blob = new Blob([graphml], { type: 'application/xml;charset=utf-8' });
//     const link = document.createElement('a');
//     link.download = 'network.graphml';
//     link.href = URL.createObjectURL(blob);
//     link.click();
//   }
// };

// ----------------------------------------------------------
// PNG EXPORT
// ----------------------------------------------------------
const handleExportPNG = () => {
  if (!cyRef.current) return;
  const png = cyRef.current.png({ full: true, scale: 2 });

  const link = document.createElement("a");
  link.download = "network.png";
  link.href = png;
  link.click();
};


// ----------------------------------------------------------
// SVG EXPORT
// ----------------------------------------------------------
const handleExportSVG = () => {
  if (!cyRef.current) return;

  const svg = cyRef.current.svg({ full: true });
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  saveAs(blob, "network.svg");
};


// ----------------------------------------------------------
// CSV EXPORT (nodes + edges)
// ----------------------------------------------------------
const handleExportCSV = () => {
  if (!cyRef.current) return;

  const cy = cyRef.current;

  const nodes = cy.nodes().map((n) => ({
    id: n.id(),
    label: n.data("label") || "",
    ...n.data(),
  }));

  const edges = cy.edges().map((e) => ({
    id: e.id(),
    source: e.source().id(),
    target: e.target().id(),
    ...e.data(),
  }));

  const convertToCSV = (data) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((obj) =>
      headers.map((h) => JSON.stringify(obj[h] ?? "")).join(",")
    );
    return headers.join(",") + "\n" + rows.join("\n");
  };

  const csvText = [
    "# NODES",
    convertToCSV(nodes),
    "",
    "# EDGES",
    convertToCSV(edges),
  ].join("\n");

  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  saveAs(blob, "network.csv");
};


// ----------------------------------------------------------
// GRAPHML EXPORT
// ----------------------------------------------------------
const handleExportGraphML = () => {
  if (!cyRef.current) return;

  const xml = cyRef.current.graphml();
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  saveAs(blob, "network.graphml");
};


// ----------------------------------------------------------
// JSON EXPORT (full graph)
// ----------------------------------------------------------
const handleExportJSON = () => {
  if (!cyRef.current) return;

  const json = cyRef.current.json();
  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, "network.json");
};


// ----------------------------------------------------------
// ZIP EXPORT (PNG + SVG + CSV + GraphML + JSON)
// ----------------------------------------------------------
const handleExportZIP = async () => {
  if (!cyRef.current) return;
  const cy = cyRef.current;

  const zip = new JSZip();

  // PNG
  const png = cy.png({ full: true, scale: 2 });
  zip.file("network.png", png.split(",")[1], { base64: true });

  // SVG
  const svg = cy.svg({ full: true });
  zip.file("network.svg", svg);

  // JSON
  zip.file("network.json", JSON.stringify(cy.json(), null, 2));

  // CSV
  const nodes = cy.nodes().map((n) => ({
    id: n.id(),
    label: n.data("label") || "",
    ...n.data(),
  }));

  const edges = cy.edges().map((e) => ({
    id: e.id(),
    source: e.source().id(),
    target: e.target().id(),
    ...e.data(),
  }));

  const convertToCSV = (data) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((obj) =>
      headers.map((h) => JSON.stringify(obj[h] ?? "")).join(",")
    );
    return headers.join(",") + "\n" + rows.join("\n");
  };

  const csvText = [
    "# NODES",
    convertToCSV(nodes),
    "",
    "# EDGES",
    convertToCSV(edges),
  ].join("\n");

  zip.file("network.csv", csvText);

  // GRAPHML
  const graphml = cy.graphml();
  zip.file("network.graphml", graphml);

  // Generate ZIP and download
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "network_export.zip");
};


// ----------------------------------------------------------
// Optional tiny toast (fallback)
// ----------------------------------------------------------
const notify = (msg) => {
  alert(msg); // replace with toast() if using shadcn or react-hot-toast
};

  return (
    <div id="explorer" className="min-h-screen py-20 pb-0">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Network Explorer</h1>
          <p className="text-muted-foreground">
            Interactive exploration of gene regulatory network predictions
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
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
        </div>

        <div id="search" className="grid lg:grid-cols-4 gap-6">
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
              <div id="cy" ref={cyRef} className="w-full h-[700px] border rounded-md" />

              <CytoscapeComponent
               id="details"
                elements={cytoscapeElements}
                style={{ width: '100%', height: '600px' }}
                stylesheet={cytoscapeStylesheet}
                layout={{ name: layout }}
                cy={(cy) => {
                  cyRef.current = cy;
                  cy.on('tap', 'node', (evt) => {
                    const node = evt.target;
                    setSelectedNode(node.data());
                  });
                }}
              />
            </div>
          </Card>

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
        </div>
          </div>

          {/* Right Sidebar - Gene Details */}
          <div className="lg:col-span-1">
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
                  {/* <button onClick={handleExportGraphML} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Download GraphML
                  </button> */}
                  <button onClick={handleExportJSON} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Download as JSON
                  </button>
                  {/* <button onClick={handleExportZIP} className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors">
                    <Download className="w-4 h-4" />
                    Export All (ZIP)
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
    </div>
  );
}
