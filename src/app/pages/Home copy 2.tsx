import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import {
  Database,
  BarChart3,
  Network,
  Upload,
  GitCompare,
  LineChart,
  Activity,
  Cpu,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Code,
  GraduationCap,
  Microscope,
  Zap,
  Download,
} from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  /* -------------------- SUBSCRIBE STATE -------------------- */
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_email: email,
          message: "User subscribed to WebGenie updates",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSuccess(true);
      setEmail("");
    } catch {
      setError("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- DATA -------------------- */
  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Curated Dataset Catalog",
      description:
        "Access standardized BEELINE datasets with comprehensive metadata",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Comprehensive Algorithm Support",
      description: "Benchmark 18+ GRN inference algorithms",
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Interactive PR/ROC Visualization",
      description: "Explore precision-recall and ROC curves",
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Top-K Network Explorer",
      description: "Visualize inferred gene regulatory networks",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Traceable Run History",
      description: "Track benchmarking runs with reproducible results",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Exportable Reports",
      description: "Export CSV reports and publication-ready figures",
    },
  ];

  /* -------------------- RENDER -------------------- */
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="py-24 border-b">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold">
              Benchmark Gene Regulatory
              <span className="block text-primary mt-2">
                Network Inference
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              WebGenie provides a comprehensive benchmarking framework for
              evaluating GRN inference algorithms.
            </p>

            <div className="flex gap-4">
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-primary text-white rounded-lg"
              >
                Get Started
              </Link>
              <Link
                to="/datasets"
                className="px-6 py-3 border rounded-lg"
              >
                Browse Datasets
              </Link>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-8 flex items-center justify-center">
            <Network className="w-24 h-24 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 bg-card border rounded-lg"
              >
                <div className="mb-4 text-primary">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white mb-3">WebGenie</h4>
              <p className="text-sm text-gray-400">
                Research-grade GRN benchmarking platform.
              </p>
            </div>

            <div>
              <h5 className="text-white mb-3">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/datasets">Datasets</Link></li>
                <li><Link to="/upload">Upload</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white mb-3">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://ukandu-webgenie-api.hf.space/docs"
                    target="_blank"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* SUBSCRIBE */}
            <div>
              <h5 className="text-white mb-3">Subscribe</h5>
              <p className="text-sm text-gray-400 mb-2">
                Get updates about new datasets and algorithms
              </p>

              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary rounded text-white text-sm disabled:opacity-50"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>

              {success && (
                <p className="text-green-400 text-sm mt-2">
                  ✅ Subscription successful!
                </p>
              )}
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400 flex justify-between">
            <p>© 2026 WebGenie Platform</p>
            <p>Built on BEELINE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}



// import { Link } from 'react-router-dom';
// import emailjs from "@emailjs/browser";
// import { useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import { 
//   Database, 
//   BarChart3, 
//   Network, 
//   Upload, 
//   GitCompare, 
//   LineChart, 
//   Users, 
//   BookOpen, 
//   ArrowRight, 
//   CheckCircle2,
//   Activity,
//   Cpu,
//   TrendingUp,
//   FileText,
//   Code,
//   GraduationCap,
//   Microscope,
//   Zap,
//   Eye,
//   Download,
//   Shield
// } from 'lucide-react';
// import { Button } from './Button';

// export function Home() {
//   const navigate = useNavigate();

