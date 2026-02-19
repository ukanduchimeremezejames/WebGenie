import React, { useState, useMemo } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { Copy, Filter, Search, X } from "lucide-react";

const MOCK_EDGES = [
  {
    edge_id: "SOX2__NANOG",
    source: "SOX2",
    target: "NANOG",
    supporting_algorithms: ["GENIE3", "GRNBoost2", "SCODE"],
    scores_by_algorithm: { GENIE3: 0.84, GRNBoost2: 0.81, SCODE: 0.79 },
    support_count: 3,
    consensus_score: 0.813
  },
  {
    edge_id: "SOX2__OCT4",
    source: "SOX2",
    target: "OCT4",
    supporting_algorithms: ["GENIE3", "SCENIC", "GRISLI"],
    scores_by_algorithm: { GENIE3: 0.86, SCENIC: 0.82, GRISLI: 0.80 },
    support_count: 3,
    consensus_score: 0.827
  },
  {
    edge_id: "OCT4__NANOG",
    source: "OCT4",
    target: "NANOG",
    supporting_algorithms: ["GENIE3", "GRNBoost2", "PIDC", "SCODE"],
    scores_by_algorithm: { GENIE3: 0.83, GRNBoost2: 0.80, PIDC: 0.76, SCODE: 0.78 },
    support_count: 4,
    consensus_score: 0.793
  }
];

const ALL_ALGORITHMS = [
  "GENIE3", "GRNBoost2", "SCODE", "PIDC", "SCENIC",
  "GRISLI", "SINCERITIES", "LEAP", "GRNVBEM"
];

