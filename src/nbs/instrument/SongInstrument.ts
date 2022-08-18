import { Instrument } from "./Instrument";

/**
 * Represents the instruments of a song.
 */
export class SongInstrument {
    /**
     * The loaded instruments of the song.
     */
    public loaded: Instrument[] = [...Instrument.builtIn];

    /**
     * Amount of default instruments when the song was saved.
     */
    public firstCustomIndex: number = Instrument.builtIn.length;
}
