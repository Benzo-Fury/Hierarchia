import { AllocatedRegion } from "../../interfaces/AllocatedRegion";

/**
 * ## Greedy Space Allocator (GSA)
 * Responsible for assigning horizontal space (xSpace) to elements in a layout engine while avoiding overlap.
 * Can be used in a wide magnitude of cases however is used in this program for ensuring nodes and groups are placed
 * horizontally without overlapping.
 *
 * ### How It Works:
 * - Each group requests a desired x-position and defines a horizontal span (`xFrom` to `xTo`)
 *   based on its width.
 * - The allocator checks if the requested space overlaps any existing allocations.
 * - If overlap is detected, the allocator can either:
 *   - Throw an error (default),
 *   - Or automatically shift the group to the right until a valid space is found (configurable).
 * - Once placed, the region is stored internally.
 *
 * ### Features:
 * - Prevents group overlap using a greedy-first-fit strategy
 * - Optional strict mode to enforce exact placement
 * - Supports querying stored allocations for debugging or visualization
 */
export class GSA {
  private regions: AllocatedRegion[] = [];

  /**
   * Attempts to allocate space to a certain object.
   * @throws {Error} if space is already allocated.
   * @param upsert Used to offset object to the right if space is taken. Error will not be thrown if this is true.
   */
  public allocate(xFrom: number, xTo: number, id: unknown, upsert = false) {
    if (xFrom > xTo) {
      throw new Error("Invalid dimensions: xFrom must be less than xTo");
    }
    const dimensions = [xFrom, xTo] as [number, number];

    if (this.overlaps(dimensions)) {
      if (upsert) {
        while (this.overlaps(dimensions)) {
          this.shift(dimensions, 1);
        }
      } else {
        throw new Error(
          "Space already allocated at x: " + this.getOverlapStartX(dimensions)
        );
      }
    }

    this.regions.push({
      id,
      xFrom: dimensions[0],
      xTo: dimensions[1],
    });

    return dimensions;
  }

  /**
   * Checks if certain dimensions overlap another object in GSA space.
   */
  private overlaps(dimensions: [number, number]): boolean {
    return this.regions.some((region) => {
      return !(dimensions[1] <= region.xFrom || dimensions[0] >= region.xTo);
    });
  }

  private getOverlapStartX([xFrom, xTo]: [number, number]): number | null {
    const overlaps = this.regions.filter(
      (r) => !(xTo <= r.xFrom || xFrom >= r.xTo)
    );

    if (overlaps.length === 0) return null;

    return Math.min(...overlaps.map((r) => r.xFrom));
  }

  /**
   * Helper method to shift an object x space.
   */
  private shift(dimensions: [number, number], amt: number) {
    dimensions[0] -= amt;
    dimensions[1] -= amt;
  }
}
