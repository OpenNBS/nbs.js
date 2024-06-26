import { enumerable } from "~/decorators/enumerable";
import { readOnly } from "~/decorators/readOnly";
import type { NoteOptions } from "~/nbs/note/Note";
import { defaultNoteOptions, Note } from "~/nbs/note/Note";

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
	 * A cached frozen copy of {@linkcode LayerNotes##existing}.
	 *
	 * {@inheritDoc LayerNotes#get}
	 */
	#frozenExisting: Readonly<ExistingNotes> = {};

	/**
	 * Whether {@linkcode LayerNotes##frozenExisting} should be re-created.
	 */
	#frozenExistingIsValid = true;

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
	public get get(): Readonly<ExistingNotes> {
		if (!this.#frozenExistingIsValid) {
			this.#frozenExisting = Object.freeze({ ...this.#existing });

			this.#frozenExistingIsValid = true;
		}

		return this.#frozenExisting;
	}

	/**
	 * Same as {@linkcode LayerNotes#get}, but without creating a frozen clone.
	 *
	 * Only use this if you know what you're doing!
	 *
	 * @internal
	 */
	public get unsafeGet(): ExistingNotes {
		return this.#existing;
	}

	/**
	 * Set an existing {@linkcode Note} at a tick.
	 *
	 * @remarks Any existing note at the same tick as the added note will be overwritten.
	 * @param tick Tick to set the note on
	 * @param note Note to set on tick
	 */
	public set(tick: number, note: Note): Note {
		this.#invalidate();

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
		this.#invalidate();

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
		this.#invalidate();

		const note = new Note(instrument, options);

		return this.add(tick, note);
	}

	/**
	 * Delete a {@linkcode Note} at a tick.
	 *
	 * @param tick Tick to remove note from
	 */
	public delete(tick: number): void {
		this.#invalidate();

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

	/**
	 * Specifies that the cached frozen copy ({@linkcode LayerNotes##frozenExisting}) needs to be updated.
	 */
	#invalidate() {
		if (!this.#frozenExistingIsValid) {
			return;
		}

		this.#frozenExistingIsValid = false;
	}
}
