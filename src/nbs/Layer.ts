import { defaultNoteOptions, Note, NoteOptions } from "./Note";
import { Instrument } from "./instrument/Instrument";

/**
 * Meta information for a {@linkcode Layer}.
 */
export interface LayerMeta {
	/**
	 * The name of the layer.
	 */
	name: string;
}

/**
 * Default {@linkcode LayerMeta} values.
 */
export const defaultLayerMeta: LayerMeta = {
	"name": ""
};

/**
 * Represents a layer of a song instance.
 */
export class Layer {
	/**
	 * ID of the layer.
	 */
	public id: number;

	/**
	 * Meta information for the layer.
	 *
	 * @see {@linkcode LayerMeta}
	 */
	public meta = { ...defaultLayerMeta };

	/**
	 * Whether this layer has been marked as locked.
	 */
	public isLocked = false;

	/**
	 * Whether this layer has been marked as solo.
	 */
	public isSolo = false;

	/**
	 * The volume of the layer.
	 *
	 * @remarks
	 * Unit: Percentage
	 */
	public volume = 100;

	/**
	 * How much this layer is panned to the left or right.
	 *
	 * @remarks
	 * -100 is 2 blocks right, 0 is center, 100 is 2 blocks left.
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
		const note = new Note(instrument, options);
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
