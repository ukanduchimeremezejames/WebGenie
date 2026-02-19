import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { ActivityPreview } from './ActivityPreview';
import { Search, SlidersHorizontal, Database, Download, Globe, Layers, Boxes, Dna, Microscope, GitFork, PlayCircle } from 'lucide-react';
import { DatasetCard } from './DatasetCard';
import { Button2 } from './Button';
import AnimatedCounter from './AnimatedCounter';
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";

import { datasets } from "../../data/datasets";

const allDatasets = [
  // -------------------------
  // Curated Ground-Truth GRNs
  // -------------------------
  {
    id: 'GSD',
    name: 'GSD',
    organism: 'N/A',
    type: 'curated',
    genes: 18,
    cells: 120,
    edges: 79,
    source: 'real' as const,
    lastUpdated: '2020-03-27',
    sparklineData: [62, 59, 62, 61, 63, 64, 63, 60, 60, 64]
  },
  {
    id: 'HSC',
    name: 'HSC',
    organism: 'N/A',
    type: 'curated',
    genes: 11,
    cells: 110,
    edges: 30,
    source: 'real' as const,
    lastUpdated: '2020-05-14',
    sparklineData: [59, 58, 61, 60, 64, 57, 62, 59, 60, 58]
  },
  {
    id: 'mCAD',
    name: 'mCAD',
    organism: 'N/A',
    type: 'curated',
    genes: 5,
    cells: 100,
    edges: 14,
    source: 'real' as const,
    lastUpdated: '2021-01-11',
    sparklineData: [60, 63, 58, 61, 65, 53, 62, 57, 60, 61]
  },
  {
    id: 'VSC',
    name: 'VSC',
    organism: 'N/A',
    type: 'curated',
    genes: 8,
    cells: 115,
    edges: 15,
    source: 'real' as const,
    lastUpdated: '2021-04-02',
    sparklineData: [60, 61, 64, 59, 62, 58, 63, 60, 62, 61]
  },

  // -------------------------
  // Real scRNA-seq Datasets
  // -------------------------
  {
    id: 'hESC',
    name: 'hESC',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 1000,
    cells: 758,
    edges: 3200,
    source: 'real' as const,
    lastUpdated: '2020-09-18',
    sparklineData: [29, 27, 31, 25, 29, 31, 28, 32, 30, 26]
  },
  {
    id: 'hHep',
    name: 'hHep',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 950,
    cells: 642,
    edges: 2800,
    source: 'real' as const,
    lastUpdated: '2021-02-23',
    sparklineData: [18, 24, 20, 25, 32, 28, 25, 23, 25, 26]
  },
  {
    id: 'mDC',
    name: 'mDC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 900,
    cells: 383,
    edges: 2100,
    source: 'real' as const,
    lastUpdated: '2021-06-30',
    sparklineData: [15, 20, 18, 26, 20, 25, 19, 23, 21, 17]
  },
  {
    id: 'mESC',
    name: 'mESC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1100,
    cells: 536,
    edges: 3400,
    source: 'real' as const,
    lastUpdated: '2022-01-19',
    sparklineData: [26, 25, 28, 24, 23, 27, 23, 23, 24, 22]
  },
  {
    id: 'mHSC-E',
    name: 'mHSC-E',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1050,
    cells: 645,
    edges: 3100,
    source: 'real' as const,
    lastUpdated: '2022-03-07',
    sparklineData: [26, 27, 25, 30, 28, 30, 26, 29, 31, 29]
  },
  {
    id: 'mHSC-GM',
    name: 'mHSC-GM',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1200,
    cells: 635,
    edges: 3600,
    source: 'real' as const,
    lastUpdated: '2022-06-12',
    sparklineData: [30, 25, 26, 23, 27, 29, 26, 28, 30, 24]
  },
  {
    id: 'mHSC-L',
    name: 'mHSC-L',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 980,
    cells: 712,
    edges: 2950,
    source: 'real' as const,
    lastUpdated: '2022-08-25',
    sparklineData: [20, 22, 25, 26, 27, 23, 26, 24, 28, 24]
  },

  // -------------------------
  // Synthetic Dynamic Networks
  // -------------------------
  {
    id: 'dyn-LL',
    name: 'Dynamic LL',
    organism: 'N/A',
    type: 'synthetic',
    genes: 18,
    cells: 140,
    edges: 19,
    source: 'synthetic' as const,
    lastUpdated: '2020-07-09',
    sparklineData: [39, 42, 42, 41, 38, 39, 41, 37, 40, 40]
  },
  {
    id: 'dyn-LI',
    name: 'Dynamic LI',
    organism: 'N/A',
    type: 'synthetic',
    genes: 7,
    cells: 115,
    edges: 8,
    source: 'synthetic' as const,
    lastUpdated: '2020-10-21',
    sparklineData: [36, 37, 35, 40, 38, 41, 39, 39, 41, 34]
  },
  {
    id: 'dyn-TF',
    name: 'Dynamic TF',
    organism: 'N/A',
    type: 'synthetic',
    genes: 7,
    cells: 118,
    edges: 20,
    source: 'synthetic' as const,
    lastUpdated: '2021-03-16',
    sparklineData: [40, 41, 38, 41, 36, 43, 39, 42, 37, 42]
  },
  {
    id: 'dyn-BF',
    name: 'Dynamic BF',
    organism: 'N/A',
    type: 'synthetic',
    genes: 5,
    cells: 105,
    edges: 12,
    source: 'synthetic' as const,
    lastUpdated: '2021-09-28',
    sparklineData: [35, 39, 37, 37, 36, 40, 39, 42, 38, 39]
  },
  {
    id: 'dyn-BFC',
    name: 'Dynamic BFC',
    organism: 'N/A',
    type: 'synthetic',
    genes: 9,
    cells: 125,
    edges: 18,
    source: 'synthetic' as const,
    lastUpdated: '2022-02-14',
    sparklineData: [39, 40, 38, 41, 37, 42, 39, 39, 38, 40]
  },
  {
    id: 'dyn-CY',
    name: 'Dynamic CY',
    organism: 'N/A',
    type: 'synthetic',
    genes: 5,
    cells: 110,
    edges: 6,
    source: 'synthetic' as const,
    lastUpdated: '2022-11-03',
    sparklineData: [37, 41, 39, 40, 31, 43, 40, 41, 40, 41]
  },
];

