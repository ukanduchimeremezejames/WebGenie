import React from "react";
import cytoscape from "cytoscape";
import GraphML from "cytoscape-graphml";
import JSZip from "jszip";
import { saveAs } from "file-saver";

cytoscape.use(GraphML);

export default function ExportToolbar({ cy }) {

  if (!cy) return null;

  // ----------------------------------------------------------
  // PNG EXPORT
  // ----------------------------------------------------------
  const handleExportPNG = () => {
    if (!cy.current) return;
    const png = cy.current.png({ full: true, scale: 2 });
    const link = document.createElement("a");
    link.download = "network.png";
    link.href = png;
    link.click();
  };

  // ----------------------------------------------------------
  // SVG EXPORT
  // ----------------------------------------------------------
  const handleExportSVG = () => {
    if (!cy.current) return;
    const svg = cy.current.svg({ full: true });
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    saveAs(blob, "network.svg");
  };

  // ----------------------------------------------------------
  // CSV EXPORT
  // ----------------------------------------------------------
  const handleExportCSV = () => {
    if (!cy.current) return;

    const cyInstance = cy.current;

    const nodes = cyInstance.nodes().map((n) => ({
      id: n.id(),
      label: n.data("label") || "",
      ...n.data(),
    }));

    const edges = cyInstance.edges().map((e) => ({
      id: e.id(),
      source: e.source().id(),
      target: e.target().id(),
      ...e.data(),
    }));

    const convertToCSV = (data) => {
      if (!data.length) return "";
      const headers = Object.keys(data[0]);
      const rows = data.map((obj) =>
        headers.map((h) => JSON.stringify(obj[h] ?? "")).join(",")
      );
      return headers.join(",") + "\n" + rows.join("\n");
    };

    const csvText = [
      "# NODES",
      convertToCSV(nodes),
      "",
      "# EDGES",
      convertToCSV(edges),
    ].join("\n");

    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "network.csv");
  };

  // ----------------------------------------------------------
  // GRAPHML EXPORT
  // ----------------------------------------------------------
  const handleExportGraphML = () => {
    if (!cy.current) return;
    const xml = cy.current.graphml();
    const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
    saveAs(blob, "network.graphml");
  };

  // ----------------------------------------------------------
  // JSON EXPORT
  // ----------------------------------------------------------
  const handleExportJSON = () => {
    if (!cy.current) return;
    const json = cy.current.json();
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "network.json");
  };

  // ----------------------------------------------------------
  // ZIP EXPORT (ALL FORMATS)
  // ----------------------------------------------------------
  const handleExportZIP = async () => {
    if (!cy.current) return;

    const cyInstance = cy.current;
    const zip = new JSZip();

    // PNG
    const png = cyInstance.png({ full: true, scale: 2 });
    zip.file("network.png", png.split(",")[1], { base64: true });

    // SVG
    const svg = cyInstance.svg({ full: true });
    zip.file("network.svg", svg);

    // JSON
    zip.file("network.json", JSON.stringify(cyInstance.json(), null, 2));

    // CSV
    const nodes = cyInstance.nodes().map((n) => ({
      id: n.id(),
      label: n.data("label") || "",
      ...n.data(),
    }));

    const edges = cyInstance.edges().map((e) => ({
      id: e.id(),
      source: e.source().id(),
      target: e.target().id(),
      ...e.data(),
    }));

    const convertToCSV = (data) => {
      if (!data.length) return "";
      const headers = Object.keys(data[0]);
      const rows = data.map((obj) =>
        headers.map((h) => JSON.stringify(obj[h] ?? "")).join(",")
      );
      return headers.join(",") + "\n" + rows.join("\n");
    };

    const csvText = [
      "# NODES",
      convertToCSV(nodes),
      "",
      "# EDGES",
      convertToCSV(edges),
    ].join("\n");

    zip.file("network.csv", csvText);

    // GRAPHML
    const graphml = cyInstance.graphml();
    zip.file("network.graphml", graphml);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "network_export.zip");
  };

  // ----------------------------------------------------------
  // UI BUTTONS
  // ----------------------------------------------------------
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <button onClick={handleExportPNG} className="px-3 py-2 bg-primary text-white rounded">
        PNG
      </button>

      <button onClick={handleExportSVG} className="px-3 py-2 bg-primary text-white rounded">
        SVG
      </button>

      <button onClick={handleExportCSV} className="px-3 py-2 bg-primary text-white rounded">
        CSV
      </button>

      <button onClick={handleExportGraphML} className="px-3 py-2 bg-primary text-white rounded">
        GraphML
      </button>

      <button onClick={handleExportJSON} className="px-3 py-2 bg-primary text-white rounded">
        JSON
      </button>

      <button onClick={handleExportZIP} className="px-3 py-2 bg-secondary text-black rounded">
        Export All (ZIP)
      </button>
    </div>
  );
}
