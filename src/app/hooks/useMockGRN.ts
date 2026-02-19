import { useEffect, useState } from "react";
import data from "../../data/mock_grn.json";

export function useMockGRN() {
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    setEdges(data);
  }, []);

  return edges;
}
