import Instrument from "./Instrument";

export default class Note {
    /**
     * Key of the note.
     */
    public key: number;

    /**
     * Panning of the note.
     */
    public panning: number;

    /**
     * Velocity of the note.
     */
    public velocity: number;

    /**
     * Pitch of the note.
     */
    public pitch: number;

    /**
     * Instrument of the note.
     */
    public instrument: Instrument;

    /**
     * Construct a note.
     * @param key Key of the note
     * @param panning Panning of the note
     * @param velocity Velocity of the note
     * @param pitch Pitch of the note
     * @param instrument Instrument of the note
     */
    public constructor(key: number, panning: number, velocity: number, pitch: number, instrument: Instrument) {
        this.key = key;
        this.panning = panning;
        this.velocity = velocity;
        this.pitch = pitch;
        this.instrument = instrument;
    }
}
