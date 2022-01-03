import Song from "./Song";
import Note from "./Note";
import Instrument from "./Instrument";
export default class Layer {
    private song;
    /**
     * Name of the layer.
     */
    name: string;
    /**
     * ID of the layer.
     */
    id: number;
    /**
     * Velocity of the layer.
     */
    velocity: number;
    /**
     * Panning of the layer.
     */
    panning: number;
    /**
     * Whether the layer is locked.
     */
    locked: boolean;
    /**
     * Notes within the layer.
     */
    notes: Note[];
    /**
     * Construct a layer.
     * @param song Song the layer is attached to
     * @param id ID of the layer
     */
    constructor(song: Song, id: number);
    /**
     * Set a note at a tick.
     * @param tick Tick to set the note
     * @param key The note's key
     * @param panning The note's panning
     * @param velocity The note's velocity
     * @param pitch The note's pitch
     * @param instrument The note's instrument
     */
    setNote(tick: number, key: number, panning: number, velocity: number, pitch: number, instrument: Instrument): Note;
    /**
     * Delete the layer from the song.
     */
    delete(): void;
    /**
     * Delete a note at a specified tick.
     * @param tick Tick to remove note from
     */
    deleteNote(tick: number): void;
}
