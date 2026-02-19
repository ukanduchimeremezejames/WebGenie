import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import { useRef } from "react";

cytoscape.use(fcose);

export default function GRNGraph({ elements }) {
  const cyRef = useRef(null);

  return (
    <div className="w-full h-[650px] border rounded shadow bg-white">
      <CytoscapeComponent
        elements={elements}
        cy={cy => {
          cyRef.current = cy;
          cy.on("tap", "node", evt => console.log(evt.target.data()));
          cy.on("tap", "edge", evt => console.log(evt.target.data()));
        }}
        style={{ width: "100%", height: "100%" }}
        layout={{
          name: "fcose",
          randomize: true
        }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              width: "data(size)",
              height: "data(size)",
              "background-color": "data(color)",
              "font-size": 10,
              color: "#111"
            }
          },
          {
            selector: "edge",
            style: {
              width: "mapData(support_count, 1, 4, 1, 7)",
              "line-color":
                "mapData(consensus_score, 0.6, 0.85, #cbd5e1, #111)",
              "target-arrow-shape": "triangle",
              "target-arrow-color": "#000"
            }
          }
        ]}
      />
    </div>
  );
}