//   const features = [
//     {
//       icon: <Database className="w-6 h-6" />,
//       title: 'Curated Dataset Catalog',
//       description: 'Access standardized BEELINE datasets with comprehensive metadata, organism info, and sample counts'
//     },
//     {
//       icon: <Cpu className="w-6 h-6" />,
//       title: 'Comprehensive Algorithm Support',
//       description: 'Benchmark 18+ GRN inference algorithms including GENIE3, PIDC, SINCERITIES, and GRNBoost2'
//     },
//     {
//       icon: <LineChart className="w-6 h-6" />,
//       title: 'Interactive PR/ROC Visualization',
//       description: 'Explore precision-recall and ROC curves with interactive tooltips and multi-algorithm overlays'
//     },
//     {
//       icon: <Network className="w-6 h-6" />,
//       title: 'Top-K Network Explorer',
//       description: 'Visualize inferred gene regulatory networks with force-directed layouts and edge filtering'
//     },
//     {
//       icon: <BarChart3 className="w-6 h-6" />,
//       title: 'Traceable Run History',
//       description: 'Track all benchmarking runs with version control, parameters, and reproducible results'
//     },
//     {
//       icon: <Download className="w-6 h-6" />,
//       title: 'Exportable Reports & Metrics',
//       description: 'Export comprehensive CSV reports and publication-ready figures with full metric breakdowns'
//     },
//     {
//       icon: <Code className="w-6 h-6" />,
//       title: 'Test and Evaluate',
//       description: 'Conduct a systematic evaluation of the strengths, limitations, and context-specific applicability of each gene regulatory algorithm.'
//     },
//     {
//       icon: <Microscope className="w-6 h-6" />,
//       title: 'A web-based preprocessing protocol',
//       description: 'Enabling standardized and reproducible benchmarking of gene regulatory algorithms.'
//     }
//   ];

//   const workflowSteps = [
//     {
//       number: '01',
//       title: 'Upload/Select Dataset',
//       description: 'Choose from curated BEELINE datasets or upload your own expression data and ground truth network',
//       icon: <Upload className="w-8 h-8" />
//     },
//     {
//       number: '02',
//       title: 'Run Algorithms',
//       description: 'Select different inference algorithms to benchmark and configure parameters for your analysis',
//       icon: <Cpu className="w-8 h-8" />
//     },
//     {
//       number: '03',
//       title: 'Compute Metrics',
//       description: 'Automatically calculate AUPRC, AUROC, EPR, and other performance metrics against ground truth',
//       icon: <TrendingUp className="w-8 h-8" />
//     },
//     {
//       number: '04',
//       title: 'Compare Results',
//       description: 'Visualize side-by-side algorithm comparisons with interactive charts and statistical analysis',
//       icon: <GitCompare className="w-8 h-8" />
//     },
//     {
//       number: '05',
//       title: 'Visualize Networks',
//       description: 'Explore inferred GRNs with interactive graph visualization and export results for publications',
//       icon: <Network className="w-8 h-8" />
//     }
//   ];

//   const targetAudience = [
//     {
//       icon: <Microscope className="w-8 h-8" />,
//       title: 'Computational Biologists',
//       description: 'Evaluate and select the best GRN inference methods for your research questions'
//     },
//     {
//       icon: <Activity className="w-8 h-8" />,
//       title: 'Bioinformatics Researchers',
//       description: 'Benchmark new algorithms against established methods with standardized datasets'
//     },
//     {
//       icon: <Code className="w-8 h-8" />,
//       title: 'Algorithm Developers',
//       description: 'Test and validate your new GRN inference methods with comprehensive metrics'
//     },
//     {
//       icon: <GraduationCap className="w-8 h-8" />,
//       title: 'Graduate Students',
//       description: 'Learn about network inference methods through hands-on experimentation and visualization'
//     }
//   ];

//   const quickLinks = [
//     {
//       title: 'Launch App',
//       description: 'Start benchmarking algorithms now',
//       icon: <Zap className="w-5 h-5" />,
//       action: () => navigate('/dashboard'),
//       variant: 'primary' as const
//     },
//     {
//       title: 'Browse Datasets',
//       description: 'Explore available BEELINE datasets',
//       icon: <Database className="w-5 h-5" />,
//       action: () => navigate('/datasets'),
//       variant: 'secondary' as const
//     },
//     {
//       title: 'View Documentation',
//       description: 'Read API docs and tutorials',
//       icon: <BookOpen className="w-5 h-5" />,
//       action: () => window.open('https://ukandu-webgenie-api.hf.space/docs', '_blank'),
//       variant: 'secondary' as const
//     },
//     {
//       title: 'Upload Predictions',
//       description: 'Submit your algorithm results',
//       icon: <Upload className="w-5 h-5" />,
//       action: () => navigate('/upload'),
//       variant: 'secondary' as const
//     }
//   ];

