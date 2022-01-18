let song;
let instruments;
let timePerTick;
const instrumentMap = new Map();

let elements;
let structureCode;
let setStructureCode = false;

window.addEventListener("load", () => {
    elements = {
        "button": {
            "fileInput": document.getElementById("file-input"),
            "playback": {
                "toggle": document.getElementById("playback"),
                "restart": document.getElementById("restart")
            },
            "structure": {
                "highlight": document.getElementById("highlight")
            }
        },
        "toggle": {
            "playback": {
                "looping": document.getElementById("toggle-looping"),
                "clamping": document.getElementById("toggle-clamping")
            },
            "structure": {
                "highlight": document.getElementById("hide-structure")
            }
        },
        "text": {
            "overview": document.getElementById("result-overview"),
            "structure": {
                "parent": document.getElementById("structure"),
                "code": document.getElementById("structure-code"),
                "highlighting": document.getElementById("highlight-status")
            }
        }
    };

    // Initial result state
    elements.button.fileInput.value = null;
    prepareResult("No file selected.");
    setReady(false);

    // Speed highlight does not work on firefox
    if (!navigator.userAgent.includes("Firefox")) {
        elements.button.structure.highlight.classList.add("visible");
        elements.text.structure.highlighting.classList.add("enabled");
    }

    // File is selected
    elements.button.fileInput.addEventListener("change",  event => {
        if (event.target.files.length === 0) {
            return;
        }

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

                elements.text.overview.append(row);
            }

            // Set structure text
            displayStructureCode(event.data.structureText);
        });
    });

    // Play button is pressed
    elements.button.playback.toggle.addEventListener("click", () => {
        // Toggle playback of the song
        if (elements.button.playback.toggle.dataset.toggled === "true") {
            stopSong();
        } else {
            startSong();
        }
    });

    // Restart button is pressed
    elements.button.playback.restart.addEventListener("click", () => {
        // Restart the song
        resetSong();
    });

    // Highlight button is pressed
    elements.button.structure.highlight.addEventListener("click", () => {
        // Start highlighting
        const highlightWorker = new Worker("src/worker/highlight.js", {
            "type": "module"
        });

        elements.text.structure.highlighting.classList.add("visible");

        // Highlight the block
        highlightWorker.postMessage({
            "code": elements.text.structure.code.innerHTML
        });

        highlightWorker.addEventListener("message", highlightEvent => {
            displayStructureCode(highlightEvent.data.code);
            elements.text.structure.highlighting.classList.remove("visible");
        });
    });

    // Ability to hide the structure code
    elements.toggle.structure.highlight.addEventListener("change", event => {
        if (event.target.checked) {
            // Hide the code
            elements.text.structure.parent.classList.remove("visible");

            // Don't let highlights happen
            elements.button.structure.highlight.disabled = true;
        } else {
            if (!setStructureCode) {
                elements.text.structure.code.innerHTML = structureCode;
            }

            // Show the code
            elements.text.structure.parent.classList.add("visible");
            elements.button.structure.highlight.disabled = false;
        }
    });
});

/**
 * Display the stored structure code.
 * @param code Code to override
 */
function displayStructureCode(code) {
    structureCode = code || structureCode;

    if (!elements.toggle.structure.highlight.checked) {
        setStructureCode = true;
        elements.text.structure.code.innerHTML = structureCode;
    }
}

/**
 * Prepare the result code block with a placeholder message.
 * @param placeholder Message to display
 * @return {void}
 */
function prepareResult(placeholder) {
    elements.text.overview.innerHTML = null;
    displayStructureCode(placeholder);
}

function setReady(isReady) {
    if (isReady) {
        prepareSong();
        resetSong();
        elements.button.playback.toggle.disabled = false;
        elements.button.playback.restart.disabled = false;
        elements.toggle.playback.clamping.disabled = false;

        if (!elements.toggle.structure.highlight.checked) {
            elements.button.structure.highlight.disabled = false;
        }
    } else {
        setStructureCode = false;
        elements.button.playback.toggle.disabled = true;
        elements.button.playback.restart.disabled = true;
        elements.button.structure.highlight.disabled = true;
        elements.toggle.playback.looping.disabled = true;
        elements.toggle.playback.clamping.disabled = true;
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

    // Check looping toggle if available
    elements.toggle.playback.looping.disabled = !song.loopEnabled;
    elements.toggle.playback.looping.checked = song.loopEnabled;
}

/**
 * Start the currently loaded song.
 * @return {void}
 */
function startSong() {
    stopPlaying = false;
    elements.button.playback.toggle.dataset.toggled = "true";
    playSong(song, timePerTick);
}

/**
 * Stop the currently playing song.
 * @return {void}
 */
function stopSong() {
    elements.button.playback.toggle.dataset.toggled = "false";
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
                    elements.toggle.playback.clamping.checked
                );
            }
        }

        // Wait until next tick
        await new Promise(resolve => setTimeout(resolve, timePerTick));

        currentTick++;

        // Loop or stop song
        if (currentTick === song.size) {
            // Loop if available
            if (elements.toggle.playback.looping.checked && song.loopEnabled && (song.maxLoopCount === 0 || currentLoop < song.maxLoopCount)) {
                currentLoop++;
                currentTick = song.loopStartTick;
            } else {
                resetSong();
            }
        }
    }
}
