import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Badge2 } from './Badge';
import { Button2 } from './Button';
import { MetricCard } from './MetricCard';

import { PerformanceChart } from "./../components/PerformanceChart";
import { RocCurve } from "./../components/RocCurve";
import { PrCurve } from "./../components/PrCurve";

import { generateDeterministicMetrics } from "./../../utils/generateDeterministicMetrics";

import { 
  Download, Activity, FileText, TrendingUp, ArrowLeft 
} from 'lucide-react';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const allDatasets = [
  // -------------------------
  // Curated Ground-Truth GRNs
  // -------------------------
  {
    id: 'GSD',
    name: 'GSD',
    organism: 'N/A',
    type: 'curated',
    genes: 18,
    cells: 120,
    edges: 79,
    source: 'real' as const,
    lastUpdated: '2020-03-27',
    sparklineData: [62, 59, 62, 61, 63, 64, 63, 60, 60, 64]
  },
  {
    id: 'HSC',
    name: 'HSC',
    organism: 'N/A',
    type: 'curated',
    genes: 11,
    cells: 110,
    edges: 30,
    source: 'real' as const,
    lastUpdated: '2020-05-14',
    sparklineData: [59, 58, 61, 60, 64, 57, 62, 59, 60, 58]
  },
  {
    id: 'mCAD',
    name: 'mCAD',
    organism: 'N/A',
    type: 'curated',
    genes: 5,
    cells: 100,
    edges: 14,
    source: 'real' as const,
    lastUpdated: '2021-01-11',
    sparklineData: [60, 63, 58, 61, 65, 53, 62, 57, 60, 61]
  },
  {
    id: 'VSC',
    name: 'VSC',
    organism: 'N/A',
    type: 'curated',
    genes: 8,
    cells: 115,
    edges: 15,
    source: 'real' as const,
    lastUpdated: '2021-04-02',
    sparklineData: [60, 61, 64, 59, 62, 58, 63, 60, 62, 61]
  },

  // -------------------------
  // Real scRNA-seq Datasets
  // -------------------------
  {
    id: 'hESC',
    name: 'hESC',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 1000,
    cells: 758,
    edges: 3200,
    source: 'real' as const,
    lastUpdated: '2020-09-18',
    sparklineData: [29, 27, 31, 25, 29, 31, 28, 32, 30, 26]
  },
  {
    id: 'hHep',
    name: 'hHep',
    organism: 'Human',
    type: 'scRNA-seq',
    genes: 950,
    cells: 642,
    edges: 2800,
    source: 'real' as const,
    lastUpdated: '2021-02-23',
    sparklineData: [18, 24, 20, 25, 32, 28, 25, 23, 25, 26]
  },
  {
    id: 'mDC',
    name: 'mDC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 900,
    cells: 383,
    edges: 2100,
    source: 'real' as const,
    lastUpdated: '2021-06-30',
    sparklineData: [15, 20, 18, 26, 20, 25, 19, 23, 21, 17]
  },
  {
    id: 'mESC',
    name: 'mESC',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1100,
    cells: 536,
    edges: 3400,
    source: 'real' as const,
    lastUpdated: '2022-01-19',
    sparklineData: [26, 25, 28, 24, 23, 27, 23, 23, 24, 22]
  },
  {
    id: 'mHSC-E',
    name: 'mHSC-E',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1050,
    cells: 645,
    edges: 3100,
    source: 'real' as const,
    lastUpdated: '2022-03-07',
    sparklineData: [26, 27, 25, 30, 28, 30, 26, 29, 31, 29]
  },
  {
    id: 'mHSC-GM',
    name: 'mHSC-GM',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 1200,
    cells: 635,
    edges: 3600,
    source: 'real' as const,
    lastUpdated: '2022-06-12',
    sparklineData: [30, 25, 26, 23, 27, 29, 26, 28, 30, 24]
  },
  {
    id: 'mHSC-L',
    name: 'mHSC-L',
    organism: 'Mouse',
    type: 'scRNA-seq',
    genes: 980,
    cells: 712,
    edges: 2950,
    source: 'real' as const,
    lastUpdated: '2022-08-25',
    sparklineData: [20, 22, 25, 26, 27, 23, 26, 24, 28, 24]
  },

  // -------------------------
  // Synthetic Dynamic Networks
  // -------------------------
  {
    id: 'dyn-LL',
    name: 'Dynamic LL',
    organism: 'N/A',
    type: 'synthetic',
    genes: 18,
    cells: 140,
    edges: 19,
    source: 'synthetic' as const,
    lastUpdated: '2020-07-09',
    sparklineData: [39, 42, 42, 41, 38, 39, 41, 37, 40, 40]
  },
  {
    id: 'dyn-LI',
    name: 'Dynamic LI',
    organism: 'N/A',
    type: 'synthetic',
    genes: 7,
    cells: 115,
    edges: 8,
    source: 'synthetic' as const,
    lastUpdated: '2020-10-21',
    sparklineData: [36, 37, 35, 40, 38, 41, 39, 39, 41, 34]
  },
  {
    id: 'dyn-TF',
    name: 'Dynamic TF',
    organism: 'N/A',
    type: 'synthetic',
    genes: 7,
    cells: 118,
    edges: 20,
    source: 'synthetic' as const,
    lastUpdated: '2021-03-16',
    sparklineData: [40, 41, 38, 41, 36, 43, 39, 42, 37, 42]
  },
  {
    id: 'dyn-BF',
    name: 'Dynamic BF',
    organism: 'N/A',
    type: 'synthetic',
    genes: 5,
    cells: 105,
    edges: 12,
    source: 'synthetic' as const,
    lastUpdated: '2021-09-28',
    sparklineData: [35, 39, 37, 37, 36, 40, 39, 42, 38, 39]
  },
  {
    id: 'dyn-BFC',
    name: 'Dynamic BFC',
    organism: 'N/A',
    type: 'synthetic',
    genes: 9,
    cells: 125,
    edges: 18,
    source: 'synthetic' as const,
    lastUpdated: '2022-02-14',
    sparklineData: [39, 40, 38, 41, 37, 42, 39, 39, 38, 40]
  },
  {
    id: 'dyn-CY',
    name: 'Dynamic CY',
    organism: 'N/A',
    type: 'synthetic',
    genes: 5,
    cells: 110,
    edges: 6,
    source: 'synthetic' as const,
    lastUpdated: '2022-11-03',
    sparklineData: [37, 41, 39, 40, 31, 43, 40, 41, 40, 41]
  },
];



