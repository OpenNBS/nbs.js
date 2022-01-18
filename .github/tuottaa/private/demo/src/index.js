let song;
let instruments;
let timePerTick;
const instrumentMap = new Map();

const elements = {
    "button": {},
    "text": {
        "result": {}
    }
};

let isFirefox;

window.addEventListener("load", () => {
    elements.button.fileInput = document.getElementById("file-input");
    elements.button.playback = document.getElementById("playback");
    elements.button.restart = document.getElementById("restart");
    elements.button.highlight = document.getElementById("highlight");
    elements.text.highlighting = document.getElementById("highlight-status");
    elements.text.result.structure = document.getElementById("result-structure");
    elements.text.result.overview = document.getElementById("result-overview");

    // Initial result state
    prepareResult("No file selected.");

    // Initialize file input
    elements.button.fileInput.value = null;

    // Sneaky Firefox detection
    isFirefox = navigator.userAgent.indexOf("Firefox") > 0;

    if (!isFirefox) {
        elements.button.highlight.classList.add("visible");
    }

    elements.button.fileInput.addEventListener("change",  event => {
        const worker = new Worker("src/worker/loadSong.js");

        // Load the song
        prepareResult("Loading...");
        worker.postMessage({
            "file": event.target.files[0]
        });

        worker.addEventListener("message", async event => {
            song = event.data.song;
            instruments = event.data.instruments;
            timePerTick = event.data.timePerTick;

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
            elements.text.result.structure.innerHTML = event.data.structureText;
        });
    });

    elements.button.playback.addEventListener("click", () => {
        // Ensure a song is loaded
        if (song) {
            // Start or stop the song
            if (elements.button.playback.dataset.toggled === "true") {
                stopSong();
            } else {
                prepareSong();
            }
        }
    });

    elements.button.restart.addEventListener("click", () => {
        // Restart the song
        currentTick = 0;
    });

    elements.button.highlight.addEventListener("click", () => {
        // Start highlighting
        const highlightWorker = new Worker("src/worker/highlight.js", {
            "type": "module"
        });

        elements.text.highlighting.classList.add("visible");

        // Highlight the block
        highlightWorker.postMessage({
            "code": elements.text.result.structure.innerHTML
        });

        highlightWorker.addEventListener("message", highlightEvent => {
            elements.text.result.structure.innerHTML = highlightEvent.data.code;
            elements.text.highlighting.classList.remove("visible");
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
    currentTick = 0;
    stopSong();
}

/**
 * Prepare and play the loaded song.
 */
async function prepareSong() {
    // Load all instruments
    await Promise.all(instruments.map(instrument => {
        if (instrument.builtIn) {
            return fetch(instrument.audioSrc)
                .then(data => data.arrayBuffer())
                .then(audioData => decodeAudioData(audioData))
                .then(buffer => instrument.audioBuffer = buffer)
                .then(() => instrumentMap.set(instrument.name, instrument));
        }

        return null;
    }));

    // Play the song
    stopPlaying = false;
    elements.button.playback.dataset.toggled = "true";
    playSong(song, timePerTick);
}

/**
 * Stop the currently playing song
 */
function stopSong() {
    elements.button.playback.dataset.toggled = "false";
    stopPlaying = true;
}

let stopPlaying = true;
let currentTick = 0;

/**
 * Play a song.
 * @param song Song to play
 * @param timePerTick Time to wait between notes
 */
async function playSong(song, timePerTick) {
    // Iterate each tick
    for (currentTick; currentTick < song.size; currentTick++) {
        if (stopPlaying) {
            break;
        }

        // Iterate each layer
        for (let j = 0; j < song.layers.length; j++) {
            // Ensure a note is on the tick
            if (song.layers[j]?.notes[currentTick]) {
                // Play the note
                playNote(
                    song.layers[j].notes[currentTick].key,
                    instrumentMap.get(song.layers[j].notes[currentTick].instrument.name),
                    (song.layers[j].notes[currentTick].velocity * song.layers[j].velocity) / 100,
                    (song.layers[j].panning + song.layers[j].notes[currentTick].panning) / 100,
                    song.layers[j].notes[currentTick].pitch / 100
                );
            }
        }

        // Wait until next tick
        await new Promise(resolve => setTimeout(resolve, timePerTick));
    }
}
