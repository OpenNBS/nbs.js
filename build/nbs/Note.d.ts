import Instrument from "./Instrument";
export default class Note {
    /**
     * Key of the note.
     */
    key: number;
    /**
     * Panning of the note.
     */
    panning: number;
    /**
     * Velocity of the note.
     */
    velocity: number;
    /**
     * Pitch of the note.
     */
    pitch: number;
    /**
     * Instrument of the note.
     */
    instrument: Instrument;
    /**
     * Construct a note.
     * @param key Key of the note
     * @param panning Panning of the note
     * @param velocity Velocity of the note
     * @param pitch Pitch of the note
     * @param instrument Instrument of the note
     */
    constructor(key: number, panning: number, velocity: number, pitch: number, instrument: Instrument);
}
