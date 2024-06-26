import type { BuiltIn, InstrumentOptions } from "~/nbs/instrument/Instrument";
import { Instrument } from "~/nbs/instrument/Instrument";

/**
 * The existing {@linkcode Instrument}s.
 *
 * @see {@linkcode SongInstruments#all}
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
	 * ID-instrument pair of the song's instruments.
	 */
	public readonly all: ExistingInstruments = { ...Instrument.builtIn }; // TODO: Only import the number of instruments defined by the NBS version

	/**
	 * The ID of the first custom instrument.
	 *
	 * @internal
	 */
	public readonly firstCustomIndex = +Object.keys(Instrument.builtIn).at(-1) + 1;

	/**
	 * Total number of instruments.
	 */
	public getTotal(): number {
		return Object.keys(this.all).length;
	}

	/**
	 * Set an existing {@linkcode Instrument} at an ID.
	 *
	 * @remarks
	 * Any existing instrument with the same ID as the added instrument will be overwritten.
	 *
	 * According to the Note Block Song specification, instrument IDs must be consecutive.
	 * @see Built-in instruments cannot be modified!
	 * @param id ID of the instrument to be set
	 * @param instrument The instrument to set at `id`.
	 */
	public set(id: number, instrument: Instrument): Instrument {
		this.all[id] = instrument;

		return instrument;
	}

	/**
	 * Add an existing {@linkcode Instrument}.
	 *
	 * @param instrument Instrument to add
	 */
	public add(instrument: Instrument): Instrument {
		return this.set(this.getTotal(), instrument);
	}

	/**
	 * Create and add an {@linkcode Instrument}.
	 *
	 * @param options Options for the instrument
	 */
	public create(options: InstrumentOptions): Instrument {
		return this.add(new Instrument(options));
	}

	/**
	 * Delete an {@linkcode Instrument}.
	 *
	 * @see Built-in instruments cannot be deleted!
	 * @param id ID of the instrument to be deleted
	 */
	public delete(id: number): void {
		delete this.all[id];
	}

	/**
	 * Iterate each id-instrument pair.
	 */
	*[Symbol.iterator](): Iterator<[number, Instrument]> {
		for (const [id, note] of Object.entries(this.all)) {
			yield [+id, note];
		}
	}
}
