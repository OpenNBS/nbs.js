import commonjs from "@rollup/plugin-commonjs";
import nodeExternals from "rollup-plugin-node-externals";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import path from "path";

/**
 * The target output directory.
 *
 * @type {string}
 */
const outDir = "dist";

/**
 * Get a base configuration
 *
 * @param {string} type Type to get base for
 * @param {boolean} [toMinify=false] Whether to create minified output
 * @return {Object}
 */
function getBase(type, toMinify = false) {
    return {
        "input": "src/index.ts",
        "output": {
            "file": `${outDir}/${type}${toMinify ? ".min" : ""}.js`,
            "name": type === "umd" ? "NBSjs" : undefined,
            "format": type
        },
        "plugins": [
            commonjs(),
            nodeExternals(),
            nodeResolve({
                "extensions": [
                    ".ts",
                    ".js"
                ]
            }),
            esbuild({
                "minify": toMinify,
                "sourceMap": false,
                "tsconfig": path.resolve(process.cwd(), "tsconfig.json")
            }),
            json({
                "compact": toMinify
            })
        ]
    };
}

/**
 * Get the config for a build type.
 *
 * @param {string} types Types to build
 * @return {Object[]}
 */
function getConfig(...types) {
    const configs = [{
        "input": "build/index.d.ts",
        "output": {
            "file": `${outDir}/index.d.ts`,
            "format": "es"
        },
        "plugins": [
            dts()
        ]
    }];

    // Generate config for each type
    for (const type of types) {
        configs.push(
            getBase(type),
            getBase(type, true)
        );
    }

    return configs;
}

export default getConfig("cjs", "esm", "umd");
