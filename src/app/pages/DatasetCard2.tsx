import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Database, Eye, Download } from 'lucide-react';
import { Dataset } from '../types';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface DatasetCardProps {
  dataset: Dataset;
  onViewDetails: (dataset: Dataset) => void;
  onDownload: (dataset: Dataset) => void;
}

export function DatasetCard({ dataset, onViewDetails, onDownload }: DatasetCardProps) {
  // Generate sparkline data
  const sparklineData = Array.from({ length: 10 }, (_, i) => ({
    value: Math.random() * 100 + 50
  }));

  const getOrganimBadgeColor = (organism: string) => {
    const colors: Record<string, string> = {
      'Human': 'bg-blue-100 text-blue-800',
      'Mouse': 'bg-green-100 text-green-800',
      'Yeast': 'bg-yellow-100 text-yellow-800',
      'Synthetic': 'bg-purple-100 text-purple-800',
      'E. coli': 'bg-red-100 text-red-800'
    };
    return colors[organism] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-300 hover:border-primary/50">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground">{dataset.name}</h3>
              <p className="text-xs text-muted-foreground">{dataset.type}</p>
            </div>
          </div>
          <Badge className={getOrganimBadgeColor(dataset.organism)}>
            {dataset.organism}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-3 border-y border-border">
          <div>
            <p className="text-xs text-muted-foreground">Genes</p>
            <p className="text-foreground">{dataset.genes.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cells</p>
            <p className="text-foreground">{dataset.cells > 0 ? dataset.cells.toLocaleString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Edges</p>
            <p className="text-foreground">{dataset.edges.toLocaleString()}</p>
          </div>
        </div>

        {/* Sparkline */}
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#5B2C6F"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Updated {new Date(dataset.lastUpdated).toLocaleDateString()}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(dataset)}
              className="gap-1 hover:bg-secondary hover:text-white"
            >
              <Eye className="w-3 h-3" />
              View
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onDownload(dataset)}
              className="gap-1 bg-secondary hover:bg-primary"
            >
              <Download className="w-3 h-3" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
