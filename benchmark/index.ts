import { HEngine, HRawNode } from "../src/index";
import exampleNode from "./benchmark-tree.json";

function test() {
  const node = exampleNode as HRawNode;

  const engine = new HEngine();

  const iterations = 10000;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    engine.calculate(node);
  }

  const end = performance.now();
  console.log(`Average time: ${(end - start) / iterations} ms`);
}

test();
