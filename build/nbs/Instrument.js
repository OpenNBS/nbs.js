var _a;
export default class Instrument {
    /**
     * Construct an instrument.
     * @param name Name of the instrument
     * @param id ID of the instrument in the song's instrument array
     * @param options Options for the instrument
     */
    constructor(name, id, options) {
        this.name = name;
        this.id = id;
        // Parse options
        this.audioSrc = (options === null || options === void 0 ? void 0 : options.audioSrc) || "";
        this.pitch = (options === null || options === void 0 ? void 0 : options.pitch) === undefined ? 0 : options.pitch;
        this.key = (options === null || options === void 0 ? void 0 : options.key) === undefined ? 45 : options.key;
        this.builtIn = (options === null || options === void 0 ? void 0 : options.builtIn) || false;
    }
}
_a = Instrument;
/**
 * The built-in instruments.
 */
Instrument.builtIn = [
    new _a("Harp", 0, {
        "audioSrc": "harp.ogg",
        "builtIn": true
    }),
    new _a("Double Bass", 1, {
        "audioSrc": "dbass.ogg",
        "builtIn": true
    }),
    new _a("Bass Drum", 2, {
        "audioSrc": "bdrum.ogg",
        "builtIn": true
    }),
    new _a("Snare Drum", 3, {
        "audioSrc": "sdrum.ogg",
        "builtIn": true
    }),
    new _a("Click", 4, {
        "audioSrc": "click.ogg",
        "builtIn": true
    }),
    new _a("Guitar", 5, {
        "audioSrc": "guitar.ogg",
        "builtIn": true
    }),
    new _a("Flute", 6, {
        "audioSrc": "flute.ogg",
        "builtIn": true
    }),
    new _a("Bell", 7, {
        "audioSrc": "bell.ogg",
        "builtIn": true
    }),
    new _a("Chime", 8, {
        "audioSrc": "chime.ogg",
        "builtIn": true
    }),
    new _a("Xylophone", 9, {
        "audioSrc": "xylophone.ogg",
        "builtIn": true
    }),
    new _a("Iron Xylophone", 10, {
        "audioSrc": "iron_xylophone.ogg",
        "builtIn": true
    }),
    new _a("Cow Bell", 11, {
        "audioSrc": "cow_bell.ogg",
        "builtIn": true
    }),
    new _a("Didgeridoo", 12, {
        "audioSrc": "didgeridoo.ogg",
        "builtIn": true
    }),
    new _a("Bit", 13, {
        "audioSrc": "bit.ogg",
        "builtIn": true
    }),
    new _a("Banjo", 14, {
        "audioSrc": "banjo.ogg",
        "builtIn": true
    }),
    new _a("Pling", 15, {
        "audioSrc": "pling.ogg",
        "builtIn": true
    })
];
