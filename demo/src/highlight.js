import { highlightText } from "https://cdn.jsdelivr.net/gh/speed-highlight/core@1.1.4/dist/index.js";

self.addEventListener("message", async event => {
    const code = await highlightText(event.data.code, "json", false);

    postMessage({
        "code": code
    });
});
