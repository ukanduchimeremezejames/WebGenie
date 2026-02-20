import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Upload as UploadIcon, FileText, CheckCircle, Clock, AlertCircle, Download, Activity } from 'lucide-react';
import { mockDatasets } from "../components/mockData";

const dynamicSteps = [
  { label: "Upload", key: "upload", icon: UploadIcon },
  { label: "Validation", key: "validation", icon: CheckCircle },
  { label: "Analysis", key: "analysis", icon: Clock },
  { label: "Comparison", key: "comparison", icon: FileText },
];

const pipelineSteps = [
  { label: 'Upload', icon: UploadIcon, status: 'active' },
  { label: 'Validation', icon: CheckCircle, status: 'pending' },
  { label: 'Analysis', icon: Clock, status: 'pending' },
  { label: 'Comparison', icon: FileText, status: 'pending' },
];

const recentJobs = [
  {
    id: 'JOB-001',
    name: 'GENIE3_predictions',
    dataset: 'BEELINE_Synthetic_100',
    algorithm: 'GENIE3',
    status: 'completed',
    timestamp: '2h ago',
  },
  {
    id: 'JOB-002',
    name: 'custom_run_v2',
    dataset: 'mESC_hematopoietic',
    algorithm: 'SINCERITIES',
    status: 'completed',
    timestamp: '5h ago',
  },
  {
    id: 'JOB-003',
    name: 'test_predictions',
    dataset: 'hESC_definitive_endoderm',
    algorithm: 'SINCERITIES',
    status: 'failed',
    timestamp: '1d ago',
  },
];



export function Upload() {

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const validation = await validateDatasetFile(file);

  if (!validation.valid) {
    alert("Dataset validation failed: " + validation.message);
    return;
  }

  // If valid:
  setUploadedFile(file);
  setDatasetList((prev) => [...prev, file.name]);

  console.log("Saving file to /datasets/" + file.name);

  handleUploadSuccess(file.name);

  setPipelineStep("validation");
};

const [availableDatasets, setAvailableDatasets] = useState(mockDatasets);

// Tracks uploaded dataset's ID
const [uploadedDataset, setUploadedDataset] = useState<string | null>(null);

function handleUploadSuccess(fileName: string) {
  const ds = {
    id: fileName,
    name: fileName,
    organism: "User",
    type: "Custom Dataset",
    genes: 0,
    cells: 0,
    edges: 0,
    source: "uploaded",
    lastUpdated: new Date().toISOString(),
    sparklineData: [],
  };

  // Add to list
  setAvailableDatasets(prev => [...prev, ds]);

  // Auto-select it
  setUploadedDataset(fileName);

  setJobConfig(prev => ({
    ...prev,
    dataset: fileName,
  }));
}

const downloadTemplate = () => {
  const csvContent = `gene,target,weight
GATA1,TAL1,0.92
RUNX1,MYB,0.87
...`;

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "dataset_template.csv";
  a.click();

  URL.revokeObjectURL(url);
};


  const [pipelineStep, setPipelineStep] = useState("upload");

  const [uploadedFile, setUploadedFile] = useState(null);
  const [datasetList, setDatasetList] = useState([]);
  const [jobConfig, setJobConfig] = useState({
    dataset: "",
    algorithm: "",
    algorithmVersion: "",
    runName: "",
    evalOptions: {
      prroc: true,
      earlyPrecision: true,
      motif: false,
    }
  });

  const [runsHistory, setRunsHistory] = useState([]);

  const isJobValid =
  jobConfig.dataset &&
  jobConfig.dataset.trim() !== "" &&
  jobConfig.algorithm &&
  jobConfig.algorithm.trim() !== "";


  const REQUIRED_COLUMNS = ["gene", "target", "weight"];

