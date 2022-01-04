const elements = {
    "button": {},
    "text": {
        "result": {}
    }
};

let isFirefox;

window.addEventListener("load", () => {
    elements.button.fileInput = document.getElementById("file-input");
    elements.text.highlighting = document.getElementById("highlight-status");
    elements.text.result.structure = document.getElementById("result-structure");
    elements.text.result.overview = document.getElementById("result-overview");

    // Initial result state
    prepareResult("No file selected.");

    // Initialize file input
    elements.button.fileInput.value = null;

    // Sneaky Firefox detection
    isFirefox = navigator.userAgent.indexOf("Firefox") > 0;

    elements.button.fileInput.addEventListener("change",  event => {
        const worker = new Worker("src/worker/loadSong.js");

        // Load the song
        prepareResult("Loading...");
        worker.postMessage({
            "file": event.target.files[0]
        });

        worker.addEventListener("message", event => {
            // Fill result table
            for (const overview of event.data.overviews) {
                const row = document.createElement("tr");

                const key = document.createElement("td");
                key.innerHTML = `<strong>${overview[0]}</strong>`;

                const value = document.createElement("td");
                value.innerHTML = overview[1] === "" ? "None" : overview[1];

                row.append(key);
                row.append(value);

                elements.text.result.overview.append(row);
            }

            // Set structure text
            if (isFirefox) {
                elements.text.result.structure.innerHTML = event.data.structureText;
            } else {
                const highlightWorker = new Worker("src/worker/highlight.js", {
                    "type": "module"
                });

                elements.text.highlighting.classList.add("visible");

                // Highlight the block
                highlightWorker.postMessage({
                    "code": event.data.structureText
                });

                highlightWorker.addEventListener("message", event => {
                    elements.text.result.structure.innerHTML = event.data.code;
                    elements.text.highlighting.classList.remove("visible");
                });
            }
        });
    });
});

/**
 * Prepare the result code block with a placeholder message.
 * @param placeholder Message to display
 */
function prepareResult(placeholder) {
    elements.text.result.overview.innerHTML = null;
    elements.text.result.structure.innerHTML = placeholder;
}
