let resultOverview;
let resultStructure;
let fileInput;

window.addEventListener("load", () => {
    resultOverview = document.getElementById("result-overview");
    resultStructure = document.getElementById("result-structure");
    fileInput = document.getElementById("file-input");

    // Initial result state
    hljs.highlightElement(resultStructure);
    prepareResult("No file selected...");

    // Initialize file input
    fileInput.value = null;
    fileInput.addEventListener("change", async () => {
        // Load the song
        prepareResult("Loading...");
        const song = NBSjs.Song.fromArrayBuffer(await fileInput.files[0].arrayBuffer());

        // Remove undefined notes and empty layers
        const newLayers = [];
        for (let i = 0; i < song.layers.length; i++) {
            const layer = song.layers[i];

            // Check for empty notes
            const newNotes = [];
            for (const note of layer.notes) {
                if (note !== undefined) {
                    newNotes.push(note);
                }
            }

            layer.notes = newNotes;

            // Check for empty layers
            if (layer.notes.length > 0) {
                newLayers.push(layer);
            }
        }

        song.layers = newLayers;

        // Get ready to display the result
        displayResult();

        // Display the instruments first
        resultStructure.innerHTML = `Instruments: ${JSON.stringify(song.instruments, null, 4)}\n\n`;

        // Stringify the song structure
        const cache = [];
        resultStructure.innerHTML += "Song: " + JSON.stringify(song, (key, value) => {
            // Decycle the object
            if (typeof value === "object" && value !== null) {
                if (key === "instrument") {
                    return `[${key} ${value.name}]`;
                }

                if (key === "song") {
                    return `[this]`;
                }

                if (cache.includes(value)) {
                    return `[${key}]`;
                }

                cache.push(value);
            }

            return value;
        }, 4);

        const overviews = [[
            "NBS version",
            song.nbsVersion
        ], [
            "Song name",
            song.name
        ], [
            "Song author",
            song.author
        ], [
            "Song description",
            song.description
        ], [
            "Total layers",
            song.layers.length
        ], [
            "Total notes",
            song.size
        ], [
            "Custom instruments",
            song.instruments.map(i => {
                if (!i.builtIn) {
                    return i.name;
                }

                return null;
            }).filter(Boolean)
                .join(", ")
        ]];

        // Fill result table
        for (const overview of overviews) {
            const row = document.createElement("tr");

            const key = document.createElement("td");
            key.innerHTML = `<strong>${overview[0]}</strong>`;

            const value = document.createElement("td");
            value.innerHTML = overview[1] === "" ? "None" : overview[1];

            row.append(key);
            row.append(value);

            resultOverview.append(row);
        }

        hljs.highlightElement(resultStructure);
    });
});

/**
 * Prepare the result code block with a placeholder message.
 * @param placeholder Message to display
 */
function prepareResult(placeholder) {
    resultOverview.innerHTML = null;
    resultStructure.classList.add("no-white-space");
    resultStructure.innerHTML = placeholder;
}

/**
 * Display the result.
 * Used after prepareResult has been called.
 */
function displayResult() {
    resultStructure.classList.remove("no-white-space");
}
