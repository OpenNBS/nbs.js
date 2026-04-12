import type { InstrumentIdentifier } from "~/instruments/Instrument";
import type { InstrumentSupportedVersion } from "~/instruments/MinecraftInstrument";

import { CompleteInstrumentBuilder, InstrumentBuilder } from "~/instruments/InstrumentBuilder";
import { MinecraftInstrument } from "~/instruments/MinecraftInstrument";

export class CompleteMinecraftInstrumentBuilder extends CompleteInstrumentBuilder {
	readonly #identifier: InstrumentIdentifier;

	#supportedVersion: InstrumentSupportedVersion | undefined;

	public constructor(identifier: InstrumentIdentifier) {
		super(identifier);

		this.#identifier = identifier;
	}

	public supportedVersion(supportedVersion: InstrumentSupportedVersion): this {
		this.#supportedVersion = supportedVersion;

		return this;
	}

	public build(): MinecraftInstrument {
		const instrument = new MinecraftInstrument(this.#identifier);

		if (this.#supportedVersion !== undefined) {
			instrument.supportedVersion = this.#supportedVersion;
		}

		this.assign(instrument);

		instrument.makeImmutable();

		return instrument;
	}
}

export class MinecraftInstrumentBuilder extends InstrumentBuilder {
	public identifier(identifier: InstrumentIdentifier): CompleteMinecraftInstrumentBuilder {
		return new CompleteMinecraftInstrumentBuilder(identifier);
	}
}
