import Instrument from "./Instrument";

export default class Note {
    /**
     * Instrument of the note.
     */
    public instrument: Instrument;

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
     * Construct a note.
     * @param instrument Instrument of the note
     * @param key Key of the note
     * @param panning Panning of the note
     * @param velocity Velocity of the note
     * @param pitch Pitch of the note
     */
    public constructor(instrument?: Instrument, key?: number, panning?: number, velocity?: number, pitch?: number) {
        this.instrument = instrument || Instrument.builtIn[0];
        this.key = key || 45;
        this.panning = panning || 0;
        this.velocity = velocity || 100;
        this.pitch = pitch || 0;
    }
}
