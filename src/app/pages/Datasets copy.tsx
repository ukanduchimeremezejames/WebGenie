import { Filter, Boxes, Layers, Globe, Search, Database, Download, Activity } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { Button } from '../components/ui/button';

const allDatasets = [
  {
    id: 'hESC',
    name: 'hESC',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 1872,
    cells: 758,
    edges: 3289,
    source: 'curated' as const,
    lastUpdated: '2024-11-15',
    sparklineData: [34, 45, 52, 48, 61, 73, 68, 82, 91, 78]
  },
  {
    id: 'mDC',
    name: 'mDC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1547,
    cells: 383,
    edges: 2456,
    source: 'real' as const,
    lastUpdated: '2024-10-28',
    sparklineData: [28, 31, 39, 42, 38, 51, 58, 64, 59, 71]
  },
  {
    id: 'mESC',
    name: 'mESC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1654,
    cells: 421,
    edges: 2891,
    source: 'curated' as const,
    lastUpdated: '2024-11-08',
    sparklineData: [22, 35, 41, 48, 44, 59, 62, 71, 68, 75]
  },
  {
    id: 'hHep',
    name: 'hHep',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 1985,
    cells: 642,
    edges: 3567,
    source: 'synthetic' as const,
    lastUpdated: '2024-09-22',
    sparklineData: [31, 38, 42, 49, 55, 62, 58, 69, 77, 82]
  },
  {
    id: 'VSC',
    name: 'VSC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1432,
    cells: 564,
    edges: 2234,
    source: 'curated' as const,
    lastUpdated: '2024-10-12',
    sparklineData: [19, 28, 34, 41, 48, 52, 59, 65, 71, 68]
  },
  {
    id: 'hHSPC',
    name: 'hHSPC',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 2145,
    cells: 823,
    edges: 4156,
    source: 'real' as const,
    lastUpdated: '2024-09-05',
    sparklineData: [42, 51, 58, 62, 69, 75, 81, 88, 92, 89]
  },
  {
    id: 'mHSC-E',
    name: 'mHSC-E',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1789,
    cells: 645,
    edges: 3012,
    source: 'curated' as const,
    lastUpdated: '2024-11-01',
    sparklineData: [25, 33, 39, 46, 53, 61, 68, 74, 79, 85]
  },
  {
    id: 'mHSC-L',
    name: 'mHSC-L',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1823,
    cells: 712,
    edges: 3178,
    source: 'curated' as const,
    lastUpdated: '2024-10-29',
    sparklineData: [28, 36, 43, 49, 56, 64, 71, 77, 82, 88]
  },
  {
    id: 'Synthetic-1',
    name: 'Synthetic-1',
    organism: 'Synthetic',
    type: 'scRNA-seq',
    genes: 1500,
    cells: 500,
    edges: 2500,
    source: 'synthetic' as const,
    lastUpdated: '2024-08-15',
    sparklineData: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75]
  },
  {
    id: 'Synthetic-2',
    name: 'Synthetic-2',
    organism: 'Synthetic',
    type: 'scRNA-seq',
    genes: 2000,
    cells: 750,
    edges: 3500,
    source: 'synthetic' as const,
    lastUpdated: '2024-08-20',
    sparklineData: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
  },
  {
    id: 'yeast-1',
    name: 'Yeast Network 1',
    organism: 'Yeast',
    type: 'Bulk RNA-seq',
    genes: 987,
    cells: 234,
    edges: 1456,
    source: 'real' as const,
    lastUpdated: '2024-07-10',
    sparklineData: [18, 24, 31, 37, 44, 51, 57, 63, 68, 72]
  },
  {
    id: 'yeast-2',
    name: 'Yeast Network 2',
    organism: 'Yeast',
    type: 'Bulk RNA-seq',
    genes: 1123,
    cells: 298,
    edges: 1789,
    source: 'real' as const,
    lastUpdated: '2024-07-22',
    sparklineData: [21, 27, 34, 40, 47, 54, 60, 66, 71, 75]
  }
];

const datasets = [
  {
    id: 1,
    name: 'HSC_Synthetic_100',
    organism: 'Mouse',
    cells: 500,
    genes: 100,
    networks: 12,
    description: 'Synthetic hematopoietic stem cell data',
  },
  {
    id: 2,
    name: 'mESC_hematopoietic',
    organism: 'Mouse',
    cells: 1654,
    genes: 3934,
    networks: 10,
    description: 'Mouse embryonic stem cells differentiating to blood cells',
  },
  {
    id: 3,
    name: 'hESC_definitive_endoderm',
    organism: 'Human',
    cells: 3396,
    genes: 16834,
    networks: 8,
    description: 'Human embryonic stem cell differentiation',
  },
  {
    id: 4,
    name: 'mDC_GSE48968',
    organism: 'Mouse',
    cells: 383,
    genes: 18215,
    networks: 6,
    description: 'Mouse dendritic cell maturation',
  },
  {
    id: 5,
    name: 'mESC_GSE65525',
    organism: 'Mouse',
    cells: 933,
    genes: 24175,
    networks: 5,
    description: 'Mouse embryonic stem cell cultures',
  },
  {
    id: 6,
    name: 'hESC_GSE75748',
    organism: 'Human',
    cells: 1018,
    genes: 16708,
    networks: 7,
    description: 'Human embryonic stem cell time series',
  },
];

