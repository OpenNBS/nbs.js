import Song from "./Song";
import Note from "./Note";
import Instrument from "./Instrument";
import { getNoteClass } from "../util/util";

/**
 * Represents a layer of a song instance.
 */
export default class Layer {
    /**
     * Song instance this layer is attached to.
     *
     * @internal
     */
    private song: Song;

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
    public panning = 100;

    /**
     * Whether the layer is locked or muted.
     */
    public locked = false;

    /**
     * Notes within the layer.
     */
    public notes: Note[] = [];

    /**
     * Construct a layer.
     *
     * @param song Song the layer is attached to
     * @param id ID of the layer
     */
    public constructor(song: Song, id: number) {
        this.song = song;
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
        // Expand the song if required
        if (tick + 1 > this.song.size) {
            this.song.size = tick + 1;
        }

        // Construct the note
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

    /**
     * Delete the layer from the song.
     */
    public delete(): void {
        this.song.deleteLayer(this);
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
