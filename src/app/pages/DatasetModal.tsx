import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './../components/ui/dialog';
import { Badge } from './../components/ui/badge';
import { Button } from './../components/ui/button';
import { Download, FileJson, FileText } from 'lucide-react';
import { Dataset } from '../types';

interface DatasetDetailModalProps {
  dataset: Dataset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const handleDownloadHug = () => {

    // open link in a new tab
    window.open("https://zenodo.org/records/3701939", "_blank");
  };


export function DatasetDetailModal({
  dataset,
  open,
  onOpenChange,
}: DatasetDetailModalProps) {
  if (!dataset) return null;

  const handleDownload = (format: 'json' | 'csv') => {
    console.log(`Downloading ${dataset.name} as ${format}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {dataset.name}
            <Badge variant="secondary">{dataset.organism}</Badge>
          </DialogTitle>

          <DialogDescription className="text-muted-foreground">
            {dataset.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* METADATA */}
          <div>
            <h4 className="mb-3 text-foreground">Metadata</h4>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary border border-border">
              {[
                ['Dataset Type', dataset.type],
                ['Organism', dataset.organism],
                ['Number of Genes', dataset.genes.toLocaleString()],
                [
                  'Number of Cells',
                  dataset.cells > 0 ? dataset.cells.toLocaleString() : 'N/A',
                ],
                ['Ground Truth Edges', dataset.edges.toLocaleString()],
                [
                  'Last Updated',
                  new Date(dataset.lastUpdated).toLocaleDateString(),
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY STATISTICS */}
          <div>
            <h4 className="mb-3 text-foreground">Summary Statistics</h4>

            <div className="p-4 rounded-lg bg-secondary border border-border space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Network Density
                </span>
                <span className="text-foreground">
                  {(
                    (dataset.edges / (dataset.genes * dataset.genes)) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Avg. Degree
                </span>
                <span className="text-foreground">
                  {(dataset.edges * 2 / dataset.genes).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Data Points
                </span>
                <span className="text-foreground">
                  {dataset.cells > 0
                    ? (dataset.genes * dataset.cells).toLocaleString()
                    : dataset.genes.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* GROUND TRUTH PREVIEW */}
          <div>
            <h4 className="mb-3 text-foreground">Ground Truth Preview</h4>

            <div className="p-4 rounded-lg bg-secondary border border-border">
              {/* Header */}
              <div className="grid grid-cols-3 gap-2 text-xs mb-2 pb-2 border-b border-border">
                <span className="text-muted-foreground">Source</span>
                <span className="text-muted-foreground">Target</span>
                <span className="text-muted-foreground">Type</span>
              </div>

              {/* Mock Data */}
              {[
                'GENE1 → GENE2 (Activation)',
                'GENE2 → GENE3 (Repression)',
                // 'GENE3 → GENE4 (Unknown)',
              ].map((edge, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-2 text-xs py-1 border-b last:border-none border-border/40"
                >
                  <span className="text-foreground">{edge.split(' ')[0]}</span>
                  <span className="text-foreground">{edge.split(' ')[2]}</span>
                  {/* <span className="text-foreground">{edge.split(' ')[3]}</span> */}
                </div>
              ))}

              <p className="text-xs text-muted-foreground mt-2">
                ... and {dataset.edges - 3} more edges
              </p>
            </div>
          </div>

          {/* DOWNLOAD OPTIONS */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="flex-1 gap-2 border-border"
              onClick={() => handleDownload('json')}
            >
              <FileJson className="w-4 h-4" />
              Export JSON
            </Button>

            <Button
              variant="outline"
              className="flex-1 gap-2 border-border"
              onClick={() => handleDownload('csv')}
            >
              <FileText className="w-4 h-4" />
              Export CSV
            </Button>

            <Button className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"

            >
              <Download className="w-4 h-4" />
              <a href='https://zenodo.org/records/3701939'>Download Dataset</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
