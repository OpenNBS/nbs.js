import { defaultInstrumentOptions } from "./InstrumentOptions";

/**
 * Meta information for an {@linkcode Instrument}.
 */
export default interface InstrumentMeta {
    /**
     * The name of the instrument.
     */
    name: string | undefined,

    /**
     * The sound file of the instrument (just the file name, not the path).
     */
    soundFile: string | undefined
};

/**
 * Default {@linkcode InstrumentMeta} values.
 */
export const defaultInstrumentMeta: InstrumentMeta = {
    "name": defaultInstrumentOptions.name,
    "soundFile": defaultInstrumentOptions.soundFile
};
