import type { NoteOptions } from "./Note";
import { enumerable } from "../../decorators/enumerable";
import { readOnly } from "../../decorators/readOnly";
import { Note, defaultNoteOptions } from "./Note";

/**
 * The existing {@linkcode Note}s of the layer.
 *
 * @see {@linkcode LayerNotes#get}
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
 * Represents the {@linkcode Note}s of a {@linkcode Layer} and provides helper functions.
 *
 * @includeExample ./examples/full/iterateNotes.ts
 * @category Layer
 * @category Note
 */
export class LayerNotes {
	/**
	 * {@inheritDoc LayerNotes#get}
	 */
	#existing: ExistingNotes = {};

	/**
	 * Total number of notes within the {@linkcode Layer}.
	 */
	@enumerable
	@readOnly
	public get total(): number {
		return Object.keys(this.#existing).length;
	}

	/**
	 * Array of ticks that contain notes within the {@linkcode Layer}.
	 */
	@enumerable
	@readOnly
	public get ticks(): number[] {
		return Object.keys(this.#existing).map((key) => +key);
	}

	/**
	 * Existing notes.
	 */
	@enumerable
	@readOnly
	public get get(): ExistingNotes {
		return Object.freeze({ ...this.#existing });
	}

	/**
	 * Set an existing {@linkcode Note} at a tick.
	 *
	 * @remarks Any existing note at the same tick as the added note will be overwritten.
	 * @param tick Tick to set the note on
	 * @param note Note to set on tick
	 */
	public set(tick: number, note: Note): Note {
		this.#existing[tick] = note;

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
	 * @param instrument The note's instrument
	 * @param options Options for the note
	 */
	public create(tick: number, instrument: number, options: NoteOptions = defaultNoteOptions): Note {
		const note = new Note(instrument, options);

		return this.add(tick, note);
	}

	/**
	 * Delete a {@linkcode Note} at a tick.
	 *
	 * @param tick Tick to remove note from
	 */
	public delete(tick: number): void {
		delete this.#existing[tick];
	}

	/**
	 * Iterate each tick-note pair.
	 */
	*[Symbol.iterator](): Iterator<[number, Note]> {
		for (const [id, note] of Object.entries(this.#existing)) {
			yield [+id, note];
		}
	}
}
