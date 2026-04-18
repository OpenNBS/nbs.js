import type { ResourceLocation } from "~/identifiers/ResourceLocation";
import type { KeyRange, UnknownKeyRange } from "~/parameters/KeyParameter";

import { KeyParameter } from "~/parameters/KeyParameter";

import type { Optional } from "type-fest";

export type InstrumentIdentifier = ResourceLocation;

export type InstrumentName = string;
export type InstrumentSoundFile = string;
export type InstrumentKey = KeyRange;
export type InstrumentPressKey = boolean;

export type OptionalInstrumentName = Optional<InstrumentName>;
export type OptionalInstrumentSoundFile = Optional<InstrumentSoundFile>;

export type UnknownInstrumentKey = UnknownKeyRange;

export class Instrument {
	public static get DEFAULT_NAME(): OptionalInstrumentName {
		return undefined;
	}

	public static get DEFAULT_SOUND_FILE(): OptionalInstrumentSoundFile {
		return undefined;
	}

	public static get DEFAULT_KEY(): InstrumentKey {
		return 45;
	}

	public static get DEFAULT_PRESS_KEY(): InstrumentPressKey {
		return false;
	}

	readonly #identifier: InstrumentIdentifier;

	#name: OptionalInstrumentName = Instrument.DEFAULT_NAME;
	#soundFile: OptionalInstrumentSoundFile = Instrument.DEFAULT_SOUND_FILE;
	#key: InstrumentKey = Instrument.DEFAULT_KEY;
	#doesPressKey: InstrumentPressKey = Instrument.DEFAULT_PRESS_KEY;

	public constructor(identifier: InstrumentIdentifier) {
		this.#identifier = identifier;
	}

	public get identifier(): InstrumentIdentifier {
		return this.#identifier;
	}

	public get name(): OptionalInstrumentName {
		return this.#name;
	}

	public set name(name: OptionalInstrumentName) {
		this.#name = name;
	}

	public get soundFile(): OptionalInstrumentSoundFile {
		return this.#soundFile;
	}

	public set soundFile(soundFile: OptionalInstrumentSoundFile) {
		this.#soundFile = soundFile;
	}

	public get key(): InstrumentKey {
		return this.#key;
	}

	public set key(key: UnknownInstrumentKey) {
		KeyParameter.validate(key).ensure();

		this.#key = key as InstrumentKey;
	}

	public get doesPressKey(): InstrumentPressKey {
		return this.#doesPressKey;
	}

	public set doesPressKey(pressKey: InstrumentPressKey) {
		this.#doesPressKey = pressKey;
	}
}
