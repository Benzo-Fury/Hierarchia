import { Coordinates } from "../../interfaces/Coordinates";
import { HEngine } from "../core/HEngine";
import { HNode } from "./Node";
import { HSubGroup } from "./SubGroup";

/**
 * Represents a group of nodes within the same generation level in the graph layout.
 *
 * `HGroup` instances contain both individual nodes and subgroups (e.g., partners),
 * and are used to control their collective positioning within a generation.
 * Groups manage their own horizontal space and anchor points for edge drawing.
 */
export class HGroup {
  public x?: number;
  public y?: number;

  /**
   * The individual nodes that are part of this group.
   * These nodes exist on the same generation and are not part of a subgroup.
   */
  public members: HNode[] = [];

  /**
   * Optional subgroups within the group, typically used for grouping related nodes,
   * such as partners or siblings, to ensure clean and meaningful layout.
   */
  public subGroups: HSubGroup[] = [];

  /**
   * Anchor points used to connect this group vertically to its parent or child nodes.
   * These anchors are computed during layout and used for edge routing.
   */
  public anchors?: {
    top?: Coordinates;
    bottom?: Coordinates;
  };

  /**
   * The total horizontal space this group occupies in the layout.
   * Includes spacing between members and any subgroups.
   */
  get xSpace(): number {
    const sGroupSpace = this.subGroups.reduce((sum, sg) => sum + sg.xSpace, 0);

    const nodeSpace = this.members.reduce((sum, m) => sum + m.xSpace, 0);
    const gapSpace = (this.members.length - 1) * HEngine.config.node.gap;

    return sGroupSpace + nodeSpace + gapSpace;
  }

  /**
   * Creates a new group instance.
   * @param parentGroup - The parent group this group belongs to, if any.
   */
  constructor(public readonly parentGroup?: HGroup) {}

  /**
   * Adds one or more nodes to the group.
   * These nodes will be laid out horizontally at the same generation level.
   *
   * @param mem - A single node or an array of nodes to add.
   * @returns This group instance (for chaining).
   */
  public addMembers(mem: HNode | HNode[]): this {
    if (mem instanceof HNode) {
      mem = [mem];
    }

    this.members.push(...mem);
    return this;
  }

  /**
   * Adds one or more subgroups to this group.
   * Subgroups can be used to organize related nodes (e.g. couples).
   *
   * @param g - A single subgroup or an array of subgroups to add.
   * @returns This group instance (for chaining).
   */
  public addSubGroups(g: HSubGroup | HSubGroup[]): this {
    if (g instanceof HSubGroup) {
      g = [g];
    }

    this.subGroups.push(...g);
    return this;
  }
}
