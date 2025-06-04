/**
 * Raw node that should be passed into the engine.
 *
 * Only one raw node should be passed PER TREE!!
 * This is due to this single raw node containing essentially whats like the entire tree inside.
 *
 * @example
 * const node: HRawNode = {
 *   id: "1234",
 *   parents: [], // Top node
 *   children: [
 *     {
 *       id: "5678",
 *       children: [...etc],
 *       partners: []
 *     },
 *     {
 *       id: "9101",
 *       children: [...etc],
 *       partners: []
 *     }
 *   ],
 *   partners: []
 * }
 */
export interface HRawNode {
  id: string;
  children: HRawNode[];
  partners: HRawNode[];
}
