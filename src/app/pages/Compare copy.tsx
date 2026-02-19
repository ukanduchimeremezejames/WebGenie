// import { FileDown, X } from 'lucide-react';
import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Download, Settings, FileDown, X, FileText, Activity } from 'lucide-react';
import { mockAlgorithms, mockPerformanceMetrics, getPRCurveData, getROCCurveData } from '.././components/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

import { AlgorithmChip } from './AlgorithmChip';
import { DataTable } from './DataTable';
import { Badge2 } from './Badge';
import { Button2 } from './Button';

const algorithms = [
  { name: 'GENIE3', color: '#A970FF', selected: true },
  { name: 'PPCOR', color: '#60a5fa', selected: true },
  { name: 'SINCERITIES', color: '#f59e0b', selected: true },
  { name: 'PIDC', color: '#ef4444', selected: false },
  { name: 'GRNBoost2', color: '#10b981', selected: false },
  { name: 'SCENIC', color: '#8b5cf6', selected: false },
];


// const algorithms = [
//   { name: 'GENIE3', color: '#5B2C6F' },
//   { name: 'PPCOR', color: '#28A745' },
//   { name: 'SINCERITIES', color: '#3B82F6' },
//   { name: 'PIDC', color: '#F59E0B' },
//   { name: 'GRNBoost2', color: '#EF4444' },
//   { name: 'SCENIC', color: '#8B5CF6' }
// ];

const performanceData = [
  { 
    algorithm: 'GENIE3',
    auprc: 0.847,
    auroc: 0.923,
    f1: 0.782,
    precision: 0.821,
    recall: 0.746,
    earlyPrec: 0.891,
    runtime: 252,
    memory: 1.8
  },
  { 
    algorithm: 'GRNBoost2',
    auprc: 0.803,
    auroc: 0.891,
    f1: 0.756,
    precision: 0.798,
    recall: 0.718,
    earlyPrec: 0.867,
    runtime: 324,
    memory: 2.1
  },
  { 
    algorithm: 'SCENIC',
    auprc: 0.789,
    auroc: 0.878,
    f1: 0.741,
    precision: 0.776,
    recall: 0.709,
    earlyPrec: 0.852,
    runtime: 486,
    memory: 3.4
  },
  { 
    algorithm: 'SINCERITIES',
    auprc: 0.734,
    auroc: 0.856,
    f1: 0.698,
    precision: 0.741,
    recall: 0.659,
    earlyPrec: 0.801,
    runtime: 522,
    memory: 2.7
  },
  { 
    algorithm: 'PIDC',
    auprc: 0.691,
    auroc: 0.812,
    f1: 0.654,
    precision: 0.701,
    recall: 0.612,
    earlyPrec: 0.778,
    runtime: 186,
    memory: 1.2
  },
  { 
    algorithm: 'PPCOR',
    auprc: 0.612,
    auroc: 0.789,
    f1: 0.601,
    precision: 0.648,
    recall: 0.559,
    earlyPrec: 0.723,
    runtime: 108,
    memory: 0.9
  }
];

const prCurveData = Array.from({ length: 20 }, (_, i) => {
  const recall = i / 19;
  return {
    recall,
    GENIE3: 0.95 - (recall * 0.3) - (Math.random() * 0.05),
    PPCOR: 0.75 - (recall * 0.4) - (Math.random() * 0.05),
    SINCERITIES: 0.85 - (recall * 0.35) - (Math.random() * 0.05),
    PIDC: 0.80 - (recall * 0.38) - (Math.random() * 0.05),
    GRNBoost2: 0.90 - (recall * 0.32) - (Math.random() * 0.05),
    SCENIC: 0.88 - (recall * 0.34) - (Math.random() * 0.05)
  };
});

const motifEnrichmentData = [
  { motif: 'SOX2', enrichment: 8.4 },
  { motif: 'OCT4', enrichment: 7.2 },
  { motif: 'NANOG', enrichment: 6.8 },
  { motif: 'KLF4', enrichment: 5.9 },
  { motif: 'MYC', enrichment: 4.7 }
];

// const similarityData = [
//   { algo1: 'GENIE3', algo2: 'GRNBoost2', similarity: 0.82 },
//   { algo1: 'GENIE3', algo2: 'SCENIC', similarity: 0.76 },
//   { algo1: 'PPCOR', algo2: 'PIDC', similarity: 0.71 },
//   { algo1: 'SINCERITIES', algo2: 'SCENIC', similarity: 0.68 }
// ];

