import type { Instrument, InstrumentIdentifier } from "~/instruments/Instrument";
import type { Song } from "~/songs/Song";

import { InitializedInstrument } from "~/instruments/InitializedInstrument";
import { InitializedInstrumentBuilder } from "~/instruments/InitializedInstrumentBuilder";

export type SongInstrument = InitializedInstrument;

export type SongInstrumentKey = InstrumentIdentifier;
export type SongInstrumentValue = SongInstrument;

export type SongInstrumentEntry = [SongInstrumentKey, SongInstrumentValue];

export class SongInstruments {
	readonly #song: Song;
	readonly #map: Map<SongInstrumentKey, SongInstrumentValue> = new Map();

	public constructor(song: Song) {
		this.#song = song;
	}

	public get(identifier: InstrumentIdentifier): SongInstrument | undefined {
		return this.#map.get(identifier);
	}

	public has(identifier: InstrumentIdentifier): boolean {
		return this.#map.has(identifier);
	}

	public register(instrument: Instrument): SongInstrument {
		let initializedInstrument: InitializedInstrument;

		if (instrument instanceof InitializedInstrument) {
			initializedInstrument = instrument;
		} else {
			initializedInstrument = InitializedInstrument.from(this.#song, instrument);
		}

		this.#map.set(instrument.identifier, initializedInstrument);

		return initializedInstrument;
	}

	public delete(identifier: InstrumentIdentifier): boolean {
		const instrument = this.#map.get(identifier);

		if (instrument !== undefined) {
			this.#removeNotes(instrument);
		}

		return this.#map.delete(identifier);
	}

	public clear(): void {
		this.#map.clear();
	}

	public get total(): number {
		return this.#map.size;
	}

	public builder(): InitializedInstrumentBuilder {
		return new InitializedInstrumentBuilder(this.#song, this);
	}

	public *keys(): Generator<SongInstrumentKey> {
		yield* this.#map.keys();
	}

	public *values(): Generator<SongInstrumentValue> {
		yield* this.#map.values();
	}

	public *entries(): Generator<SongInstrumentEntry> {
		yield* this.#map.entries();
	}

	public *[Symbol.iterator](): MapIterator<SongInstrumentEntry> {
		yield* this.#map[Symbol.iterator]();
	}

	#removeNotes(instrument: SongInstrument): void {
		for (const layer of this.#song.layers.values()) {
			for (const [tick, note] of layer.notes) {
				if (note.instrument !== instrument) {
					continue;
				}

				layer.notes.delete(tick, false);
			}
		}
	}
}
