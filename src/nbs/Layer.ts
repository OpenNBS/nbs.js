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
 * The notes contained within the layer.
 *
 * @remarks
 * Designed similarly to an array, indexed by tick number.
 *
 * @example
 * ```js
 * // To access the song's first note,
 * layer.notes[0];
 *
 * // To count the number of notes
 * Object.keys(layer.notes).length;
 *
 * // Practical example: reading every note in a song
 * for (const tick in song.length) { // Iterate through every tick in the song
 * 	for (const layer in song.layers) { // On each tick, iterate every layer
 * 		const note = layer.notes[ticks]; // Read the layer's notes at the current tick
 *
 * 		// Not all ticks contain notes!
 * 		// If the layer does not contain a note at the current tick, it'll simply be undefined
 * 		if (!note) {
 * 			continue;
 * 		}
 *
 * 		console.dir(note);
 * 	}
 * }
 * ```
 */
export interface LayerNotes {
	/**
	 * Each tick-note pair.
	 *
	 * @see {@linkcode Note}
	 */
	[tick: number]: Note;
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
	 * Whether the layer is stored within a song.
	 */
	public inSong = false;

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
	 *
	 * @see {@linkcode LayerNotes}
	 */
	public notes: LayerNotes = {};

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
	 * @param fromSong Internal specifier, do not set!
	 *
	 * @remarks
	 * **Only use this method when creating new Layer objects!**
	 *
	 * If the layer is part of a song (e.g. `song.layers[0].setNote(...)`), use the {@link Song#setNote | song's `setNote`} method!
	 */
	public setNote(tick: number, note: Note, fromSong?: true): Note {
		this.notes[tick] = note;

		if (!fromSong && this.inSong) {
			console.warn("A note has been modified within a song's layers! Please refer to the documentation for proper usage.");
		}

		return note;
	}

	/**
	 * Create and add a note to a tick.
	 *
	 * @param tick Tick to set the note
	 * @param instrument The note's instrument
	 * @param options Options for the note
	 * @param fromSong Internal specifier, do not set!
	 *
	 * @remarks
	 * **Only use this method when creating new Layer objects!**
	 *
	 * If the layer is part of a song (e.g. `song.layers[0].addNote(...)`), use the {@link Song#addNote | song's `addNote`} method!
	 * {@linkcode Song#addNote} ensures that properties within the {@linkcode Song}, notably {@linkcode Song#length}, are also updated.
	 */
	public addNote(tick: number, instrument: Instrument | number = 0, options: NoteOptions = defaultNoteOptions, fromSong?: true): Note {
		const note = new Note(instrument, options);

		return this.setNote(tick, note, fromSong);
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
