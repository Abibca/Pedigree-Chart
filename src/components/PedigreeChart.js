import React, { useEffect, useRef } from "react";
import * as go from "gojs";

export default function PedigreeChart({ formInfo }) {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (diagramRef.current && !diagramRef.current.diagram) {
      const diagram = new go.Diagram(diagramRef.current);

      // Node Template (circle for female, square for male)
      diagram.nodeTemplate = new go.Node("Auto").add(
        new go.Shape({
          stroke: "green",
          strokeWidth: 2,
          height: 40,
          width: 40,
        })
          .bind("figure", "gender", (gender) =>
            gender === "male" ? "Square" : "Circle"
          )
          .bind("fill", "gender", (gender) =>
            gender === "male" ? "lightblue" : "lightpink"
          ),
        new go.TextBlock({
          margin: 5,
          textAlign: "center",
          font: "bold 12px sans-serif",
        }).bind("text", "key") // Display the key (name) of the node
      );

      // Link Template (for parent-child relationships)
      diagram.linkTemplate = new go.Link({
        routing: go.Link.Orthogonal,
        corner: 5,
      }).add(new go.Shape({ stroke: "blue", strokeWidth: 2 }));

      // Relationship Link Template (single straight horizontal line)
      const relationshipLinkTemplate = new go.Link({
        routing: go.Link.Normal,
        selectable: false,
        isTreeLink: false,
        layerName: "Background",
        fromSpot: go.Spot.Left,
        toSpot: go.Spot.Right,
      }).add(new go.Shape({ stroke: "black", strokeWidth: 2 }));
      diagram.linkTemplateMap.add("Relationship", relationshipLinkTemplate);

      // Node Data Array
      const nodeDataArray = [
        { key: "Maternal Grandfather", gender: "male", loc: "0 0" },
        { key: "Maternal Grandmother", gender: "female", loc: "200 0" },
        { key: "Paternal Grandfather", gender: "male", loc: "300 0" },
        { key: "Paternal Grandmother", gender: "female", loc: "400 0" },
        ...Array.from({ length: formInfo.maternalUncles }, (_, i) => ({
          key: `Maternal Uncle ${i + 1}`,
          parent: "Maternal Grandfather",
          gender: "male",
        })),
        ...Array.from({ length: formInfo.maternalAunts }, (_, i) => ({
          key: `Maternal Aunt ${i + 1}`,
          parent: "Maternal Grandfather",
          gender: "female",
        })),
        { key: "Mother", parent: "Maternal Grandfather", gender: "female" },
        { key: "Father", parent: "Paternal Grandfather", gender: "male" },
        ...Array.from({ length: formInfo.paternalUncles }, (_, i) => ({
          key: `Paternal Uncle ${i + 1}`,
          parent: "Paternal Grandfather",
          gender: "male",
        })),
        ...Array.from({ length: formInfo.paternalAunts }, (_, i) => ({
          key: `Paternal Aunt ${i + 1}`,
          parent: "Paternal Grandfather",
          gender: "female",
        })),
        ...Array.from({ length: formInfo.brothers }, (_, i) => ({
          key: `Brother ${i + 1}`,
          parent: "Mother",
          gender: "male",
        })),
        ...Array.from({ length: formInfo.sisters }, (_, i) => ({
          key: `Sister ${i + 1}`,
          parent: "Mother",
          gender: "female",
        })),
        { key: formInfo.name, parent: "Mother", gender: formInfo.gender },
        ...Array.from({ length: formInfo.sons }, (_, i) => ({
          key: `Son ${i + 1}`,
          parent: formInfo.name,
          gender: "male",
        })),
        ...Array.from({ length: formInfo.daughters }, (_, i) => ({
          key: `Daughter ${i + 1}`,
          parent: formInfo.name,
          gender: "female",
        })),
      ];

      // Link Data Array (with Relationship links)
      const linkDataArray = [
        {
          from: "Maternal Grandfather",
          to: "Maternal Grandmother",
          category: "Relationship",
        },
        {
          from: "Paternal Grandfather",
          to: "Paternal Grandmother",
          category: "Relationship",
        },
        { from: "Mother", to: "Father", category: "Relationship" },
        ...nodeDataArray
          .filter((node) => node.parent)
          .map((node) => ({ from: node.parent, to: node.key })), // Parent-child links
      ];

      // Set the model
      diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

      // Tree Layout for nodes
      diagram.layout = new go.TreeLayout({
        arrangement: go.TreeLayout.ArrangementHorizontal,
        angle: 90,
        layerSpacing: 50,
        nodeSpacing: 50,
      });

      // Explicitly position key nodes (grandparents)
      diagram.addDiagramListener("InitialLayoutCompleted", () => {
        const maternalGrandfather = diagram.findNodeForKey(
          "Maternal Grandfather"
        );
        const maternalGrandmother = diagram.findNodeForKey(
          "Maternal Grandmother"
        );
        const paternalGrandfather = diagram.findNodeForKey(
          "Paternal Grandfather"
        );
        const paternalGrandmother = diagram.findNodeForKey(
          "Paternal Grandmother"
        );

        if (maternalGrandfather && maternalGrandmother) {
          maternalGrandfather.position = new go.Point(0, 0);
          maternalGrandmother.position = new go.Point(200, 0);
        }

        if (paternalGrandfather && paternalGrandmother) {
          paternalGrandfather.position = new go.Point(300, 0);
          paternalGrandmother.position = new go.Point(500, 0);
        }
      });

      diagramRef.current.diagram = diagram;
    } else {
      const diagram = diagramRef.current.diagram;
      diagram.model = new go.GraphLinksModel([]);
    }

    return () => {
      if (diagramRef.current && diagramRef.current.diagram) {
        diagramRef.current.diagram.clear();
      }
    };
  }, [formInfo]);

  return (
    <div ref={diagramRef} style={{ width: "100%", height: "600px" }}></div>
  );
}

