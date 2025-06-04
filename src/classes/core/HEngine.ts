import { HRawNode } from "../../interfaces";
import { HGeneration, HGraph, HGroup, HNode, HSubGroup } from "../models";
import { GSA } from "./GSA";
import { HGraphBuilder } from "./HGraphBuilder";

/**
 * ## Layout Engine
 * A sub-millisecond tree graph layout engine with greedy allocation and poly-relationship support.
 *
 * This engine converts a raw graph structure into a fully positioned layout consisting of generations,
 * groups, subgroups, and nodes. It handles spacing, anchor positioning, and dimension calculations.
 *
 * Note: This engine produces layout data only. A separate visualizer is required to render the output.
 */
export class HEngine {
  /**
   * Configuration options for layout dimensions and spacing.
   */
  public static config = {
    graph: {
      padding: 200, // Padding applied to overall height and width
    },
    generation: {
      defaultX: 0, // Default x-coordinate for the initial generation
      padding: 0, // Internal padding within generations
      gap: 100, // Vertical gap between generations
    },
    node: {
      width: 40, // Default node width
      height: 80, // Default node height
      gap: 20, // Horizontal gap between nodes
    },
  };

  /**
   * Public entry point to calculate a graph layout.
   *
   * @param initNode - The root node to begin the graph layout from.
   * @returns A fully laid-out graph with computed node positions.
   */
  public calculate(initNode: HRawNode | HGraphBuilder) {
    if (initNode instanceof HGraphBuilder) {
      initNode = initNode.export();
    }

    const genList: HGeneration[] = [];

    // Build the graph's structural foundation
    this.structure([initNode], genList);

    // Simulate layout and calculate coordinates
    const graph = new HGraph(genList);
    this.simulate(graph);

    return graph;
  }

  /**
   * Recursively builds the underlying structure of the graph from raw data.
   * Converts raw nodes to HNode instances and organizes them into groups and generations.
   *
   * @param arr - Array of raw nodes to convert.
   * @param list - Generation list to append to.
   * @param parentGroup - The group that spawned this generation (used for anchoring).
   * @param depth - The current generation depth.
   */
  private structure(
    arr: HRawNode[],
    list: HGeneration[],
    parentGroup?: HGroup,
    depth = 0
  ) {
    const group = new HGroup(parentGroup);

    if (!list[depth]) {
      list[depth] = new HGeneration(depth);
    }
    list[depth].groups.push(group);

    for (const node of arr) {
      const convNode = HNode.fromRaw(node);

      if (node.partners.length > 0) {
        // Node has partners – group them together in a subgroup
        const sGroup = new HSubGroup().addMembers([
          convNode,
          ...node.partners.map((rn) => HNode.fromRaw(rn)),
        ]);
        group.addSubGroups(sGroup);
      } else {
        // Node stands alone – add directly to group
        group.addMembers(convNode);
      }

      // Recurse through children to build next generation
      if (node.children.length > 0) {
        this.structure(node.children, list, group, depth + 1);
      }
    }
  }

  /**
   * Simulates layout and calculates coordinates (x, y) for all nodes in the graph.
   * Assigns anchors and determines final graph dimensions.
   *
   * @param graph - The constructed graph structure to position.
   */
  private simulate(graph: HGraph) {
    const calcGenY = (currHeight: number) =>
      currHeight - HEngine.config.generation.gap - graph.genHeight;

    const calcGroupY = (anchor: number) =>
      anchor - HEngine.config.generation.gap / 2;

    const calcGroupAnchorY = (currY: number) =>
      currY - graph.genHeight / 2 - HEngine.config.graph.padding / 2;

    let graphDimensions = {
      leftMostX: 0,
      rightMostX: 0,
    };

    graph.generations.forEach((gen, i) => {
      if (i === 0) {
        // Initial generation: manually assign base coordinates
        if (gen.groups.length !== 1) {
          throw new Error("Initial generation should always have 1 group.");
        }

        gen.x = HEngine.config.generation.defaultX;
        gen.y =
          graph.height - HEngine.config.graph.padding - graph.genHeight / 2;

        const group = gen.groups[0];
        group.x = gen.x;
        group.y = gen.y;

        group.anchors = {
          bottom: {
            x: group.x,
            y: calcGroupAnchorY(group.y),
          },
        };
      } else {
        const prevGen = graph.generations[i - 1];

        if (prevGen.x == null || prevGen.y == null) {
          throw new Error(
            "Coordinates from previously looped generation are undefined."
          );
        }

        gen.x = prevGen.x;
        gen.y = calcGenY(prevGen.y);

        const gsa = new GSA();
        const genDimensions: [number, number] = [0, 0]; // [leftmost, rightmost]

        for (const g of gen.groups) {
          if (!g.parentGroup) throw new Error("Child group missing parent.");
          if (!g.parentGroup.anchors?.bottom)
            throw new Error("Parent group missing bottom anchor.");

          // ------- X Axis Calculation ------- //
          const anchorX = g.parentGroup.anchors.bottom.x;
          const halfWidth = g.xSpace / 2;
          let xFrom = anchorX - halfWidth;
          let xTo = anchorX + halfWidth;

          // Allocate space using GSA (Greedy Space Allocator)
          [xFrom, xTo] = gsa.allocate(xFrom, xTo, g, true);

          // Track min/max boundaries for width calculation
          genDimensions[0] = Math.min(genDimensions[0], xFrom);
          genDimensions[1] = Math.max(genDimensions[1], xTo);

          g.x = (xFrom + xTo) / 2;

          // Set anchors
          g.anchors = {
            top: {
              x: g.x,
              y: g.parentGroup.anchors.bottom.y,
            },
          };

          // ------- Y Axis Calculation ------- //
          g.y = calcGroupY(g.anchors.top.y);

          g.anchors.bottom = {
            x: g.x,
            y: calcGroupAnchorY(g.y),
          };
        }

        gen.xSpace = genDimensions[1] - genDimensions[0];

        // Update graph-wide boundaries
        graphDimensions.leftMostX = Math.min(
          graphDimensions.leftMostX,
          genDimensions[0]
        );
        graphDimensions.rightMostX = Math.max(
          graphDimensions.rightMostX,
          genDimensions[1]
        );
      }
    });

    // Final graph width includes padding
    graph.width =
      graphDimensions.rightMostX -
      graphDimensions.leftMostX +
      HEngine.config.graph.padding;
  }
}
