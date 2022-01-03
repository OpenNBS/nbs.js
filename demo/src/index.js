let resultDiv;
let resultCode;
let fileInput;

window.addEventListener("load", () => {
    resultDiv = document.getElementById("result");
    resultCode = resultDiv.getElementsByTagName("code")[0];
    fileInput = document.getElementById("file-input");

    // Initial result state
    hljs.highlightElement(resultCode);
    prepareResult("No file selected...");

    // Initialize file input
    fileInput.value = null;
    fileInput.addEventListener("change", async () => {
        // Load the song
        prepareResult("Loading...");
        const song = NBSjs.Song.fromArrayBuffer(await fileInput.files[0].arrayBuffer());

        // Remove undefined notes
        for (let i = 0; i < song.layers.length; i++) {
            const newNotes = [];

            for (const note of song.layers[i].notes) {
                if (note !== undefined) {
                    newNotes.push(note);
                }
            }

            song.layers[i].notes = newNotes;
        }

        // Get ready to display the result
        displayResult();

        // Stringify the song
        const cache = [];
        resultCode.innerHTML = JSON.stringify(song, (key, value) => {
            // Decycle the object
            if (typeof value === "object" && value !== null) {
                if (cache.includes(value)) {
                    return;
                }

                cache.push(value);
            }

            return value;
        }, 4);

        hljs.highlightElement(resultCode);
    });
});

/**
 * Prepare the result code block with a placeholder message.
 * @param placeholder Message to display
 */
function prepareResult(placeholder) {
    resultCode.classList.add("no-white-space");
    resultCode.innerHTML = placeholder;
}

/**
 * Display the result.
 * Used after prepareResult has been called.
 */
function displayResult() {
    resultCode.classList.remove("no-white-space");
}
