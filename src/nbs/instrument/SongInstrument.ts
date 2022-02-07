import { getInstrumentClass } from "../../util/util";
import Instrument from "./Instrument";

/**
 * Represents the instruments of a song.
 */
export default class SongInstrument {
    /**
     * The loaded instruments of the song.
     */
    public loaded: Instrument[] = [...getInstrumentClass().builtIn];

    /**
     * Amount of default instruments when the song was saved.
     */
    public firstCustomIndex: number = getInstrumentClass().builtIn.length;
};
