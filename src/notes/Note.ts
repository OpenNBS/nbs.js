import type { KeyRange, UnknownKeyRange } from "~/parameters/KeyParameter";
import type { PanningRange, UnknownPanningRange } from "~/parameters/PanningParameter";
import type { Pitch, PitchRange, UnknownPitchRange } from "~/parameters/PitchParameter";
import type { UnknownVolumeRange, VolumeRange } from "~/parameters/VolumeParameter";
import type { Result } from "~/types/validators/Result";

import { Instrument } from "~/instruments/Instrument";
import { MinecraftInstruments } from "~/instruments/MinecraftInstruments";
import { KeyParameter } from "~/parameters/KeyParameter";
import { PanningParameter } from "~/parameters/PanningParameter";
import { PitchParameter } from "~/parameters/PitchParameter";
import { VolumeParameter } from "~/parameters/VolumeParameter";
import { mergeResults } from "~/validators/results";

export type NoteInstrument = Instrument;

export type NoteKey = KeyRange;
export type NotePitch = PitchRange;
export type NoteVolume = VolumeRange;
export type NotePanning = PanningRange;

export type UnknownNoteKey = UnknownKeyRange;
export type UnknownNotePitch = UnknownPitchRange;
export type UnknownNoteVolume = UnknownVolumeRange;
export type UnknownNotePanning = UnknownPanningRange;

export class Note {
	public static get DEFAULT_KEY(): NoteKey {
		return 45;
	}

	public static get DEFAULT_PITCH(): NotePitch {
		return 0;
	}

	public static get DEFAULT_VOLUME(): NoteVolume {
		return 100;
	}

	public static get DEFAULT_PANNING(): NotePanning {
		return 0;
	}

	#instrument: NoteInstrument;

	#key: NoteKey = Note.DEFAULT_KEY;
	#pitch: NotePitch = Note.DEFAULT_PITCH;
	#volume: NoteVolume = Note.DEFAULT_VOLUME;
	#panning: NotePanning = Note.DEFAULT_PANNING;

	public constructor(instrument: NoteInstrument) {
		this.#instrument = instrument;
	}

	public get instrument(): NoteInstrument {
		return this.#instrument;
	}

	public set instrument(instrument: NoteInstrument) {
		if (!(instrument instanceof Instrument)) {
			throw "Not an instrument";
		}

		this.#instrument = instrument;
	}

	public get key(): NoteKey {
		return this.#key;
	}

	public set key(key: UnknownNoteKey) {
		KeyParameter.validate(key).ensure();

		this.#key = key as NoteKey;
	}

	public get pitch(): NotePitch {
		return this.#pitch;
	}

	public set pitch(pitch: UnknownNotePitch) {
		PitchParameter.validate(pitch).ensure();

		const roundedPitch = Math.round(pitch * 100 * (1 + Number.EPSILON)) / 100;

		this.#pitch = roundedPitch as NotePitch;
	}

	public get volume(): NoteVolume {
		return this.#volume;
	}

	public set volume(volume: UnknownNoteVolume) {
		VolumeParameter.validate(volume).ensure();

		this.#volume = volume as NoteVolume;
	}

	public get panning(): NotePanning {
		return this.#panning;
	}

	public set panning(panning: UnknownNotePanning) {
		PanningParameter.validate(panning).ensure();

		this.#panning = panning as NotePanning;
	}

	public get effectivePitch(): Pitch {
		return this.#key + (this.#instrument.key - 45) + this.#pitch / 100;
	}

	public isVanillaCompatible(): Result {
		const keyStatus = KeyParameter.validate(this.#key, true);
		const instrumentStatus = MinecraftInstruments.validate(this.#instrument);

		return mergeResults(keyStatus, instrumentStatus);
	}
}
