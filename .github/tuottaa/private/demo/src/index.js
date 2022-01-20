import { getElements, setElements, setSong } from "./util/globals.js";
import { prepareSong, resetSong, startSong, stopSong } from "./audio/playback.js";
import { loadSong, generateOverviews } from "./audio/loadSong.js";
import { canParse } from "./util/util.js";

let editor;
let structureText;
let fileName;

window.addEventListener("load", () => {
    // Reset all elements to their default state
    for (const element of document.getElementsByTagName("*")) {
        // Checkboxes
        if (element.getAttribute("checked") === "") {
            element.checked = true;
        }

        // File inputs
        if (element.getAttribute("type") === "file") {
            element.value = null;
        }
    }

    setElements({
        "button": {
            "file": {
                "input": document.getElementById("file-input"),
                "export": document.getElementById("file-export")
            },
            "playback": {
                "toggle": document.getElementById("playback-button"),
                "restart": document.getElementById("restart-button")
            },
            "structure": {
                "apply": document.getElementById("structure-apply")
            }
        },
        "toggle": {
            "playback": {
                "looping": document.getElementById("toggle-looping"),
                "parity": document.getElementById("toggle-parity")
            },
            "structure": {
                "hide": document.getElementById("structure-hide")
            }
        },
        "text": {
            "playback": document.getElementById("playback"),
            "overview": document.getElementById("result-overview"),
            "structure": {
                "parent": document.getElementById("structure"),
                "edit": document.getElementById("structure-editor")
            }
        }
    });

    // Ace editor setup
    ace.config.set("basePath", "https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.4.13/src-min/");
    ace.config.setModuleUrl("ace/theme/ayu-mirage", "https://cdn.jsdelivr.net/gh/ayu-theme/ayu-ace@2.0.4/mirage.min.js");

    editor = ace.edit(getElements().text.structure.edit, {
        "mode": "ace/mode/javascript",
        "theme": "ace/theme/ayu-mirage",
        "maxLines": 25,
        "fontSize": "0.8em",
        "printMargin": false
    });

    editor.commands.addCommand({
        "name": "Save",
        "bindKey": {
            "win": "Ctrl-S",
            "mac": "Command-S"
        },
        "exec": exportSong
    });

    // Initial result state
    prepareResult("No file selected.");
    setReady(false);

    // File is selected
    getElements().button.file.input.addEventListener("change",  async event => {
        if (event.target.files.length === 0) {
            return;
        }

        fileName = event.target.files[0].name;

        setReady(false);

        // Load the song
        prepareResult("Loading...");
        const data = await loadSong({
            "file": event.target.files[0]
        });

        const song = data.song;

        updateSong(song);

        // Set structure text
        displayStructureText(data.structureText);

        setReady(true);
    });

    // Play button is pressed
    getElements().button.playback.toggle.addEventListener("click", () => {
        // Toggle playback of the song
        if (getElements().button.playback.toggle.dataset.toggled === "true") {
            stopSong();
        } else {
            startSong();
        }
    });

    // Restart button is pressed
    getElements().button.playback.restart.addEventListener("click", () => {
        // Restart the song
        resetSong();
    });

    // Export the displayed song
    getElements().button.file.export.addEventListener("click", exportSong);

    // Apply button clicked
    getElements().button.structure.apply.addEventListener("click", () => {
        const result = checkEditor();

        if (result.changed) {
            // Generate a new song
            const song = generateSong(result.value);

            updateSong(song);
        }
    });

    // Hide checkbox
    getElements().toggle.structure.hide.addEventListener("change", event => {
        if (event.target.checked) {
            //  Hide the structure
            getElements().text.structure.parent.classList.remove("visible");
        } else {
            // Show the structure
            displayStructureText();
            getElements().text.structure.parent.classList.add("visible");
        }
    });
});

/**
 * Prepare the result code block with a placeholder message.
 *
 * @param placeholder Message to display
 * @return {void}
 */
function prepareResult(placeholder) {
    getElements().text.overview.innerHTML = null;
    displayStructureText(placeholder);
}

/**
 * @param isReady Whether the app is ready for interaction.
 */
function setReady(isReady) {
    if (isReady) {
        prepareSong();
        resetSong();
        getElements().button.file.export.disabled = false;
        getElements().button.structure.apply.disabled = false;
        getElements().button.playback.toggle.disabled = false;
        getElements().button.playback.restart.disabled = false;
        getElements().toggle.playback.parity.disabled = false;
    } else {
        stopSong();
        getElements().button.file.export.disabled = true;
        getElements().button.structure.apply.disabled = true;
        getElements().button.playback.toggle.disabled = true;
        getElements().button.playback.restart.disabled = true;
        getElements().toggle.playback.looping.disabled = true;
        getElements().toggle.playback.parity.disabled = true;
        getElements().text.structure.edit.value = "";
    }
}

/**
 * Update the overviews for a song.
 *
 * @param song Song to update overviews with
 */
function updateOverviews(song) {
    getElements().text.overview.innerHTML = "";

    const overviews = generateOverviews(song);

    for (const overview of overviews) {
        const row = document.createElement("tr");

        const key = document.createElement("td");
        key.innerHTML = `<strong>${overview[0]}</strong>`;

        const value = document.createElement("td");
        value.innerHTML = overview[1] === "" ? "None" : overview[1];

        row.append(key);
        row.append(value);

        getElements().text.overview.append(row);
    }
}

/**
 * Update the loaded song.
 *
 * @param song Song to update with
 */
function updateSong(song) {
    setSong(song);
    updateOverviews(song);
}

/**
 * Display the stored structure code.
 *
 * @param code Code to override
 */
function displayStructureText(code) {
    structureText = code || structureText;

    if (!getElements().toggle.structure.hide.checked && editor.getValue() !== structureText) {
        editor.setValue(structureText, -1);
    }
}

/**
 * Check whether the editor state is valid.
 *
 * @return {Object} Content of the editor or last valid state
 */
function checkEditor() {
    const value = editor.getValue();

    // Ensure the new song can be parsed
    if (value !== structureText && canParse(value)) {
        structureText = value;
        return {
            "changed": true,
            value
        };
    } else {
        displayStructureText(structureText);
        return {
            "changed": false,
            "value": structureText
        };
    }
}

/**
 * Generate a Song from an object.
 *
 * @param obj Object to parse.
 * @return {*}
 */
function generateSong(obj) {
    if (typeof obj !== "object" && canParse(obj)) {
        obj = JSON.parse(obj);
    }

    const newSong = new NBSjs.Song();
    Object.assign(newSong, obj);

    return newSong;
}

/**
 * Export the song currently saved in the editor.
 */
function exportSong() {
    const newSong = generateSong(checkEditor().value);

    // Create and download the ArrayBuffer
    const buffer = newSong.toArrayBuffer();
    const blob = new Blob([new Uint8Array(buffer)]);

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.append(link);

    link.click();
    link.remove();
}
