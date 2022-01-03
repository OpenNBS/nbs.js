"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Note {
    /**
     * Construct a note.
     * @param key Key of the note
     * @param panning Panning of the note
     * @param velocity Velocity of the note
     * @param pitch Pitch of the note
     * @param instrument Instrument of the note
     */
    constructor(key, panning, velocity, pitch, instrument) {
        this.key = key;
        this.panning = panning;
        this.velocity = velocity;
        this.pitch = pitch;
        this.instrument = instrument;
    }
}
exports.default = Note;
