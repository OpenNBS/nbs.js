/* eslint-disable @typescript-eslint/no-var-requires, unicorn/prefer-module */
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    "mode": "development",
    "context": path.resolve(__dirname, "./src"),
    "entry": {
        "main": "./index.ts"
    },
    "output": {
        "path": path.resolve(__dirname, "./dist"),
        "filename": "index.js",
        "library": "NBSjs",
        "libraryTarget": "umd"
    },
    "resolve": {
        "extensions": [".ts", ".js"]
    },
    "module": {
        "rules": [
            {
                "test": /\.ts$/,
                "loader": "ts-loader"
            }
        ]
    },
    "optimization": {
        "minimize": true,
        "minimizer": [
            new TerserPlugin({
                "minify": TerserPlugin.uglifyJsMinify,
                "extractComments": false
            })
        ]
    }
};
