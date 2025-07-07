import { Coordinates } from "../../interfaces/Coordinates";
import { HRawNode } from "../../interfaces/RawNode";
import { HEngine } from "../core/HEngine";

/**
 * Calculates the width needed to display text with the given configuration.
 *
 * @param text - The text to calculate width for
 * @returns The width in pixels needed to display the text
 */
function calculateTextWidth(text: string): number {
  const config = HEngine.config;
  const truncatedText =
    text.length > config.node.maxNameLength
      ? text.substring(0, config.node.maxNameLength)
      : text;

  return truncatedText.length * config.text.charWidth + config.text.padding;
}

/**
 * Represents a positioned node in the graph layout.
 *
 * Each `HNode` instance corresponds to a visual node in the graph,
 * containing layout information such as its coordinates and anchor points.
 *
 * Nodes are identified by a unique `id` and may optionally include a `name`.
 */
export class HNode {
  public readonly name: string;
  public x?: number;
  public y?: number;

  public readonly ySpace = HEngine.config.node.height;
  public get xSpace() {
    // Calculate xSpace based on nodes name
    return calculateTextWidth(this.name) + HEngine.config.node.xPadding;
  }

  /**
   * Anchor points used for edge connection rendering.
   * Typically computed during layout to determine visual connection points.
   */
  public anchors?: {
    top: Coordinates;
    bottom: Coordinates;
  };

  constructor(public readonly id: string, name?: string) {
    name = name ?? "Unnamed Node";
  }

  /**
   * Converts a raw node structure into an `HNode` instance.
   * Coordinates and layout information will be computed later.
   */
  public static fromRaw(raw: HRawNode): HNode {
    return new HNode(raw.id, raw.name);
  }
}
