import Song from "./Song";
import Note from "./Note";
import Instrument from "./Instrument";
import { getNoteClass } from "../util/util";

export default class Layer {
    private song: Song;

    /**
     * Name of the layer.
     */
    public name = "";

    /**
     * ID of the layer.
     */
    public id: number;

    /**
     * Velocity of the layer.
     */
    public velocity = 100;

    /**
     * Panning of the layer.
     */
    public panning = 100;

    /**
     * Whether the layer is locked.
     */
    public locked = false;

    /**
     * Notes within the layer.
     */
    public notes: Note[] = [];

    /**
     * Construct a layer.
     * @param song Song the layer is attached to
     * @param id ID of the layer
     */
    public constructor(song: Song, id: number) {
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
    public setNote(tick: number, key: number, panning: number, velocity: number, pitch: number, instrument: Instrument): Note {
        // Expand the song if required
        if (tick + 1 > this.song.size) {
            this.song.size = tick + 1;
        }

        // Construct the note
        const note = new (getNoteClass())(key, panning, velocity, pitch, instrument);
        this.notes[tick] = note;
        return note;
    }

    /**
     * Delete the layer from the song.
     */
    public delete(): void {
        this.song.deleteLayer(this);
    }

    // todo: shrink song if last tick
    /**
     * Delete a note at a specified tick.
     * @param tick Tick to remove note from
     */
    public deleteNote(tick: number): void {
        delete this.notes[tick];
    }
}
