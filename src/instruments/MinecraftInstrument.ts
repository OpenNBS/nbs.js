import type {
	InstrumentKey,
	OptionalInstrumentName,
	OptionalInstrumentSoundFile,
	UnknownInstrumentKey
} from "~/instruments/Instrument";
import type { InstrumentId } from "~/instruments/MinecraftInstruments";
import type {
	SupportedVersionRange,
	UnknownSupportedVersionRange
} from "~/parameters/VersionParameter";
import type { Result } from "~/types/validators/Result";

import { Instrument } from "~/instruments/Instrument";
import { MinecraftInstruments } from "~/instruments/MinecraftInstruments";
import { VersionParameter } from "~/parameters/VersionParameter";
import { fail, ok } from "~/validators/results";

export type InstrumentSupportedVersion = SupportedVersionRange;
export type InstrumentImmutable = boolean;

export type UnknownInstrumentSupportedVersion = UnknownSupportedVersionRange;

export class MinecraftInstrument extends Instrument {
	public static get DEFAULT_SUPPORTED_VERSION(): InstrumentSupportedVersion {
		return VersionParameter.MAX_SUPPORTED_VERSION;
	}

	public static get DEFAULT_IMMUTABLE(): InstrumentImmutable {
		return false;
	}

	#supportedVersion: InstrumentSupportedVersion = MinecraftInstrument.DEFAULT_SUPPORTED_VERSION;
	#isImmutable: InstrumentImmutable = MinecraftInstrument.DEFAULT_IMMUTABLE;

	public get name(): OptionalInstrumentName {
		return super.name;
	}

	public set name(name: OptionalInstrumentName) {
		this.checkMutable().ensure();

		super.name = name;
	}

	public get soundFile(): OptionalInstrumentSoundFile {
		return super.soundFile;
	}

	public set soundFile(soundFile: OptionalInstrumentSoundFile) {
		this.checkMutable().ensure();

		super.soundFile = soundFile;
	}

	public get key(): InstrumentKey {
		return super.key;
	}

	public set key(key: UnknownInstrumentKey) {
		this.checkMutable().ensure();

		super.key = key;
	}

	public get supportedVersion(): InstrumentSupportedVersion {
		return this.#supportedVersion;
	}

	public set supportedVersion(supportedVersion: UnknownInstrumentSupportedVersion) {
		this.checkMutable().ensure();

		VersionParameter.validate(supportedVersion).ensure();

		this.#supportedVersion = supportedVersion as InstrumentSupportedVersion;
	}

	public get isImmutable(): InstrumentImmutable {
		return this.#isImmutable;
	}

	public makeImmutable(): void {
		this.#isImmutable = true;
	}

	public checkMutable(): Result {
		return this.#isImmutable ? fail("Instrument is immutable") : ok();
	}

	public toId(): InstrumentId {
		return MinecraftInstruments.toId(this);
	}
}
