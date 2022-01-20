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
            "builtIn": true,
            "pressKey": true
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

export async function loadSong(data) {
    // Load the song
    const song = NBSjs.Song.fromArrayBuffer(await data.file.arrayBuffer());
    const modSong = _.cloneDeep(song);

    const returnData = {
        song
    };

    // Remove undefined notes and empty layers
    const newLayers = [];
    const totalLayers = modSong.layers.length;
    for (let i = 0; i < totalLayers; i++) {
        const layer = modSong.layers[i];

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

    modSong.layers = newLayers;

    const duration = {
        "seconds": (modSong.timePerTick * modSong.size) / 1000,
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

    // Display the instruments first
    returnData.overviews = [[
        "NBS version",
        modSong.nbsVersion
    ], [
        "Song name",
        modSong.name
    ], [
        "Song author",
        modSong.author
    ], [
        "Song description",
        modSong.description
    ], [
        "Song tick length",
        modSong.size
    ], [
        "Song duration",
        duration.format
    ], [
        "Total layers",
        modSong.layers.length
    ], [
        "Custom instruments",
        modSong.instruments.map(i => {
            if (!i.builtIn) {
                return i.name;
            }

            return null;
        }).filter(Boolean)
            .join(", ")
    ]];

    // Stringify the song structure
    returnData.structureText = JSON.stringify(modSong, undefined, 4);

    return returnData;
}

function prependZeros(num) {
    return Array.from({ "length": Math.max(3 - Math.floor(num).toString().length, 0) }).join("0") + num;
}