type DatasetMetricProfile = {
  auroc: [number, number];   // min, max
  auprc: [number, number];
  f1:    [number, number];
  sparsityBias: number;
};

const DATASET_PROFILES: Record<string, DatasetMetricProfile> = {
  "cskokgibbs/BEELINE-HepG2-no-label-pretokenized-NT": {
    auroc: [0.78, 0.88],
    auprc: [0.35, 0.55],
    f1: [0.42, 0.62],
    sparsityBias: 0.15,
  },

  "cskokgibbs/BEELINE-mDC-no-label-pretokenized-NT": {
    auroc: [0.65, 0.78],
    auprc: [0.18, 0.32],
    f1: [0.30, 0.45],
    sparsityBias: 0.35,
  },
};

function boundedRandom([min, max]: [number, number]) {
  return +(min + Math.random() * (max - min)).toFixed(3);
}

function generateRunMetrics(datasetId: string) {
  const profile = DATASET_PROFILES[datasetId];

  return {
    auroc: boundedRandom(profile.auroc),
    auprc: boundedRandom(profile.auprc),
    f1: boundedRandom(profile.f1),
  };
}


type PopupStep = "summary" | "charts" | "compare";
// const [step, setStep] = useState<PopupStep>("summary");
// function DatasetPage() {
  
// }

const COMPARISON_DATASETS = [
  "BEELINE-HepG2",
  "BEELINE-mDC",
  "BEELINE-hESC"
];

function scoreColor(score: number) {
  if (score >= 0.9) return "text-green-600";
  if (score >= 0.75) return "text-yellow-500";
  return "text-red-500";
}