const prData = Array.from({ length: 20 }, (_, i) => ({
  recall: i / 20,
  GENIE3: 0.95 - i * 0.04,
  PPCOR: 0.85 - i * 0.038,
  SINCERITIES: 0.82 - i * 0.036,
}));

const rocData = Array.from({ length: 20 }, (_, i) => ({
  fpr: i / 20,
  GENIE3: 0.5 + i * 0.025,
  PPCOR: 0.4 + i * 0.028,
  SINCERITIES: 0.35 + i * 0.03,
}));

const enrichmentData = [
  { category: 'GO:0000', GENIE3: 850, GRNBoost2: 720 },
  { category: 'OCT4', GENIE3: 725, GRNBoost2: 680 },
  { category: 'NANOG', GENIE3: 650, GRNBoost2: 590 },
  { category: 'E2F7', GENIE3: 580, GRNBoost2: 520 },
  { category: 'MYC', GENIE3: 450, GRNBoost2: 480 },
];

const similarityData = [
  { pair: 'GENIE3 — GRNBoost2', similarity: 0.82, color: '#A970FF' },
  { pair: 'GENIE3 — SCENIC', similarity: 0.76, color: '#60a5fa' },
  { pair: 'PPCOR — PIDC', similarity: 0.71, color: '#f59e0b' },
  { pair: 'SINCERITIES — SCENIC', similarity: 0.68, color: '#ef4444' },
];

const metricsData = [
  {
    algorithm: 'GENIE3',
    auroc: 0.847,
    auprc: 0.753,
    f1: 0.782,
    precision: 0.821,
    recall: 0.746,
    earlyPrecision: 0.851,
  },
  {
    algorithm: 'GRNBoost2',
    auroc: 0.803,
    auprc: 0.681,
    f1: 0.756,
    precision: 0.798,
    recall: 0.718,
    earlyPrecision: 0.867,
  },
  {
    algorithm: 'SCENIC',
    auroc: 0.769,
    auprc: 0.678,
    f1: 0.741,
    precision: 0.776,
    recall: 0.709,
    earlyPrecision: 0.824,
  },
  {
    algorithm: 'SINCERITIES',
    auroc: 0.734,
    auprc: 0.698,
    f1: 0.721,
    precision: 0.741,
    recall: 0.689,
    earlyPrecision: 0.801,
  },
  {
    algorithm: 'PIDC',
    auroc: 0.691,
    auprc: 0.612,
    f1: 0.668,
    precision: 0.701,
    recall: 0.612,
    earlyPrecision: 0.778,
  },
  {
    algorithm: 'PPCOR',
    auroc: 0.612,
    auprc: 0.789,
    f1: 0.553,
    precision: 0.648,
    recall: 0.559,
    earlyPrecision: 0.723,
  },
];

