import { XMLParser } from "fast-xml-parser";

self.onmessage = (event: MessageEvent<string>) => {
  const xmlString = event.data;

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const graphml = parser.parse(xmlString);
  const graph = graphml.graphml.graph;

  const elements: any[] = [];

  // Nodes
  const nodes = Array.isArray(graph.node)
    ? graph.node
    : [graph.node];

  nodes?.forEach((node: any) => {
    elements.push({
      data: {
        id: node.id,
        label: node.id,
      },
    });
  });

  // Edges
  const edges = Array.isArray(graph.edge)
    ? graph.edge
    : [graph.edge];

  edges?.forEach((edge: any, idx: number) => {
    elements.push({
      data: {
        id: edge.id || `e-${idx}`,
        source: edge.source,
        target: edge.target,
      },
    });
  });

  self.postMessage(elements);
};
