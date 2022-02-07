import InstrumentOptions, { defaultInstrumentOptions } from "../interfaces/instrument/InstrumentOptions";
import { defaultInstrumentMeta } from "../interfaces/instrument/InstrumentMeta";

/**
 * Represents an instrument of a {@linkcode Note}.
 */
export default class Instrument {
    /**
     * The built-in instruments.
     *
     * Includes harp, double bass, bass drum, snare drum, click, guitar, flute, bell, chime, xylophone, iron xylophone, cow bell, didgeridoo, bit, banjo, and pling.
     */
    public static builtIn = [
        new this(
            0,
            {
                "name": "Harp",
                "soundFile": "harp.ogg",
                "builtIn": true
            }
        ),
        new this(
            1,
            {
                "name": "Double Bass",
                "soundFile": "dbass.ogg",
                "builtIn": true
            }
        ),
        new this(
            2,
            {
                "name": "Bass Drum",
                "soundFile": "bdrum.ogg",
                "builtIn": true
            }
        ),
        new this(
            3,
            {
                "name": "Snare Drum",
                "soundFile": "sdrum.ogg",
                "builtIn": true
            }
        ),
        new this(
            4,
            {
                "name": "Click",
                "soundFile": "click.ogg",
                "builtIn": true
            }
        ),
        new this(
            5,
            {
                "name": "Guitar",
                "soundFile": "guitar.ogg",
                "builtIn": true
            }
        ),
        new this(
            6,
            {
                "name": "Flute",
                "soundFile": "flute.ogg",
                "builtIn": true
            }
        ),
        new this(
            7,
            {
                "name": "Bell",
                "soundFile": "bell.ogg",
                "builtIn": true
            }
        ),
        new this(
            8,
            {
                "name": "Chime",
                "soundFile": "icechime.ogg",
                "builtIn": true
            }
        ),
        new this(
            9,
            {
                "name": "Xylophone",
                "soundFile": "xylobone.ogg",
                "builtIn": true
            }
        ),
        new this(
            10,
            {
                "name": "Iron Xylophone",
                "soundFile": "iron_xylophone.ogg",
                "builtIn": true
            }
        ),
        new this(
            11,
            {
                "name": "Cow Bell",
                "soundFile": "cow_bell.ogg",
                "builtIn": true
            }
        ),
        new this(
            12,
            {
                "name": "Didgeridoo",
                "soundFile": "didgeridoo.ogg",
                "builtIn": true
            }
        ),
        new this(
            13,
            {
                "name": "Bit",
                "soundFile": "bit.ogg",
                "builtIn": true
            }
        ),
        new this(
            14,
            {
                "name": "Banjo",
                "soundFile": "banjo.ogg",
                "builtIn": true
            }
        ),
        new this(
            15,
            {
                "name": "Pling",
                "soundFile": "pling.ogg",
                "builtIn": true
            }
        )
    ];

    /**
     * ID of the instrument.
     *
     * Used internally for built-in instruments.
     */
    public id: number;

    /**
     * Meta information for the instrument.
     *
     * @see {@linkcode InstrumentMeta}
     */
    public meta = { ...defaultInstrumentMeta };

    /**
     * The pitch of the sound file. Just like the note blocks, this ranges from 0-87.
     */
    public pitch = defaultInstrumentOptions.pitch;

    /**
     * Whether the piano should automatically press keys with this instrument when the marker passes them.
     */
    public pressKey = defaultInstrumentOptions.pressKey;

    /**
     * Whether the instrument is a built-in instrument.
     */
    public builtIn = defaultInstrumentOptions.builtIn;

    /**
     * Construct an instrument.
     * @param id ID of the instrument in the song's instrument array
     * @param options Options for the instrument
     */
    public constructor(id: number, options: InstrumentOptions = defaultInstrumentOptions) {
        this.id = id;

        // Parse options
        if (options) {
            this.meta.name = options.name ?? defaultInstrumentOptions.name;
            this.meta.soundFile = options.soundFile ?? defaultInstrumentOptions.soundFile;
            this.pressKey = options.pressKey ?? defaultInstrumentOptions.pressKey;
            this.pitch = options.pitch ?? defaultInstrumentOptions.pitch;
            this.builtIn = options.builtIn ?? defaultInstrumentOptions.builtIn;
        }
    }
}