export function Compare() {
  // const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['GENIE3', 'PPCOR', 'SINCERITIES']);
  const [sselectedMetrics, setSelectedMetrics] = useState<string[]>(['auprc', 'auroc', 'f1', 'precision', 'recall']);
  const [normalizeMetrics, setNormalizeMetrics] = useState(false);
  
  // const toggleAlgorithm = (name: string) => {
  //   if (selectedAlgorithms.includes(name)) {
  //     setSelectedAlgorithms(selectedAlgorithms.filter(a => a !== name));
  //   } else {
  //     setSelectedAlgorithms([...selectedAlgorithms, name]);
  //   }
  // };
  
  const toggleMetric = (metric: string) => {
    if (sselectedMetrics.includes(metric)) {
      setSelectedMetrics(sselectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...sselectedMetrics, metric]);
    }
  };
  
  const exportCSV = () => {
    // Mock CSV export functionality
    console.log('Exporting to CSV...');
  };
  
  const exportPDF = () => {
    // Mock PDF export functionality
    console.log('Exporting to PDF...');
  };
  
  const metricOptions = [
    { key: 'precision', label: 'Precision' },
    { key: 'recall', label: 'Recall' },
    { key: 'f1', label: 'F1 Score' },
    { key: 'auprc', label: 'AUPRC' },
    { key: 'auroc', label: 'AUROC' },
    { key: 'runtime', label: 'Runtime' },
    { key: 'memory', label: 'Memory' }
  ];
  
  const columns = [
    { 
      key: 'algorithm', 
      label: 'Algorithm',
      sortable: true,
      render: (val: string) => {
        const algo = algorithms.find(a => a.name === val);
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: algo?.color }}
            />
            <span>{val}</span>
          </div>
        );
      }
    },
    ...(sselectedMetrics.includes('auprc') ? [{ 
      key: 'auprc', 
      label: 'AUPRC',
      sortable: true,
      render: (val: number) => <span>{val.toFixed(3)}</span>
    }] : []),
    ...(sselectedMetrics.includes('auroc') ? [{ 
      key: 'auroc', 
      label: 'AUROC',
      sortable: true,
      render: (val: number) => <span>{val.toFixed(3)}</span>
    }] : []),
    ...(sselectedMetrics.includes('f1') ? [{ 
      key: 'f1', 
      label: 'F1 Score',
      sortable: true,
      render: (val: number) => <span>{val.toFixed(3)}</span>
    }] : []),
    ...(sselectedMetrics.includes('precision') ? [{ 
      key: 'precision', 
      label: 'Precision',
      sortable: true,
      render: (val: number) => <span>{val.toFixed(3)}</span>
    }] : []),
    ...(sselectedMetrics.includes('recall') ? [{ 
      key: 'recall', 
      label: 'Recall',
      sortable: true,
      render: (val: number) => <span>{val.toFixed(3)}</span>
    }] : []),
    { 
      key: 'earlyPrec', 
      label: 'Early Precision',
      sortable: true,
      render: (val: number) => <span>{val.toFixed(3)}</span>
    },
    ...(sselectedMetrics.includes('runtime') ? [{ 
      key: 'runtime', 
      label: 'Runtime (s)',
      sortable: true,
      render: (val: number) => (
        <Badge2 variant={val < 200 ? 'success' : val < 400 ? 'warning' : 'default'}>
          {val}s
        </Badge2>
      )
    }] : []),
    ...(sselectedMetrics.includes('memory') ? [{ 
      key: 'memory', 
      label: 'Memory (GB)',
      sortable: true,
      render: (val: number) => (
        <Badge2 variant={val < 2 ? 'success' : val < 4 ? 'warning' : 'default'}>
          {val}GB
        </Badge2>
      )
    }] : [])
  ];
  
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['alg1', 'alg3']);

  const toggleAlgorithm = (algId: string) => {
    setSelectedAlgorithms(prev =>
      prev.includes(algId)
        ? prev.filter(id => id !== algId)
        : [...prev, algId]
    );
  };

  const selectAll = () => {
    setSelectedAlgorithms(mockAlgorithms.map(a => a.id));
  };

  const deselectAll = () => {
    setSelectedAlgorithms([]);
  };

  const selectedMetrics = mockPerformanceMetrics.filter(m =>
    selectedAlgorithms.includes(m.algorithmId)
  );

  const colors = ['#5B2C6F', '#28A745', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];

  const prData = Array.from({ length: 11 }, (_, i) => {
    const recall = i * 0.1;
    const point: any = { recall };
    selectedAlgorithms.forEach((algId, idx) => {
      const precision = 0.9 - recall * 0.4 - (idx * 0.05) + Math.random() * 0.05;
      point[algId] = Math.max(0, Math.min(1, precision));
    });
    return point;
  });

  const rocData = Array.from({ length: 11 }, (_, i) => {
    const fpr = i * 0.1;
    const point: any = { fpr };
    selectedAlgorithms.forEach((algId, idx) => {
      const tpr = fpr + 0.3 + (idx * 0.05) + Math.random() * 0.05;
      point[algId] = Math.min(1, tpr);
    });
    return point;
  });

  return (
    <div id="compare" className="min-h-screen py-20 pb-0">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Algorithm Comparison</h1>
          <p className="text-muted-foreground">
            Compare gene inference algorithm performance on HSC dataset
          </p>
        </div>

        {/* Algorithm Selection */}
        <Card id="select" className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground">Select Algorithms to Compare</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                Deselect All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockAlgorithms.map(algorithm => (
              <div
                key={algorithm.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAlgorithms.includes(algorithm.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleAlgorithm(algorithm.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedAlgorithms.includes(algorithm.id)}
                    onCheckedChange={() => toggleAlgorithm(algorithm.id)}
                  />
                  <div className="flex-1">
                    <p className="text-foreground">{algorithm.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">v{algorithm.version}</p>
                    <Badge variant="secondary" className="text-xs">
                      {algorithm.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">{selectedAlgorithms.length}</span> algorithms selected
            </p>
          </div>
        </div>
      </Card>

        {/* Performance Metrics Table */}
        {/* <div className="mb-6 p-6 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold mb-1">Performance Metrics</h2>
              <p className="text-sm text-muted-foreground">
                Comparing performance across all metrics
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-accent">
                <FileDown className="w-4 h-4" />
                CSV
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-accent">
                <FileDown className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Algorithm
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    AUROC
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    AUPRC
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    F1 Score
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Precision
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Recall
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Early Precision
                  </th>
                </tr>
              </thead>
              <tbody>
                {metricsData.map((metric) => (
                  <tr key={metric.algorithm} className="border-b last:border-0 hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">{metric.algorithm}</td>
                    <td className="text-right py-3 px-4 font-mono text-sm">{metric.auroc}</td>
                    <td className="text-right py-3 px-4 font-mono text-sm">{metric.auprc}</td>
                    <td className="text-right py-3 px-4 font-mono text-sm">{metric.f1}</td>
                    <td className="text-right py-3 px-4 font-mono text-sm">{metric.precision}</td>
                    <td className="text-right py-3 px-4 font-mono text-sm">{metric.recall}</td>
                    <td className="text-right py-3 px-4 font-mono text-sm">
                      {metric.earlyPrecision}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        
      {/* Performance Metrics Table */}
      {selectedMetrics.length > 0 && (
        {/* Performance Metrics Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-900 mb-1">Performance Metrics</h3>
            <p className="text-gray-500 text-sm">Comparative performance across all metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" icon={<FileText className="w-4 h-4" />} onClick={exportCSV}>
              CSV
            </Button>
            <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={exportPDF}>
              PDF
            </Button>
          </div>
        </div>
        
        {/* Metric Selection and Normalize Controls */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm text-gray-700 mb-2">Select Metrics to Display</label>
              <div className="flex flex-wrap gap-2">
                {metricOptions.map((metric) => (
                  <button
                    key={metric.key}
                    onClick={() => toggleMetric(metric.key)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                      selectedMetrics.includes(metric.key)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="ml-6 pl-6 border-l border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={normalizeMetrics}
                  onChange={(e) => setNormalizeMetrics(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Normalize Metrics</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">Scale 0-1 for comparison</p>
            </div>
          </div>
        </div>
        
        <DataTable columns={columns} data={performanceData} />
      </div>
      
      <Card id="metrics" className='mt-5'>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-foreground">Performance Metrics</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <FileDown className="w-4 h-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Algorithm</TableHead>
                <TableHead className="text-right">Precision</TableHead>
                <TableHead className="text-right">Recall</TableHead>
                <TableHead className="text-right">F1 Score</TableHead>
                <TableHead className="text-right">AUROC</TableHead>
                <TableHead className="text-right">AUPRC</TableHead>
                <TableHead className="text-right">Early Prec.</TableHead>
                <TableHead className="text-right">Runtime (s)</TableHead>
                <TableHead className="text-right">Memory (MB)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedMetrics.map((metric, idx) => (
                <TableRow key={metric.algorithmId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[idx % colors.length] }}
                      />
                      <span className="text-foreground">{metric.algorithmName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{metric.precision.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{metric.recall.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{metric.f1Score.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{metric.auroc.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{metric.auprc.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{metric.earlyPrecision.toFixed(3)}</TableCell>
                  <TableCell className="text-right">{metric.runtime.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{metric.memoryUsage.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      
      {/* Visualization Zone */}
      {selectedMetrics.length > 0 && (
        <div id="roc" className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5">
          {/* Precision-Recall Curve */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground">Precision-Recall Curve</h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E6EB" />
                  <XAxis
                    dataKey="recall"
                    label={{ value: 'Recall', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{ value: 'Precision', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #E4E6EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  {selectedAlgorithms.map((algId, idx) => {
                    const alg = mockAlgorithms.find(a => a.id === algId);
                    return (
                      <Line
                        key={algId}
                        type="monotone"
                        dataKey={algId}
                        name={alg?.name}
                        stroke={colors[idx % colors.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* ROC Curve */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground">ROC Curve</h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rocData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E6EB" />
                  <XAxis
                    dataKey="fpr"
                    label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #E4E6EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  {selectedAlgorithms.map((algId, idx) => {
                    const alg = mockAlgorithms.find(a => a.id === algId);
                    return (
                      <Line
                        key={algId}
                        type="monotone"
                        dataKey={algId}
                        name={alg?.name}
                        stroke={colors[idx % colors.length]}
                        strokeWidth={2}
                        dot={false}
                      />
                    );
                  })}
                  <Line
                    type="monotone"
                    dataKey="fpr"
                    stroke="#E4E6EB"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Random"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Performance Comparison Bar Chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="space-y-4">
              <h3 className="text-foreground">Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={selectedMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E6EB" />
                  <XAxis dataKey="algorithmName" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #E4E6EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="precision" fill="#5B2C6F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recall" fill="#28A745" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="f1Score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {selectedMetrics.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            Select algorithms above to view performance comparisons
          </p>
        </Card>
      )}

        {/* Charts */}
        {/* <div className="grid lg:grid-cols-2 gap-6 mb-6"> */}
          {/* PR Curves */}
          {/* <div className="p-6 rounded-lg border bg-card">
            <div className="mb-6">
              <h2 className="font-semibold mb-1">Precision-Recall Curves</h2>
              <p className="text-sm text-muted-foreground">Multi-algorithm overlay</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="recall"
                    label={{ value: 'Recall', position: 'insideBottom', offset: -5 }}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                  />
                  <YAxis
                    label={{ value: 'Precision', angle: -90, position: 'insideLeft' }}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="GENIE3" stroke="#A970FF" strokeWidth={2} />
                  <Line type="monotone" dataKey="PPCOR" stroke="#60a5fa" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="SINCERITIES"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div> */}

          {/* ROC Curves */}
          {/* <div className="p-6 rounded-lg border bg-card">
            <div className="mb-6">
              <h2 className="font-semibold mb-1">ROC Curves</h2>
              <p className="text-sm text-muted-foreground">Receiver operating characteristic</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="fpr"
                    label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                  />
                  <YAxis
                    label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }}
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="GENIE3" stroke="#A970FF" strokeWidth={2} />
                  <Line type="monotone" dataKey="PPCOR" stroke="#60a5fa" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="SINCERITIES"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> */}

        {/* Additional Charts */}
        <div id="enrichment" className="grid lg:grid-cols-2 gap-6 py-5">
          {/* Enrichment */}
          <div className="p-6 rounded-lg border bg-card">
            <div className="mb-6">
              <h2 className="font-semibold mb-1">Top Motif Enrichment</h2>
              <p className="text-sm text-muted-foreground">
                Transcription factor binding site enrichment
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrichmentData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fill: 'var(--color-muted-foreground)' }} />
                  <YAxis
                    dataKey="category"
                    type="category"
                    tick={{ fill: 'var(--color-muted-foreground)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="GENIE3" fill="#28D37C" />
                  <Bar dataKey="GRNBoost2" fill="#A970FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Similarity */}
          <div className="p-6 rounded-lg border bg-card">
            <div className="mb-6">
              <h2 className="font-semibold mb-1">Algorithm Similarity</h2>
              <p className="text-sm text-muted-foreground">
                Network prediction overlap (Jaccard index)
              </p>
            </div>
            <div className="space-y-4">
              {similarityData.map((item) => (
                <div key={item.pair}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="font-medium">{item.pair}</span>
                    <span className="font-mono">{item.similarity.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.similarity * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-6 p-3 rounded-lg bg-accent/50 border">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> High similarity indicates algorithms predict overlapping
                  edge sets. Low similarity suggests complementary approaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- LANDINGPAGE FOOTER -------------------- */}
      {/* <footer className="bg-gray-900 text-gray-300 py-12 mt-10">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white">WebGenie</div>
                  <div className="text-xs text-gray-400">Benchmarking Platform</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Research-grade GRN inference benchmarking and visualization for evaluating
              gene regulatory network inference algorithms on single-cell data.
              </p>
            </div>
            
            <div>
              <h5 className="text-white mb-4">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/datasets" className="hover:text-white transition-colors">Datasets</a></li>
                <li><a href="/compare" className="hover:text-white transition-colors">Algorithms</a></li>
                <li><a href="/upload" className="hover:text-white transition-colors">Upload</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white mb-4">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://github.com/Murali-group/Beeline" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://github.com/ukanduchimeremezejames/WebgenieDark" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white mb-4">Subscribe</h5>
              <p className="text-sm text-gray-400 mb-2">Get updates about new datasets and algorithms</p>
              <form className="flex gap-2">
                <input type="email" placeholder="Email" className="flex-1 p-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm" />
                <button type="submit" className="px-4 py-2 bg-purple-600 rounded-lg text-white text-sm hover:bg-purple-700 transition-colors">Subscribe</button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 text-center text-sm">
            © 2026 WebGenie | Built on the BEELINE Platform. All rights reserved.
          </div>
        </div>
      </footer> */}
    </div>
  );
}
