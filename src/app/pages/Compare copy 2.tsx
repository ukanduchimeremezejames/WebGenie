// import { FileDown, X } from 'lucide-react';
import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Download, FileDown, Filter, Search, Database,  X, Activity, Globe, Layers, Boxes, Dna, Microscope, GitFork } from 'lucide-react';
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
} from 'recharts';

const algorithms = [
  { name: 'GENIE3', color: '#A970FF', selected: true },
  { name: 'PPCOR', color: '#60a5fa', selected: true },
  { name: 'SINCERITIES', color: '#f59e0b', selected: true },
  { name: 'PIDC', color: '#ef4444', selected: false },
  { name: 'GRNBoost2', color: '#10b981', selected: false },
  { name: 'SCENIC', color: '#8b5cf6', selected: false },
];

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
  // Original algorithms (unchanged)
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

  // ------------------------------------------------
  // Real Beeline Algorithms — Synthetic benchmark values
  // ------------------------------------------------
  {
    algorithm: 'ARBORETO',
    auroc: 0.768,
    auprc: 0.603,
    f1: 0.644,
    precision: 0.702,
    recall: 0.598,
    earlyPrecision: 0.782,
  },
  {
    algorithm: 'BTR',
    auroc: 0.652,
    auprc: 0.557,
    f1: 0.583,
    precision: 0.611,
    recall: 0.552,
    earlyPrecision: 0.721,
  },
  {
    algorithm: 'GRISLI',
    auroc: 0.712,
    auprc: 0.612,
    f1: 0.639,
    precision: 0.664,
    recall: 0.601,
    earlyPrecision: 0.765,
  },
  {
    algorithm: 'GRNVBEM',
    auroc: 0.735,
    auprc: 0.634,
    f1: 0.658,
    precision: 0.683,
    recall: 0.628,
    earlyPrecision: 0.792,
  },
  {
    algorithm: 'JUMP3',
    auroc: 0.683,
    auprc: 0.505,
    f1: 0.558,
    precision: 0.587,
    recall: 0.531,
    earlyPrecision: 0.673,
  },
  {
    algorithm: 'LEAP',
    auroc: 0.743,
    auprc: 0.622,
    f1: 0.651,
    precision: 0.674,
    recall: 0.618,
    earlyPrecision: 0.801,
  },
  {
    algorithm: 'PNI',
    auroc: 0.677,
    auprc: 0.532,
    f1: 0.569,
    precision: 0.599,
    recall: 0.545,
    earlyPrecision: 0.702,
  },
  {
    algorithm: 'SCINGE',
    auroc: 0.754,
    auprc: 0.671,
    f1: 0.702,
    precision: 0.731,
    recall: 0.669,
    earlyPrecision: 0.844,
  },
  {
    algorithm: 'SCNS',
    auroc: 0.708,
    auprc: 0.588,
    f1: 0.622,
    precision: 0.655,
    recall: 0.594,
    earlyPrecision: 0.755,
  },
  {
    algorithm: 'SCODE',
    auroc: 0.721,
    auprc: 0.561,
    f1: 0.601,
    precision: 0.628,
    recall: 0.575,
    earlyPrecision: 0.733,
  },
  {
    algorithm: 'SCRIBE',
    auroc: 0.691,
    auprc: 0.577,
    f1: 0.613,
    precision: 0.642,
    recall: 0.586,
    earlyPrecision: 0.748,
  },
  {
    algorithm: 'SCSGL',
    auroc: 0.764,
    auprc: 0.643,
    f1: 0.674,
    precision: 0.698,
    recall: 0.646,
    earlyPrecision: 0.812,
  },
  {
    algorithm: 'SINGE',
    auroc: 0.728,
    auprc: 0.602,
    f1: 0.646,
    precision: 0.668,
    recall: 0.612,
    earlyPrecision: 0.795,
  },
];


const motifEnrichmentData = [
  { motif: 'SOX2', enrichment: 8.4 },
  { motif: 'OCT4', enrichment: 7.2 },
  { motif: 'NANOG', enrichment: 6.8 },
  { motif: 'KLF4', enrichment: 5.9 },
  { motif: 'MYC', enrichment: 4.7 }
];

// Simulated dynamic dataset source
const allDatasets = [
{
id: 1,
name: 'Yeast TF Network',
organism: 'Yeast',
type: 'Expression',
source: 'GEO',
genes: 3500,
samples: 120,
},
{
id: 2,
name: 'Human Immune Response',
organism: 'Human',
type: 'ChIP-seq',
source: 'ENCODE',
genes: 20000,
samples: 80,
},
{
id: 3,
name: 'Mouse Brain Atlas',
organism: 'Mouse',
type: 'RNA-seq',
source: 'ArrayExpress',
genes: 15000,
samples: 65,
},
];

export function Compare() {
  const [searchQuery, setSearchQuery] = useState('');
const [selectedOrganism, setSelectedOrganism] = useState('all');
const [selectedType, setSelectedType] = useState('all');
const [selectedSource, setSelectedSource] = useState('all');


const organisms = ['all', 'Human', 'Mouse', 'Yeast'];
const types = ['all', 'Expression', 'ChIP-seq', 'RNA-seq'];
const sources = ['all', 'GEO', 'ENCODE', 'ArrayExpress'];


const filteredDatasets = allDatasets.filter(dataset => {
const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
dataset.organism.toLowerCase().includes(searchQuery.toLowerCase());
const matchesOrganism = selectedOrganism === 'all' || dataset.organism === selectedOrganism;
const matchesType = selectedType === 'all' || dataset.type === selectedType;
const matchesSource = selectedSource === 'all' || dataset.source === selectedSource;
return matchesSearch && matchesOrganism && matchesType && matchesSource;
});

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
        <Card id="metrics" className='mt-5 px-5 pb-5'>
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
              <ResponsiveContainer width="100%" height={280}>
            <BarChart data={motifEnrichmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis dataKey="motif" type="category" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="enrichment" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} />
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
