import { useState } from 'react';
import { Button } from './Button';
import { Badge } from './Badge';
import { 
  Layers, Grid3x3, Circle, Filter, Eye, EyeOff, 
  Download, Share2, Maximize2, Search, ZoomIn, ZoomOut,
  Target, HelpCircle, Play, Info, Sparkles, Network
} from 'lucide-react';

export function NetworkExplorer() {
  const [layoutType, setLayoutType] = useState<'force' | 'circular' | 'grid' | 'hierarchical'>('force');
  const [showOverlay, setShowOverlay] = useState(false);
  const [tfOnlyView, setTfOnlyView] = useState(false);
  const [showModules, setShowModules] = useState(true);
  const [scoreThreshold, setScoreThreshold] = useState(0.5);
  const [edgeType, setEdgeType] = useState<'all' | 'activation' | 'inhibition'>('all');
  const [selectedGene, setSelectedGene] = useState('');
  const [showHelpPanel, setShowHelpPanel] = useState(true);
  
  return (
    <div className="max-w-[1800px] mx-auto px-8 py-8">
      {/* Header with Context */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-gray-900 mb-2">Network Explorer</h1>
            <p className="text-gray-600">
              Interactive exploration of gene regulatory network predictions
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Badge variant="info" size="sm">
                <Network className="w-3 h-3 mr-1" />
                CytoscapeJS Interactive Canvas
              </Badge>
              <Badge variant="default" size="sm">
                Dataset: hESC v2.1.0
              </Badge>
              <Badge variant="default" size="sm">
                Algorithm: GENIE3 v1.12.0
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="sm"
              icon={<HelpCircle className="w-4 h-4" />}
              onClick={() => setShowHelpPanel(!showHelpPanel)}
            >
              Help
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              icon={<Share2 className="w-4 h-4" />}
            >
              Share
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              icon={<Download className="w-4 h-4" />}
            >
              Export
            </Button>
          </div>
        </div>
        
        {/* Help Panel */}
        {showHelpPanel && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-blue-900 mb-3">How to Explore This Network</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <p className="font-medium mb-1">🧬 For Biologists:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Click nodes to see gene annotations and regulatory relationships</li>
                      <li>Use the search bar to find specific transcription factors</li>
                      <li>Adjust score threshold to focus on high-confidence edges</li>
                      <li>Toggle "TF-only View" to see transcription factor networks</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">🔬 Network Interpretation:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li><strong>Edge thickness:</strong> Confidence score of regulation</li>
                      <li><strong>Green edges:</strong> Predicted activation</li>
                      <li><strong>Red edges:</strong> Predicted inhibition</li>
                      <li><strong>Node size:</strong> Number of regulatory connections</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg text-sm text-blue-900">
                  <strong>💡 Tip:</strong> Use "Highlight Neighbors" to focus on regulatory modules around key genes like SOX2, OCT4, or NANOG
                </div>
              </div>
              <button 
                onClick={() => setShowHelpPanel(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Filter Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-900">Controls</h3>
            </div>
            
            {/* Gene Search */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Search Gene</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g., SOX2, OCT4..."
                  value={selectedGene}
                  onChange={(e) => setSelectedGene(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              {selectedGene && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={<Target className="w-4 h-4" />}
                  className="w-full mt-2"
                >
                  Focus on {selectedGene}
                </Button>
              )}
            </div>
            
            {/* Layout Switcher */}
            <div>
              <label className="block text-sm text-gray-700 mb-3">Layout Type</label>
              <div className="space-y-2">
                {[
                  { key: 'force', icon: Layers, label: 'Force-Directed', desc: 'Physics-based' },
                  { key: 'circular', icon: Circle, label: 'Circular', desc: 'Radial layout' },
                  { key: 'hierarchical', icon: Target, label: 'Hierarchical', desc: 'Top-down' },
                  { key: 'grid', icon: Grid3x3, label: 'Grid', desc: 'Structured' }
                ].map(({ key, icon: Icon, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => setLayoutType(key as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all ${
                      layoutType === key 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="text-left flex-1">
                      <p className="text-sm">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Score Threshold */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Score Threshold
                <span className="text-purple-600 ml-2 font-medium">{scoreThreshold.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={scoreThreshold}
                onChange={(e) => setScoreThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.0</span>
                <span>1.0</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Only show edges with confidence ≥ {scoreThreshold.toFixed(2)}
              </p>
            </div>
            
            {/* Edge Type Filter */}
            <div>
              <label className="block text-sm text-gray-700 mb-3">Edge Type</label>
              <div className="space-y-2">
                {[
                  { key: 'all', label: 'All Interactions', color: 'gray' },
                  { key: 'activation', label: 'Activation Only', color: 'green' },
                  { key: 'inhibition', label: 'Inhibition Only', color: 'red' }
                ].map(({ key, label, color }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edgeType"
                      checked={edgeType === key}
                      onChange={() => setEdgeType(key as any)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                    <div className={`w-6 h-0.5 bg-${color}-500`} />
                  </label>
                ))}
              </div>
            </div>
            
            {/* View Options */}
            <div>
              <label className="block text-sm text-gray-700 mb-3">View Options</label>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">TF-only View</span>
                  <input 
                    type="checkbox"
                    checked={tfOnlyView}
                    onChange={(e) => setTfOnlyView(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">Show Modules</span>
                  <input 
                    type="checkbox"
                    checked={showModules}
                    onChange={(e) => setShowModules(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">Gene Labels</span>
                  <input 
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
            </div>
            
            {/* Apply Filters Button */}
            <Button 
              variant="primary" 
              icon={<Play className="w-4 h-4" />}
              className="w-full"
            >
              Apply Filters
            </Button>
            
            {/* Network Stats */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3">Current Network</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Nodes:</span>
                  <span className="text-gray-900 font-medium">1,847</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Edges:</span>
                  <span className="text-gray-900 font-medium">3,289</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Filtered:</span>
                  <span className="text-gray-900 font-medium">856</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Network Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Canvas Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">
                  Interactive Canvas
                </Badge>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-600">Layout: {layoutType}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Zoom In">
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Zoom Out">
                  <ZoomOut className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Fit View">
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Toggle Labels">
                  {showOverlay ? <EyeOff className="w-4 h-4 text-gray-600" /> : <Eye className="w-4 h-4 text-gray-600" />}
                </button>
              </div>
            </div>
            
            {/* Network Visualization Canvas */}
            <div className="relative bg-gray-50" style={{ height: '700px' }}>
              {/* Placeholder for CytoscapeJS Canvas */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">CytoscapeJS Interactive Network Canvas</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Backend integration required: GET /api/runs/{'{id}'}/network
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700">
                    <Info className="w-4 h-4" />
                    <span>Dynamic network will render here from FastAPI</span>
                  </div>
                </div>
              </div>
              
              {/* Canvas Overlay UI Elements */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-gray-700">Transcription Factors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-gray-700">Target Genes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-green-500" />
                    <span className="text-gray-700">Activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-red-500" />
                    <span className="text-gray-700">Inhibition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Button variant="secondary" icon={<Target className="w-4 h-4" />}>
              Highlight Neighbors
            </Button>
            <Button variant="secondary" icon={<Sparkles className="w-4 h-4" />}>
              Detect Modules
            </Button>
            <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
              Export Network
            </Button>
          </div>
        </div>
        
        {/* Right Info Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
            <h3 className="text-gray-900">Gene Details</h3>
            
            <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
              Click a gene node to view details
            </div>
            
            {/* Example Gene Info (shown when selected) */}
            <div className="hidden">
              <div className="mb-4">
                <h4 className="text-lg text-gray-900 mb-1">SOX2</h4>
                <Badge variant="info" size="sm">Transcription Factor</Badge>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Full Name</p>
                  <p className="text-gray-900">SRY-Box Transcription Factor 2</p>
                </div>
                
                <div>
                  <p className="text-gray-500 mb-1">Function</p>
                  <p className="text-gray-900">Maintains pluripotency and self-renewal in embryonic stem cells</p>
                </div>
                
                <div>
                  <p className="text-gray-500 mb-1">Regulatory Targets</p>
                  <p className="text-gray-900">24 predicted targets</p>
                </div>
                
                <div>
                  <p className="text-gray-500 mb-1">Regulators</p>
                  <p className="text-gray-900">8 predicted regulators</p>
                </div>
              </div>
            </div>
            
            {/* Subnetwork Controls */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm text-gray-700 mb-3">Focus Options</h4>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Expand 1-hop neighborhood
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Show all paths to target
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Hide unconnected nodes
                </Button>
              </div>
            </div>
            
            {/* Export Options */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm text-gray-700 mb-3">Export</h4>
              <div className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Export as PNG
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Export as SVG
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Download Edge List (CSV)
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  Download GraphML
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
