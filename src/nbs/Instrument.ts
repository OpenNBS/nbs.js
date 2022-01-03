interface InstrumentOptions {
    "audioSrc"?: string,
    "pitch"?: number,
    "key"?: number,
    "builtIn"?: boolean
}

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
     * Whether the instrument is a built-in instrument.
     */
    public builtIn: boolean;

    /**
     * The built-in instruments.
     */
    public static builtIn = [
        new this(
            "Harp",
            0,
            {
                "audioSrc": "harp.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Double Bass",
            1,
            {
                "audioSrc": "dbass.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Bass Drum",
            2,
            {
                "audioSrc": "bdrum.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Snare Drum",
            3,
            {
                "audioSrc": "sdrum.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Click",
            4,
            {
                "audioSrc": "click.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Guitar",
            5,
            {
                "audioSrc": "guitar.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Flute",
            6,
            {
                "audioSrc": "flute.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Bell",
            7,
            {
                "audioSrc": "bell.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Chime",
            8,
            {
                "audioSrc": "chime.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Xylophone",
            9,
            {
                "audioSrc": "xylophone.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Iron Xylophone",
            10,
            {
                "audioSrc": "iron_xylophone.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Cow Bell",
            11,
            {
                "audioSrc": "cow_bell.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Didgeridoo",
            12,
            {
                "audioSrc": "didgeridoo.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Bit",
            13,
            {
                "audioSrc": "bit.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Banjo",
            14,
            {
                "audioSrc": "banjo.ogg",
                "builtIn": true
            }
        ),
        new this(
            "Pling",
            15,
            {
                "audioSrc": "pling.ogg",
                "builtIn": true
            }
        )
    ];

    /**
     * Construct an instrument.
     * @param name Name of the instrument
     * @param id ID of the instrument in the song's instrument array
     * @param options Options for the instrument
     */
    public constructor(name: string, id: number, options?: InstrumentOptions) {
        this.name = name;
        this.id = id;

        // Parse options
        this.audioSrc = options?.audioSrc || "";
        this.pitch = options?.pitch === undefined ? 0 : options.pitch;
        this.key = options?.key === undefined ? 45 : options.key;
        this.builtIn = options?.builtIn || false;
    }
}
