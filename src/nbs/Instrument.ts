export default class Instrument {
    /**
     * Name of the instrument.
     */
    public name: string;

    /**
     * ID of the instrument.
     */
    public id: number;

    /**
     * Audio source file of the instrument.
     */
    public audioSrc: string;

    /**
     * Pitch of the instrument.
     */
    public pitch: number;

    /**
     * Key of the instrument.
     */
    public key: number;

    /**
     * The built-in instruments.
     */
    public static builtIn = [
        new this(
            "Harp",
            0,
            "harp.ogg",
            "default",
            "default"
        ),
        new this(
            "Double Bass",
            1,
            "dbass.ogg"
        ),
        new this(
            "Bass Drum",
            2,
            "bdrum.ogg"
        ),
        new this(
            "Snare Drum",
            3,
            "sdrum.ogg"
        ),
        new this(
            "Click",
            4,
            "click.ogg"
        ),
        new this(
            "Guitar",
            5,
            "guitar.ogg"
        ),
        new this(
            "Flute",
            6,
            "flute.ogg"
        ),
        new this(
            "Bell",
            7,
            "bell.ogg"
        ),
        new this(
            "Chime",
            8,
            "chime.ogg"
        ),
        new this(
            "Xylophone",
            9,
            "xylophone.ogg"
        ),
        new this(
            "Iron Xylophone",
            10,
            "iron_xylophone.ogg"
        ),
        new this(
            "Cow Bell",
            11,
            "cow_bell.ogg"
        ),
        new this(
            "Didgeridoo",
            12,
            "didgeridoo.ogg"
        ),
        new this(
            "Bit",
            13,
            "bit.ogg"
        ),
        new this(
            "Banjo",
            14,
            "banjo.ogg"
        ),
        new this(
            "Pling",
            15,
            "pling.ogg"
        )
    ];

    /**
     * Construct an instrument.
     * @param name Name of the instrument
     * @param id ID of the instrument in the song's instrument array
     * @param audioSrc Audio file for the instrument
     * @param pitch Pitch offset of the instrument
     * @param key Key of the instrument
     */
    public constructor(name: string, id: number, audioSrc: string, pitch: number | "default" = 0, key: number | "default" = 0) {
        this.name = name;
        this.id = id;
        this.audioSrc = audioSrc;
        this.pitch = pitch === "default" ? 0 : pitch;
        this.key = key === "default" ? 45 : key;
    }
}
