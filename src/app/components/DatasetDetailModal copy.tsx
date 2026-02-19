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
import { Dataset } from '../types';

interface DatasetDetailModalProps {
  dataset: Dataset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatasetDetailModal({ dataset, open, onOpenChange }: DatasetDetailModalProps) {
  if (!dataset) return null;

  const handleDownload = (format: 'json' | 'csv') => {
    console.log(`Downloading ${dataset.name} as ${format}`);
    // Mock download functionality
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {dataset.name}
            <Badge variant="secondary">{dataset.organism}</Badge>
          </DialogTitle>
          <DialogDescription>{dataset.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Metadata */}
          <div>
            <h4 className="mb-3 text-foreground">Metadata</h4>
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
              <div>
                <p className="text-xs text-muted mb-1">Dataset Type</p>
                <p className="text-foreground">{dataset.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Organism</p>
                <p className="text-foreground">{dataset.organism}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Number of Genes</p>
                <p className="text-foreground">{dataset.genes.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Number of Cells</p>
                <p className="text-foreground">{dataset.cells > 0 ? dataset.cells.toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Ground Truth Edges</p>
                <p className="text-foreground">{dataset.edges.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Last Updated</p>
                <p className="text-foreground">{new Date(dataset.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div>
            <h4 className="mb-3 text-foreground">Summary Statistics</h4>
            <div className="p-4 bg-secondary rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted">Network Density</span>
                <span className="text-foreground">
                  {((dataset.edges / (dataset.genes * dataset.genes)) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted">Avg. Degree</span>
                <span className="text-foreground">
                  {(dataset.edges * 2 / dataset.genes).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted">Data Points</span>
                <span className="text-foreground">
                  {dataset.cells > 0 ? (dataset.genes * dataset.cells).toLocaleString() : dataset.genes.toLocaleString()}
                </span>
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
              {['GENE1 → GENE2 (Activation)', 'GENE2 → GENE3 (Repression)', 'GENE3 → GENE4 (Unknown)'].map((edge, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 text-xs py-1">
                  <span className="text-foreground">{edge.split(' ')[0]}</span>
                  <span className="text-foreground">{edge.split(' ')[2]}</span>
                  <span className="text-foreground">{edge.split(' ')[3]}</span>
                </div>
              ))}
              <p className="text-xs text-muted mt-2">
                ... and {dataset.edges - 3} more edges
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
            <Button className="flex-1 gap-2 bg-secondary hover:bg-accent/90">
              <Download className="w-4 h-4" />
              Download Dataset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
