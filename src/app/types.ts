// Type definitions for BEELINE GRN Benchmarking Platform

export type DatasetType = 'scRNA-seq' | 'bulk RNA-seq' | 'synthetic' | 'time-series';
export type Organism = 'Human' | 'Mouse' | 'Yeast' | 'E. coli' | 'Synthetic';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

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

export interface Algorithm {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
}

export interface PerformanceMetrics {
  algorithmId: string;
  algorithmName: string;
  precision: number;
  recall: number;
  f1Score: number;
  auroc: number;
  auprc: number;
  earlyPrecision: number;
  runtime: number; // seconds
  memoryUsage: number; // MB
}

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

export interface NetworkNode {
  id: string;
  label: string;
  score?: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
  type: 'activation' | 'repression' | 'unknown';
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}
