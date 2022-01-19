import { getElements, getSong } from "../util/globals.js";
import { decodeAudioData, playNote } from "./audio.js";

const instrumentMap = new Map();
let stopPlaying = true;
let currentTick = -1;
let currentLoop = 0;

/**
 * Prepare and play the loaded song.
 * @return {Promise<void>}
 */
export async function prepareSong() {
    // Load all instruments
    await Promise.all(getSong().instruments.map(instrument => {
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
    getElements().toggle.playback.looping.disabled = !getSong().song.loopEnabled;
    getElements().toggle.playback.looping.checked = getSong().song.loopEnabled;
}

/**
 * Start the currently loaded song.
 * @return {void}
 */
export function startSong() {
    stopPlaying = false;
    getElements().button.playback.toggle.dataset.toggled = "true";
    playSong();
}

/**
 * Stop the currently playing song.
 * @return {void}
 */
export function stopSong() {
    getElements().button.playback.toggle.dataset.toggled = "false";
    stopPlaying = true;
}

/**
 * Reset the currently playing song.
 * @return {void}
 */
export function resetSong() {
    stopSong();
    currentTick = -1;
    currentLoop = 0;
}

/**
 * Play a song.
 * @return {void}
 */
export async function playSong() {
    if (!getSong()) {
        return;
    }

    const totalLayers = getSong().song.layers.length;

    // eslint-disable-next-line no-unmodified-loop-condition
    while (!stopPlaying) {
        // Iterate each layer
        for (let currentLayer = 0; currentLayer < totalLayers; currentLayer++) {
            const layer = getSong().song.layers[currentLayer];

            // Skip locked layers
            if (layer.locked) {
                continue;
            }

            const note = layer?.notes[currentTick];

            // Ensure a note is on the tick
            if (note) {
                let notePanning = (note.panning + layer.panning) / 2;
                let notePitch = note.pitch;

                // ONBS parity settings
                if (getElements().toggle.playback.parity.checked) {
                    notePanning = layer.panning === 0 ? note.panning : notePanning;
                    notePitch = notePitch - 20;
                }

                // Play the note
                playNote(
                    note.key,
                    instrumentMap.get(note.instrument.name),
                    (note.velocity * layer.velocity) / 100,
                    notePanning,
                    notePitch
                );
            }
        }

        // Wait until next tick
        await new Promise(resolve => setTimeout(resolve, getSong().timePerTick));

        currentTick++;

        // Loop or stop song
        if (currentTick === getSong().song.size) {
            // Loop if available
            if (getElements().toggle.playback.looping.checked && (getSong().song.maxLoopCount === 0 || currentLoop < getSong().song.maxLoopCount)) {
                currentLoop++;
                currentTick = getSong().song.loopStartTick;
            } else {
                resetSong();
            }
        }
    }
}
