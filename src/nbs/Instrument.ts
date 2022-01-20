import { InstrumentOptions } from "./interfaces/InstrumentOptions";

/**
 * Represents an instrument of a {@linkcode Note}.
 */
export default class Instrument {
    /**
     * Name of the instrument.
     */
    public name = "";

    /**
     * ID of the instrument.
     *
     * Used internally to order lists.
     */
    public id: number;

    /**
     * Audio source file of the instrument.
     *
     * NBS.js does not handle audio playback, this field is for storage.
     */
    public audioSrc = "";

    /**
     * Key of the instrument.
     *
     * @example E = 44, F = 45
     */
    public key = 45;

    /**
     * Whether the instrument is a built-in instrument.
     */
    public builtIn = false;

    /**
     * Whether the instrument should press the keys on a keyboard.
     */
    public pressKey = false;

    /**
     * The built-in instruments.
     *
     * Includes harp, double bass, bass drum, snare drum, click, guitar, flute, bell, chime, xylophone, iron xylophone, cow bell, didgeridoo, bit, banjo, and pling.
     *
     * All {@linkcode audioSrc} fields are empty by default - implementation dependent.
     */
    public static builtIn = [
        new this(
            "Harp",
            0,
            {
                "builtIn": true
            }
        ),
        new this(
            "Double Bass",
            1,
            {
                "builtIn": true
            }
        ),
        new this(
            "Bass Drum",
            2,
            {
                "builtIn": true
            }
        ),
        new this(
            "Snare Drum",
            3,
            {
                "builtIn": true
            }
        ),
        new this(
            "Click",
            4,
            {
                "builtIn": true
            }
        ),
        new this(
            "Guitar",
            5,
            {
                "builtIn": true
            }
        ),
        new this(
            "Flute",
            6,
            {
                "builtIn": true
            }
        ),
        new this(
            "Bell",
            7,
            {
                "builtIn": true
            }
        ),
        new this(
            "Chime",
            8,
            {
                "builtIn": true
            }
        ),
        new this(
            "Xylophone",
            9,
            {
                "builtIn": true
            }
        ),
        new this(
            "Iron Xylophone",
            10,
            {
                "builtIn": true
            }
        ),
        new this(
            "Cow Bell",
            11,
            {
                "builtIn": true
            }
        ),
        new this(
            "Didgeridoo",
            12,
            {
                "builtIn": true
            }
        ),
        new this(
            "Bit",
            13,
            {
                "builtIn": true
            }
        ),
        new this(
            "Banjo",
            14,
            {
                "builtIn": true
            }
        ),
        new this(
            "Pling",
            15,
            {
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
        this.key = options?.key === undefined ? 45 : options.key;
        this.builtIn = options?.builtIn ?? false;
        this.pressKey = options?.pressKey ?? false;
    }
}
