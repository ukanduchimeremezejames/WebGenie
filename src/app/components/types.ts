// ============================================================
// BEELINE GRN Benchmarking Platform - Core Type Definitions
// ============================================================

/* ------------------------------------------------------------
   Core Enums
------------------------------------------------------------ */

export type DatasetType =
  | 'scRNA-seq'
  | 'bulk RNA-seq'
  | 'synthetic'
  | 'time-series';

export type Organism =
  | 'Human'
  | 'Mouse'
  | 'Yeast'
  | 'E. coli'
  | 'Synthetic';

export type JobStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed';

/* ------------------------------------------------------------
   Shared Biological Edge Type
------------------------------------------------------------ */

export type EdgeType =
  | 'activation'
  | 'repression'
  | 'unknown';

/* ------------------------------------------------------------
   Dataset Models
------------------------------------------------------------ */

export interface Dataset {
  id: string;
  name: string;
  organism: Organism;
  type: DatasetType;
  genes: number;
  cells: number;
  edges: number;
  lastUpdated: string;
  description: string;
}

/* ------------------------------------------------------------
   Algorithm Models
------------------------------------------------------------ */

export interface Algorithm {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
}

/* ------------------------------------------------------------
   Performance Metrics
------------------------------------------------------------ */

export interface PerformanceMetrics {
  algorithmId: string;
  algorithmName: string;
  precision: number;
  recall: number;
  f1Score: number;
  auroc: number;
  auprc: number;
  earlyPrecision: number;
  runtime: number;       // seconds
  memoryUsage: number;   // MB
}

/* ------------------------------------------------------------
   Job Tracking
------------------------------------------------------------ */

export interface Job {
  id: string;
  datasetId: string;
  datasetName: string;
  algorithmId: string;
  algorithmName: string;
  status: JobStatus;
  progress: number;
  startTime: string;
  endTime?: string;
  error?: string;
}

/* ------------------------------------------------------------
   Network Models (Visualization Layer)
------------------------------------------------------------ */

export interface NetworkNode {
  id: string;        // must match edge endpoints
  label: string;
  score?: number;    // importance / centrality
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight: number;    // confidence score
  type: EdgeType;
}

/* ------------------------------------------------------------
   Inference Models (Raw Algorithm Output)
------------------------------------------------------------ */

export interface InferenceEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  scores: Record<string, number>;  // algorithm → score
}

export interface InferenceData {
  genes: { id: string; label: string }[];
  algorithms: string[];
  edges: InferenceEdge[];
}

/* ------------------------------------------------------------
   Complete Network Container
------------------------------------------------------------ */

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}
