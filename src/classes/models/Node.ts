import { Coordinates } from "../../interfaces/Coordinates";
import { HRawNode } from "../../interfaces/RawNode";
import { HEngine } from "../core/HEngine";

/**
 * Represents a positioned node in the graph layout.
 * 
 * Each `HNode` instance corresponds to a visual node in the graph,
 * containing layout information such as its coordinates and anchor points.
 * 
 * Nodes are identified by a unique `id` and may optionally include a `name`.
 */
export class HNode {
  public x?: number;
  public y?: number;
  public readonly ySpace = HEngine.config.node.height;
  public readonly xSpace = HEngine.config.node.width;

  /**
   * Anchor points used for edge connection rendering.
   * Typically computed during layout to determine visual connection points.
   */
  public anchors?: {
    top: Coordinates;
    bottom: Coordinates;
  };

  constructor(public readonly id: string, public readonly name?: string) {}

  /**
   * Converts a raw node structure into an `HNode` instance.
   * Coordinates and layout information will be computed later.
   */
  public static fromRaw(raw: HRawNode): HNode {
    return new HNode(raw.id, raw.name);
  }
}
