# Hierarchia

![License](https://img.shields.io/github/license/Benzo-Fury/Hierarchia)
![Version](https://img.shields.io/npm/v/hierarchia)
![Bun](https://img.shields.io/badge/built_with-bun-fbf3e8)

Ultra light-weight, sub-millisecond graph layout engine with greedy allocation and poly-relationship support.

✔️ Polyamorous relationships  
✔️ Joint partner children  
✔️ Extensive configuration (spacing, padding, etc.)

### Average simulation speed: `0.01ms`

> This was calculated using Hierarchia's basic benchmarking tool which can be found in [/bechmark](/benchmark/index.ts)

### 🖼️ Example Graph
![Example Graph](https://raw.githubusercontent.com/Benzo-Fury/Hierarchia/refs/heads/main/public/images/example-graph.png)
> [!NOTE]
> Hierarchia does not ship with a visualization tool. We recommend creating your own with [Canvas](https://www.npmjs.com/package/canvas).

## 📐 How It Works

The layout engine simulates a visual tree structure using a nested box-model concept:

```
Generation → Group → SubGroup → Node
```

Each layer behaves like a layout container:

- **Generations** are rows in the tree (like flex rows)
- **Groups** cluster related nodes (siblings, partners)
- **SubGroups** bind partner relationships together
- **Nodes** represent individuals in the tree

## 🧠 Core Concepts

- **Anchor Points**  
  Every group and node defines top and bottom anchors used to visually connect parents to children.

- **Greedy Space Allocation (GSA)**  
  To prevent overlap, the engine uses a first-fit greedy algorithm.  
  Each group attempts to place itself at its desired position and shifts right if necessary until a free region is found.

## 🔁 Simulation Overview

1. **Structure Phase**  
   Raw nodes are recursively parsed into generations and groups.

2. **Simulation Phase**  
   Each generation is simulated from top to bottom:
   - Groups are positioned based on their parent anchors
   - Overlap is prevented using the GSA system
   - X/Y positions and anchor links are finalized

## ⚙️ Configuration

All spacing, dimensions, and padding are customizable via the static config object:

```ts
HEngine.config = {
  graph: {
    padding: 200,
  },
  generation: {
    gap: 100,
    padding: 0,
    defaultX: 0,
  },
  node: {
    width: 40,
    height: 80,
    gap: 20,
    maxNameLength: 15,
  },
  text: {
    charWidth: 8,
    padding: 10,
  },
};
```

![Example graph with annotations](https://raw.githubusercontent.com/Benzo-Fury/Hierarchia/refs/heads/main/public/images/example-graph-spacing.png)

![Badge](https://img.shields.io/badge/-Graph_Padding-ff90c6)
![Badge](https://img.shields.io/badge/-Generation_Gap-7f75ee)
![Badge](https://img.shields.io/badge/-Node_Gap-8cf56e)
![Badge](https://img.shields.io/badge/-Text_Width-ff6b6b)

### 📝 Text Width Calculation

Nodes with names automatically calculate their horizontal space based on the text content. The system:

- **Truncates** names longer than `maxLength` characters
- **Calculates** width using `charWidth` × character count + `padding`
- **Uses** the larger of base node width or calculated text width
- **Configurable** via the `text` configuration object

This ensures nodes with names have adequate space for text display while maintaining layout efficiency.
## 🚀 Performance

```
10,000 simulations completed in ~0.01 ms each (average)
```

> [!NOTE]
> Performance benchmark can be found in [/benchmark/index.ts](/benchmark/index.ts).

## 📦 Usage

### Option 1
Create graph from raw node.
```ts
import { HEngine, HRawNode } from "hierarchia";

const node: HRawNode = {
  id: "1234",
  parents: [],
  partners: [],
  children: []
}

const graph = new HEngine().calculate(node);
```
### Option 2
Alternatively, if it works better with your app, you can use the `GraphBuilder` class which is a simple wrapper for the `HEngine` class and providers a easier API to use.
```ts
const builder = new HGraphBuilder();

const node1 = builder.addNode("1234");
const node2 = builder.addNode("5678", node1); // Node1 will be parent

// OR

const node1 = builder.addNode("1234");
const node2 = builder.addNode("5678");

builder.addEdge(node1, "parent_of", node2);

// FINALLY
const engine = new HEngine().calculate(builder)
```

## 📁 Output Structure

Each graph consists of **generations**, which contain **groups**, which in turn contain **nodes**. This nested structure allows you to organize and render hierarchical data effectively.

To render the graph, you'll need access to each node’s position:

```ts
graph.generations.groups.nodes.x // or .y
```

## 💡 Credits

Created by me for the [**Unionize**](https://github.com/Benzo-Fury/Unionize/) project but designed to be framework-agnostic and extensible.
