/**
 * Options available for an {@linkcode Instrument}.
 */
export default interface InstrumentOptions {
    /**
     * The name of the instrument.
     */
    "name"?: string,

    /**
     * The sound file of the instrument (just the file name, not the path).
     */
    "soundFile"?: string,

    /**
     * The pitch of the sound file. Just like the note blocks, this ranges from 0-87.
     */
    "pitch"?: number,

    /**
     * Whether the piano should automatically press keys with this instrument when the marker passes them.
     */
    "pressKey"?: boolean

    /**
     * Whether the instrument is a built-in instrument.
     */
    "builtIn"?: boolean,
};

/**
 * Default {@linkcode InstrumentOptions} values.
 */
export const defaultInstrumentOptions: InstrumentOptions = {
    "name": "",
    "soundFile": "",
    "pitch": 45,
    "pressKey": false,
    "builtIn": false
};
