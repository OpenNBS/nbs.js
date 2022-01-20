import Song from "./Song";
import Note from "./Note";
import Instrument from "./Instrument";
import { getNoteClass } from "../util/util";

/**
 * Represents a layer of a song instance.
 */
export default class Layer {
    /**
     * Name of the layer.
     */
    public name = "";

    /**
     * ID (index) of the layer.
     *
     * Used internally to order lists.
     */
    public id: number;

    /**
     * Velocity (volume) of the layer.
     */
    public velocity = 100;

    /**
     * Panning of the layer.
     */
    public panning = 0;

    /**
     * Whether the layer is locked or muted.
     */
    public locked = false;

    /**
     * Whether the layer is solo.
     */
    public solo = false;

    /**
     * Notes within the layer.
     */
    public notes: Note[] = [];

    /**
     * Construct a layer.
     *
     * @param id ID of the layer
     */
    public constructor(id: number) {
        this.id = id;
    }

    /**
     * Create and add a note to a tick.
     *
     * @param instrument The note's instrument
     * @param tick Tick to set the note
     * @param key The note's key
     * @param panning The note's panning
     * @param velocity The note's velocity
     * @param pitch The note's pitch
     */
    public addNote(tick: number, instrument?: Instrument, key?: number, panning?: number, velocity?: number, pitch?: number): Note {
        const note = new (getNoteClass())(instrument, key, panning, velocity, pitch);
        this.notes[tick] = note;
        return note;
    }

    /**
     * Set a note at a tick.
     *
     * @param tick Tick to set note on
     * @param note Note to set on tick
     */
    public setNote(tick: number, note: Note): void {
        this.notes[tick] = note;
    }

    // TODO: Shrink song if available
    /**
     * Delete a note at a specified tick.
     *
     * @param tick Tick to remove note from
     */
    public deleteNote(tick: number): void {
        delete this.notes[tick];
    }
}
