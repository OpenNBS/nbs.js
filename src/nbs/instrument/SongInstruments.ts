import { enumerable } from "~/decorators/enumerable";
import { readOnly } from "~/decorators/readOnly";
import type { BuiltIn, InstrumentOptions } from "~/nbs/instrument/Instrument";
import { Instrument } from "~/nbs/instrument/Instrument";

/**
 * The existing {@linkcode Instrument}s.
 *
 * @see {@linkcode SongInstruments#get}
 * @category Song
 * @category Instrument
 */
export interface ExistingInstruments extends BuiltIn {
	/**
	 * ID-Instrument pair.
	 *
	 * @see {@linkcode Instrument}
	 */
	[id: number]: Instrument;
}

/**
 * Represents the {@linkcode Instrument}s of a {@linkcode Song} and provides helper functions.
 *
 * @category Instrument
 */
export class SongInstruments {
	/**
	 * {@inheritDoc SongInstruments#get}
	 */
	#existing: ExistingInstruments = { ...Instrument.builtIn }; // TODO: Only import the number of instruments defined by the NBS version

	/**
	 * A cached frozen copy of {@linkcode SongInstruments##existing}.
	 *
	 * {@inheritDoc SongInstruments#get}
	 */
	#frozenExisting: Readonly<ExistingInstruments> = {};

	/**
	 * Whether {@linkcode SongInstruments##frozenExisting} needs to be updated.
	 */
	#frozenExistingIsValid = true;

	/**
	 * {@inheritDoc SongInstruments#firstCustomIndex}
	 */
	#firstCustomIndex = +Object.keys(Instrument.builtIn).at(-1) + 1;

	/**
	 * Total number of instruments.
	 */
	@enumerable
	@readOnly
	public get total(): number {
		return Object.keys(this.#existing).length;
	}

	/**
	 * Existing instruments.
	 */
	@enumerable
	@readOnly
	public get get(): ExistingInstruments {
		if (!this.#frozenExistingIsValid) {
			this.#frozenExisting = Object.freeze({ ...this.#existing });

			this.#frozenExistingIsValid = true;
		}

		return this.#frozenExisting;
	}

	/**
	 * Same as {@linkcode SongInstruments#get}, but without creating a frozen clone.
	 *
	 * Only use this if you know what you're doing!
	 *
	 * @internal
	 */
	public get unsafeGet(): Readonly<ExistingInstruments> {
		return this.#existing;
	}

	/**
	 * The ID of the first custom instrument.
	 */
	@enumerable
	@readOnly
	public get firstCustomIndex(): number {
		return this.#firstCustomIndex;
	}

	/**
	 * Set an existing {@linkcode Instrument} at an ID.
	 *
	 * @remarks Any existing instrument with the same ID as the added instrument will be overwritten.
	 * @see Built-in instruments cannot be modified!
	 * @param id ID of the instrument to be set
	 * @param instrument The instrument to set at `id`.
	 */
	public set(id: number, instrument: Instrument): Instrument {
		const existingInstrument = this.#existing[id];
		if (existingInstrument?.isBuiltIn) {
			console.warn("Built-in instruments cannot be modified!");
			return;
		}

		if (!this.#existing[id - 1]) {
			throw new Error("Instrument cannot be set out of order! There must be an instrument before or on this ID.");
		}

		this.#invalidate();

		this.#existing[id] = instrument;

		return instrument;
	}

	/**
	 * Add an existing {@linkcode Instrument}.
	 *
	 * @param instrument Instrument to add
	 */
	public add(instrument: Instrument): Instrument {
		this.#invalidate();

		return this.set(this.total, instrument);
	}

	/**
	 * Create and add an {@linkcode Instrument}.
	 *
	 * @param options Options for the instrument
	 */
	public create(options: InstrumentOptions): Instrument {
		this.#invalidate();

		return this.add(new Instrument(options));
	}

	/**
	 * Delete an {@linkcode Instrument}.
	 *
	 * @see Built-in instruments cannot be deleted!
	 * @param id ID of the instrument to be deleted
	 */
	public delete(id: number): void {
		const existingInstrument = this.#existing[id];

		if (existingInstrument?.isBuiltIn) {
			console.warn("Built-in instruments cannot be deleted!");
			return;
		}

		this.#invalidate();

		delete this.#existing[id];
	}

	/**
	 * Iterate each id-instrument pair.
	 */
	*[Symbol.iterator](): Iterable<[number, Instrument]> {
		for (const [id, instrument] of Object.entries(this.#existing)) {
			yield [+id, instrument];
		}
	}

	/**
	 * Specifies that the cached frozen copy ({@linkcode SongInstruments##frozenExisting}) needs to be updated.
	 */
	#invalidate() {
		if (!this.#frozenExistingIsValid) {
			return;
		}

		this.#frozenExistingIsValid = false;
	}
}