// import React, { useEffect, useRef } from "react";
// import * as go from "gojs";

// export default function PedigreeChart({ formInfo }) {
//   const diagramRef = useRef(null);

//   useEffect(() => {
//     if (diagramRef.current && !diagramRef.current.diagram) {
//       const diagram = new go.Diagram(diagramRef.current);

//       // Node Template (circle for female, square for male)
//       diagram.nodeTemplate = new go.Node("Auto").add(
//         new go.Shape()
//           .bind("figure", "gender", (gender) =>
//             gender === "male" ? "Square" : "Circle"
//           )
//           .bind("fill", "gender", (gender) =>
//             gender === "male" ? "lightblue" : "lightpink"
//           )
//       );

//       // Link Template (for parent-child relationships)
//       diagram.linkTemplate = new go.Link({
//         routing: go.Link.Orthogonal,
//         corner: 5,
//       }).add(new go.Shape());

//       // Relationship Link Template (single straight horizontal line)
//       const relationshipLinkTemplate = new go.Link({
//         routing: go.Link.Normal, // Ensures a straight line
//         selectable: false,
//         isTreeLink: false, // Not part of the tree structure
//         layerName: "Background", // Doesn't interfere with other elements
//       }).add(new go.Shape({ stroke: "black", strokeWidth: 2 })); // Single horizontal line
//       diagram.linkTemplateMap.add("Relationship", relationshipLinkTemplate);

//       // Node Data
//       const nodeDataArray = [
//         { key: "Maternal Grandfather", gender: "male", loc: "0 0" }, // Explicit position
//         { key: "Maternal Grandmother", gender: "female", loc: "150 0" }, // Explicit position
//         { key: "Paternal Grandfather", gender: "male" },
//         { key: "Paternal Grandmother", gender: "female" },
//         ...Array.from({ length: formInfo.maternalUncles }, (_, i) => ({
//           key: `Maternal Uncle ${i + 1}`,
//           parent: "Maternal Grandfather",
//           gender: "male",
//         })),
//         ...Array.from({ length: formInfo.maternalAunts }, (_, i) => ({
//           key: `Maternal Aunt ${i + 1}`,
//           parent: "Maternal Grandfather",
//           gender: "female",
//         })),
//         { key: "Mother", parent: "Maternal Grandfather", gender: "female" },
//         { key: "Father", parent: "Paternal Grandfather", gender: "male" },
//         ...Array.from({ length: formInfo.paternalUncles }, (_, i) => ({
//           key: `Paternal Uncle ${i + 1}`,
//           parent: "Paternal Grandfather",
//           gender: "male",
//         })),
//         ...Array.from({ length: formInfo.paternalAunts }, (_, i) => ({
//           key: `Paternal Aunt ${i + 1}`,
//           parent: "Paternal Grandfather",
//           gender: "female",
//         })),
//         ...Array.from({ length: formInfo.brothers }, (_, i) => ({
//           key: `Brother ${i + 1}`,
//           parent: "Mother",
//           gender: "male",
//         })),
//         ...Array.from({ length: formInfo.sisters }, (_, i) => ({
//           key: `Sister ${i + 1}`,
//           parent: "Mother",
//           gender: "female",
//         })),
//         { key: formInfo.name, parent: "Mother", gender: formInfo.gender },
//         ...Array.from({ length: formInfo.sons }, (_, i) => ({
//           key: `Son ${i + 1}`,
//           parent: formInfo.name,
//           gender: "male",
//         })),
//         ...Array.from({ length: formInfo.daughters }, (_, i) => ({
//           key: `Daughter ${i + 1}`,
//           parent: formInfo.name,
//           gender: "female",
//         })),
//       ];

//       // Link Data (relationship link + parent-child links)
//       const linkDataArray = [
//         {
//           from: "Maternal Grandfather",
//           to: "Maternal Grandmother",
//           category: "Relationship",
//         }, // Single horizontal line
//         ...nodeDataArray
//           .filter((node) => node.parent)
//           .map((node) => ({ from: node.parent, to: node.key })), // Parent-child links
//       ];

//       // Set the model
//       diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

//       // Tree Layout for non-relationship nodes
//       diagram.layout = new go.TreeLayout({
//         arrangement: go.TreeLayout.ArrangementHorizontal,
//         angle: 90,
//         layerSpacing: 30,
//         nodeSpacing: 8,
//       });

//       // Explicitly position Maternal Grandfather and Grandmother
//       diagram.addDiagramListener("InitialLayoutCompleted", () => {
//         const maternalGrandfather = diagram.findNodeForKey(
//           "Maternal Grandfather"
//         );
//         const maternalGrandmother = diagram.findNodeForKey(
//           "Maternal Grandmother"
//         );
//         if (maternalGrandfather && maternalGrandmother) {
//           maternalGrandfather.position = new go.Point(0, 0); // Set explicit position
//           maternalGrandmother.position = new go.Point(150, 0); // Horizontal alignment
//         }
//       });

//       diagramRef.current.diagram = diagram;
//     } else {
//       const diagram = diagramRef.current.diagram;
//       diagram.model = new go.GraphLinksModel([]);
//     }

//     return () => {
//       if (diagramRef.current && diagramRef.current.diagram) {
//         diagramRef.current.diagram.clear();
//       }
//     };
//   }, [formInfo]);

//   return (
//     <div ref={diagramRef} style={{ width: "100%", height: "500px" }}></div>
//   );
// }
