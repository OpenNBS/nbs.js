import {
    getElements,
    getInstruments,
    getLoadedInstruments,
    pushLoadedInstruments,
    getSong, setInstruments
} from "../util/globals.js";
import { decodeAudioData, playNote } from "./audio.js";

let stopPlaying = true;
let currentTick = -1;
let currentLoop = 0;

/**
 * Prepare and play the loaded song.
 * @return {Promise<void>}
 */
export async function prepareSong() {
    const loadedInstruments = getLoadedInstruments() || new Map();
    const instruments = getSong().instruments;

    // Load all instruments
    const instrumentMap = new Map();
    for (const instrument of instruments) {
        let cantLoad = false;

        if (!instrument.audioBuffer) {
            // Get the loaded instruments
            const loadedInstrument = loadedInstruments.get(instrument.audioSrc);

            if (loadedInstrument) {
                instrument.audioBuffer = loadedInstrument;
            } else if (instrument.builtIn) {
                // Load built-in instruments
                const data = await fetch(instrument.audioSrc);
                const buffer = await data.arrayBuffer();
                instrument.audioBuffer = await decodeAudioData(buffer);

                pushLoadedInstruments(instrument.audioSrc, buffer);
            } else {
                cantLoad = true;
            }
        }

        // Add to the song instrument map
        if (!cantLoad) {
            instrumentMap.set(instrument.name, instrument);
        }
    }

    setInstruments(instrumentMap);

    // Check looping toggle if available
    getElements().toggle.playback.looping.disabled = !getSong().loopEnabled;
    getElements().toggle.playback.looping.checked = getSong().loopEnabled;
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
    delete getElements().button.playback.toggle.dataset.toggled;
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

    const instruments = getInstruments();
    const hasSolo = getSong().hasSolo;
    const totalLayers = getSong().layers.length;

    // eslint-disable-next-line no-unmodified-loop-condition
    while (!stopPlaying) {
        // Iterate each layer
        for (let currentLayer = 0; currentLayer < totalLayers; currentLayer++) {
            const layer = getSong().layers[currentLayer];

            // Skip non-solo layers
            if (hasSolo && !layer.solo) {
                continue;
            }

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
                    notePitch = notePitch - 2;
                }

                // Play the note
                playNote(
                    note.key,
                    instruments.get(note.instrument.name),
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
        if (currentTick === getSong().size) {
            // Loop if available
            if (getElements().toggle.playback.looping.checked && (getSong().maxLoopCount === 0 || currentLoop < getSong().maxLoopCount)) {
                currentLoop++;
                currentTick = getSong().loopStartTick;
            } else {
                resetSong();
            }
        }
    }
}