// const allDatasets = [
//   {
//     id: 'GSD',
//     name: 'GSD',
//     organism: 'Human',
//     type: 'currated',
//     genes: 1872,
//     cells: 789,
//     edges: 4728,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [34, 45, 52, 48, 51, 73, 68, 32, 91, 78]
//   },
//   {
//     id: 'HSC',
//     name: 'HSC',
//     organism: 'Mouse',
//     type: 'curated',
//     genes: 1726,
//     cells: 895,
//     edges: 2896,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [31, 43, 51, 42, 51, 73, 68, 83, 91, 78]
//   },  
//   {
//     id: 'mCAD',
//     name: 'mCAD',
//     organism: 'Mouse',
//     type: 'curated',
//     genes: 1872,
//     cells: 758,
//     edges: 3289,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [34, 45, 52, 48, 61, 73, 68, 82, 43, 78]
//   },
//   {
//     id: 'VSC',
//     name: 'VSC',
//     organism: 'Mouse',
//     type: 'curated',
//     genes: 1782,
//     cells: 598,
//     edges: 2989,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [34, 45, 32, 48, 61, 73, 98, 82, 91, 78]
//   },
//   {
//     id: 'hESC',
//     name: 'hESC',
//     organism: 'Human',
//     type: 'scRNA-seq',
//     genes: 1872,
//     cells: 758,
//     edges: 3289,
//     source: 'real' as const,
//     lastUpdated: '2024-11-15',
//     sparklineData: [34, 45, 52, 48, 61, 73, 68, 82, 91, 78]
//   },
//   {
//     id: 'mDC',
//     name: 'mDC',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1547,
//     cells: 383,
//     edges: 2456,
//     source: 'real' as const,
//     lastUpdated: '2024-10-28',
//     sparklineData: [28, 31, 39, 42, 38, 51, 58, 64, 59, 71]
//   },
//   // {
//   //   id: 'mESC',
//   //   name: 'mESC',
//   //   organism: 'Mouse',
//   //   type: 'scRNA-seq',
//   //   genes: 1654,
//   //   cells: 421,
//   //   edges: 2891,
//   //   source: 'curated' as const,
//   //   lastUpdated: '2024-11-08',
//   //   sparklineData: [22, 35, 41, 48, 44, 59, 62, 71, 68, 75]
//   // },
//   {
//     id: 'hHep',
//     name: 'hHep',
//     organism: 'Human',
//     type: 'scRNA-seq',
//     genes: 1985,
//     cells: 642,
//     edges: 3567,
//     source: 'real' as const,
//     lastUpdated: '2024-09-22',
//     sparklineData: [31, 38, 42, 49, 55, 62, 58, 69, 77, 82]
//   },
//   {
//     id: 'mESC',
//     name: 'mESC',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1362,
//     cells: 536,
//     edges: 2384,
//     source: 'curated' as const,
//     lastUpdated: '2024-10-12',
//     sparklineData: [19, 38, 24, 41, 48, 72, 59, 65, 71, 68]
//   },
//   {
//   id: 'mHSC-E',
//   name: 'mHSC-E',
//   organism: 'Mouse',
//   type: 'scRNA-seq',
//   genes: 4762,                     // from GeneOrdering.csv
//   cells: 645,                      // from PseudoTime.csv
//   edges: 2857,                      // ~0.6 * genes
//   source: 'curated' as const,
//   lastUpdated: '2024-11-01',
//   sparklineData: [22, 30, 38, 45, 53, 60, 68, 74, 80, 86]
// },
//   {
//     id: 'mHSC-GM',
//     name: 'mHSC-GM',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 18895,
//     cells: 635,
//     edges: 3062,
//     source: 'curated' as const,
//     lastUpdated: '2024-11-01',
//     sparklineData: [24, 39, 43, 46, 53, 61, 68, 74, 78, 85]
//   },
//   {
//     id: 'mHSC-L',
//     name: 'mHSC-L',
//     organism: 'Mouse',
//     type: 'scRNA-seq',
//     genes: 1823,
//     cells: 712,
//     edges: 3178,
//     source: 'curated' as const,
//     lastUpdated: '2024-10-29',
//     sparklineData: [28, 36, 43, 49, 56, 64, 71, 77, 82, 88]
//   },
//   // {
//   //   id: 'yeast-1',
//   //   name: 'Yeast Network 1',
//   //   organism: 'Yeast',
//   //   type: 'Bulk RNA-seq',
//   //   genes: 987,
//   //   cells: 234,
//   //   edges: 1456,
//   //   source: 'real' as const,
//   //   lastUpdated: '2024-07-10',
//   //   sparklineData: [18, 24, 31, 37, 44, 51, 57, 63, 68, 72]
//   // },
//   // {
//   //   id: 'yeast-2',
//   //   name: 'Yeast Network 2',
//   //   organism: 'Yeast',
//   //   type: 'Bulk RNA-seq',
//   //   genes: 1123,
//   //   cells: 298,
//   //   edges: 1789,
//   //   source: 'real' as const,
//   //   lastUpdated: '2024-07-22',
//   //   sparklineData: [21, 27, 34, 40, 47, 54, 60, 66, 71, 75]
//   // },
//   // {
//   //   id: 'Synthetic-1',
//   //   name: 'Synthetic-1',
//   //   organism: 'Synthetic',
//   //   type: 'scRNA-seq',
//   //   genes: 1500,
//   //   cells: 500,
//   //   edges: 2500,
//   //   source: 'synthetic' as const,
//   //   lastUpdated: '2024-08-15',
//   //   sparklineData: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75]
//   // },
//   // {
//   //   id: 'Synthetic-2',
//   //   name: 'Synthetic-2',
//   //   organism: 'Synthetic',
//   //   type: 'scRNA-seq',
//   //   genes: 2000,
//   //   cells: 750,
//   //   edges: 3500,
//   //   source: 'synthetic' as const,
//   //   lastUpdated: '2024-08-20',
//   //   sparklineData: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
//   // }  
//   {
//     id: 'dyn-LL',
//     name: 'Dynamic LL',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 1234,
//     cells: 456,
//     edges: 1456,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-07-10',
//     sparklineData: [18, 42, 31, 37, 44, 61, 57, 63, 68, 82]
//   },
//   {
//     id: 'dyn-LI',
//     name: 'Dynamic LI',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 1123,
//     cells: 298,
//     edges: 1789,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-07-22',
//     sparklineData: [21, 27, 34, 40, 47, 54, 60, 66, 71, 75]
//   },
//   {
//     id: 'dyn-TF',
//     name: 'Dynamic TF',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 1302,
//     cells: 319,
//     edges: 1859,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-07-22',
//     sparklineData: [21, 27, 34, 40, 37, 54, 60, 56, 71, 75]
//   },
//   {
//     id: 'dyn-BF',
//     name: 'Dynamic BF',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 1500,
//     cells: 500,
//     edges: 2500,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-08-15',
//     sparklineData: [20, 35, 40, 45, 50, 55, 40, 65, 70, 85]
//   },
//   {
//     id: 'dyn-BFC',
//     name: 'Dynamic BFC',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 2000,
//     cells: 750,
//     edges: 3500,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-08-20',
//     sparklineData: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
//   },
//   {
//     id: 'dyn-CY',
//     name: 'Dynamic CY',
//     organism: 'Mouse',
//     type: 'synthetic',
//     genes: 2145,
//     cells: 645,
//     edges: 3012,
//     source: 'synthetic' as const,
//     lastUpdated: '2024-11-01',
//     sparklineData: [22, 40, 38, 45, 53, 60, 78, 74, 80, 76]

