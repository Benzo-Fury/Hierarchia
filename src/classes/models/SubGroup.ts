import { Coordinates } from "../../interfaces/Coordinates";
import { HEngine } from "../core/HEngine";
import { HNode } from "./Node";

/**
 * Represents a subgroup within a larger group in the graph layout.
 * 
 * Subgroups are typically used to keep related nodes — such as partners — visually grouped together
 * on the same horizontal axis. They share a single anchor point that connects them to their children.
 */
export class HSubGroup {
  public x?: number;
  public y?: number;

  /**
   * The anchor point used to connect this subgroup to its child nodes.
   * Unlike full groups, subgroups only use one anchor (typically centered below).
   */
  public anchor?: Coordinates;

  /**
   * The list of nodes that belong to this subgroup.
   * These nodes are usually placed horizontally next to each other.
   */
  public members: HNode[] = [];

  /**
   * The total horizontal space occupied by this subgroup,
   * including node widths and gaps between them.
   */
  get xSpace(): number {
    const memberSpace = this.members.reduce((sum, m) => sum + m.xSpace, 0);
    const gapSpace = (this.members.length - 1) * HEngine.config.node.gap;
    return memberSpace + gapSpace;
  }

  /**
   * Adds one or more nodes to this subgroup.
   * Nodes will be laid out next to each other in the order added.
   * 
   * @param mem - A single node or an array of nodes to add.
   * @returns This subgroup instance (for chaining).
   */
  public addMembers(mem: HNode[] | HNode): this {
    if (mem instanceof HNode) {
      mem = [mem];
    }

    this.members.push(...mem);
    return this;
  }
}
