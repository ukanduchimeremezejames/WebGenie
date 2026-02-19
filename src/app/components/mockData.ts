import { Dataset, Algorithm, PerformanceMetrics, Job, NetworkData } from './types';

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateMockInferenceData(dataset: Dataset) {
  const algorithms = ["GENIE3", "GRNBoost2", "PIDC", "SCENIC"];

  const geneCount = Math.min(dataset.genes / 100, 40); // scale realistically
  const edgeCount = Math.min(dataset.edges / 100, 60);

  const genes = Array.from({ length: geneCount }, (_, i) => {
    return `GENE_${i + 1}`;
  });

  const edges: any[] = [];

  for (let i = 0; i < edgeCount; i++) {
    const source = genes[Math.floor(seededRandom(i + 1) * genes.length)];
    const target = genes[Math.floor(seededRandom(i + 2) * genes.length)];

    if (source === target) continue;

    const scores: Record<string, number> = {};

    algorithms.forEach((algo, idx) => {
      const base =
        algo === "GENIE3" && dataset.source === "curated"
          ? 0.85
          : algo === "GRNBoost2" && dataset.source === "real"
          ? 0.8
          : algo === "PIDC" && dataset.source === "synthetic"
          ? 0.82
          : 0.7;

      scores[algo] =
        base + (seededRandom(i * (idx + 3)) - 0.5) * 0.1;
    });

    edges.push({
      id: `${source}-${target}`,
      source,
      target,
      type: randomEdgeType(),
      // type: seededRandom(i + 5) > 0.2 ? "activation" : "repression",
      scores
    });
  }

  return {
    genes: genes.map(g => ({ id: g, label: g })),
    algorithms,
    edges
  };
}

// Types
export interface Node {
  id: string;
  label: string;
  degree?: number;
  neighbors?: string[];
  bestAlgo?: string;
  bestMean?: number;
}

export interface Edge {
  source: string;
  target: string;
  scores: Record<string, number>;
}

export interface Dataset {
  id: string;
  name: string;
  organism: string;
  type: string;
  genes: number;
  cells: number;
  edges: number;
  source: 'curated' | 'real' | 'synthetic';
  description: string;
  lastUpdated: string;
  sparklineData: number[];
  nodes: Node[];
  edgesData: Edge[];
}

