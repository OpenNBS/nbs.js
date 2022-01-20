/**
 * Options available for the instrument.
 */
export interface InstrumentOptions {
    /**
     * Audio source file of the instrument.
     *
     * @see {@linkcode Instrument.audioSrc}
     */
    "audioSrc"?: string,

    /**
     * Key of the instrument.
     *
     * @see {@linkcode Instrument.key}
     */
    "key"?: number,

    /**
     * Whether the instrument is a built-in instrument.
     *
     * @see {@linkcode Instrument.builtIn}
     */
    "builtIn"?: boolean,

    /**
     * Whether the instrument should press the keys on a keyboard.
     *
     * @see {@linkcode Instrument.pressKey}
     */
    "pressKey"?: boolean
}
