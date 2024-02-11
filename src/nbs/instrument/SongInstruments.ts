import type { BuiltIn, InstrumentOptions } from "./Instrument";
import { enumerable } from "../../decorators/enumerable";
import { readOnly } from "../../decorators/readOnly";
import { Instrument } from "./Instrument";

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
		return Object.freeze({ ...this.#existing });
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

		this.#existing[id] = instrument;

		return instrument;
	}

	/**
	 * Add an existing {@linkcode Instrument}.
	 *
	 * @param instrument Instrument to add
	 */
	public add(instrument: Instrument): Instrument {
		return this.set(this.total, instrument);
	}

	/**
	 * Create and add an {@linkcode Instrument}.
	 *
	 * @param options Options for the instrument
	 */
	public create(options: InstrumentOptions): Instrument {
		const instrument = new Instrument(options);

		return this.add(instrument);
	}

	/**
	 * Delete an {@linkcode Instrument}.
	 *
	 * @see Built-in instruments cannot be delted!
	 * @param id ID of the instrument to be deleted
	 */
	public delete(id: number): void {
		const existingInstrument = this.#existing[id];
		if (existingInstrument?.isBuiltIn) {
			console.warn("Built-in instruments cannot be deleted!");
			return;
		}

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
}
