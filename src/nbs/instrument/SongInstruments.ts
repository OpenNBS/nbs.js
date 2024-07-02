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
 * Represents the {@linkcode Instrument}s of a {@linkcode Song} with helper methods.
 *
 * @category Instrument
 */
export class SongInstruments {
	/**
	 * ID-instrument pair of the song's instruments.
	 *
	 * @remarks Currently, this always includes the built-in instruments from Note Block Studio v5.
	 * @see This should not be modified directly! Instead, utilize the various helper methods in this class.
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
	 * @remarks Any existing instrument with the same ID as the added instrument will be overwritten. This includes built-in instruments, which may not be desirable!
	 * @see According to the NBS specification, instrument IDs must be consecutive!
	 *
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
	 * @remarks Does not protect built-in instruments. This may not be desirable!
	 * @see According to the NBS specification, instrument IDs must be consecutive! Make sure to update any proceeding instrument IDs.
	 *
	 * @param id ID of the instrument to be deleted
	 */
	public delete(id: number): void {
		delete this.all[id];
	}

	/**
	 * Iterate each id-instrument pair.
	 *
	 * @example
	 * This is intended for use in `for` loops.
	 *
	 * ```ts
	 * for (const [id, instrument] in song.instruments) { ... }
	 * ```
	 */
	*[Symbol.iterator](): Iterator<[number, Instrument]> {
		for (const [id, instrument] of Object.entries(this.all)) {
			yield [+id, instrument];
		}
	}
}
