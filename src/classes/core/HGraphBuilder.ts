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
   * Array containing all nodes in the graph for easy lookup
   */
  private nodes: HRawNode[] = [];

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

    // Store the node in our nodes array
    this.nodes.push(node);

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
   * Creates a directional or bidirectional edge between two nodes using their IDs.
   *
   * @param id1 - The ID of the first node in the relationship.
   * @param t - The type of relationship: `"parent_of"`, `"child_of"`, or `"partner_of"`.
   * @param id2 - The ID of the second node in the relationship.
   *
   * @throws If a circular or duplicate partner relationship is attempted.
   * @throws If either node ID is not found in the graph.
   */
  public addEdge(
    id1: string,
    t: "PARENT_OF" | "PARTNER_OF" | "CHILD_OF",
    id2: string
  ) {
    const n1 = this.findNode(id1);
    const n2 = this.findNode(id2);

    if (!n1) {
      throw new Error(`Node with ID "${id1}" not found`);
    }
    if (!n2) {
      throw new Error(`Node with ID "${id2}" not found`);
    }

    switch (t) {
      case "PARENT_OF":
        n1.children.push(n2);
        break;
      case "CHILD_OF":
        n2.children.push(n1);
        break;
      case "PARTNER_OF":
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

    /**
   * Finds a node by its ID
   * 
   * @param id - The ID of the node to find
   * @returns The found node or undefined if not found
   */
    private findNode(id: string): HRawNode | undefined {
      return this.nodes.find(node => node.id === id);
    }
}
