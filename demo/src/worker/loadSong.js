self.importScripts("../NBS.js");
self.importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js");

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
            "audioSrc": "./assets/harp.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Double Bass",
        1,
        {
            "audioSrc": "./assets/dbass.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Bass Drum",
        2,
        {
            "audioSrc": "./assets/bdrum.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Snare Drum",
        3,
        {
            "audioSrc": "./assets/sdrum.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Click",
        4,
        {
            "audioSrc": "./assets/click.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Guitar",
        5,
        {
            "audioSrc": "./assets/guitar.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Flute",
        6,
        {
            "audioSrc": "./assets/flute.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Bell",
        7,
        {
            "audioSrc": "./assets/bell.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Chime",
        8,
        {
            "audioSrc": "./assets/chime.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Xylophone",
        9,
        {
            "audioSrc": "./assets/xylophone.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Iron Xylophone",
        10,
        {
            "audioSrc": "./assets/iron_xylophone.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Cow Bell",
        11,
        {
            "audioSrc": "./assets/cow_bell.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Didgeridoo",
        12,
        {
            "audioSrc": "./assets/didgeridoo.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Bit",
        13,
        {
            "audioSrc": "./assets/bit.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Banjo",
        14,
        {
            "audioSrc": "./assets/banjo.ogg",
            "builtIn": true
        }
    ),
    new Instrument(
        "Pling",
        15,
        {
            "audioSrc": "./assets/pling.ogg",
            "builtIn": true
        }
    )
];

NBSjs.setInstrumentClass(Instrument);

self.addEventListener("message", async event => {
    const data = {};

    // Load the song
    const song = NBSjs.Song.fromArrayBuffer(await event.data.file.arrayBuffer());
    data.song = _.cloneDeep(song);
    data.timePerTick = song.timePerTick;
    data.instruments = song.instruments;

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

    // Display the instruments first
    data.structureText = `Instruments: ${JSON.stringify(song.instruments, null, 4)}\n\n`;
    data.overviews = [[
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
    ]];

    // Stringify the song structure
    const cache = [];
    data.structureText += "Song: " + JSON.stringify(song, (key, value) => {
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

    postMessage(data);
});
