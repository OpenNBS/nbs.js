import type { InstrumentIdentifier } from "~/instruments/Instrument";
import type { ParentSong, ParentSongInstruments } from "~/types/initialized/Parent";

import { InitializedInstrument } from "~/instruments/InitializedInstrument";
import { CompleteInstrumentBuilder, InstrumentBuilder } from "~/instruments/InstrumentBuilder";

export class CompleteInitializedInstrumentBuilder extends CompleteInstrumentBuilder {
	readonly #song: ParentSong;
	readonly #songInstruments: ParentSongInstruments;

	readonly #identifier: InstrumentIdentifier;

	public constructor(
		song: ParentSong,
		songInstruments: ParentSongInstruments,
		identifier: InstrumentIdentifier
	) {
		super(identifier);

		this.#song = song;
		this.#songInstruments = songInstruments;

		this.#identifier = identifier;
	}

	public build(): InitializedInstrument {
		const instrument = new InitializedInstrument(this.#song, this.#identifier);

		this.assign(instrument);

		this.#songInstruments.register(instrument);

		return instrument;
	}
}

export class InitializedInstrumentBuilder extends InstrumentBuilder {
	readonly #song: ParentSong;
	readonly #songInstruments: ParentSongInstruments;

	public constructor(song: ParentSong, songInstruments: ParentSongInstruments) {
		super();

		this.#song = song;
		this.#songInstruments = songInstruments;
	}

	public identifier(identifier: InstrumentIdentifier): CompleteInitializedInstrumentBuilder {
		return new CompleteInitializedInstrumentBuilder(this.#song, this.#songInstruments, identifier);
	}
}
