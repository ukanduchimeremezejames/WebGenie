import { useEffect, useState } from "react";
import {
  computeDegrees,
  computeInfluence,
  computeModules,
  applyNodeStyles
} from "../analytics";

export function useNetworkAnalytics(cyRef, filteredEdges, hopDepth) {
  const [degrees, setDegrees] = useState({});
  const [influence, setInfluence] = useState({});
  const [modules, setModules] = useState({});

  useEffect(() => {
    if (!cyRef.current) return;

    const deg = computeDegrees(filteredEdges);
    const inf = computeInfluence(deg);
    const mods = computeModules(cyRef.current, deg);

    setDegrees(deg);
    setInfluence(inf);
    setModules(mods);

    applyNodeStyles(cyRef.current, deg, inf, mods);
  }, [filteredEdges, hopDepth, cyRef.current]);

  return { degrees, influence, modules };
}
