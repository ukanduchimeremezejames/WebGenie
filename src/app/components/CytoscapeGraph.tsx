// components/CytoscapeGraph.tsx
import CytoscapeComponent from "react-cytoscapejs";
import { useRef } from "react";

interface Props {
  elements: any[];
  layout?: any;
  onNodeSelect?: (data: any) => void;
}

export const CytoscapeGraph = ({ elements, layout, onNodeSelect }: Props) => {
  const cyRef = useRef<any>(null);

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: "100%", height: "600px" }}
      layout={layout || { name: "cose" }}
      cy={cy => {
        cyRef.current = cy;
        cy.on("tap", "node", evt => {
          if (onNodeSelect) onNodeSelect(evt.target.data());
        });
      }}
      stylesheet={[
        {
          selector: "node",
          style: {
            label: "data(label)",
            width: "data(size)",
            height: "data(size)",
            "background-color": "mapData(community, 0, 10, #60A5FA, #FBBF24)",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": 10
          }
        },
        {
          selector: "edge",
          style: {
            width: "mapData(support_count, 1, 5, 1, 6)",
            "line-color": "#ccc",
            "target-arrow-shape": "triangle"
          }
        },
        {
          selector: "edge[support_count >= 3]",
          style: { "line-color": "#10B981" }
        },
        {
          selector: "edge[support_count = 2]",
          style: { "line-color": "#F59E0B" }
        }
      ]}
    />
  );
};
