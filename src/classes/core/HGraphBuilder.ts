import { HRawNode } from "../../interfaces";

/**
 * ## HGraphBuilder
 * A simple utility class for constructing hierarchical tree graphs.
 *
 * `HGraphBuilder` allows you to programmatically create a graph structure
 * consisting of parent-child and partner relationships using `HRawNode` objects.
 *
 * This builder is useful for prototyping or testing graph layouts
 * without needing to manually define nested structures.
 */
export class HGraphBuilder {
  /**
   * The root (topmost) node of the graph. Automatically set when the first node is added.
   */
  private top?: HRawNode;

  private usedIds = new Set<string>();

  /**
   * Creates a new node and optionally attaches it to a parent.
   *
   * @param id - A unique identifier for the node.
   * @param parent - (Optional) A parent node to attach this node to.
   * @returns The newly created `HRawNode` instance.
   */
  public addNode(id: string, parent?: HRawNode): HRawNode {
    if (this.usedIds.has(id)) {
      throw new Error(`Node ID "${id}" is already in use`);
    }
    this.usedIds.add(id);
    
    const node: HRawNode = {
      id,
      children: [],
      partners: [],
    };

    // If this is the first node, treat it as the top/root of the graph
    if (!this.top) {
      this.top = node;
    }

    // Attach to parent if specified
    if (parent) {
      parent.children.push(node);
    }

    return node;
  }

  /**
   * Creates a directional or bidirectional edge between two nodes.
   *
   * @param n1 - The first node in the relationship.
   * @param t - The type of relationship: `"parent_of"`, `"child_of"`, or `"partner_of"`.
   * @param n2 - The second node in the relationship.
   *
   * @throws If a circular or duplicate partner relationship is attempted.
   */
  public addEdge(
    n1: HRawNode,
    t: "parent_of" | "partner_of" | "child_of",
    n2: HRawNode
  ) {
    switch (t) {
      case "parent_of":
        n1.children.push(n2);
        break;
      case "child_of":
        n2.children.push(n1);
        break;
      case "partner_of":
        // Prevent duplicate or circular partnerships
        if (
          n2.partners.find((n) => n.id === n1.id) ||
          n1.partners.find((n) => n.id === n2.id)
        ) {
          throw new Error(
            "Partner relationship already exists and cannot be circular."
          );
        }

        n2.partners.push(n1);
        break;
    }
  }

  /**
   * Exports the final constructed graph, beginning from the top/root node.
   *
   * @returns The root node of the graph.
   * @throws If no nodes have been added yet.
   */
  public export(): HRawNode {
    if (!this.top) {
      throw new Error("Top node doesn't exist. Have you added a node yet?");
    }

    return this.top;
  }
}