function generateExpressionDistribution(genes: number) {
  const bins = Array.from({ length: 20 }, (_, i) => ({
    range: `${i}`,
    count: Math.round(
      Math.exp(-i / 4) * genes + Math.random() * genes * 0.02
    ),
  }));

  return bins;
}

export function DatasetPage() {

  // 1️⃣ ALL HOOKS FIRST
  const [step, setStep] = useState<PopupStep>("summary");
  const location = useLocation();
  const navigate = useNavigate();

  const [runId, setRunId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);

  const datasetId = location.pathname.substring(9);       // "/dataset/<id>"
  const ds = allDatasets.find(d => d.id === datasetId);   // Resolve dataset

  if (!ds) {
    return (
      <div className="p-20 text-center text-xl text-red-500">
        Dataset "{datasetId}" not found.
      </div>
    );
  }

  // ---- Dynamic substitutions ----

  const dynamicGeneDist = ds.sparklineData.map((v, i) => ({
    range: `Bin ${i + 1}`,
    count: v
  }));

  const dynamicCellTypes = [
    { name: "Cluster A", value: Math.round(ds.cells * 0.32), color: '#5B2C6F' },
    { name: "Cluster B", value: Math.round(ds.cells * 0.26), color: '#7A3A94' },
    { name: "Cluster C", value: Math.round(ds.cells * 0.20), color: '#9B5BB5' },
    { name: "Cluster D", value: Math.round(ds.cells * 0.16), color: '#BB7CD6' },
  ];

  const lastUpdatedDate = new Date(ds.lastUpdated);

  const formatNumber = (n: number) =>
    Intl.NumberFormat('en-US').format(n);



  

// ---------------- Backend Integrated Logic ----------------

// const API_BASE = "https://huggingface.co/Ukandu/webgenie_api";
const API_BASE = "https://ukandu-webgenie-api.hf.space/";

const [selectedDataset, setSelectedDataset] = useState(datasetId);
// const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);

const [isSimulating, setIsSimulating] = useState(false);
const [activeRun, setActiveRun] = useState<{
  status: "queued" | "running" | "completed";
  progress: number;
  metrics?: {
    auroc: number;
    auprc: number;
    f1: number;
    edges: number;
    mean_weight: number;
    max_weight: number;
  };
} | null>(null);

function generateFakeMetrics(ds: any) {
  return {
    auroc: +(0.72 + Math.random() * 0.18).toFixed(3),
    auprc: +(0.25 + Math.random() * 0.35).toFixed(3),
    f1: +(0.35 + Math.random() * 0.25).toFixed(3),
    edges: Math.floor(ds.edges * (0.85 + Math.random() * 0.2)),
    mean_weight: +(0.15 + Math.random() * 0.35).toFixed(3),
    max_weight: +(0.6 + Math.random() * 0.35).toFixed(3),
  };
}

const runBenchmark = async () => {
  setIsSimulating(true);
  setIsRunning(true);

  let currentProgress = 0;

  setActiveRun({
    status: "queued",
    progress: 0,
  });

  const interval = setInterval(() => {
    currentProgress += Math.floor(6 + Math.random() * 12);

    if (currentProgress >= 100) {
      clearInterval(interval);

      const metrics = generateFakeMetrics(ds);

      setActiveRun({
        status: "completed",
        progress: 100,
        metrics,
      });

      setIsRunning(false);
      setIsSimulating(false);
      return;
    }

    setActiveRun({
      status: "running",
      progress: Math.min(currentProgress, 95),
    });

    setProgress(currentProgress);
  }, 1200);
};


const fetchMetrics = async (runId: string) => {
  const res = await fetch(`${API_BASE}/runs/${runId}/metrics`);
  const data = await res.json();
  setMetrics(data);
};

useEffect(() => {
  if (!runId || !isRunning) return;

  const interval = setInterval(async () => {
    const res = await fetch(`${API_BASE}/runs/${runId}`);
    const data = await res.json();

    setProgress(data.progress);

    if (data.status === "completed") {
      setIsRunning(false);
      clearInterval(interval);
      fetchMetrics(runId);
    }
  }, 2500);

  return () => clearInterval(interval);

  const fallback = generateDeterministicMetrics(datasetId);
  setMetrics(fallback);
}, [runId, isRunning]);



async function pollTaskStatus(runId: string) {
  const interval = setInterval(async () => {
    const res = await fetch(`${API_BASE}/runs/${runId}`);
    const data = await res.json();

    setProgress(data.progress);

    if (data.status === "completed") {
      clearInterval(interval);
      const metrics = await fetch(`${API_BASE}/runs/${runId}/metrics`);
      setRunResult(await metrics.json());
      setShowResult(true);
      setIsRunning(false);
    }
  }, 1500);
}

// ---------------- Download Ground Truth ----------------
// function handleDownloadGroundTruth() {
//   // --- realistic synthetic ground truth ---
//   const numEdges = Math.min(ds.edges, 5000); // cap to avoid massive files
//   const numGenes = ds.genes;

//   const rows: string[] = [];
//   rows.push("source,target,weight"); // CSV header

//   for (let i = 0; i < numEdges; i++) {
//     const source = `Gene_${Math.floor(Math.random() * numGenes) + 1}`;
//     const target = `Gene_${Math.floor(Math.random() * numGenes) + 1}`;
//     const weight = (Math.random() * 0.9 + 0.1).toFixed(4); // realistic edge weight

//     rows.push(`${source},${target},${weight}`);
//   }

//   const csvContent = rows.join("\n");

//   // --- trigger download ---
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `${ds.name}_ground_truth.csv`;
//   a.click();

//   URL.revokeObjectURL(url);
// }

// async function handleDownloadGroundTruth() {
//   const fileName = `${ds.name}_ground-truth.csv`;
//   const filePath = `/ground-truth/${fileName}`;

//   try {
//     const response = await fetch(filePath, { method: "HEAD" });

//     if (!response.ok) {
//       throw new Error("Ground truth file not found");
//     }

//     const a = document.createElement("a");
//     a.href = filePath;
//     a.download = fileName;
//     a.click();
//   } catch (err) {
//     console.error(err);
//     alert("Ground truth not available for this dataset.");
//   }
// }

async function handleDownloadGroundTruth() {
  const fileName = `${ds.name}_refNetwork.csv`;
  const filePath = `/ground-truth/${fileName}`;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      alert(`Ground truth file for "${ds.name}" is not available.`);
      return;
    }

    // Check Content-Type to avoid downloading HTML
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/csv")) {
      alert(`Ground truth file for "${ds.name}" is not available.`);
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading ground truth file:", err);
    alert("An error occurred while trying to download the ground truth file.");
  }
}

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

          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-card-foreground font-semibold text-xlg">
                  {ds.name} Dataset
                </h1>

                <Badge2 variant="success">Validated</Badge2>
                <Badge2 variant="info">{ds.type}</Badge2>
              </div>

              <p className="text-muted-foreground mb-3 text-lg">
                {ds.organism} dataset — {ds.type} expression profile
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Organism:</span>
                  <span className="text-card-foreground">{ds.organism}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Modality:</span>
                  <span className="text-card-foreground">{ds.type}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Edges:</span>
                  <span className="text-card-foreground">{formatNumber(ds.edges)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="text-card-foreground">{ds.lastUpdated}</span>
                </div>

              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button2 
              variant="secondary" 
              icon={<Download className="w-4 h-4"/>}
              onClick={handleDownloadGroundTruth}
            >
              Download Ground Truth
            </Button2>
            <input
              type="checkbox"
              className="mb-3"
              value="GENIE3"
              onChange={(e) =>
                setSelectedAlgorithms(
                  e.target.checked
                    ? [...selectedAlgorithms, e.target.value]
                    : selectedAlgorithms.filter(a => a !== e.target.value)
                )
              }
            />
            I AGREE TO PROCEED



            <Button2
              variant="primary"
              onClick={runBenchmark}
              disabled={isRunning || !selectedDataset || selectedAlgorithms.length === 0}
            >

              {isRunning ? "Running..." : "Run Benchmark"}
            </Button2>

            {/* PROGRESS BAR */}
            {isRunning && (
              <div style={{ marginTop: 16 }}>
                <p>Progress: {progress}%</p>
                <progress value={progress} max={100} />
              </div>
            )}
          
          {activeRun && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card border border-border rounded-xl p-6 w-[420px] shadow-xl">
                <h2 className="text-lg font-semibold mb-3 text-card-foreground">
                  BEELINE Run Status
                </h2>

                <p className="text-sm text-muted-foreground mb-2 capitalize">
                  Status: {activeRun.status}
                </p>

                <progress
                  className="w-full mb-4"
                  value={activeRun.progress}
                  max={100}
                />

                {activeRun.metrics && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>AUROC: <b>{activeRun.metrics.auroc}</b></div>
                    <div>AUPRC: <b>{activeRun.metrics.auprc}</b></div>
                    <div>F1 Score: <b>{activeRun.metrics.f1}</b></div>
                    <div>Edges: <b>{activeRun.metrics.edges}</b></div>
                    <div>Mean weight: <b>{activeRun.metrics.mean_weight}</b></div>
                    <div>Max weight: <b>{activeRun.metrics.max_weight}</b></div>
                  </div>
                )}

                {metrics && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <MetricCard
                      label="AUROC"
                      value={metrics.auroc.toFixed(3)}
                      icon={<TrendingUp className="w-6 h-6" />}
                    />
                    <MetricCard
                      label="AUPRC"
                      value={metrics.auprc.toFixed(3)}
                      icon={<Activity className="w-6 h-6" />}
                    />
                    <MetricCard
                      label="F1 Score"
                      value={metrics.f1.toFixed(3)}
                      icon={<FileText className="w-6 h-6" />}
                    />
                  </div>
                )}

                {metrics && (
                  <div className="bg-card border border-border rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-card-foreground mb-4">
                      Metric Interpretation
                    </h3>

                    <ul className="space-y-2 text-sm">
                      <li className={scoreColor(metrics.auroc)}>
                        AUROC {metrics.auroc.toFixed(3)} — ranking quality
                      </li>
                      <li className={scoreColor(metrics.auprc)}>
                        AUPRC {metrics.auprc.toFixed(3)} — precision on positives
                      </li>
                      <li className={scoreColor(metrics.f1)}>
                        F1 {metrics.f1.toFixed(3)} — precision/recall balance
                      </li>
                    </ul>
                  </div>
                )}


                {metrics && (
                  <>
                    {/* 1. Numeric summary */}
                    <MetricSummary metrics={metrics} />

                    {/* 2. Bar chart */}
                    <PerformanceChart metrics={metrics} />

                    {/* 3. Curves */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <RocCurve data={metrics.roc_curve} />
                      <PrCurve data={metrics.pr_curve} />
                    </div>
                  </>
                )}


      <button
        onClick={() => setActiveRun(null)}
        className="mt-5 w-full py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        Close
      </button>
    </div>
  </div>
)}




            {/* CHARTS */}
            {metrics && (
              <>
                <PerformanceChart metrics={metrics} />
                <RocCurve data={metrics.roc_curve} />
                <PrCurve data={metrics.pr_curve} />
              </>
            )}
          </div>
        </div>


        {/* Metadata */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-card-foreground mb-4 font-semibold">Dataset Metadata</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Source */}
            <div className="p-4 rounded-lg border border-purple-100 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700">
              <p className="text-xs text-purple-600 dark:text-purple-300 mb-1">Source</p>
              <p className="text-card-foreground capitalize">{ds.source}</p>
              <p className="text-xs text-muted-foreground mt-1">Dataset origin</p>
            </div>

            {/* Size */}
            <div className="p-4 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <p className="text-xs text-blue-600 dark:text-blue-300 mb-1">Size</p>
              <p className="text-card-foreground">{formatNumber(ds.genes)} genes</p>
              <p className="text-xs text-muted-foreground mt-1">{formatNumber(ds.cells)} samples</p>
            </div>

            {/* Last updated */}
            <div className="p-4 rounded-lg border border-green-100 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
              <p className="text-xs text-green-600 dark:text-green-300 mb-1">Last Updated</p>
              <p className="text-card-foreground">{ds.lastUpdated}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {lastUpdatedDate.toDateString()}
              </p>
            </div>

            {/* Version (dynamic placeholder) */}
            <div className="p-4 rounded-lg border border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
              <p className="text-xs text-orange-600 dark:text-orange-300 mb-1">Version</p>
              <p className="text-card-foreground">v1.0.{Math.floor(Math.random() * 9)}</p>
              <p className="text-xs text-muted-foreground mt-1">Autogenerated</p>
            </div>
          </div>
        </div>
      </div>


      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          label="Total Genes" 
          value={formatNumber(ds.genes)} 
          icon={<FileText className="w-6 h-6" />} 
        />

        <MetricCard 
          label="Known Edges" 
          value={formatNumber(ds.edges)} 
          icon={<TrendingUp className="w-6 h-6" />} 
        />

        <MetricCard 
          label="Total Samples" 
          value={formatNumber(ds.cells)} 
          icon={<Activity className="w-6 h-6" />} 
        />

        <MetricCard 
          label="Sparsity" 
          value={`${((1 - ds.edges / (ds.genes * ds.genes)) * 100).toFixed(2)}%`}
          icon={<Activity className="w-6 h-6" />} 
        />
      </div>


      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Gene Distribution */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-card-foreground mb-1 font-semibold">Gene Expression Distribution</h3>
          <p className="text-muted-foreground text-sm mb-6">Sparkline-derived synthetic distribution</p>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dynamicGeneDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cell Types */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-card-foreground mb-1 font-semibold">Cell Type Composition</h3>
          <p className="text-muted-foreground text-sm mb-6">Synthetic cell population distribution</p>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie 
                data={dynamicCellTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {dynamicCellTypes.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {dynamicCellTypes.map(t => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-sm text-card-foreground">{t.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Quality Metrics — placeholder dynamic */}
      <div className="bg-card rounded-lg p-6 border border-border mb-8">
        <h3 className="text-card-foreground mb-1 font-semibold">Quality Control Metrics</h3>
        <p className="text-muted-foreground text-sm mb-6">Autogenerated QC metrics</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Mean UMI Count</p>
            <p className="text-2xl text-card-foreground">{formatNumber(ds.genes * 2)}</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Median Genes/Cell</p>
            <p className="text-2xl text-card-foreground">{formatNumber(Math.floor(ds.genes / 2))}</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Mitochondrial %</p>
            <p className="text-2xl text-card-foreground">{(Math.random() * 5).toFixed(1)}%</p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <p className="text-xs text-muted-foreground mb-1">Doublet Rate</p>
            <p className="text-2xl text-card-foreground">{(Math.random() * 3).toFixed(1)}%</p>
          </div>

        </div>
      </div>


      {/* Footer Actions */}
      <div className="flex flex-wrap gap-4">
        <Button2 variant="primary" onClick={() => navigate('/compare')}>
          Compare Algorithms on this Dataset
        </Button2>

        <Button2 variant="secondary" onClick={() => navigate(`/upload/recent`)}>
          View All Runs
        </Button2>

        <Button2 variant="secondary" onClick={() => navigate('/upload')}>
          Upload New Predictions
        </Button2>
      </div>

      {isRunning && (
        <div className="mt-6 w-full">
          <div className="text-sm text-muted-foreground mb-2">
            Benchmark Running… {progress}%
          </div>
          <div className="w-full h-3 bg-muted rounded-lg overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}


      {showResult && runResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg border border-border max-w-lg w-full">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Benchmark Completed
            </h2>

            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(runResult, null, 2)}
            </pre>

            <div className="mt-6 flex justify-end">
              <Button2 variant="primary" onClick={() => setShowResult(false)}>
                Close
              </Button2>
            </div>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="border-t bg-background mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2026 WebGenie Platform. MIT License.
            </p>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built upon</span>
              <span className="text-primary">BEELINE</span>
              <span>Benchmarking Platform</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
