import type { NoteOptions } from "~/nbs/note/Note";
import { defaultNoteOptions, Note } from "~/nbs/note/Note";

/**
 * The existing {@linkcode Note}s of the layer.
 *
 * @see {@linkcode LayerNotes#all}
 * @category Layer
 * @category Note
 */
export interface ExistingNotes {
	/**
	 * Each tick-note pair.
	 *
	 * @see {@linkcode Note}
	 */
	[tick: number]: Note;
}

/**
 * Represents the {@linkcode Note}s of a {@linkcode Layer} with helper methods.
 *
 * @includeExample ./examples/full/iterateNotes.ts
 * @category Layer
 * @category Note
 */
export class LayerNotes {
	/**
	 * Tick-note pair of every note in the layer.
	 *
	 * @see This should not be modified directly! Instead, utilize the various helper methods in this class.
	 */
	public readonly all: ExistingNotes = {};

	/**
	 * Total number of notes within the {@linkcode Layer}.
	 */
	public getTotal() {
		return Object.keys(this.all).length;
	}

	/**
	 * Array of ticks that contain notes within the {@linkcode Layer}.
	 */
	public get getTicks(): number[] {
		return Object.keys(this.all).map((key) => +key);
	}

	/**
	 * Set an existing {@linkcode Note} at the specified tick.
	 *
	 * @remarks Any existing note at the same tick as the added note will be overwritten.
	 *
	 * @param tick Tick to set the note on
	 * @param note Note to set on tick
	 */
	public set(tick: number, note: Note): Note {
		this.all[tick] = note;

		return note;
	}

	/**
	 * Create and add a {@linkcode Note} to a tick.
	 *
	 * @param tick Tick to set the note at
	 * @param note The note to add
	 */
	public add(tick: number, note: Note): Note {
		return this.set(tick, note);
	}

	/**
	 * Create and add a {@linkcode Note} to a tick.
	 *
	 * @param tick Tick to set the note at
	 * @param instrument The ID of the instrument for the note to use.
	 * @param options Options for the note
	 */
	public create(tick: number, instrument: number, options: NoteOptions = defaultNoteOptions): Note {
		return this.add(tick, new Note(instrument, options));
	}

	/**
	 * Delete a {@linkcode Note} at the specified tick.
	 *
	 * @param tick Tick to remove the note from
	 */
	public delete(tick: number): void {
		delete this.all[tick];
	}

	/**
	 * Iterate each tick-note pair.
	 *
	 * @example
	 * This is intended for use in `for` loops.
	 *
	 * ```ts
	 * for (const [id, note] in layer.notes) { ... }
	 * ```
	 */
	*[Symbol.iterator](): Iterator<[number, Note]> {
		for (const [id, note] of Object.entries(this.all)) {
			yield [+id, note];
		}
	}
}
