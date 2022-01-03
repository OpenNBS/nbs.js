interface InstrumentOptions {
    "audioSrc"?: string;
    "pitch"?: number;
    "key"?: number;
    "builtIn"?: boolean;
}
export default class Instrument {
    /**
     * Name of the instrument.
     */
    name: string;
    /**
     * ID of the instrument.
     */
    id: number;
    /**
     * Audio source file of the instrument.
     */
    audioSrc: string;
    /**
     * Pitch of the instrument.
     */
    pitch: number;
    /**
     * Key of the instrument.
     */
    key: number;
    /**
     * Whether the instrument is a built-in instrument.
     */
    builtIn: boolean;
    /**
     * The built-in instruments.
     */
    static builtIn: Instrument[];
    /**
     * Construct an instrument.
     * @param name Name of the instrument
     * @param id ID of the instrument in the song's instrument array
     * @param options Options for the instrument
     */
    constructor(name: string, id: number, options?: InstrumentOptions);
}
export {};
