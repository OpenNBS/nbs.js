import type { InstrumentIdentifier } from "~/instruments/Instrument";
import type { Song } from "~/songs/Song";
import type { ParentSong } from "~/types/initialized/Parent";

import { Instrument } from "~/instruments/Instrument";
import type { InstrumentId } from "./MinecraftInstruments";

export class InitializedInstrument extends Instrument {
	readonly #song: ParentSong;

	public constructor(song: ParentSong, identifier: InstrumentIdentifier) {
		super(identifier);

		this.#song = song;
	}

	public static from(song: Song, instrument: Instrument): InitializedInstrument {
		const initializedInstrument = new InitializedInstrument(song, instrument.identifier);

		initializedInstrument.name = instrument.name;
		initializedInstrument.soundFile = instrument.soundFile;
		initializedInstrument.key = instrument.key;
		initializedInstrument.doesPressKey = instrument.doesPressKey;

		return initializedInstrument;
	}

	public toId(): InstrumentId {
		const instrumentIdentifiers = [...this.#song.instruments.keys()];
		const index = instrumentIdentifiers.indexOf(this.identifier);

		if (index === undefined) {
			throw "Instrument does not exist within the song registry";
		}

		return index;
	}
}
