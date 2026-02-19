export type SearchItem = {
  label: string;
  type: "dataset" | "algorithm";
  path: string;
};

export const searchIndex: SearchItem[] = [
  // ---- DATASETS ----
  { label: "hESC", type: "dataset", path: "/dataset/hESC" },
  { label: "mESC", type: "dataset", path: "/dataset/mESC" },
  { label: "hHep", type: "dataset", path: "/dataset/hHep" },
  { label: "mDC", type: "dataset", path: "/dataset/mDC" },
  { label: "mHSC-L", type: "dataset", path: "/dataset/mHSC-L" },
  { label: "mHSC-E", type: "dataset", path: "/dataset/mHSC-E" },
  { label: "hHSPC", type: "dataset", path: "/dataset/hHSPC" },
  { label: "VSC", type: "dataset", path: "/dataset/VSC" },
  { label: "Synthetic-1", type: "dataset", path: "/dataset/Synthetic-1" },
  { label: "Synthetic-2", type: "dataset", path: "/dataset/Synthetic-2" },
  { label: "hHep", type: "dataset", path: "/dataset/hHep" },
  { label: "Yeast Network 1", type: "dataset", path: "/dataset/Yeast Network 1" },
  { label: "Yeast Network 2", type: "dataset", path: "/dataset/Yeast Network 2" },

  // ---- ALGORITHMS ----
  { label: "GENIE3", type: "algorithm", path: "/compare" },
  { label: "GRNBoost2", type: "algorithm", path: "/compare" },
  { label: "Pearson", type: "algorithm", path: "/compare" },
  { label: "Spearman", type: "algorithm", path: "/compare" },
  { label: "ARACNE", type: "algorithm", path: "/compare" },
  { label: "SINGE", type: "algorithm", path: "/compare" },
  { label: "GRNVBEM", type: "algorithm", path: "/compare" },
  { label: "GRISLI", type: "algorithm", path: "/compare" },
  { label: "SCODE", type: "algorithm", path: "/compare" },
  { label: "PIDC", type: "algorithm", path: "/compare" },
  { label: "SCNS", type: "algorithm", path: "/compare" },
  { label: "LEAP", type: "algorithm", path: "/compare" },
  { label: "ARBORETO", type: "algorithm", path: "/compare" },
//   { label: "GENIE3", type: "algorithm", path: "/algorithm/GENIE3" },
//   { label: "GRNBoost2", type: "algorithm", path: "/algorithm/GRNBoost2" },
//   { label: "PIDC", type: "algorithm", path: "/algorithm/PIDC" },
//   { label: "SCENIC", type: "algorithm", path: "/algorithm/SCENIC" },
];