//   export function SubscribeBox() {
//     const [email, setEmail] = useState("");
// const [loading, setLoading] = useState(false);
// const [success, setSuccess] = useState(false);
// const [error, setError] = useState("");

// const handleSubscribe = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setError("");
//   setSuccess(false);

//   if (!email) {
//     setError("Please enter a valid email");
//     return;
//   }

//   setLoading(true);

//   try {
//     await emailjs.send(
//       import.meta.env.VITE_EMAILJS_SERVICE_ID,
//       import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
//       {
//         from_email: email,
//         message: "User subscribed to WebGenie updates",
//       },
//       import.meta.env.VITE_EMAILJS_PUBLIC_KEY
//     );

//     setSuccess(true);
//     setEmail("");
//   } catch {
//     setError("Subscription failed. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };

//   // const [email, setEmail] = useState("");
//   // const [loading, setLoading] = useState(false);
//   // const [success, setSuccess] = useState(false);
//   // const [error, setError] = useState("");

//   // const handleSubscribe = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setError("");
//   //   setSuccess(false);

//   //   if (!email) {
//   //     setError("Please enter a valid email");
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     await emailjs.send(
//   //       "webgenie",
//   //       "webgenie_tmp",
//   //       {
//   //         from_email: email,
//   //         message: "User subscribed to WebGenie updates",
//   //       },
//   //       "NR1KjnKUJnOpPjzLm"
//   //     );

//   //     setSuccess(true);
//   //     setEmail("");
//   //   } catch (err) {
//   //     setError("Subscription failed. Please try again.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   // ---- Start Rendering ----
//   return (
//     <div className="min-h-screen">

//       {/* -------------------- Original Home Hero -------------------- */}
//       <section className="relative overflow-hidden border-b">
//         <div className="mx-auto container px-4 py-24 grid md:grid-cols-1 lg:grid-cols-2 gap-12">
//   {/* Left: Intro + Steps */}
//   <div className="max-w-3xl mx-auto text-center lg:text-left space-y-8">
//     <h1 className="text-5xl font-bold mb-6">
//       Benchmark Gene Regulatory
//       <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//         Network Inference
//       </span>
//     </h1>
//     <p className="text-xl text-muted-foreground dark:text-muted-foreground-dark mb-8">
//       <strong>WebGenie</strong> provides a comprehensive benchmarking framework for evaluating
//       gene regulatory network inference algorithms on single-cell data.
//     </p>

//     {/* Cards Section: 3 cards in a row on lg screens */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {[
//         {
//           title: 'Browse Datasets',
//           description: 'Explore our curated collection of single-cell RNA-seq datasets across multiple organisms',
//         },
//         {
//           title: 'Upload Predictions',
//           description: 'Submit your algorithm\'s predictions using our standardized file format',
//         },
//         {
//           title: 'Compare & Analyze',
//           description: 'View comprehensive metrics and compare your results against established baselines',
//         },
//       ].map((item, idx) => (
//         <div
//           key={idx}
//           className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
//         >
//           <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
//             {idx + 1}
//           </div>
//           <h3 className="font-semibold text-lg mb-2 text-foreground dark:text-foreground-dark">{item.title}</h3>
//           <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">{item.description}</p>
//         </div>
//       ))}
//     </div>

//     {/* Action Buttons */}
//     {/* <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8"> */}
//     <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">

//       <Link
//         to="/dashboard"
//         className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
//       >
//         Get Started
//         <ArrowRight className="w-4 h-4" />
//       </Link>
//       <Link
//         to="/datasets"
//         className="inline-flex items-center gap-2 px-6 py-3 border border-border dark:border-border-dark rounded-lg hover:bg-accent dark:hover:bg-accent-dark transition-colors"
//       >
//         Browse Datasets
//       </Link>
//     </div>
//   </div>

//   {/* Right: Network Visualization */}
//   <div className="bg-card dark:bg-card-dark rounded-2xl shadow-2xl p-8 border border-border dark:border-border-dark">
//     <div className="relative h-[400px] flex items-center justify-center">
//       <svg width="100%" height="100%" viewBox="0 0 400 400">
//         <circle cx="200" cy="200" r="20" fill="var(--color-primary)" opacity="0.9" />
//         {[0,1,2,3,4,5,6,7].map((i) => {
//           const angle = (i * Math.PI * 2) / 8;
//           const x = 200 + Math.cos(angle) * 120;
//           const y = 200 + Math.sin(angle) * 120;
//           return (
//             <g key={i}>
//               <line x1="200" y1="200" x2={x} y2={y} stroke="var(--color-accent)" strokeWidth="2" opacity="0.4" />
//               <circle cx={x} cy={y} r="12" fill="var(--color-accent)" opacity="0.8" />
//             </g>
//           );
//         })}
//         {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => {
//           const angle = (i * Math.PI * 2) / 12;
//           const x = 200 + Math.cos(angle) * 180;
//           const y = 200 + Math.sin(angle) * 180;
//           return <circle key={`outer-${i}`} cx={x} cy={y} r="8" fill="var(--color-blue)" opacity="0.6" />;
//         })}
//       </svg>

//       <div className="absolute top-4 right-4 bg-card dark:bg-card-dark px-3 py-2 rounded-lg shadow-lg border border-border dark:border-border-dark">
//         <div className="text-xs text-muted-foreground dark:text-muted-foreground-dark">AUPRC</div>
//         <div className="font-semibold text-green-600 dark:text-green-400">0.847</div>
//       </div>

//       <div className="absolute bottom-4 left-4 bg-card dark:bg-card-dark px-3 py-2 rounded-lg shadow-lg border border-border dark:border-border-dark">
//         <div className="text-xs text-muted-foreground dark:text-muted-foreground-dark">AUROC</div>
//         <div className="font-semibold text-purple-600 dark:text-purple-400">0.923</div>
//       </div>
//     </div>
//   </div>
// </div>

//       </section>

//       {/* -------------------- Features Section -------------------- */}
//       <section className="py-20 border-b">
//         <div className="container px-4 mx-auto">
//           <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((f, idx) => (
//               <div key={idx} className="p-6 rounded-lg border bg-card">
//                 <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
//                   {f.icon}
//                 </div>
//                 <h3 className="font-semibold mb-2">{f.title}</h3>
//                 <p className="text-sm text-muted-foreground">{f.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* -------------------- Visual Preview Section -------------------- */}
//       <section className="py-20 border-b">
//         <div className="container px-4 mx-auto">
//           <div className="max-w-5xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12">
//               Powerful Benchmarking Tools
//             </h2>
//             <div className="grid md:grid-cols-2 gap-8">
//               <div className="rounded-lg border bg-card p-6">
//                 <h3 className="font-semibold mb-4">Algorithm Comparison</h3>
//                 <div className="h-48 rounded bg-muted flex items-center justify-center">
//                   <BarChart3 className="w-16 h-16 text-muted-foreground" />
//                 </div>
//                 <p className="text-sm text-muted-foreground mt-4">
//                   Compare multiple algorithms side-by-side with detailed performance metrics
//                 </p>
//               </div>
//               <div className="rounded-lg border bg-card p-6">
//                 <h3 className="font-semibold mb-4">Network Visualization</h3>
//                 <div className="h-48 rounded bg-muted flex items-center justify-center">
//                   <Network className="w-16 h-16 text-muted-foreground" />
//                 </div>
//                 <p className="text-sm text-muted-foreground mt-4">
//                   Explore predicted networks with interactive force-directed layouts
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* -------------------- Getting Started Section -------------------- */}
//       <section className="py-20 mx-auto border-b">
//         <div className="container px-4 mx-auto">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-3xl font-bold text-center mb-12">Get Started</h2>
//             {/* Cards Section: 3 cards in a row on lg screens */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {[
//         {
//           title: 'Browse Datasets',
//           description: 'Explore our curated collection of single-cell RNA-seq datasets across multiple organisms',
//         },
//         {
//           title: 'Upload Predictions',
//           description: 'Submit your algorithm\'s predictions using our standardized file format',
//         },
//         {
//           title: 'Compare & Analyze',
//           description: 'View comprehensive metrics and compare your results against established baselines',
//         },
//       ].map((item, idx) => (
//         <div
//           key={idx}
//           className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
//         >
//           <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
//             {idx + 1}
//           </div>
//           <h3 className="font-semibold text-lg mb-2 text-foreground dark:text-foreground-dark">{item.title}</h3>
//           <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">{item.description}</p>
//         </div>
//       ))}
//     </div>
//             <div className="mt-12 text-center">
//               <Link
//                 to="/upload"
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
//               >
//                 Upload Your Predictions
//                 <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>
// {/* How It Works Section */}
// <section className="py-20 bg-background dark:bg-background-dark">
//   <div className="max-w-[1400px] mx-auto px-8">
//     <div className="text-center mb-16">
//       <h2 className="text-foreground dark:text-foreground-dark mb-4">How It Works</h2>
//       <p className="text-xl text-muted-foreground dark:text-muted-foreground-dark max-w-2xl mx-auto">
//         Five simple steps from data to insights
//       </p>
//     </div>
    
