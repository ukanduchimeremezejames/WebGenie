import Papa from "papaparse"
import type { ExpressionMatrix } from "./types"

export async function loadExpressionMatrix(): Promise<ExpressionMatrix> {
  const response = await fetch("/ExpressionData.csv")
  const text = await response.text()

  const parsed = Papa.parse<string[]>(text, {
    skipEmptyLines: true
  })

  const rows = parsed.data

  // First row = header
  const header = rows[0]
  const cells = header.slice(1)

  const genes: string[] = []
  const values: number[][] = []

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    genes.push(row[0])

    const numericRow = row
      .slice(1)
      .map(v => Number(v) || 0)

    values.push(numericRow)
  }

  return { genes, cells, values }
}
