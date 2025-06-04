import { HEngine } from "../core/HEngine";
import { HGeneration } from "./Generation";

/**
 * Represents the full graph layout, composed of multiple vertical generations.
 *
 * `HGraph` is the top-level structure that calculates and stores layout
 * information for the entire graph, including dimensions and generation stacking.
 */
export class HGraph {
  /**
   * The total height of the graph in pixels.
   * Calculated as the sum of all generation heights and vertical gaps.
   */
  public height: number;

  /**
   * The total width of the graph in pixels.
   * This may be set externally after layout to reflect actual horizontal usage.
   */
  public width?: number;

  /**
   * The ordered list of generations in the graph.
   * Marked `readonly` to prevent external modification, ensuring layout integrity.
   * Generations should only be added during graph construction.
   */
  public readonly generations: HGeneration[] = [];

  /**
   * The height allocated to each generation, including node height and padding.
   */
  public readonly genHeight: number;

  /**
   * The vertical gap between each generation.
   */
  public readonly gapHeight: number;

  /**
   * The total vertical space occupied by all generations (excluding gaps).
   */
  public readonly genSpace: number;

  /**
   * The total vertical space occupied by all gaps between generations.
   */
  public readonly gapSpace: number;

  /**
   * Constructs a new graph instance from the provided generations.
   * Computes the total layout height based on node and configuration data.
   *
   * @param gens - An ordered list of `HGeneration` instances representing the graph structure.
   */
  constructor(gens: HGeneration[]) {
    this.generations.push(...gens);

    const config = HEngine.config;

    this.genHeight = config.node.height + config.generation.padding;
    this.gapHeight = config.generation.gap;

    const gapAmount = this.generations.length + 1; // One gap before and after each generation

    this.gapSpace = this.gapHeight * gapAmount;
    this.genSpace = this.genHeight * this.generations.length;

    // Total vertical space = all generations + all gaps
    this.height = this.gapSpace + this.genSpace;
  }
}