//     <div className="relative">
//       {/* Workflow Steps */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
//         {workflowSteps.map((step, idx) => (
//           <div key={idx} className="relative">
//             <div className="bg-card dark:bg-card-dark border-2 border-border dark:border-border-dark rounded-xl p-6 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
//               <div className="text-purple-600 dark:text-purple-400 mb-4">{step.icon}</div>
//               <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">{step.number}</div>
//               <h4 className="text-foreground dark:text-foreground-dark mb-2">{step.title}</h4>
//               <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
//                 {step.description}
//               </p>
//             </div>
            
//             {/* Arrow connector */}
//             {idx < workflowSteps.length - 1 && (
//               <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
//                 <ArrowRight className="w-6 h-6 text-purple-300 dark:text-purple-500" />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// </section>

// {/* -------------------- APPENDED LANDINGPAGE CONTENT -------------------- */}
// <section className="py-20 bg-background dark:bg-background-dark">
//   <div className="max-w-[1400px] mx-auto px-8">
//     <div className="text-center mb-16">
//       <h2 className="text-foreground dark:text-foreground-dark mb-4">Who It's For</h2>
//       <p className="text-xl text-muted-foreground dark:text-muted-foreground-dark max-w-2xl mx-auto">
//         Built for researchers and developers across the bioinformatics community
//       </p>
//     </div>
    
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {targetAudience.map((audience, idx) => (
//         <div key={idx} className="text-center p-6 bg-card dark:bg-card-dark rounded-lg">
//           <div className="w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-300 mx-auto mb-4">
//             {audience.icon}
//           </div>
//           <h4 className="text-foreground dark:text-foreground-dark mb-2">{audience.title}</h4>
//           <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark leading-relaxed">
//             {audience.description}
//           </p>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>

// <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-green-50 dark:from-purple-900/20 dark:via-background-dark dark:to-green-900/20">
//   <div className="max-w-[1400px] mx-auto px-8">
//     <div className="text-center mb-16">
//       <h2 className="text-foreground dark:text-foreground-dark mb-4">Getting To Know More</h2>
//       <p className="text-xl text-muted-foreground dark:text-muted-foreground-dark max-w-2xl mx-auto">
//         Choose your path and start exploring WebGenie today
//       </p>
//     </div>
    
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {quickLinks.map((link, idx) => (
//         <div 
//           key={idx} 
//           className="bg-card dark:bg-card-dark p-6 rounded-xl border border-border dark:border-border-dark hover:shadow-lg transition-all cursor-pointer group"
//           onClick={link.action}
//         >
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-800 transition-colors">
//               {link.icon}
//             </div>
//             <h4 className="text-foreground dark:text-foreground-dark">{link.title}</h4>
//           </div>
//           <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark mb-4">
//             {link.description}
//           </p>
//           <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 text-sm group-hover:gap-3 transition-all">
//             <span>Get started</span>
//             <ArrowRight className="w-4 h-4" />
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// </section>


//       {/* -------------------- LANDINGPAGE FOOTER -------------------- */}
//       <footer className="bg-gray-900 text-gray-300 py-12">
//         <div className="max-w-[1400px] mx-auto px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
//                   <Activity className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <div className="text-white">WebGenie</div>
//                   <div className="text-xs text-gray-400">Benchmarking Platform</div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-400 leading-relaxed">
//                 Research-grade GRN inference benchmarking and visualization for evaluating
//               gene regulatory network inference algorithms on single-cell data.
//               </p>
//             </div>
            
//             <div  className='ml-30'>
//               <h5 className="text-white mb-4">Platform</h5>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
//                 <li><a href="/datasets" className="hover:text-white transition-colors">Datasets</a></li>
//                 <li><a href="/compare" className="hover:text-white transition-colors">Algorithms</a></li>
//                 <li><a href="/upload" className="hover:text-white transition-colors">Upload</a></li>
//               </ul>
//             </div>
            
            
//             <div className='ml-30'>
//               <h5 className="text-white mb-4">Resources</h5>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="https://ukandu-webgenie-api.hf.space/docs" className="hover:text-white transition-colors">Documentation</a></li>
//                 <li><a href="https://github.com/Murali-group/Beeline" className="hover:text-white transition-colors">GitHub</a></li>
//                 <li><a href="https://github.com/ukanduchimeremezejames/WebgenieDark" className="hover:text-white transition-colors">Contact</a></li>
//               </ul>
//             </div>
            
//             {/* <div>
//               <h5 className="text-white mb-4">Subscribe</h5>
//               <p className="text-sm text-gray-400 mb-2">Get updates about new datasets and algorithms</p>
//               <form className="flex gap-2">
//                 <input type="email" placeholder="Email" className="flex-1 p-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm" />
//                 <button type="submit" className="px-4 py-2 bg-primary rounded-lg text-white text-sm hover:bg-purple-700 transition-colors">Subscribe</button>
//               </form>
//             </div> */}
//             <div>
//               <h5 className="text-white mb-4">Subscribe</h5>
//               <p className="text-sm text-gray-400 mb-2">
//                 Get updates about new datasets and algorithms
//               </p>

//               <form onSubmit={handleSubscribe} className="flex gap-2">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email"
//                   required
//                   className="flex-1 p-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm"
//                 />

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-primary rounded-lg text-white text-sm hover:bg-purple-700 transition-colors disabled:opacity-50"
//                 >
//                   {loading ? "Subscribing..." : "Subscribe"}
//                 </button>
//               </form>

//               {success && (
//                 <p className="text-sm text-green-400 mt-2">
//                   ✅ Subscription successful!
//                 </p>
//               )}

//               {error && (
//                 <p className="text-sm text-red-400 mt-2">
//                   {error}
//                 </p>
//               )}
//             </div>
//           </div>
          
//           {/* <div className="border-t border-gray-700 pt-6 text-center text-sm">
//             © 2026 WebGenie | Built on the BEELINE Platform. All rights reserved.
//           </div> */}
//           <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
//             <p>© 2026 WebGenie Platform. Licensed under MIT. All rights reserved.</p>
//             <p className="flex items-center gap-2">
//               <span>Built upon the </span>
//               <span className="text-primary">BEELINE</span>
//               <span> GRN Benchmarking Platform </span>
//             </p>
//           </div>
//         </div>
//       </footer>

//     </div>
//   );
// }
