let song;
let instruments;
let timePerTick;
const instrumentMap = new Map();

const elements = {
    "button": {},
    "toggle": {},
    "text": {
        "result": {}
    }
};

window.addEventListener("load", () => {
    elements.button.fileInput = document.getElementById("file-input");
    elements.button.playback = document.getElementById("playback");
    elements.button.restart = document.getElementById("restart");
    elements.button.highlight = document.getElementById("highlight");
    elements.toggle.looping = document.getElementById("toggle-looping");
    elements.toggle.clamping = document.getElementById("toggle-clamping");
    elements.text.highlighting = document.getElementById("highlight-status");
    elements.text.result.structure = document.getElementById("result-structure");
    elements.text.result.overview = document.getElementById("result-overview");

    // Initial result state
    elements.button.fileInput.value = null;
    prepareResult("No file selected.");
    setReady(false);

    // Speed highlight does not work on firefox
    if (!navigator.userAgent.indexOf("Firefox") > 0) {
        elements.button.highlight.classList.add("visible");
    }

    // File is selected
    elements.button.fileInput.addEventListener("change",  event => {
        setReady(false);
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

            setReady(true);

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

    // Play button is pressed
    elements.button.playback.addEventListener("click", () => {
        // Toggle playback of the song
        if (elements.button.playback.dataset.toggled === "true") {
            stopSong();
        } else {
            startSong();
        }
    });

    // Restart button is pressed
    elements.button.restart.addEventListener("click", () => {
        // Restart the song
        resetSong();
    });

    // Highlight button is pressed
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
 * @return {void}
 */
function prepareResult(placeholder) {
    elements.text.result.overview.innerHTML = null;
    elements.text.result.structure.innerHTML = placeholder;
}

function setReady(isReady) {
    if (isReady) {
        prepareSong();
        resetSong();
        elements.button.playback.disabled = false;
        elements.button.restart.disabled = false;
        elements.button.highlight.disabled = false;
    } else {
        elements.button.playback.disabled = true;
        elements.button.restart.disabled = true;
        elements.button.highlight.disabled = true;
        stopSong();
    }
}

/**
 * Prepare and play the loaded song.
 * @return {Promise<void>}
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
}

/**
 * Start the currently loaded song.
 * @return {void}
 */
function startSong() {
    stopPlaying = false;
    elements.button.playback.dataset.toggled = "true";
    playSong(song, timePerTick);
}

/**
 * Stop the currently playing song.
 * @return {void}
 */
function stopSong() {
    elements.button.playback.dataset.toggled = "false";
    stopPlaying = true;
}

/**
 * Reset the currently playing song.
 * @return {void}
 */
function resetSong() {
    stopSong();
    currentTick = -1;
    currentLoop = 0;
}

let stopPlaying = true;
let currentTick = -1;
let currentLoop = 0;

/**
 * Play a song.
 * @param song Song to play
 * @param timePerTick Time to wait between notes
 * @return {void}
 */
async function playSong(song, timePerTick) {
    if (!song) {
        return;
    }

    // eslint-disable-next-line no-unmodified-loop-condition
    while (!stopPlaying) {
        // Iterate each layer
        for (let j = 0; j < song.layers.length; j++) {
            const layer = song.layers[j];

            // Skip locked layers
            if (layer.locked) {
                continue;
            }

            const note = layer?.notes[currentTick];

            // Ensure a note is on the tick
            if (note) {
                // Play the note
                playNote(
                    note.key,
                    instrumentMap.get(note.instrument.name),
                    (note.velocity * layer.velocity) / 100,
                    ((note.panning + layer.panning) / 100),
                    note.pitch / 100,
                    elements.toggle.clamping.checked
                );
            }
        }

        // Wait until next tick
        await new Promise(resolve => setTimeout(resolve, timePerTick));

        currentTick++;

        // Loop or stop song
        if (currentTick === song.size) {
            // Loop if available
            if (elements.toggle.looping.checked && song.loopEnabled && (song.maxLoopCount === 0 || currentLoop < song.maxLoopCount)) {
                currentLoop++;
                currentTick = song.loopStartTick;
            } else {
                resetSong();
            }
        }
    }
}
