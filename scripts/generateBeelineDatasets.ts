import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const RAW_DIR = path.join(__dirname, "../src/data/beeline/raw");
const OUTPUT_DIR = path.join(__dirname, "../src/data/beeline/processed");
const META_OUTPUT = path.join(__dirname, "../src/data/beelineDatasets.ts");

interface DatasetMeta {
  id: string;
  name: string;
  organism: string;
  type: string;
  genes: number;
  cells: number;
  edges: number;
  source: "benchmark";
  lastUpdated: string;
  nodesFile: string;
  edgesFile: string;
  description: string;
  sparsity: number;
}

function computeSparsity(matrix: number[][]): number {
  let zero = 0;
  let total = 0;

  for (const row of matrix) {
    for (const value of row) {
      total++;
      if (Number(value) === 0) zero++;
    }
  }

  return (zero / total) * 100;
}

async function processDatasets() {
  const datasets: DatasetMeta[] = [];

  const folders = fs.readdirSync(RAW_DIR);

  for (const folder of folders) {
    const datasetPath = path.join(RAW_DIR, folder);

    if (!fs.statSync(datasetPath).isDirectory()) continue;

    console.log(`Processing ${folder}...`);

    const expressionPath = path.join(datasetPath, "ExpressionData.csv");
    const groundTruthPath = path.join(datasetPath, "GroundTruth.csv");

    if (!fs.existsSync(expressionPath) || !fs.existsSync(groundTruthPath)) {
      console.warn(`Skipping ${folder} (missing required files)`);
      continue;
    }

    // -------- Parse ExpressionData --------
    const expressionRaw = fs.readFileSync(expressionPath);
    const expressionParsed = parse(expressionRaw, { columns: false });

    const genes = expressionParsed.length;
    const cells = expressionParsed[0].length - 1;

    const expressionMatrix = expressionParsed.map((row: any) =>
      row.slice(1).map(Number)
    );

    const sparsity = computeSparsity(expressionMatrix);

    const geneNames = expressionParsed.map((row: any) => row[0]);

    // -------- Parse GroundTruth --------
    const groundRaw = fs.readFileSync(groundTruthPath);
    const groundParsed = parse(groundRaw, { columns: false });

    const edgesCount = groundParsed.length;

    const edges = groundParsed.map((row: any, i: number) => ({
      data: {
        id: `e${i}`,
        source: row[0],
        target: row[1]
      }
    }));

    const nodes = Array.from(
      new Set(geneNames)
    ).map((gene) => ({
      data: { id: gene }
    }));

    // -------- Save JSON files --------
    const nodesFile = `/data/beeline/processed/${folder}_nodes.json`;
    const edgesFile = `/data/beeline/processed/${folder}_edges.json`;

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${folder}_nodes.json`),
      JSON.stringify(nodes, null, 2)
    );

    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${folder}_edges.json`),
      JSON.stringify(edges, null, 2)
    );

    datasets.push({
      id: folder,
      name: folder,
      organism: "Unknown", // You can enhance this later
      type: "scRNA-seq",
      genes,
      cells,
      edges: edgesCount,
      source: "benchmark",
      lastUpdated: new Date().toISOString().split("T")[0],
      nodesFile,
      edgesFile,
      description: `BEELINE benchmark dataset (${folder})`,
      sparsity: Number(sparsity.toFixed(2))
    });
  }

  // -------- Generate metadata file --------
  const fileContent = `
export const beelineDatasets = ${JSON.stringify(datasets, null, 2)} as const;
`;

  fs.writeFileSync(META_OUTPUT, fileContent);

  console.log("✅ BEELINE datasets generated successfully!");
}

processDatasets();
