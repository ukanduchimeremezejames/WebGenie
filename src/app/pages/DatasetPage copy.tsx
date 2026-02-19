import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Badge2 } from './Badge';
import { Button2 } from './Button';
import { MetricCard } from './MetricCard';
// import { useLocation } from 'react-router-dom';
import { Download, Activity, FileText, TrendingUp, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const geneDistData = [
  { range: '0-100', count: 45 },
  { range: '100-500', count: 128 },
  { range: '500-1000', count: 89 },
  { range: '1000-2000', count: 56 },
  { range: '2000+', count: 23 }
];

const cellTypeData = [
  { name: 'Type A', value: 342, color: '#5B2C6F' },
  { name: 'Type B', value: 256, color: '#7A3A94' },
  { name: 'Type C', value: 189, color: '#9B5BB5' },
  { name: 'Type D', value: 124, color: '#BB7CD6' }
];

export function DatasetPage() {
  
const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="mt-15 max-w-[1600px] mx-auto px-6 py-8">
      {/* Back Button */}
      <Button2 
        variant="ghost" 
        icon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/datasets')}
        className="mb-6"
      >
        Back to Dataset Lists
      </Button2>
      
      {/* Header */}
      <div className="bg-card rounded-lg p-6 border border-border mb-6">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-card-foreground font-semibold text-lg">{location.pathname.substring(9)} Dataset</h1>
                <Badge2 variant="success">Validated</Badge2>
                <Badge2 variant="info">scRNA-seq</Badge2>
              </div>
              <p className="text-muted-foreground mb-3">Human Embryonic Stem Cells - Time-series expression data</p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Organism:</span>
                  <span className="text-card-foreground">Homo sapiens</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Modality:</span>
                  <span className="text-card-foreground">Single-cell RNA-seq</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Time points:</span>
                  <span className="text-card-foreground">5</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Published:</span>
                  <span className="text-card-foreground">2023-03-15</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button2 variant="secondary" icon={<Download className="w-4 h-4" />}>
              Download Ground Truth
            </Button2>
            <Button2 variant="primary">Run Benchmark</Button2>
          </div>
        </div>
        
        {/* Dataset Metadata Section */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-card-foreground mb-4 font-semibold">Dataset Metadata</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-lg border border-purple-100 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700">
              <p className="text-xs text-purple-600 dark:text-purple-300 mb-1">Source</p>
              <p className="text-card-foreground">Curated</p>
              <p className="text-xs text-muted-foreground mt-1">Real experimental data</p>
            </div>
            <div className="p-4 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <p className="text-xs text-blue-600 dark:text-blue-300 mb-1">Size</p>
              <p className="text-card-foreground">1,842 genes</p>
              <p className="text-xs text-muted-foreground mt-1">911 cells/samples</p>
            </div>
            <div className="p-4 rounded-lg border border-green-100 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
              <p className="text-xs text-green-600 dark:text-green-300 mb-1">Last Updated</p>
              <p className="text-card-foreground">2024-11-15</p>
              <p className="text-xs text-muted-foreground mt-1">3 weeks ago</p>
            </div>
            <div className="p-4 rounded-lg border border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
              <p className="text-xs text-orange-600 dark:text-orange-300 mb-1">Version</p>
              <p className="text-card-foreground">v2.1.0</p>
              <p className="text-xs text-muted-foreground mt-1">Latest stable</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Total Genes" value="1,842" icon={<FileText className="w-6 h-6" />} color="var(--color-primary)" />
        <MetricCard label="Known Edges" value="3,267" icon={<TrendingUp className="w-6 h-6" />} color="var(--color-accent)" />
        <MetricCard label="Total Samples" value="911" icon={<Activity className="w-6 h-6" />} color="var(--color-blue)" />
        <MetricCard label="Sparsity" value="94.2%" icon={<Activity className="w-6 h-6" />} color="var(--color-yellow)" />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gene Expression Distribution */}
        <div className="bg-card rounded-lg p-6 border border-border dark:border-gray-700">
          <h3 className="text-card-foreground mb-1 font-semibold">Gene Expression Distribution</h3>
          <p className="text-muted-foreground text-sm mb-6">Expression count ranges across samples</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={geneDistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="range" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Cell Type Composition */}
        <div className="bg-card rounded-lg p-6 border border-border dark:border-gray-700">
          <h3 className="text-card-foreground mb-1 font-semibold">Cell Type Composition</h3>
          <p className="text-muted-foreground text-sm mb-6">Distribution of cell populations</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={cellTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                {cellTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {cellTypeData.map((type) => (
              <div key={type.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                <span className="text-sm text-card-foreground">{type.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{type.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quality Control Metrics */}
      <div className="bg-card rounded-lg p-6 border border-border mb-8">
        <h3 className="text-card-foreground mb-1 font-semibold">Quality Control Metrics</h3>
        <p className="text-muted-foreground text-sm mb-6">Dataset quality and preprocessing statistics</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Mean UMI Count</p>
            <p className="text-2xl text-card-foreground">4,827</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Median Genes/Cell</p>
            <p className="text-2xl text-card-foreground">1,234</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Mitochondrial %</p>
            <p className="text-2xl text-card-foreground">3.2%</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Doublet Rate</p>
            <p className="text-2xl text-card-foreground">2.1%</p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button2 variant="primary" onClick={() => navigate('/compare')}>
          Compare Algorithms on this Dataset
        </Button2>
        <Button2 variant="secondary" onClick={() => navigate(`/upload/recent`)}>
          {/* /dataset/${id}/runs */}
          View All Runs
        </Button2>
        <Button2 variant="secondary" onClick={() => navigate('/upload')}>
          Upload New Predictions
        </Button2>
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
