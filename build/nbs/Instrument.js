var _a;
export default class Instrument {
    /**
     * Construct an instrument.
     * @param name Name of the instrument
     * @param id ID of the instrument in the song's instrument array
     * @param audioSrc Audio file for the instrument
     * @param pitch Pitch offset of the instrument
     * @param key Key of the instrument
     */
    constructor(name, id, audioSrc, pitch = 0, key = 0) {
        this.name = name;
        this.id = id;
        this.audioSrc = audioSrc;
        this.pitch = pitch === "default" ? 0 : pitch;
        this.key = key === "default" ? 45 : key;
    }
}
_a = Instrument;
/**
 * The built-in instruments.
 */
Instrument.builtIn = [
    new _a("Harp", 0, "harp.ogg", "default", "default"),
    new _a("Double Bass", 1, "dbass.ogg"),
    new _a("Bass Drum", 2, "bdrum.ogg"),
    new _a("Snare Drum", 3, "sdrum.ogg"),
    new _a("Click", 4, "click.ogg"),
    new _a("Guitar", 5, "guitar.ogg"),
    new _a("Flute", 6, "flute.ogg"),
    new _a("Bell", 7, "bell.ogg"),
    new _a("Chime", 8, "chime.ogg"),
    new _a("Xylophone", 9, "xylophone.ogg"),
    new _a("Iron Xylophone", 10, "iron_xylophone.ogg"),
    new _a("Cow Bell", 11, "cow_bell.ogg"),
    new _a("Didgeridoo", 12, "didgeridoo.ogg"),
    new _a("Bit", 13, "bit.ogg"),
    new _a("Banjo", 14, "banjo.ogg"),
    new _a("Pling", 15, "pling.ogg")
];
