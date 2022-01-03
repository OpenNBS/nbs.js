"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util/util");
class Layer {
    /**
     * Construct a layer.
     * @param song Song the layer is attached to
     * @param id ID of the layer
     */
    constructor(song, id) {
        /**
         * Name of the layer.
         */
        this.name = "";
        /**
         * Velocity of the layer.
         */
        this.velocity = 100;
        /**
         * Panning of the layer.
         */
        this.panning = 100;
        /**
         * Whether the layer is locked.
         */
        this.locked = false;
        /**
         * Notes within the layer.
         */
        this.notes = [];
        this.song = song;
        this.id = id;
    }
    /**
     * Set a note at a tick.
     * @param tick Tick to set the note
     * @param key The note's key
     * @param panning The note's panning
     * @param velocity The note's velocity
     * @param pitch The note's pitch
     * @param instrument The note's instrument
     */
    setNote(tick, key, panning, velocity, pitch, instrument) {
        // Expand the song if required
        if (tick + 1 > this.song.size) {
            this.song.size = tick + 1;
        }
        // Construct the note
        const note = new ((0, util_1.getNoteClass)())(key, panning, velocity, pitch, instrument);
        this.notes[tick] = note;
        return note;
    }
    /**
     * Delete the layer from the song.
     */
    delete() {
        this.song.deleteLayer(this);
    }
    // todo: shrink song if last tick
    /**
     * Delete a note at a specified tick.
     * @param tick Tick to remove note from
     */
    deleteNote(tick) {
        delete this.notes[tick];
    }
}
exports.default = Layer;