export default function GRNInferencePage() {
  const [query, setQuery] = useState("");
  const [minConsensus, setMinConsensus] = useState(0);
  const [minSupport, setMinSupport] = useState(0);
  const [algorithmFilters, setAlgorithmFilters] = useState([]);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [sortKey, setSortKey] = useState("consensus");

  // ---------- Filtering ----------
  const filteredEdges = useMemo(() => {
    return MOCK_EDGES.filter(edge => {
      const matchesQuery =
        edge.edge_id.toLowerCase().includes(query.toLowerCase()) ||
        edge.source.toLowerCase().includes(query.toLowerCase()) ||
        edge.target.toLowerCase().includes(query.toLowerCase());

      const matchesConsensus = edge.consensus_score >= minConsensus;
      const matchesSupport = edge.support_count >= minSupport;

      const matchesAlgorithms =
        algorithmFilters.length === 0 ||
        algorithmFilters.every(a => edge.supporting_algorithms.includes(a));

      return matchesQuery && matchesConsensus && matchesSupport && matchesAlgorithms;
    }).sort((a, b) => {
      if (sortKey === "consensus") return b.consensus_score - a.consensus_score;
      if (sortKey === "support") return b.support_count - a.support_count;
      if (sortKey === "alphabetical") return a.edge_id.localeCompare(b.edge_id);
      if (sortKey === "algCount") return b.supporting_algorithms.length - a.supporting_algorithms.length;
      return 0;
    });
  }, [query, minConsensus, minSupport, algorithmFilters, sortKey]);

  // ---------- Generate Cytoscape Graph Data ----------
  const graphElements = useMemo(() => {
    const nodes = {};
    MOCK_EDGES.forEach(e => {
      nodes[e.source] = { data: { id: e.source, label: e.source } };
      nodes[e.target] = { data: { id: e.target, label: e.target } };
    });

    const edges = filteredEdges.map(e => ({
      data: { id: e.edge_id, source: e.source, target: e.target }
    }));

    return [...Object.values(nodes), ...edges];
  }, [filteredEdges]);

  // ---------- Export ----------
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredEdges, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    download(url, "grn_edges.json");
  };

  const exportCSV = () => {
    const header = "edge_id,source,target,consensus_score,support_count,algorithms\n";
    const rows = filteredEdges
      .map(e =>
        `${e.edge_id},${e.source},${e.target},${e.consensus_score},${e.support_count},"${e.supporting_algorithms.join(
          ";"
        )}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    download(url, "grn_edges.csv");
  };

  const download = (url, name) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <div className="p-8 space-y-8">

      {/* ---------- HEADER ---------- */}
      <h1 className="text-3xl font-bold">GRN Inference Dashboard</h1>

      {/* ---------- SEARCH + FILTERS ---------- */}
      <div className="flex gap-4 items-end flex-wrap">

        <div className="flex flex-col w-64">
          <label className="text-sm font-semibold">Search</label>
          <div className="flex items-center border rounded px-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="SOX2, NANOG, GENIE3, etc."
              className="p-2 flex-1 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold">Min Consensus Score: {minConsensus}</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={minConsensus}
            onChange={e => setMinConsensus(parseFloat(e.target.value))}
          />
        </div>

        <div className="flex flex-col w-40">
          <label className="text-sm font-semibold">Min Support Count</label>
          <input
            type="number"
            min={0}
            max={9}
            value={minSupport}
            onChange={e => setMinSupport(Number(e.target.value))}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col w-52">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" /> Algorithm Filter
          </label>
          <select
            multiple
            value={algorithmFilters}
            onChange={e =>
              setAlgorithmFilters(
                [...e.target.options]
                  .filter(o => o.selected)
                  .map(o => o.value)
              )
            }
            className="border p-2 rounded h-24"
          >
            {ALL_ALGORITHMS.map(a => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* ---------- SORT ---------- */}
        <div className="flex flex-col w-40">
          <label className="text-sm font-semibold">Sort By</label>
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="consensus">Consensus Score</option>
            <option value="support">Support Count</option>
            <option value="algCount"># Algorithms</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>

        {/* ---------- EXPORT ---------- */}
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Export CSV
        </button>

        <button
          onClick={exportJSON}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Export JSON
        </button>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="border rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Edge</th>
              <th>Consensus</th>
              <th>Support</th>
              <th>Algorithms</th>
            </tr>
          </thead>
          <tbody>
            {filteredEdges.map(edge => (
              <tr
                key={edge.edge_id}
                onClick={() => setSelectedEdge(edge)}
                className="cursor-pointer hover:bg-gray-50 border-t"
              >
                <td className="p-3 font-medium">{edge.edge_id}</td>
                <td>{edge.consensus_score.toFixed(3)}</td>
                <td>{edge.support_count}</td>
                <td>
                  <div className="flex gap-1">
                    {ALL_ALGORITHMS.map(a => (
                      <div
                        key={a}
                        className={`w-3 h-3 rounded ${
                          edge.supporting_algorithms.includes(a)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        title={a}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- CYTOSCAPE GRAPH ---------- */}
      <div className="border rounded p-4 h-[500px]">
        <CytoscapeComponent
          elements={graphElements}
          style={{ width: "100%", height: "100%" }}
          layout={{ name: "cose" }}
          cy={cy => {
            cy.on("tap", "edge", evt => {
              const id = evt.target.id();
              const edge = MOCK_EDGES.find(e => e.edge_id === id);
              if (edge) setSelectedEdge(edge);
            });
          }}
        />
      </div>

      {/* ---------- EDGE DETAILS DRAWER ---------- */}
      {selectedEdge && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl p-6 border-l overflow-auto">
          <button
            className="absolute right-4 top-4"
            onClick={() => setSelectedEdge(null)}
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold">{selectedEdge.edge_id}</h2>

          <p className="mt-2">
            <strong>Consensus Score:</strong> {selectedEdge.consensus_score}
          </p>

          <p>
            <strong>Support Count:</strong> {selectedEdge.support_count}
          </p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Algorithm Scores</h3>
            {Object.entries(selectedEdge.scores_by_algorithm).map(([alg, score]) => (
              <div key={alg} className="flex justify-between border-b py-1">
                <span>{alg}</span>
                <span>{score}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Raw JSON</h3>

            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(selectedEdge, null, 2)}
            </pre>

            <button
              className="mt-2 px-3 py-2 bg-gray-800 text-white rounded flex gap-2 items-center"
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(selectedEdge, null, 2))
              }
            >
              <Copy className="w-4 h-4" /> Copy JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
