const typescript = require("@rollup/plugin-typescript");
const { terser } = require("rollup-plugin-terser");

/**
 * The target output directory.
 *
 * @type {string}
 */
const outDir = "dist";

/**
 * Get an output configuration.
 *
 * @param {string} type Type to get output for
 * @param {boolean} [toMinify=false] Whether to create minified output
 * @return {Object}
 */
function getOutput(type, toMinify = false) {
    return {
        "file": `${outDir}/${type}${toMinify ? ".min" : ""}.js`,
        "name": type === "umd" ? "NBSjs" : undefined,
        "format": type,
        "plugins": toMinify ? [terser()] : undefined
    };
}

/**
 * Get a base configuration
 *
 * @param {string} type Type to get base for
 * @return {Object}
 */
function getBase(type) {
    return  {
        "input": "src/index.ts",
        "output": [
            getOutput(type, false),
            getOutput(type, true)
        ],
        "plugins": [typescript({
            "outDir": "dist"
        })]
    };
};

/**
 * Get the config for a build type.
 *
 * @param {string} types Types to build
 * @return {Object[]}
 */
function getConfig(...types) {
    const configs = [];

    // Generate config for each type
    for (const type of types) {
        configs.push(getBase(type));
    }

    return configs;
}

export default getConfig("cjs", "esm", "umd");
