import fs from "fs";
import path from "path";
import readline from "readline";

interface BeelineEdge {
  source: string;
  target: string;
  type: "activation" | "repression";
}

/**
 * Convert a Beeline CSV file to JSON suitable for Explorer
 * @param csvFilePath Full path to the CSV file
 * @param jsonOutputPath Where to write the JSON file
 */
async function convertBeelineCsv(csvFilePath: string, jsonOutputPath: string) {
  const edges: BeelineEdge[] = [];

  const fileStream = fs.createReadStream(csvFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isHeader = true;

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false; // skip header
      continue;
    }
    if (!line.trim()) continue; // skip empty lines

    const [gene1, gene2, type] = line.split(",");
    edges.push({
      source: gene1.trim(),
      target: gene2.trim(),
      type: type.trim() === "+" ? "activation" : "repression"
    });
  }

  fs.writeFileSync(jsonOutputPath, JSON.stringify(edges, null, 2));
  console.log(`✅ Converted: ${path.basename(csvFilePath)} → ${path.basename(jsonOutputPath)}`);
}

// ------------------
// Example usage
// ------------------
async function main() {
  const inputDir = path.join(__dirname, "csv"); // folder with CSVs
  const outputDir = path.join(__dirname, "json"); // folder for JSON output
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const files = fs.readdirSync(inputDir).filter(f => f.endsWith(".csv"));
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(".csv", ".json"));
    await convertBeelineCsv(inputPath, outputPath);
  }
}

main().catch(console.error);
