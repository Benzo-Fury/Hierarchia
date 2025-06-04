import dts from 'bun-plugin-dts'

Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "node",
    minify: true,
    plugins: [dts()],
    banner: `
    /*
    This code is a bundled and minified version of Hierarchia,
    a light-weight, sub-millisecond graph layout engine with 
    greedy allocation and poly-relationship support.

    It can be found here:
    https://github.com/Benzo-Fury/Hierarchia
    */
    `
})