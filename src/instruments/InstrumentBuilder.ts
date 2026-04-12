import type {
	InstrumentIdentifier,
	InstrumentPressKey,
	OptionalInstrumentName,
	OptionalInstrumentSoundFile,
	UnknownInstrumentKey
} from "~/instruments/Instrument";

import { Instrument } from "~/instruments/Instrument";

export class CompleteInstrumentBuilder {
	readonly #identifier: InstrumentIdentifier;

	#name: OptionalInstrumentName | undefined;
	#soundFile: OptionalInstrumentSoundFile | undefined;
	#key: UnknownInstrumentKey | undefined;
	#doesPressKey: InstrumentPressKey | undefined;

	public constructor(identifier: InstrumentIdentifier) {
		this.#identifier = identifier;
	}

	public name(name: OptionalInstrumentName): this {
		this.#name = name;

		return this;
	}

	public soundFile(soundFile: OptionalInstrumentSoundFile): this {
		this.#soundFile = soundFile;

		return this;
	}

	public key(key: UnknownInstrumentKey): this {
		this.#key = key;

		return this;
	}

	public pressKey(): this {
		this.#doesPressKey = true;

		return this;
	}

	public build(): Instrument {
		const instrument = new Instrument(this.#identifier);

		this.assign(instrument);

		return instrument;
	}

	protected assign(instrument: Instrument): void {
		instrument.name = this.#name;
		instrument.soundFile = this.#soundFile;

		if (this.#key !== undefined) {
			instrument.key = this.#key;
		}

		if (this.#doesPressKey !== undefined) {
			instrument.doesPressKey = this.#doesPressKey;
		}
	}
}

export class InstrumentBuilder {
	public identifier(identifier: InstrumentIdentifier): CompleteInstrumentBuilder {
		return new CompleteInstrumentBuilder(identifier);
	}
}
