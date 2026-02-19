import { Upload as UploadIcon, FileText, CheckCircle, Clock, AlertCircle, Download, Activity } from 'lucide-react';

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
    algorithm: 'SINCERITIES',
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
            {pipelineSteps.map((step, index) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                      step.status === 'active'
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium">{step.label}</div>
                </div>
                {index < pipelineSteps.length - 1 && (
                  <div className="flex-1 h-px bg-border mx-4 mt-[-20px]"></div>
                )}
              </div>
            ))}
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
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                  Choose File
                </button>
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
                  <select className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>BEELINE_Synthetic_100</option>
                    <option>mESC_hematopoietic</option>
                    <option>hESC_definitive_endoderm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Algorithm</label>
                  <select className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>SINCERITIES</option>
                    <option>GENIE3</option>
                    <option>GRNBoost2</option>
                    <option>SCENIC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Algorithm Version</label>
                  <input
                    type="text"
                    placeholder="e.g., 1.2.0"
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
                  />
                </div>

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
                <button className="flex items-center gap-2 text-sm text-primary hover:underline">
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

            {/* Result Traceability */}
            <div id="report" className="p-6 rounded-lg border bg-card">
              <h2 className="font-semibold mb-4">Result Traceability</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Every result includes full provenance tracking:
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-1 bg-primary rounded"></div>
                  <div>
                    <div className="font-medium text-primary mb-1">Dataset Version</div>
                    <div className="text-muted-foreground">HESC_v2.1.0</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 bg-secondary rounded"></div>
                  <div>
                    <div className="font-medium text-secondary mb-1">Algorithm Version</div>
                    <div className="text-muted-foreground">GENIE3 v1.12.0</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 bg-primary rounded"></div>
                  <div>
                    <div className="font-medium mb-1">Parameter Used</div>
                    <div className="text-muted-foreground">nIrees=1000, mtry=sqrt</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold text-sm mb-2">Run Details</h3>
                <button className="text-sm text-primary hover:underline">
                  View full run detail
                </button>
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
