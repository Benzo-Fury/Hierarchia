/**
 * Represents a horizontal region allocated on the graph,
 * typically used for managing layout boundaries or collision zones.
 */
export interface AllocatedRegion {
  /**
   * The starting x-coordinate of the region.
   */
  xFrom: number;

  /**
   * The ending x-coordinate of the region.
   */
  xTo: number;

  /**
   * The identifier or object associated with this region.
   * This could be a node, group, generation, or any layout element.
   */
  id: unknown;
}
