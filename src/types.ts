export interface ExpressionMatrix {
  genes: string[]
  cells: string[]
  values: number[][] // values[geneIndex][cellIndex]
}
