import { Badge2 } from './Badge';
import { Button2 } from './Button';
import { Activity, Download } from 'lucide-react';
import { ActivityPreview } from './ActivityPreview';
interface DatasetCardProps {
  name: string;
  organism: string;
  type: string;
  genes: number;
  cells: number;
  edges: number;
  source?: 'synthetic' | 'real' | 'curated';
  lastUpdated?: string;
  sparklineData?: number[];
  onClick?: () => void;
  dataset: Dataset;
  onViewDetails: (dataset: Dataset) => void;
  onDownload: (dataset: Dataset) => void;
}

export function DatasetCard({ 
  name, 
  organism, 
  type, 
  genes, 
  cells, 
  edges, 
  source = 'curated',
  lastUpdated = '2024-11-15',
  sparklineData,
  dataset, 
  onViewDetails,
  onClick 
}: DatasetCardProps) {
  const getSourceColor = (src: string) => {
    switch(src) {
      case 'synthetic': return 'warning';
      case 'real': return 'success';
      case 'curated': return 'info';
      default: return 'default';
    }
  };
  
  

  return (
    <div 
      className="bg-card dark:bg-card-dark rounded-lg p-5 border border-border dark:border-border-dark hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-foreground dark:text-foreground-dark">{name}</h4>
            <p className="text-muted-foreground dark:text-muted-foreground-dark text-xs">{organism}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge2 variant="info" size="sm">{type}</Badge2>
        </div>
      </div>
      
      {/* Metadata Row */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border dark:border-border-dark">
        <Badge2 variant={getSourceColor(source)} size="sm">
          {source}
        </Badge2>
        <span className="text-xs text-muted-foreground dark:text-muted-foreground-dark">•</span>
        <span className="text-xs text-muted-foreground dark:text-muted-foreground-dark">Updated {lastUpdated}</span>
      </div>
      
      {/* Dataset Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark mb-1">Genes</p>
          <p className="text-foreground dark:text-foreground-dark">{genes.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark mb-1">Cells</p>
          <p className="text-foreground dark:text-foreground-dark">{cells.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground-dark mb-1">Edges</p>
          <p className="text-foreground dark:text-foreground-dark">{edges.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Mini Preview Sparkline */}
      {sparklineData && (
        <div className="mb-4 p-3 bg-muted-background dark:bg-muted-background-dark rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-transparent ">Activity Preview</span>
            {/* Mini Preview Sparkline */}
            {sparklineData && (
              <div className="mb-4 p-3 bg-muted-background dark:bg-muted-background-dark rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                    Activity Preview
                  </span>
                </div>
                <ActivityPreview data={sparklineData} />
              </div>
            )}

          </div>
          <svg width="100%" height="32" className="block">
            <polyline
              points={sparklineData.map((val, i) => 
                `${(i / (sparklineData.length - 1)) * 100}%,${32 - (val / Math.max(...sparklineData)) * 24}`
              ).join(' ')}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button2 
          variant="secondary" 
          size="sm" 
          className="flex-1"
          // onClick={(e) => e.stopPropagation()}
          onClick={() => onDownload(dataset)}
        >
          View Details
        </Button2>
        <Button2 
          variant="ghost" 
          size="sm"
          icon={<Download className="w-4 h-4 text-foreground dark:text-foreground-dark" />}
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              'https://zenodo.org/records/3701939',
              '_blank',
              'noopener,noreferrer'
            );
          }}
        />
      </div>
    </div>
  );
}
