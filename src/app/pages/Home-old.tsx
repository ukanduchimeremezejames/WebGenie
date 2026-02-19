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
  Download
} from 'lucide-react';
import { Button } from './Button';

export function LandingPage() {
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-green-50">
        <div className="max-w-[1400px] mx-auto px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm mb-6">
                <CheckCircle2 className="w-4 h-4" />
                Research-grade benchmarking platform
              </div>
              
              <h1 className="text-gray-900 mb-6">
                GENEVAL Benchmarking & Visualization Platform
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Benchmark and visualize gene regulatory network (GRN) inference algorithms using curated BEELINE datasets and interactive analytics.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <Button 
                  variant="primary" 
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => navigate('/dashboard')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  icon={<BookOpen className="w-5 h-5" />}
                  onClick={() => window.open('#', '_blank')}
                >
                  Explore Documentation
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                Cloud-ready, reproducible benchmarking powered by research-grade metrics.
              </p>
            </div>
            
            {/* Right: Illustration */}
            <div className="relative">
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
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-gray-900 mb-4">What GENEVAL Does</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              A unified environment for evaluating, comparing, and visualizing the performance of gene regulatory network (GRN) inference algorithms.
            </p>
            <p className="text-gray-600">
              Benchmarking network inference typically requires manual data processing, inconsistent metrics, and fragmented tooling. BEELINE standardizes and automates this entire workflow through an intuitive web interface.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-100">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Standardized Datasets</h3>
              <p className="text-gray-600">
                Curated collection of BEELINE benchmark datasets with ground truth networks, expression data, and metadata.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-xl border border-green-100">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Rich Performance Metrics</h3>
              <p className="text-gray-600">
                Comprehensive evaluation using AUPRC, AUROC, Early Precision, and custom threshold-based metrics.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-100">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Interactive Visualizations</h3>
              <p className="text-gray-600">
                Explore results through dynamic charts, network graphs, and side-by-side algorithm comparisons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to benchmark and analyze GRN inference algorithms in one integrated platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Five simple steps from data to insights
            </p>
          </div>
          
          <div className="relative">
            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
                    <div className="text-purple-600 mb-4">{step.icon}</div>
                    <div className="text-sm text-purple-600 mb-2">{step.number}</div>
                    <h4 className="text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow connector */}
                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-purple-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Visual Preview</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the platform's powerful visualization and analysis tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview Card 1 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                <Database className="w-16 h-16 text-purple-400" />
              </div>
              <div className="p-6">
                <h4 className="text-gray-900 mb-2">Dataset Detail Page</h4>
                <p className="text-sm text-gray-600">
                  Comprehensive metadata, quality metrics, and visualization of expression distributions
                </p>
              </div>
            </div>
            
            {/* Preview Card 2 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <LineChart className="w-16 h-16 text-green-400" />
              </div>
              <div className="p-6">
                <h4 className="text-gray-900 mb-2">Comparison Dashboard</h4>
                <p className="text-sm text-gray-600">
                  Interactive PR/ROC curves with multi-algorithm overlays and metric breakdowns
                </p>
              </div>
            </div>
            
            {/* Preview Card 3 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <Network className="w-16 h-16 text-blue-400" />
              </div>
              <div className="p-6">
                <h4 className="text-gray-900 mb-2">Network Explorer</h4>
                <p className="text-sm text-gray-600">
                  Interactive force-directed graph with Top-K filtering and edge weight visualization
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Who It's For</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for researchers and developers across the bioinformatics community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetAudience.map((audience, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mx-auto mb-4">
                  {audience.icon}
                </div>
                <h4 className="text-gray-900 mb-2">{audience.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started / Quick Links Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-green-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 mb-4">Getting Started</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your path and start exploring GENEVAL today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                onClick={link.action}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                    {link.icon}
                  </div>
                  <h4 className="text-gray-900">{link.title}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {link.description}
                </p>
                <div className="flex items-center gap-2 text-purple-600 text-sm group-hover:gap-3 transition-all">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Branding */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white">GENEVAL</div>
                  <div className="text-xs text-gray-400">Benchmarking Platform</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Research-grade GRN inference benchmarking and visualization
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h5 className="text-white mb-4">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Datasets</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Algorithms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Upload</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h5 className="text-white mb-4">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Publications</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h5 className="text-white mb-4">Contact</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cite GENEVAL</a></li>
                <li><a href="#" className="hover:text-white transition-colors">License</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2025 GENEVAL Platform. Licensed under MIT.</p>
            <p className="flex items-center gap-2">
              <span>Powered by</span>
              <span className="text-purple-400">BEELINE</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
