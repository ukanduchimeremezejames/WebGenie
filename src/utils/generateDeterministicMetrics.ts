type RocPoint = { fpr: number; tpr: number };
type PrPoint = { recall: number; precision: number };

export type BenchmarkMetrics = {
  auroc: number;
  auprc: number;
  f1: number;
  roc_curve: RocPoint[];
  pr_curve: PrPoint[];
};

/**
 * Deterministic hash → number
 */
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

/**
 * Seeded pseudo-random generator
 */
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

/**
 * Main generator
 */
export function generateDeterministicMetrics(
  datasetId: string
): BenchmarkMetrics {
  const seed = hashString(datasetId);
  const rand = seededRandom(seed);

  // --- Scalar metrics ---
  const auroc = +(0.75 + rand() * 0.2).toFixed(3);
  const auprc = +(0.35 + rand() * 0.4).toFixed(3);
  const f1 = +(0.45 + rand() * 0.25).toFixed(3);

  // --- ROC Curve (monotonic, convex-ish) ---
  const roc_curve: RocPoint[] = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.05, tpr: +(0.55 + rand() * 0.15).toFixed(3) },
    { fpr: 0.15, tpr: +(0.7 + rand() * 0.15).toFixed(3) },
    { fpr: 0.3, tpr: +(0.82 + rand() * 0.12).toFixed(3) },
    { fpr: 0.6, tpr: +(0.9 + rand() * 0.08).toFixed(3) },
    { fpr: 1, tpr: 1 }
  ];

  // --- PR Curve (decreasing precision) ---
  const pr_curve: PrPoint[] = [
    { recall: 0, precision: 1 },
    { recall: 0.2, precision: +(0.85 + rand() * 0.1).toFixed(3) },
    { recall: 0.4, precision: +(0.7 + rand() * 0.1).toFixed(3) },
    { recall: 0.6, precision: +(0.55 + rand() * 0.1).toFixed(3) },
    { recall: 0.8, precision: +(0.4 + rand() * 0.1).toFixed(3) },
    { recall: 1, precision: +(0.25 + rand() * 0.1).toFixed(3) }
  ];

  return {
    auroc,
    auprc,
    f1,
    roc_curve,
    pr_curve,
  };
}