const stats = [
  { label: 'Total Datasets', value: '24', change: '+2 this month' },
  { label: 'Total Cells', value: '47K', change: 'Across all datasets' },
  { label: 'Organisms', value: '5', change: 'Mouse, Human, Yeast' },
  { label: 'Networks Available', value: '156', change: 'Ground truth & predicted' },
];

export function Datasets() {
    const totalGenes = allDatasets.reduce((sum, d) => sum + d.genes, 0);
  const totalCells = allDatasets.reduce((sum, d) => sum + d.cells, 0);
  const totalEdges = allDatasets.reduce((sum, d) => sum + d.edges, 0);

  // Placeholder — update when you have "runs"
  const totalRuns = 0;

  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganism, setSelectedOrganism] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  const filteredDatasets = allDatasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.organism.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrganism = selectedOrganism === 'all' || dataset.organism === selectedOrganism;
    const matchesType = selectedType === 'all' || dataset.type === selectedType;
    const matchesSource = selectedSource === 'all' || dataset.source === selectedSource;
    
  

    return matchesSearch && matchesOrganism && matchesType && matchesSource;
  });

  return (
    <div id="all" className="min-h-screen py-20 pb-0">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Datasets</h1>
          <p className="text-muted-foreground">
            Browse and explore single-cell RNA-seq datasets for benchmarking
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 rounded-lg border bg-card">
              <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div id="search" className="text-xs text-muted-foreground">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

  {/* <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
        <Database className="w-4 h-4 text-blue-600" />
      </div>
      <h4 className="text-gray-900 font-medium">Total Datasets</h4>
    </div>
    <p className="text-sm text-gray-600 mb-2">Number of datasets in the system</p>
    <AnimatedCounter title="" value={allDatasets.length} className="mt-2" />
  </div>

  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
        <Globe className="w-4 h-4 text-green-600" />
      </div>
      <h4 className="text-gray-900 font-medium">Organisms</h4>
    </div>
    <p className="text-sm text-gray-600 mb-2">Unique organisms represented</p>
    <AnimatedCounter
      title=""
      value={new Set(allDatasets.map(d => d.organism)).size}
      className="mt-2"
    />
  </div> */}

  {/* <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
        <Layers className="w-4 h-4 text-purple-600" />
      </div>
      <h4 className="text-gray-900 font-medium">Types</h4>
    </div>
    <p className="text-sm text-gray-600 mb-2">Dataset categories available</p>
    <AnimatedCounter
      title=""
      value={new Set(allDatasets.map(d => d.type)).size}
      className="mt-2"
    />
  </div> */}

  {/* <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
        <Boxes className="w-4 h-4 text-yellow-600" />
      </div>
      <h4 className="text-gray-900 font-medium">Sources</h4>
    </div>
    <p className="text-sm text-gray-600 mb-2">Distinct dataset sources</p>
    <AnimatedCounter
      title=""
      value={new Set(allDatasets.map(d => d.source)).size}
      className="mt-2"
    />
  </div> */}

</div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search datasets by name or organism..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedOrganism}
              onChange={(e) => setSelectedOrganism(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Organisms</option>
              <option value="Human">Human</option>
              <option value="Mouse">Mouse</option>
              <option value="Yeast">Yeast</option>
              <option value="Synthetic">Synthetic</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="scRNA-seq">scRNA-seq</option>
              <option value="Bulk RNA-seq">Bulk RNA-seq</option>
              <option value="ChIP-seq">ChIP-seq</option>
            </select>

            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Sources</option>
              <option value="curated">Curated</option>
              <option value="real">Real</option>
              <option value="synthetic">Synthetic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredDatasets.length}</span> of{' '}
          <span className="font-medium text-gray-900">{allDatasets.length}</span> datasets
        </p>
        <Button variant="secondary" icon={<SlidersHorizontal className="w-4 h-4" />}>
          Advanced Filters
        </Button>
      </div>


        {/* Filters & Search */}
        <div  className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets..."
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Dataset Grid */}
        <div id="metadata" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold mb-1">{dataset.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{dataset.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 text-xs rounded bg-secondary/10 text-secondary font-medium">
                  {dataset.organism}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Cells</div>
                  <div className="font-semibold">{dataset.cells.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Genes</div>
                  <div className="font-semibold">{dataset.genes.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Networks</div>
                  <div className="font-semibold">{dataset.networks}</div>
                </div>
              </div>
            </div>
          ))}
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
