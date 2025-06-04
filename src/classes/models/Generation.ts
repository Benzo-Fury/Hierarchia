import { HGroup } from "./Group";

/**
 * Represents a single generation in the graph layout.
 * 
 * A generation consists of one or more `HGroup` instances that belong
 * to the same vertical level (i.e., the same parent or child layer).
 * Generations are stacked vertically in the graph to represent lineage or hierarchy.
 */
export class HGeneration {
  /**
   * Internal counter for auto-incrementing generation IDs.
   */
  private static idIndex = 0;

  /**
   * A unique ID assigned to this generation.
   * Used to identify and distinguish between multiple generations.
   */
  public readonly id: number;

  public x?: number;
  public y?: number;

  /**
   * The total horizontal space occupied by all groups in this generation.
   * Usually computed externally for performance optimization.
   */
  public xSpace?: number;

  /**
   * The list of node groups that belong to this generation.
   * Each group may contain individual nodes and/or subgroups.
   */
  public groups: HGroup[] = [];

  /**
   * @param reqId - Optionally provide a specific ID. Otherwise, one is auto-assigned.
   */
  constructor(reqId?: number) {
    this.id = reqId ?? HGeneration.idIndex;
    HGeneration.idIndex++;
  }

  /**
   * Adds one or more groups to this generation.
   * 
   * @param g - A single group or an array of groups to add.
   * @returns This generation instance (for chaining).
   */
  public addGroups(g: HGroup[] | HGroup): this {
    if (g instanceof HGroup) {
      g = [g];
    }

    this.groups.push(...g);
    return this;
  }
}
