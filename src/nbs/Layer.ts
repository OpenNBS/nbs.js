import Note from "./Note";
import Instrument from "./instrument/Instrument";
import { getNoteClass } from "../util/util";
import { defaultLayerMeta } from "./interfaces/layer/LayerMeta";
import NoteOptions, { defaultNoteOptions } from "./interfaces/note/NoteOptions";

/**
 * Represents a layer of a song instance.
 */
export default class Layer {
    /**
     * ID of the layer.
     */
    public id: number;

    /**
     * Meta information for the layer.
     *
     * @see {@linkcode LayerMeta}
     */
    public meta = defaultLayerMeta;

    /**
     * Whether or not this layer has been marked as locked.
     */
    public isLocked = false;

    /**
     * Whether or not this layer has been marked as solo.
     */
    public isSolo = false;

    /**
     * The volume of the layer (percentage).
     */
    public volume = 100;

    /**
     * How much this layer is panned to the left/right. 0 is 2 blocks right, 100 is center, 200 is 2 blocks left.
     */
    public stereo = 0;

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
     * Set the note at a tick.
     *
     * @param tick Tick to set the note on
     * @param note Note to set on tick
     */
    public setNote(tick: number, note: Note): Note {
        this.notes[tick] = note;
        return note;
    }

    /**
     * Create and add a note to a tick.
     *
     * @param tick Tick to set the note
     * @param instrument The note's instrument
     * @param options Options for the note
     */
    public addNote(tick: number, instrument: Instrument | number = 0, options: NoteOptions = defaultNoteOptions): Note {
        const note = new (getNoteClass())(instrument, options);
        return this.setNote(tick, note);
    }

    /**
     * Delete a note at a specified tick.
     *
     * @param tick Tick to remove note from
     */
    public deleteNote(tick: number): void {
        delete this.notes[tick];
    }
}
