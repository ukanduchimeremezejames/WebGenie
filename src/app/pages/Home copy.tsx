import { Link } from 'react-router-dom';
// import { ArrowRight, Network, BarChart3, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  BarChart3, 
  Network, 
  Upload, 
  GitCompare, 
  LineChart, 
  Users, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2,
  Activity,
  Cpu,
  TrendingUp,
  FileText,
  Code,
  GraduationCap,
  Microscope,
  Zap,
  Eye,
  Download,
  Shield
} from 'lucide-react';
import { Button } from './Button';

export function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Curated Dataset Catalog',
      description: 'Access standardized BEELINE datasets with comprehensive metadata, organism info, and sample counts'
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Comprehensive Algorithm Support',
      description: 'Benchmark 18+ GRN inference algorithms including GENIE3, PIDC, SINCERITIES, and GRNBoost2'
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: 'Interactive PR/ROC Visualization',
      description: 'Explore precision-recall and ROC curves with interactive tooltips and multi-algorithm overlays'
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: 'Top-K Network Explorer',
      description: 'Visualize inferred gene regulatory networks with force-directed layouts and edge filtering'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Traceable Run History',
      description: 'Track all benchmarking runs with version control, parameters, and reproducible results'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Exportable Reports & Metrics',
      description: 'Export comprehensive CSV reports and publication-ready figures with full metric breakdowns'
    }
  ];

  const workflowSteps = [
    {
      number: '01',
      title: 'Upload/Select Dataset',
      description: 'Choose from curated BEELINE datasets or upload your own expression data and ground truth network',
      icon: <Upload className="w-8 h-8" />
    },
    {
      number: '02',
      title: 'Run Algorithms',
      description: 'Select inference algorithms to benchmark and configure parameters for your analysis',
      icon: <Cpu className="w-8 h-8" />
    },
    {
      number: '03',
      title: 'Compute Metrics',
      description: 'Automatically calculate AUPRC, AUROC, EPR, and other performance metrics against ground truth',
      icon: <TrendingUp className="w-8 h-8" />
    },
    {
      number: '04',
      title: 'Compare Results',
      description: 'Visualize side-by-side algorithm comparisons with interactive charts and statistical analysis',
      icon: <GitCompare className="w-8 h-8" />
    },
    {
      number: '05',
      title: 'Visualize Networks',
      description: 'Explore inferred GRNs with interactive graph visualization and export results for publications',
      icon: <Network className="w-8 h-8" />
    }
  ];

  const targetAudience = [
    {
      icon: <Microscope className="w-8 h-8" />,
      title: 'Computational Biologists',
      description: 'Evaluate and select the best GRN inference methods for your research questions'
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Bioinformatics Researchers',
      description: 'Benchmark new algorithms against established methods with standardized datasets'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Algorithm Developers',
      description: 'Test and validate your new GRN inference methods with comprehensive metrics'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Graduate Students',
      description: 'Learn about network inference methods through hands-on experimentation and visualization'
    }
  ];

  const quickLinks = [
    {
      title: 'Launch App',
      description: 'Start benchmarking algorithms now',
      icon: <Zap className="w-5 h-5" />,
      action: () => navigate('/dashboard'),
      variant: 'primary' as const
    },
    {
      title: 'Browse Datasets',
      description: 'Explore available BEELINE datasets',
      icon: <Database className="w-5 h-5" />,
      action: () => navigate('/datasets'),
      variant: 'secondary' as const
    },
    {
      title: 'View Documentation',
      description: 'Read API docs and tutorials',
      icon: <BookOpen className="w-5 h-5" />,
      action: () => window.open('#', '_blank'),
      variant: 'secondary' as const
    },
    {
      title: 'Upload Predictions',
      description: 'Submit your algorithm results',
      icon: <Upload className="w-5 h-5" />,
      action: () => navigate('/upload'),
      variant: 'secondary' as const
    }
  ];

  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      
      <section className="relative overflow-hidden border-b">
        <div className="container px-4 py-24 grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Benchmark Gene Regulatory
              <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Network Inference
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              BEELINE provides a comprehensive benchmarking framework for evaluating
              gene regulatory network inference algorithms on single-cell data.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/datasets"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Browse Datasets
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                {/* Network Visualization Preview */}
                <div className="relative h-[400px] flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 400 400">
                    {/* Central node */}
                    <circle cx="200" cy="200" r="20" fill="var(--color-primary)" opacity="0.9" />
                    
                    {/* Surrounding nodes and edges */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                      const angle = (i * Math.PI * 2) / 8;
                      const x = 200 + Math.cos(angle) * 120;
                      const y = 200 + Math.sin(angle) * 120;
                      return (
                        <g key={i}>
                          <line
                            x1="200"
                            y1="200"
                            x2={x}
                            y2={y}
                            stroke="var(--color-accent)"
                            strokeWidth="2"
                            opacity="0.4"
                          />
                          <circle cx={x} cy={y} r="12" fill="var(--color-accent)" opacity="0.8" />
                        </g>
                      );
                    })}
                    
                    {/* Outer ring nodes */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
                      const angle = (i * Math.PI * 2) / 12;
                      const x = 200 + Math.cos(angle) * 180;
                      const y = 200 + Math.sin(angle) * 180;
                      return (
                        <circle key={`outer-${i}`} cx={x} cy={y} r="8" fill="var(--color-blue)" opacity="0.6" />
                      );
                    })}
                  </svg>
                  
                  {/* Floating metric cards */}
                  <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                    <div className="text-xs text-gray-500">AUPRC</div>
                    <div className="font-semibold text-green-600">0.847</div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
                    <div className="text-xs text-gray-500">AUROC</div>
                    <div className="font-semibold text-purple-600">0.923</div>
                  </div>
                </div>
              </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-b">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Network className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Network Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Interactive visualization and analysis of gene regulatory networks
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Performance Metrics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive evaluation with AUROC, AUPRC, and custom metrics
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Processing</h3>
              <p className="text-sm text-muted-foreground">
                Optimized algorithms for quick benchmarking and comparison
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Reproducible</h3>
              <p className="text-sm text-muted-foreground">
                Standardized protocols ensure consistent and reproducible results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Preview Section */}
      <section className="py-20 border-b">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Benchmarking Tools
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-4">Algorithm Comparison</h3>
                <div className="h-48 rounded bg-muted flex items-center justify-center">
                  <BarChart3 className="w-16 h-16 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Compare multiple algorithms side-by-side with detailed performance metrics
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold mb-4">Network Visualization</h3>
                <div className="h-48 rounded bg-muted flex items-center justify-center">
                  <Network className="w-16 h-16 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Explore predicted networks with interactive force-directed layouts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Get Started</h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Browse Datasets</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore our curated collection of single-cell RNA-seq datasets across
                    multiple organisms
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Upload Predictions</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your algorithm's predictions using our standardized file format
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Compare & Analyze</h3>
                  <p className="text-sm text-muted-foreground">
                    View comprehensive metrics and compare your results against established
                    baselines
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Upload Your Predictions
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>© 2026 WebGenie | Built on the BEELINE Platform. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="https://github.com/Murali-group/Beeline" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="https://github.com/ukanduchimeremezejames/WebgenieDark" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
