import { getElements, getLoadedInstruments, getSong, pushLoadedInstruments, setInstruments } from "../util/globals.js";
import { decodeAudioData } from "./audio.js";
import { displayProgress } from "../util/util.js";

/**
 * Represents an instrument
 */
class Instrument extends NBSjs.Instrument {
    /**
     * The resulting audio buffer that will contain the sound
     * Set by loadAudio() or load()
     */
    audioBuffer = "";

    constructor(name, id, options) {
        super(name, id, options);

        if (options !== undefined) {
            this.audioSrc = options.audioSrc || "";
        }
    }
}

/**
 * Builtin instruments
 */
Instrument.builtIn = [
    // Vue will set the correct sources and sometimes inline images using require()
    new Instrument(
        "Harp",
        0,
        {
            "audioSrc": "assets/harp.mp3",
            "builtIn": true,
            "pressKey": true
        }
    ),
    new Instrument(
        "Double Bass",
        1,
        {
            "audioSrc": "assets/dbass.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Bass Drum",
        2,
        {
            "audioSrc": "assets/bdrum.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Snare Drum",
        3,
        {
            "audioSrc": "assets/sdrum.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Click",
        4,
        {
            "audioSrc": "assets/click.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Guitar",
        5,
        {
            "audioSrc": "assets/guitar.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Flute",
        6,
        {
            "audioSrc": "assets/flute.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Bell",
        7,
        {
            "audioSrc": "assets/bell.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Chime",
        8,
        {
            "audioSrc": "assets/chime.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Xylophone",
        9,
        {
            "audioSrc": "assets/xylophone.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Iron Xylophone",
        10,
        {
            "audioSrc": "assets/iron_xylophone.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Cow Bell",
        11,
        {
            "audioSrc": "assets/cow_bell.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Didgeridoo",
        12,
        {
            "audioSrc": "assets/didgeridoo.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Bit",
        13,
        {
            "audioSrc": "assets/bit.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Banjo",
        14,
        {
            "audioSrc": "assets/banjo.mp3",
            "builtIn": true
        }
    ),
    new Instrument(
        "Pling",
        15,
        {
            "audioSrc": "assets/pling.mp3",
            "builtIn": true
        }
    )
];

NBSjs.setInstrumentClass(Instrument);

/**
 * Load a song from a file.
 *
 * @param data Data to receive
 * @return Generated song data
 */
export async function loadSong(data) {
    // Load the song
    // TODO: Potential issue loading custom instruments
    // It appears the custom instruments are stacking each time a song is loaded
    const t1 = performance.now();
    const song = NBSjs.Song.fromArrayBuffer(await data.file.arrayBuffer());
    const t2 = performance.now();

    // Send the loaded data back
    return {
        song,
        "loadTime": t2 - t1,
        "structureText": JSON.stringify(song, undefined, 4)
    };
}

/**
 * Generate the overviews for a song.
 *
 * @param song Song to generate from
 * @param loadedInstruments Instruments that are currently loaded
 * @return Generated overviews
 */
export function generateOverviews(song, loadedInstruments) {
    const duration = {
        "seconds": (song.timePerTick * song.size) / 1000,
        get "s"() {
            return (this.seconds % 60).toFixed(2);
        },
        get "m"() {
            return Math.floor(this.seconds / 60);
        },
        get "format"() {
            return `${prependZeros(this.m)}:${prependZeros(this.s)}`;
        }
    };

    // Iterate each loaded instrument
    const availableInstruments = [];
    if (loadedInstruments) {
        for (const [key, value] of loadedInstruments) {
            availableInstruments.push(value.name);
        }
    }

    return [[
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
        "Song tick length",
        song.size
    ], [
        "Song duration",
        duration.format
    ], [
        "Total layers",
        song.layers.length
    ], [
        "Custom instruments",
        song.instruments.map(i => {
            if (!i.builtIn) {
                return i.name;
            }

            return null;
        }).filter(Boolean)
            .join(", ")
    ], [
        "Available instruments",
        availableInstruments.join(", ")
    ]];
}

/**
 * Load the instruments for a song.
 *
 * @return {Promise<void>}
 */
export async function prepareSong() {
    displayProgress("Loading instruments...");

    const loadedInstruments = getLoadedInstruments() || new Map();
    const instruments = getSong().instruments;
    const totalInstruments = instruments.length;

    // Load all instruments
    const instrumentMap = new Map();
    for (let i = 0; i < totalInstruments; i++) {
        const instrument = instruments[i];
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
 * Prepend a number with zeros if required.
 *
 * @param num Number to prepend
 * @returns {string}
 */
function prependZeros(num) {
    return Array.from({ "length": Math.max(3 - Math.floor(num).toString().length, 0) }).join("0") + num;
}