const validateDatasetFile = (file: File): Promise<{ valid: boolean; message?: string }> => {
  return new Promise((resolve) => {
    if (!file.name.endsWith(".csv")) {
      resolve({ valid: false, message: "Only CSV files are allowed." });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        resolve({ valid: false, message: "File is empty." });
        return;
      }

      const rows = text.trim().split("\n");
      if (rows.length < 2) {
        resolve({ valid: false, message: "Dataset must contain at least one data row." });
        return;
      }

      const headers = rows[0].split(",").map(h => h.trim().toLowerCase());

      // Check required columns
      const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) {
        resolve({
          valid: false,
          message: `Missing required columns: ${missingColumns.join(", ")}`
        });
        return;
      }

      // Validate rows
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(",");
        if (cols.length !== headers.length) {
          resolve({ valid: false, message: `Row ${i + 1} has incorrect column count.` });
          return;
        }

        const weightIndex = headers.indexOf("weight");
        const weightValue = parseFloat(cols[weightIndex]);

        if (isNaN(weightValue)) {
          resolve({ valid: false, message: `Invalid numeric value in row ${i + 1} (weight must be numeric).` });
          return;
        }
      }

      resolve({ valid: true });
    };

    reader.readAsText(file);
  });
};

const handleValidateAndContinue = () => {
  setPipelineStep("analysis");
  alert("Dataset validated. Proceeding to Job Configuration step.");
  if (!uploadedDataset) {
    alert("Please upload and validate a dataset first.");
    return;
  }

  setPipelineStep("analysis");
};

  return (
    <div id='upload' className="min-h-screen py-20 pb-0">

      
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload & Job Monitor</h1>
          <p className="text-muted-foreground">
            Upload predictions and monitor benchmarking jobs
          </p>
        </div>

        {/* Pipeline */}
        <div className="mb-8 p-6 rounded-lg border bg-card">
          <h2 className="font-semibold mb-6">Pipeline Workflow</h2>
          <div className="flex items-center justify-between">
            {dynamicSteps.map((step, index) => {
              const active = step.key === pipelineStep;

              return (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                        active
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-medium">{step.label}</div>
                  </div>
                  {index < dynamicSteps.length - 1 && (
                    <div className="flex-1 h-px bg-border mx-4 mt-[-20px]"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-2">
                <UploadIcon className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Upload Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Users with upload permissions: <strong>Researchers, Lab Managers</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                <div id='file'>
                  <h3 className="font-semibold text-sm mb-1">Run Comparisons</h3>
                  <p className="text-sm text-muted-foreground">
                    Users who can run benchmarks: <strong>All authenticated users</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Upload File */}
            <div id="queue"className="p-6 rounded-lg border bg-card">
              <h2 className="font-semibold mb-4">Upload Prediction File</h2>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <UploadIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm mb-2">Drag and drop your file here</p>
                <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
                <input
                  type="file"
                  className="hidden"
                  id="upload-input"
                  onChange={handleFileUpload}
                />

                <label
                  htmlFor="upload-input"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Choose File
                </label>

                {uploadedFile && (
  <div className="mt-4 p-3 bg-accent/20 border rounded">
    <p className="text-sm font-medium">Uploaded File:</p>
    <p className="text-sm text-primary">{uploadedFile.name}</p>
    <button
      onClick={handleValidateAndContinue}
      className="mt-3 px-4 py-2 bg-secondary text-white rounded-lg"
    >
      Validate & Continue →
    </button>

  </div>
)}


                                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: CSV, TSV, TXT (max 15MB)
                </p>
              </div>
            </div>

            {/* Job Configuration */}
            <div id='config' className="p-6 rounded-lg border bg-card">
              <h2 className="font-semibold mb-4">Job Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dataset</label>
                 
                  <select
                    value={jobConfig.dataset || ""}
                    onChange={(e) =>
                      setJobConfig({ ...jobConfig, dataset: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-md"
                  >
                    <option value="default">-- Select Dataset (By Clicking on "Choose File") --</option>
                    {datasetList.map((ds) => (
                      <option key={ds} value={ds}>
                        {ds}
                      </option>
                    ))}
                  </select>

                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Algorithm</label>
                  <select className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  value={jobConfig.algorithm}
                  onChange={(e) =>
                    setJobConfig({ ...jobConfig, algorithm: e.target.value })
                  }
                  >
                    <option value="default">-- Select Algorithm --</option>
                    <option>GENIE3</option>
                    <option>GRNBoost2</option>
                    <option>Pearson</option>
                    <option>Spearman</option>
                    <option>ARACNE</option>
                    <option>SINGE</option>
                    <option>GRNVBEM</option>
                    <option>GRISLI</option>
                    <option>SCODE</option>
                    <option>SCNS</option>
                    <option>LEAP</option>
                    <option>Arboreto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Algorithm Version</label>
                  <input
                    type="text"
                    placeholder="e.g., 1.2.0"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    value={jobConfig.algorithmVersion}
                    onChange={(e) =>
                      setJobConfig({ ...jobConfig, algorithmVersion: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Run Name <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Optional custom name"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    value={jobConfig.runName}
                    onChange={(e) =>
                      setJobConfig({ ...jobConfig, runName: e.target.value })
                    }
                  />
                </div>
                <button
                  disabled={!isJobValid}
                  onClick={() => {
                    if (!jobConfig.dataset) {
                      alert("Please select a dataset before running the job.");
                      return;
                    }
                    if (!isJobValid) return; // safety guard

                    const runId =
                      "RUN-" + (runsHistory.length + 1).toString().padStart(3, "0");

                    const newRun = {
                      id: runId,
                      name: jobConfig.runName || "Untitled_Run",
                      dataset: jobConfig.dataset,
                      algorithm: jobConfig.algorithm,
                      status: "completed",
                      timestamp: "now",
                    };

                    setRunsHistory([newRun, ...runsHistory]);
                    setPipelineStep("comparison");
                  }}
                  className={`mt-4 px-4 py-2 rounded-lg text-white
                    ${
                      isJobValid
                        ? "bg-primary hover:opacity-90"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  Run Job →
                </button>



                <div>
                  <label className="block text-sm font-medium mb-3">Evaluation Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-sm">Generate PR/ROC curves</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-sm">Calculate early precision</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm">Motif enrichment analysis</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Format & Recent Jobs */}
          <div id="formats" className="space-y-4">
            {/* Expected Format */}
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Expected File Format</h2>
                <button className="flex items-center gap-2 text-sm text-primary hover:underline" onClick={downloadTemplate}>
                  {/* <button
                    onClick={downloadTemplate}
                    className="text-indigo-600 underline text-sm"
                  >
                    Download Template
                  </button> */}

                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>
              <div className="rounded-lg bg-muted p-4 font-mono text-xs overflow-x-auto">
                <div className="text-secondary"># Gene Regulatory Network Predictions</div>
                <div className="text-secondary"># Format: source_gene target_gene confidence_score</div>
                <div className="mt-2 text-primary">
                  <div>Gene   TF         Importance_score</div>
                  <div>OCT4   SOX2       0.923</div>
                  <div>NANOG  OCT4       0.893</div>
                  <div>ESRRA  POU5F1     0.832</div>
                  <div>E2F4   E2F2       0.812</div>
                  <div>SOX2   MYC        0.796</div>
                  <div>NANOG  DPPA3      0.789</div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded bg-accent/50 border">
                <h3 className="font-semibold text-sm mb-2">File Requirements:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tab-separated or comma-separated values</li>
                  <li>• Three columns: source gene, target gene, confidence score</li>
                  <li>• Score range 0.0 to 1.0</li>
                  <li>• Gene names must match dataset identifiers</li>
                </ul>
              </div>
            </div>

            {/* Recent Jobs */}
            <div id='recent' className="p-6 rounded-lg border bg-card">
              <h2 className="font-semibold mb-4">Recent Jobs</h2>
              <div className="space-y-3">

                {runsHistory.map(job => (
                  <div key={job.id} className="p-3 rounded-lg border bg-accent/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            job.status === 'completed'
                              ? 'bg-secondary'
                              : job.status === 'failed'
                              ? 'bg-destructive'
                              : 'bg-primary'
                          }`}
                        />
                        <span className="font-medium text-sm">{job.id}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{job.timestamp}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{job.name}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {job.dataset} Submitted For Validation
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-medium ${
                          job.status === 'completed'
                            ? 'bg-secondary/10 text-secondary'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}

                {recentJobs.map((job) => (
                  <div key={job.id} className="p-3 rounded-lg border bg-accent/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            job.status === 'completed'
                              ? 'bg-secondary'
                              : job.status === 'failed'
                              ? 'bg-destructive'
                              : 'bg-primary'
                          }`}
                        />
                        <span className="font-medium text-sm">{job.id}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{job.timestamp}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{job.name}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">
                        {job.dataset}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-medium ${
                          job.status === 'completed'
                            ? 'bg-secondary/10 text-secondary'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