// Helper to generate random numbers in a range
function randomInt1(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate mock edges with algorithm scores
function generateEdges1(nodes: Node[], algorithms: string[]) {
  const edgeTypes = ["activation", "repression", "unknown"] as const;

function randomEdgeType() {
  const rand = Math.random();

  if (rand < 0.45) return "activation";
  if (rand < 0.9) return "repression";
  return "unknown";
}

  const edges: Edge[] = [];
  const n = nodes.length;

  for (let i = 0; i < n; i++) {
    const numConnections = randomInt1(2, 4); // each node connects 2–4 others
    for (let j = 0; j < numConnections; j++) {
      const targetIdx = randomInt1(0, n - 1);
      if (targetIdx !== i) {
        const scores: Record<string, number> = {};
        algorithms.forEach(algo => {
          scores[algo] = parseFloat((Math.random() * 1).toFixed(3));
        });

        edges.push({
          source: nodes[i].id,
          target: nodes[targetIdx].id,
          scores,
        });
      }
    }
  }

  return edges;
}

// Generate realistic dataset
// function generateDataset(id: string, name: string, organism: string, type: string, genes: number) {
//   const algorithms = ['algo1', 'algo2', 'algo3'];
//   const nodes: Node[] = Array.from({ length: genes }, (_, i) => ({
//     id: `gene${i + 1}`,
//     label: `Gene ${i + 1}`,
//   }));

//   const edgesData = generateEdges1(nodes, algorithms);

//   // Compute degree and neighbors for each node
//   nodes.forEach(node => {
//     const neighbors = edgesData
//       .filter(e => e.source === node.id || e.target === node.id)
//       .map(e => (e.source === node.id ? e.target : e.source));
//     node.degree = neighbors.length;

//     // Compute best algorithm & mean score for this node
//     const algoScores: Record<string, number[]> = {};
//     edgesData
//       .filter(e => e.source === node.id || e.target === node.id)
//       .forEach(edge => {
//         Object.entries(edge.scores).forEach(([algo, score]) => {
//           if (!algoScores[algo]) algoScores[algo] = [];
//           algoScores[algo].push(score);
//         });
//       });

//     let bestAlgo = '';
//     let bestMean = 0;
//     Object.entries(algoScores).forEach(([algo, scores]) => {
//       const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
//       if (mean > bestMean) {
//         bestMean = mean;
//         bestAlgo = algo;
//       }
//     });

//     node.neighbors = neighbors;
//     node.bestAlgo = bestAlgo;
//     node.bestMean = bestMean;
//   });

//   return {
//     id,
//     name,
//     organism,
//     type,
//     genes,
//     cells: randomInt1(300, 800),
//     edges: edgesData.length,
//     source: 'curated' as const,
//     description: `${name} mock dataset`,
//     lastUpdated: new Date().toISOString().split('T')[0],
//     sparklineData: Array.from({ length: 10 }, () => randomInt1(20, 100)),
//     nodes,
//     edgesData,
//   } as Dataset;
// }

const geneNames = [
  'SOX2', 'OCT4', 'NANOG', 'SOX3', 'GATA3', 'KLF4', 'MYC', 'POU5F1',
  'TBX3', 'DPPA4', 'LIN28A', 'ZFP42', 'TFAP2C', 'NR5A2', 'ESRRB', 'TAL1',
  'RUNX1', 'HNF4A', 'FOXA2', 'PAX6', 'SOX1', 'SOX17', 'CDX2', 'EOMES', 'GATA6',
  'MEIS1', 'HAND1', 'HOXA1', 'HOXB1', 'HOXC6'
];

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function generateDataset(
  id: string,
  name: string,
  organism: string,
  type: string,
  genes: number
) {
  const algorithms = ['algo1', 'algo2', 'algo3'];

  // 🔥 Randomly select unique real gene names
  const shuffledGenes = shuffleArray(geneNames);

  const selectedGenes = shuffledGenes.slice(
    0,
    Math.min(genes, geneNames.length)
  );

  const nodes: Node[] = selectedGenes.map((gene) => ({
    id: gene,           // realistic ID
    label: gene,
    degree: 0,
    neighbors: [],
    bestAlgo: '',
    bestMean: 0
  }));

  // Generate edges using real IDs
  const edgesData = generateEdges1(nodes, algorithms);

  // -----------------------------
  // Compute degree + neighbors + bestAlgo
  // -----------------------------
  nodes.forEach(node => {

    const relatedEdges = edgesData.filter(
      e => e.source === node.id || e.target === node.id
    );

    const neighbors = relatedEdges.map(e =>
      e.source === node.id ? e.target : e.source
    );

    node.degree = neighbors.length;
    node.neighbors = neighbors;

    const algoScores: Record<string, number[]> = {};

    relatedEdges.forEach(edge => {
      Object.entries(edge.scores).forEach(([algo, score]) => {
        if (!algoScores[algo]) algoScores[algo] = [];
        algoScores[algo].push(score);
      });
    });

    let bestAlgo = '';
    let bestMean = 0;

    Object.entries(algoScores).forEach(([algo, scores]) => {
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (mean > bestMean) {
        bestMean = mean;
        bestAlgo = algo;
      }
    });

    node.bestAlgo = bestAlgo;
    node.bestMean = parseFloat(bestMean.toFixed(3));
  });

  return {
    id,
    name,
    organism,
    type,
    genes,
    cells: randomInt1(300, 800),
    edges: edgesData.length,
    source: 'curated' as const,
    description: `${name} mock dataset`,
    lastUpdated: new Date().toISOString().split('T')[0],
    sparklineData: Array.from({ length: 10 }, () => randomInt1(20, 100)),
    nodes,
    edgesData,
  } as Dataset;
}

export const mockAlgorithms: Algorithm[] = [
  {
    id: 'alg1',
    name: 'GENIE3',
    version: '1.0',
    description: 'Tree-based network inference using random forests',
    category: 'Tree-based',
    lastCommitMessage: 'Yiqi dockerfiles pull',
    lastCommitDate: '2 years ago'
  },
  {
    id: 'alg2',
    name: 'GRNBoost2',
    version: '1.0',
    description: 'Boolean network inference with GRNBoost2',
    category: 'Gradient Boosting',
    lastCommitMessage: 'Added BoolTraineR.',
    lastCommitDate: '7 years ago'
  },
  {
    id: 'alg3',
    name: 'Pearson',
    version: '1.0',
    description: 'Gene regulatory inference using correlation analysis',
    category: 'Correlation',
    lastCommitMessage: 'Add README markdown files for algorithms integration',
    lastCommitDate: '3 years ago'
  },
  {
    id: 'alg4',
    name: 'ARACNE',
    version: '1.0',
    description: 'Variational Information Theory for network inference',
    category: 'Information Theory',
    lastCommitMessage: 'Add README markdown files for algorithms integration',
    lastCommitDate: '3 years ago'
  },
  {
    id: 'alg5',
    name: 'SINGE',
    version: '1.0',
    description: 'Tree-based network inference',
    category: 'Tree-based',
    lastCommitMessage: 'tried to run the time command',
    lastCommitDate: '7 years ago'
  },
  {
    id: 'alg6',
    name: 'GRNVBEM',
    version: '1.2',
    description: 'Probabilistic based expression association for pseudotime',
    category: 'Probabilistic',
    lastCommitMessage: 'Add README markdown files for algorithms integration',
    lastCommitDate: '3 years ago'
  },
  {
    id: 'alg7',
    name: 'GRISLI',
    version: '2.1',
    description: 'Dynamical Systems Information Decomposition and Context',
    category: 'Dynamical Systems',
    lastCommitMessage: 'Yiqi dockerfiles pull',
    lastCommitDate: '2 years ago'
  },
  {
    id: 'alg8',
    name: 'SCODE',
    version: '1.0',
    description: 'Pseudo-time network inference',
    category: 'Time Series',
    lastCommitMessage: 'Added time module to each of the dockers.',
    lastCommitDate: '7 years ago'
  },
  {
    id: 'alg9',
    name: 'SCNS',
    version: '1.0',
    description: 'Partial correlation based network inference',
    category: 'Linear Models',
    lastCommitMessage: 'Add README markdown files for algorithms integration',
    lastCommitDate: '3 years ago'
  },
  {
    id: 'alg10',
    name: 'LEAP',
    version: '1.0',
    description: 'Regression network inference with time series',
    category: 'Regression',
    lastCommitMessage: 'Set user to avoid permission issues',
    lastCommitDate: '5 years ago'
  },
  {
    id: 'alg11',
    name: 'Spearman',
    version: '1.0',
    description: 'Correlation based network inference',
    category: 'Correlation',
    lastCommitMessage: 'scns dockerfile fix',
    lastCommitDate: '2 years ago'
  },
  {
    id: 'alg12',
    name: 'Arboreto',
    version: '1.0',
    description: 'Network inference from single-cell expression data',
    category: 'Tree-based',
    lastCommitMessage: 'Add README markdown files for algorithms integration',
    lastCommitDate: '3 years ago'
  }
];

// Example: generate all mock datasets
export const mockDatasets: Dataset[] = [
  generateDataset('hESC', 'hESC', 'Human', 'scRNA-seq', 25),
  generateDataset('mDC', 'mDC', 'Mouse', 'scRNA-seq', 22),
  generateDataset('mESC', 'mESC', 'Mouse', 'scRNA-seq', 28),
  generateDataset('hHep', 'hHep', 'Human', 'scRNA-seq', 24),
  generateDataset('VSC', 'VSC', 'Mouse', 'scRNA-seq', 26),
  generateDataset('hHSPC', 'hHSPC', 'Human', 'scRNA-seq', 30),
  generateDataset('mHSC-E', 'mHSC-E', 'Mouse', 'scRNA-seq', 27),
  generateDataset('mHSC-L', 'mHSC-L', 'Mouse', 'scRNA-seq', 23),
  generateDataset('Synthetic-1', 'Synthetic-1', 'Synthetic', 'scRNA-seq', 25),
  generateDataset('Synthetic-2', 'Synthetic-2', 'Synthetic', 'scRNA-seq', 24),
  generateDataset('yeast-1', 'Yeast Network 1', 'Yeast', 'Bulk RNA-seq', 22),
  generateDataset('yeast-2', 'Yeast Network 2', 'Yeast', 'Bulk RNA-seq', 21),
];


// mockData.ts
// export const mockAlgorithms = ['GENIE3', 'CLR', 'ARACNE', 'MRNET'];

const geneLabels = [
  'SOX2','OCT4','NANOG','KLF4','MYC','SOX3','POU5F1','GATA3',
  'TBX3','ESRRB','DPPA4','ZFP42','UTF1','SALL4','DNMT3B',
  'PRDM14','LEFTY1','NODAL','FGF4','LIN28A','T','EOMES','CER1','GSC','NANOS3','TFAP2C','SOX17','GATA6','PDGFRA','FOXA2'
];

// Create nodes
export const mockNetworkData = {
  nodes: geneLabels.map((gene, idx) => ({
    id: `gene${idx + 1}`,
    label: gene,
    score: parseFloat((Math.random() * 1).toFixed(3))
  })),
};

// Create edges
export const mockInferenceData = {
  algorithms: mockAlgorithms,
  edges: [] as any[],
};

// Randomly connect nodes
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate edges
mockNetworkData.nodes.forEach(sourceNode => {
  // Each node has 2–5 outgoing edges
  const numEdges = getRandomInt(2, 5);

  for (let i = 0; i < numEdges; i++) {
    const targetNode = mockNetworkData.nodes[getRandomInt(0, mockNetworkData.nodes.length - 1)];
    if (targetNode.id === sourceNode.id) continue; // no self-loop
    // Avoid duplicate edges
    if (mockInferenceData.edges.some(e => e.source === sourceNode.id && e.target === targetNode.id)) continue;

    const edgeType = Math.random() < 0.5 ? 'activation' : 'repression';

    // Generate random scores per algorithm
    const scores: Record<string, number> = {};
    mockAlgorithms.forEach(algo => {
      scores[algo] = parseFloat((Math.random()).toFixed(2));
    });

    mockInferenceData.edges.push({
      id: `edge-${mockInferenceData.edges.length + 1}`,
      source: sourceNode.id,
      target: targetNode.id,
      type: edgeType,
      scores,
    });
  }
});

// For debugging: print number of nodes and edges
console.log(`Generated ${mockNetworkData.nodes.length} nodes and ${mockInferenceData.edges.length} edges`);


// mockData.ts
export type EdgeType = 'activation' | 'repression';

export interface Node {
  id: string;
  label: string;
  degree?: number;
  neighbors?: string[];
  bestAlgo?: string;
  bestMean?: number;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  scores: Record<string, number>;
}

export interface Dataset {
  nodes: Node[];
  edges: Edge[];
  algorithms: string[];
}

// Realistic gene names for demo
// const geneNames = [
//   'SOX2', 'OCT4', 'NANOG', 'SOX3', 'GATA3', 'KLF4', 'MYC', 'POU5F1',
//   'TBX3', 'DPPA4', 'LIN28A', 'ZFP42', 'TFAP2C', 'NR5A2', 'ESRRB', 'TAL1',
//   'RUNX1', 'HNF4A', 'FOXA2', 'PAX6', 'SOX1', 'SOX17', 'CDX2', 'EOMES', 'GATA6',
//   'MEIS1', 'HAND1', 'HOXA1', 'HOXB1', 'HOXC6'
// ];

// Algorithms
const algorithms = ['GENIE3', 'SCENIC', 'PIDC', 'GRNBoost2'];

// Random int helper
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate edges with type and algorithm scores
function generateEdges(nodes: Node[], numEdges: number): Edge[] {
  const edges: Edge[] = [];
  const n = nodes.length;

  for (let i = 0; i < numEdges; i++) {
    const sourceIdx = randomInt(0, n - 1);
    let targetIdx = randomInt(0, n - 1);
    while (targetIdx === sourceIdx) targetIdx = randomInt(0, n - 1);

    const type: EdgeType = Math.random() < 0.5 ? 'activation' : 'repression';

    const scores: Record<string, number> = {};
    algorithms.forEach(algo => {
      scores[algo] = parseFloat((Math.random()).toFixed(3));
    });

    edges.push({
      id: `edge-${i}`,
      source: nodes[sourceIdx].id,
      target: nodes[targetIdx].id,
      type,
      scores,
    });
  }

  return edges;
}

const datasetGenePools: Record<string, string[]> = {
  hESC: [
    'SOX2','OCT4','NANOG','KLF4','MYC','POU5F1','ESRRB','ZFP42',
    'DPPA4','UTF1','PRDM14','LEFTY1','NODAL','FGF4','LIN28A'
  ],
  mESC: [
    'Sox2','Pou5f1','Nanog','Esrrb','Zfp42','Dppa4','Klf4',
    'Tbx3','Gata6','Sall4','Dnmt3b','Lefty2','Eomes'
  ],
  yeast: [
    'GAL4','GAL80','MIG1','HAP4','SWI4','MBP1','STE12',
    'GCN4','YAP1','RPN4','SOK2','ACE2'
  ],
  synthetic: [
    'TF1','TF2','TF3','TF4','TF5','GeneA','GeneB','GeneC','GeneD'
  ]
};

function getGenePool(datasetId: string): string[] {
  if (datasetId.startsWith('yeast')) return datasetGenePools.yeast;
  if (datasetId.startsWith('Synthetic')) return datasetGenePools.synthetic;
  if (datasetId === 'mESC') return datasetGenePools.mESC;
  return datasetGenePools.hESC; // default human stem-like
}



// Generate realistic nodes and compute degree, neighbors, best algorithm
// function generateNodes(numNodes: number, edges: Edge[]): Node[] {
//   const nodes: Node[] = geneNames.slice(0, numNodes).map((name, i) => ({
//     id: `gene-${i + 1}`,
//     label: name
//   }));

//   // compute neighbors and degree
//   nodes.forEach(node => {
//     const neighbors = edges
//       .filter(e => e.source === node.id || e.target === node.id)
//       .map(e => (e.source === node.id ? e.target : e.source));

//     node.neighbors = neighbors;
//     node.degree = neighbors.length;

//     // compute best algorithm
//     const algoScores: Record<string, number[]> = {};
//     edges
//       .filter(e => e.source === node.id || e.target === node.id)
//       .forEach(edge => {
//         Object.entries(edge.scores).forEach(([algo, score]) => {
//           if (!algoScores[algo]) algoScores[algo] = [];
//           algoScores[algo].push(score);
//         });
//       });

//     let bestAlgo = '';
//     let bestMean = 0;
//     Object.entries(algoScores).forEach(([algo, scores]) => {
//       const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
//       if (mean > bestMean) {
//         bestMean = mean;
//         bestAlgo = algo;
//       }
//     });

//     node.bestAlgo = bestAlgo;
//     node.bestMean = bestMean;
//   });

//   return nodes;
// }

function generateNodes(
  dataset: Dataset,
  edges: Edge[]
): Node[] {

  const pool = getGenePool(dataset.id);

  const nodeCount = Math.min(
    Math.floor(dataset.genes / 100),
    pool.length
  );

  const selectedGenes = pool.slice(0, nodeCount);

  const nodes: Node[] = selectedGenes.map(gene => ({
    id: gene,          // 🔥 REALISTIC ID
    label: gene,
    degree: 0,
    neighbors: [],
    bestAlgo: '',
    bestMean: 0
  }));

  // -----------------------
  // Compute neighbors + degree
  // -----------------------
  nodes.forEach(node => {

    const relatedEdges = edges.filter(
      e => e.source === node.id || e.target === node.id
    );

    const neighbors = relatedEdges.map(e =>
      e.source === node.id ? e.target : e.source
    );

    node.neighbors = neighbors;
    node.degree = neighbors.length;

    // -----------------------
    // Compute best algorithm
    // -----------------------
    const algoScores: Record<string, number[]> = {};

    relatedEdges.forEach(edge => {
      Object.entries(edge.scores).forEach(([algo, score]) => {
        if (!algoScores[algo]) algoScores[algo] = [];
        algoScores[algo].push(score);
      });
    });

    let bestAlgo = '';
    let bestMean = 0;

    Object.entries(algoScores).forEach(([algo, scores]) => {
      const mean =
        scores.reduce((a, b) => a + b, 0) / scores.length;

      if (mean > bestMean) {
        bestMean = mean;
        bestAlgo = algo;
      }
    });

    node.bestAlgo = bestAlgo;
    node.bestMean = parseFloat(bestMean.toFixed(3));
  });

  return nodes;
}


export const mockPerformanceMetrics: PerformanceMetrics[] = [
  {
    algorithmId: 'alg1',
    algorithmName: 'GENIE3',
    precision: 0.71,
    recall: 0.69,
    f1Score: 0.70,
    auroc: 0.82,
    auprc: 0.75,
    earlyPrecision: 0.68,
    runtime: 132.4,
    memoryUsage: 2200
  },
  {
    algorithmId: 'alg2',
    algorithmName: 'GRNBoost2',
    precision: 0.63,
    recall: 0.60,
    f1Score: 0.61,
    auroc: 0.74,
    auprc: 0.66,
    earlyPrecision: 0.57,
    runtime: 245.1,
    memoryUsage: 2700
  },
  {
    algorithmId: 'alg3',
    algorithmName: 'Pearson',
    precision: 0.68,
    recall: 0.71,
    f1Score: 0.69,
    auroc: 0.80,
    auprc: 0.72,
    earlyPrecision: 0.66,
    runtime: 154.8,
    memoryUsage: 2400
  },
  {
    algorithmId: 'alg4',
    algorithmName: 'Spearman',
    precision: 0.66,
    recall: 0.67,
    f1Score: 0.66,
    auroc: 0.76,
    auprc: 0.69,
    earlyPrecision: 0.61,
    runtime: 178.3,
    memoryUsage: 2816
  },
  {
    algorithmId: 'alg5',
    algorithmName: 'ARACNE',
    precision: 0.62,
    recall: 0.58,
    f1Score: 0.60,
    auroc: 0.72,
    auprc: 0.64,
    earlyPrecision: 0.55,
    runtime: 268.9,
    memoryUsage: 3000
  },
  {
    algorithmId: 'alg6',
    algorithmName: 'SINGE',
    precision: 0.69,
    recall: 0.73,
    f1Score: 0.71,
    auroc: 0.81,
    auprc: 0.74,
    earlyPrecision: 0.67,
    runtime: 143.2,
    memoryUsage: 2304
  },
  {
    algorithmId: 'alg7',
    algorithmName: 'GRNVBEM',
    precision: 0.71,
    recall: 0.68,
    f1Score: 0.69,
    auroc: 0.80,
    auprc: 0.73,
    earlyPrecision: 0.70,
    runtime: 98.2,
    memoryUsage: 1536
  },
  {
    algorithmId: 'alg8',
    algorithmName: 'GRISLI',
    precision: 0.64,
    recall: 0.63,
    f1Score: 0.63,
    auroc: 0.75,
    auprc: 0.67,
    earlyPrecision: 0.59,
    runtime: 221.5,
    memoryUsage: 2600
  },
  {
    algorithmId: 'alg9',
    algorithmName: 'SCODE',
    precision: 0.62,
    recall: 0.65,
    f1Score: 0.63,
    auroc: 0.74,
    auprc: 0.68,
    earlyPrecision: 0.58,
    runtime: 156.8,
    memoryUsage: 2560
  },
  {
    algorithmId: 'alg10',
    algorithmName: 'SCNS',
    precision: 0.67,
    recall: 0.64,
    f1Score: 0.65,
    auroc: 0.77,
    auprc: 0.70,
    earlyPrecision: 0.62,
    runtime: 285.4,
    memoryUsage: 3100
  },
  {
    algorithmId: 'alg11',
    algorithmName: 'LEAP',
    precision: 0.58,
    recall: 0.62,
    f1Score: 0.60,
    auroc: 0.71,
    auprc: 0.65,
    earlyPrecision: 0.54,
    runtime: 195.7,
    memoryUsage: 2400
  },
  {
    algorithmId: 'alg12',
    algorithmName: 'Arboreto',
    precision: 0.65,
    recall: 0.68,
    f1Score: 0.66,
    auroc: 0.76,
    auprc: 0.70,
    earlyPrecision: 0.61,
    runtime: 168.3,
    memoryUsage: 2450
  }
];

export const mockJobs: Job[] = [
  {
    id: 'job1',
    datasetId: 'ds1',
    datasetName: 'hESC',
    algorithmId: 'alg3',
    algorithmName: 'GRNBoost2',
    status: 'completed',
    progress: 100,
    startTime: '2026-02-04T10:30:00',
    endTime: '2026-02-05T10:31:27'
  },
  {
    id: 'job2',
    datasetId: 'ds2',
    datasetName: 'mDC',
    algorithmId: 'alg1',
    algorithmName: 'GENIE3',
    status: 'running',
    progress: 67,
    startTime: '2026-02-02T11:15:00'
  },
  {
    id: 'job3',
    datasetId: 'ds3',
    datasetName: 'HSC',
    algorithmId: 'alg7',
    algorithmName: 'SCENIC',
    status: 'pending',
    progress: 0,
    startTime: '2026-01-30T11:30:00'
  },
  {
    id: 'job4',
    datasetId: 'ds4',
    datasetName: 'DREAM',
    algorithmId: 'alg2',
    algorithmName: 'PIDC',
    status: 'failed',
    progress: 45,
    startTime: '2026-02-01T09:45:00',
    endTime: '2026-02-05T09:50:12',
    error: 'Memory allocation failed: insufficient resources'
  }
];

export function getAUPRCDistributionData() {
  return mockPerformanceMetrics.map(m => ({
    name: m.algorithmName,
    auprc: m.auprc,
    auroc: m.auroc,
    f1Score: m.f1Score
  }));
}

export function getPRCurveData(algorithmId: string) {
  // Generate mock Precision-Recall curve data
  const points = [];
  for (let recall = 0; recall <= 1; recall += 0.1) {
    const precision = 0.8 - recall * 0.3 + Math.random() * 0.1;
    points.push({ recall: recall, precision: Math.max(0, Math.min(1, precision)) });
  }
  return points;
}

export function getROCCurveData(algorithmId: string) {
  // Generate mock ROC curve data
  const points = [];
  for (let fpr = 0; fpr <= 1; fpr += 0.1) {
    const tpr = fpr + 0.2 + Math.random() * 0.1;
    points.push({ fpr: fpr, tpr: Math.min(1, tpr) });
  }
  return points;
}


export const mockDatasets2: Dataset[] = [
  {
    id: 'hESC',
    name: 'hESC',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 1000,
    cells: 758,
    edges: 3200,
    source: 'curated' as const,
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
    lastUpdated: '2024-11-15',
    sparklineData: [34, 45, 52, 48, 61, 73, 68, 82, 91, 78]
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
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
    lastUpdated: '2024-10-28',
    sparklineData: [28, 31, 39, 42, 38, 51, 58, 64, 59, 71]
  },
  {
    id: 'mESC',
    name: 'mESC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1100,
    cells: 536,
    edges: 3400,
    source: 'curated' as const,
    lastUpdated: '2024-11-08',
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
    sparklineData: [22, 35, 41, 48, 44, 59, 62, 71, 68, 75]
  },
  {
    id: 'hHep',
    name: 'hHep',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 950,
    cells: 642,
    edges: 2800,
    source: 'synthetic' as const,
    lastUpdated: '2024-09-22',
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
    sparklineData: [31, 38, 42, 49, 55, 62, 58, 69, 77, 82]
  },
  {
    id: 'VSC',
    name: 'VSC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 8,
    cells: 115,
    edges: 15,
    source: 'curated' as const,
    lastUpdated: '2024-10-12',
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
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
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
    sparklineData: [42, 51, 58, 62, 69, 75, 81, 88, 92, 89]
  },
  {
    id: 'mHSC-E',
    name: 'mHSC-E',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1050,
    cells: 645,
    edges: 3100,
    source: 'curated' as const,
    lastUpdated: '2024-11-01',
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
    sparklineData: [25, 33, 39, 46, 53, 61, 68, 74, 79, 85]
  },
  {
    id: 'mHSC-L',
    name: 'mHSC-L',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 980,
    cells: 712,
    edges: 2950,
    source: 'curated' as const,
    lastUpdated: '2024-10-29',
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
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
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
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
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
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
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
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
    description: 'Human embryonic stem cells single-cell RNA-seq dataset',
    sparklineData: [21, 27, 34, 40, 47, 54, 60, 66, 71, 75]
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
    description: 'Dynamic LI single-cell RNA-seq dataset',
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
    description: 'Dynamic TF single-cell RNA-seq dataset',
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
    description: 'Dynamic BF single-cell RNA-seq dataset',
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
    description: 'Dynamic BFC single-cell RNA-seq dataset',
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
    description: 'Dynamic CY cells single-cell RNA-seq dataset',
    sparklineData: [37, 41, 39, 40, 31, 43, 40, 41, 40, 41]
  }
];

