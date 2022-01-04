/* eslint-disable @typescript-eslint/no-var-requires, unicorn/prefer-module */
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    "mode": "development",
    "context": path.resolve(__dirname, "./src"),
    "entry": {
        "main": "./app.ts"
    },
    "output": {
        "path": path.resolve(__dirname, "./dist"),
        "filename": "index.js",
        "library": {
            "name": "NBSjs",
            "type": "global",
            "export": "default"
        }
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
