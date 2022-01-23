/* eslint-disable @typescript-eslint/no-var-requires, unicorn/prefer-module */
const path = require("path");

module.exports = env => {
    const mode = env?.mode ?? "production";
    const isProduction = mode === "production";

    const environments = {
        "production": {
            "output": {
                "path": path.resolve(__dirname, "./dist"),
                "filename": "index.js",
                "library": {
                    "name": "NBSjs",
                    "type": "global",
                    "export": "default"
                }
            }
        },
        "development": {
            "output": {
                "path": path.resolve(__dirname, "./.github/tuottaa/private/demo/src"),
                "filename": "NBS.js",
                "library": {
                    "name": "NBSjs",
                    "type": "global",
                    "export": "default"
                }
            }
        }
    };

    const options = {
        "mode": isProduction ? "production" : "development",
        "context": path.resolve(__dirname, "./src"),
        "entry": {
            "main": "./app.ts"
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
        }
    };

    Object.assign(options, environments[mode]);

    return options;
};
