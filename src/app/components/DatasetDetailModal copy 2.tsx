import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Download, FileJson, FileText } from 'lucide-react';

interface Dataset {
  id: string;
  name: string;
  type: string;
  organism: string;
  genes: number;
  cells: number;
  edges: number;
  lastUpdated: string;
  groundTruth: { source: string; target: string; type: string }[];
}

interface DatasetDetailModalProps {
  dataset: Dataset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatasetDetailModal({ dataset, open, onOpenChange }: DatasetDetailModalProps) {
  // If no dataset is provided, we can use a static default
  const defaultDataset: Dataset = {
    id: 'ds1',
    name: 'Example Dataset',
    type: 'scRNA-seq',
    organism: 'Human',
    genes: 1985,
    cells: 642,
    edges: 3567,
    lastUpdated: '2024-09-22',
    groundTruth: [
      { source: 'GENE1', target: 'GENE2', type: 'Activation' },
      { source: 'GENE2', target: 'GENE3', type: 'Repression' },
      { source: 'GENE3', target: 'GENE4', type: 'Unknown' },
    ],
  };

  const finalDataset = dataset || defaultDataset;

  // Helper to download file
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (format: 'json' | 'csv') => {
    if (format === 'json') {
      downloadFile(JSON.stringify(finalDataset, null, 2), `${finalDataset.name}.json`, 'application/json');
    }

    if (format === 'csv') {
      // CSV with all fields including groundTruth
      const headers = ['Source', 'Target', 'Type'];
      const rows = finalDataset.groundTruth.map(gt => [gt.source, gt.target, gt.type]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      downloadFile(csvContent, `${finalDataset.name}.csv`, 'text/csv');
    }
  };

  const handleHuggingFaceDownload = () => {
    window.open('https://huggingface.co/cskokgibbs/datasets', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {finalDataset.name}
            <Badge variant="secondary">{finalDataset.organism}</Badge>
          </DialogTitle>
          <DialogDescription>
            This is a preview of the dataset including metadata, summary statistics, and ground truth edges.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Metadata */}
          <div>
            <h4 className="mb-3 text-foreground">Metadata</h4>
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
              <div>
                <p className="text-xs text-muted mb-1">Dataset Type</p>
                <p className="text-foreground">{finalDataset.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Organism</p>
                <p className="text-foreground">{finalDataset.organism}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Number of Genes</p>
                <p className="text-foreground">{finalDataset.genes.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Number of Cells</p>
                <p className="text-foreground">{finalDataset.cells.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Ground Truth Edges</p>
                <p className="text-foreground">{finalDataset.edges.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Last Updated</p>
                <p className="text-foreground">{new Date(finalDataset.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div>
            <h4 className="mb-3 text-foreground">Summary Statistics</h4>
            <div className="p-4 bg-secondary rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted">Network Density</span>
                <span className="text-foreground">{((finalDataset.edges / (finalDataset.genes * finalDataset.genes)) * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted">Avg. Degree</span>
                <span className="text-foreground">{(finalDataset.edges * 2 / finalDataset.genes).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted">Data Points</span>
                <span className="text-foreground">{(finalDataset.genes * finalDataset.cells).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Ground Truth Preview */}
          <div>
            <h4 className="mb-3 text-foreground">Ground Truth Preview</h4>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="grid grid-cols-3 gap-2 text-xs mb-2 pb-2 border-b border-border">
                <span className="text-muted">Source</span>
                <span className="text-muted">Target</span>
                <span className="text-muted">Type</span>
              </div>
              {finalDataset.groundTruth.map((gt, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 text-xs py-1">
                  <span className="text-foreground">{gt.source}</span>
                  <span className="text-foreground">{gt.target}</span>
                  <span className="text-foreground">({gt.type})</span>
                </div>
              ))}
              <p className="text-xs text-muted mt-2">
                ... and {finalDataset.edges - finalDataset.groundTruth.length} more edges
              </p>
            </div>
          </div>

          {/* Download Options */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => handleDownload('json')}
            >
              <FileJson className="w-4 h-4" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => handleDownload('csv')}
            >
              <FileText className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              className="flex-1 gap-2 bg-secondary hover:bg-accent/90"
              onClick={handleHuggingFaceDownload}
            >
              <Download className="w-4 h-4" />
              Download Dataset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
