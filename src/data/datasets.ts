export interface DatasetMeta {
  id: string;
  name: string;
  organism: string;
  type: string;
  genes: number;
  cells: number;
  edges: number;
  source: "curated" | "real" | "synthetic";
  lastUpdated: string;
  sparklineData: number[];
  description?: string;
  nodesFile?: string;
  edgesFile?: string;
}

export const datasets: DatasetMeta[] = [ ... ];
