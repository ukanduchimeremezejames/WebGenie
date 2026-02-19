import fs from "fs";
import path from "path";
import readline from "readline";
import { buildBeelineDataset } from "./utils/buildBeelineDataset"; // adjust path if needed

interface BeelineEdge {
  source: string;
  target: string;
  type: "activation" | "repression";
}

// ------------------
// Convert CSV → JSON
// ------------------
async function convertBeelineCsv(csvFilePath: string, jsonOutputPath: string) {
  const edges: BeelineEdge[] = [];

  const fileStream = fs.createReadStream(csvFilePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let isHeader = true;
  for await (const line of rl) {
    if (isHeader) { isHeader = false; continue; }
    if (!line.trim()) continue;

    const [gene1, gene2, type] = line.split(",");
    edges.push({
      source: gene1.trim(),
      target: gene2.trim(),
      type: type.trim() === "+" ? "activation" : "repression"
    });
  }

  fs.writeFileSync(jsonOutputPath, JSON.stringify(edges, null, 2));
  console.log(`✅ Converted: ${path.basename(csvFilePath)} → ${path.basename(jsonOutputPath)}`);
  return edges;
}

// ------------------
// Generate datasets.ts
// ------------------
function generateDatasetsTs(entries: { id: string; name: string; organism: string; description: string; fileName: string; }[], outputPath: string) {
  const lines: string[] = [];
  lines.push(`import { buildBeelineDataset } from "@/utils/buildBeelineDataset";`);

  // Imports
  for (const e of entries) {
    lines.push(`import ${e.id} from "./json/${e.fileName}";`);
  }
  lines.push("");
  lines.push("const datasets = [");

  for (const e of entries) {
    lines.push(`  {`);
    lines.push(`    id: "${e.id}",`);
    lines.push(`    name: "${e.name}",`);
    lines.push(`    organism: "${e.organism}",`);
    lines.push(`    description: "${e.description}",`);
    lines.push(`    ...buildBeelineDataset(${e.id})`);
    lines.push(`  },`);
  }

  lines.push("];");
  lines.push("");
  lines.push("export default datasets;");

  fs.writeFileSync(outputPath, lines.join("\n"));
  console.log(`✅ Generated datasets.ts at ${outputPath}`);
}

// ------------------
// Main
// ------------------
async function main() {
  const inputDir = path.join(__dirname, "csv");
  const outputDir = path.join(__dirname, "json");
  const datasetsTsPath = path.join(__dirname, "datasets.ts");

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const csvFiles = fs.readdirSync(inputDir).filter(f => f.endsWith(".csv"));

  // Metadata: You can adjust these per dataset
  const metadataMap: Record<string, { name: string; organism: string; description: string }> = {
    "dyn-BFC.csv": { name: "dyn-BFC", organism: "Synthetic", description: "Bifurcating-Converging synthetic GRN" },
    "dyn-BF.csv": { name: "dyn-BF", organism: "Synthetic", description: "Bifurcating synthetic GRN" },
    "dyn-CY.csv": { name: "dyn-CY", organism: "Synthetic", description: "Cyclic synthetic GRN" },
    "dyn-LI.csv": { name: "dyn-LI", organism: "Synthetic", description: "Linear synthetic GRN" },
    "dyn-LL.csv": { name: "dyn-LL", organism: "Synthetic", description: "Long linear synthetic GRN with terminal feedback repression" },
    "dyn-TF.csv": { name: "dyn-TF", organism: "Synthetic", description: "Synthetic transcription factor hub network" },
    "mCAD.csv": { name: "mCAD", organism: "Mouse", description: "Mouse cortical arealization gene regulatory network" },
    "VSC.csv": { name: "VSC", organism: "Mouse", description: "Ventral spinal cord gene regulatory network" },
    "HSC.csv": { name: "HSC", organism: "Mouse", description: "Hematopoietic stem cell gene regulatory network" },
    "GSD.csv": { name: "GSD", organism: "Human", description: "Gonadal sex determination gene regulatory network" }
  };

  const entries: { id: string; name: string; organism: string; description: string; fileName: string }[] = [];

  for (const file of csvFiles) {
    const id = path.basename(file, ".csv").replace(/-/g, "").toLowerCase();
    const outputJson = path.join(outputDir, file.replace(".csv", ".json"));
    await convertBeelineCsv(path.join(inputDir, file), outputJson);

    const meta = metadataMap[file] ?? { name: id, organism: "Unknown", description: "" };
    entries.push({ id, name: meta.name, organism: meta.organism, description: meta.description, fileName: path.basename(outputJson) });
  }

  generateDatasetsTs(entries, datasetsTsPath);
}

main().catch(console.error);