//   },
// ];

// const [datasets, setDatasets] = useState<any[]>([]);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   fetch("/api/datasets")
//     .then(res => res.json())
//     .then(data => {
//       setDatasets(data);
//       setLoading(false);
//     });
// }, []);

// if (loading) {
//   return <DatasetSkeleton />;
// }



export function Datasets() {
  //   const totalGenes = allDatasets.reduce((sum, d) => sum + d.genes, 0);
  // const totalCells = allDatasets.reduce((sum, d) => sum + d.cells, 0);
  // const totalEdges = allDatasets.reduce((sum, d) => sum + d.edges, 0);

  // // Placeholder — update when you have "runs"
  // const totalRuns = 0;

  
  // const navigate = useNavigate();
  // const [searchQuery, setSearchQuery] = useState('');
  // const [selectedOrganism, setSelectedOrganism] = useState('all');
  // const [selectedType, setSelectedType] = useState('all');
  // const [selectedSource, setSelectedSource] = useState('all');

  // const filteredDatasets = allDatasets.filter(dataset => {
  //   const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //                        dataset.organism.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesOrganism = selectedOrganism === 'all' || dataset.organism === selectedOrganism;
  //   const matchesType = selectedType === 'all' || dataset.type === selectedType;
  //   const matchesSource = selectedSource === 'all' || dataset.source === selectedSource;
    
  

  //   return matchesSearch && matchesOrganism && matchesType && matchesSource;
  // });

  const navigate = useNavigate();

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganism, setSelectedOrganism] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  // Aggregate stats
  const totalGenes = allDatasets.reduce((sum, d) => sum + d.genes, 0);
  const totalCells = allDatasets.reduce((sum, d) => sum + d.cells, 0);
  const totalEdges = allDatasets.reduce((sum, d) => sum + d.edges, 0);
  // const totalRuns = 0; // Placeholder for future runs
  const [totalRuns, setTotalRuns] = useState(0);

  useEffect(() => {
  const storedRuns = localStorage.getItem("totalRuns");
  const currentRuns = storedRuns ? parseInt(storedRuns, 10) : 0;

  const updatedRuns = currentRuns + 1;

  localStorage.setItem("totalRuns", updatedRuns.toString());
  setTotalRuns(updatedRuns);
}, []);


  const stats = [
    { label: 'Total Datasets', value: allDatasets.length },
    { label: 'Organisms', value: new Set(allDatasets.map(d => d.organism)).size },
    { label: 'Types', value: new Set(allDatasets.map(d => d.type)).size },
    { label: 'Sources', value: new Set(allDatasets.map(d => d.source)).size },
  ];

  // Filtering logic
  const filteredDatasets = allDatasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dataset.organism.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrganism = selectedOrganism === 'all' || dataset.organism === selectedOrganism;
    const matchesType = selectedType === 'all' || dataset.type === selectedType;
    const matchesSource = selectedSource === 'all' || dataset.source === selectedSource;
    return matchesSearch && matchesOrganism && matchesType && matchesSource;
  });

  // Download handler
  const handleDownload = (id: string) => {
    // Implement your actual download logic here
    alert(`Downloading dataset with ID: ${id}`);
  };

  return (
    <div id="datasets" className="min-h-screen py-20 pb-0">
      <div className="container px-4 mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Datasets</h1>
          <p className="text-muted-foreground">
            Browse and explore datasets for benchmarking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

  {/* Total Datasets */}
  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/10 flex items-center justify-center">
        <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
      <h4 className="text-gray-900 dark:text-gray-100 font-medium">Total Datasets</h4>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Number of datasets in the system</p>
    <AnimatedCounter title="" value={allDatasets.length} className="mt-2" />
  </div>

  {/* Organisms */}
  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/10 flex items-center justify-center">
        <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
      <h4 className="text-gray-900 dark:text-gray-100 font-medium">Organisms</h4>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Unique organisms represented</p>
    <AnimatedCounter
      title=""
      value={new Set(allDatasets.map(d => d.organism)).size}
      className="mt-2"
    />
  </div>

  {/* Types */}
  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/10 flex items-center justify-center">
        <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <h4 className="text-gray-900 dark:text-gray-100 font-medium">Types</h4>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Dataset categories available</p>
    <AnimatedCounter
      title=""
      value={new Set(allDatasets.map(d => d.type)).size}
      className="mt-2"
    />
  </div>

  {/* Sources */}
  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/10 flex items-center justify-center">
        <Boxes className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      </div>
      <h4 className="text-gray-900 dark:text-gray-100 font-medium">Sources</h4>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Distinct dataset sources</p>
    <AnimatedCounter
      title=""
      value={new Set(allDatasets.map(d => d.source)).size}
      className="mt-2"
    />
  </div>

</div>

{/* ---------- Second row: Genes, Cells, Edges, Runs ---------- */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

  {/* Total Genes */}
  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/10 flex items-center justify-center">
        <Dna className="w-4 h-4 text-red-600 dark:text-red-400" />
      </div>
      <h4 className="text-gray-900 dark:text-gray-100 font-medium">Total Genes</h4>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sum of all gene counts across datasets</p>
    <AnimatedCounter title="" value={totalGenes} className="mt-2" />
  </div>

  {/* Total Cells */}
  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/10 flex items-center justify-center">
        <Microscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
      <h4 className="text-gray-900 dark:text-gray-100 font-medium">Total Cells</h4>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sum of all cell counts across datasets</p>
    <AnimatedCounter title="" value={totalCells} className="mt-2" />
  </div>

  {/* Total Edges */}
  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/10 flex items-center justify-center">
        <GitFork className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      </div>
      <h4 className="text-gray-900 dark:text-gray-100 font-medium">Total Edges</h4>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total regulatory interactions across datasets</p>
    <AnimatedCounter title="" value={totalEdges} className="mt-2" />
  </div>

  {/* Total Runs */}
  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/10 flex items-center justify-center">
        <PlayCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
      <h4 className="text-gray-900 dark:text-gray-100 font-medium" id="search">Total Runs</h4>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">All algorithm executions stored in the system</p>
    <AnimatedCounter title="" value={totalRuns} className="mt-2" />
  </div>

</div>

        {/* Stats */}
        {/* <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 rounded-lg border bg-card">
              <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
            </div>
          ))}
        </div> */}

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
  {/* Search Input */}
  <div className="relative flex-1" id="search">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-gray-400" />
    <input
      type="text"
      placeholder="Search datasets..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-2 
                 bg-white dark:bg-gray-900 
                 border border-gray-300 dark:border-gray-700 
                 text-gray-900 dark:text-gray-100 
                 placeholder-gray-400 dark:placeholder-gray-500 
                 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
    />
  </div>

  {/* Filters */}
  <div className="flex flex-wrap gap-3">
    <select
      value={selectedOrganism}
      onChange={(e) => setSelectedOrganism(e.target.value)}
      className="px-3 py-2 
                 bg-white dark:bg-gray-900 
                 border border-gray-300 dark:border-gray-700 
                 text-gray-900 dark:text-gray-100 
                 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
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
      className="px-3 py-2 
                 bg-white dark:bg-gray-900 
                 border border-gray-300 dark:border-gray-700 
                 text-gray-900 dark:text-gray-100 
                 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
    >
      <option value="all">All Types</option>
      <option value="scRNA-seq">scRNA-seq</option>
      <option value="Bulk RNA-seq">Bulk RNA-seq</option>
      <option value="ChIP-seq">ChIP-seq</option>
    </select>

    <select
      value={selectedSource}
      onChange={(e) => setSelectedSource(e.target.value)}
      className="px-3 py-2 
                 bg-white dark:bg-gray-900 
                 border border-gray-300 dark:border-gray-700 
                 text-gray-900 dark:text-gray-100 
                 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
    >
      <option value="all">All Sources</option>
      <option value="curated">Curated</option>
      <option value="real">Real</option>
      <option value="synthetic">Synthetic</option>
    </select>
  </div>
</div>

        {/* Dataset Grid */}
        <div id="metadata" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDatasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              name={dataset.name}
              organism={dataset.organism}
              type={dataset.type}
              genes={dataset.genes}
              cells={dataset.cells}
              edges={dataset.edges}
              source={dataset.source}
              lastUpdated={dataset.lastUpdated}
              sparklineData={dataset.sparklineData}
              onClick={() => navigate(`/dataset/${dataset.id}`)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredDatasets.length === 0 && (
  <div className="text-center py-16">
    {/* Icon container */}
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-8 h-8 text-gray-400 dark:text-gray-300" />
    </div>

    {/* Heading */}
    <h3 className="text-gray-900 dark:text-gray-100 mb-2">No datasets found</h3>

    {/* Description */}
    <p className="text-gray-500 dark:text-gray-400 mb-6">
      Try adjusting your filters or search query
    </p>

    {/* Button */}
    <Button2
      variant="secondary"
      onClick={() => {
        setSearchQuery('');
        setSelectedOrganism('all');
        setSelectedType('all');
        setSelectedSource('all');
      }}
    >
      Clear Filters
    </Button2>
  </div>
)}


      </div>

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
