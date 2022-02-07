const typescript = require("@rollup/plugin-typescript");

/**
 * Get the config for a build type.
 *
 * @param {String} types Types to build.
 * @return {Object[]}
 */
function getConfig(...types) {
    const configs = [];

    // Generate config for each type
    for (const type of types) {
        const config = {
            "input": "src/index.ts",
            "output": {
                "file": `dist/${type}.js`,
                "format": type
            },
            "plugins": [typescript({
                "outDir": "dist"
            })]
        };

        // Name UMD modules
        if (type === "umd") {
            config.output.name = "NBSjs";
        }

        configs.push(config);
    }

    return configs;
}

export default getConfig("cjs", "esm", "umd");
