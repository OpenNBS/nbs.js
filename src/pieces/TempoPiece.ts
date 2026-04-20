import type { BeatsRange, UnknownBeatsRange } from "~/parameters/BeatsParameter";
import type { NoteValueRange, UnknownNoteValueRange } from "~/parameters/NoteParameter";

import { BeatsParameter } from "~/parameters/BeatsParameter";
import { NoteParameter } from "~/parameters/NoteParameter";
import { isWithinRange } from "~/validators/isWithinRange";

// TODO: Song duration, support tempo changer

export type TimeSignatureBeats = BeatsRange;
export type TimeSignatureNote = NoteValueRange;

export type TicksPerSecond = number;
export type BeatsPerMinute = number;
export type MillisecondsPerTick = number;

export type UnknownTimeSignatureBeats = UnknownBeatsRange;
export type UnknownTimeSignatureNote = UnknownNoteValueRange;

export class TempoPiece {
	public static get DEFAULT_BEATS(): TimeSignatureBeats {
		return 4;
	}

	public static get DEFAULT_NOTE(): TimeSignatureNote {
		return 4;
	}

	public static get DEFAULT_TICKS_PER_SECOND(): TicksPerSecond {
		return 10;
	}

	public static get DEFAULT_BEATS_PER_MINUTE(): BeatsPerMinute {
		return 150;
	}

	public static get DEFAULT_MILLISECONDS_PER_TICK(): MillisecondsPerTick {
		return 100;
	}

	#beats: TimeSignatureBeats = TempoPiece.DEFAULT_BEATS;
	#note: TimeSignatureNote = TempoPiece.DEFAULT_NOTE;

	#ticksPerSecond: TicksPerSecond = TempoPiece.DEFAULT_TICKS_PER_SECOND;
	#beatsPerMinute: BeatsPerMinute = TempoPiece.DEFAULT_BEATS_PER_MINUTE;
	#millisecondsPerTick: MillisecondsPerTick = TempoPiece.DEFAULT_MILLISECONDS_PER_TICK;

	public get beats(): TimeSignatureBeats {
		return this.#beats;
	}

	public set beats(beats: UnknownTimeSignatureBeats) {
		BeatsParameter.validate(beats).ensure();

		this.#beats = beats as TimeSignatureBeats;
	}

	public get note(): TimeSignatureNote {
		return this.#note;
	}

	public set note(note: UnknownTimeSignatureNote) {
		NoteParameter.validate(note).ensure();

		this.#note = note as TimeSignatureNote;
	}

	public get ticksPerSecond(): TicksPerSecond {
		return this.#ticksPerSecond;
	}

	public set ticksPerSecond(ticksPerSecond: TicksPerSecond) {
		isWithinRange(ticksPerSecond, 0.25, 60).ensure();

		this.#beatsPerMinute = ticksPerSecond * 15;
		this.#millisecondsPerTick = (20 / ticksPerSecond) * 50;

		this.#ticksPerSecond = ticksPerSecond;
	}

	public get beatsPerMinute(): BeatsPerMinute {
		return this.#beatsPerMinute;
	}

	public set beatsPerMinute(beatsPerMinute: BeatsPerMinute) {
		isWithinRange(beatsPerMinute, 3.75, 900).ensure();

		this.#ticksPerSecond = beatsPerMinute / 15;
		this.#millisecondsPerTick = (15 / beatsPerMinute) * 1000;

		this.#beatsPerMinute = beatsPerMinute;
	}

	public get millisecondsPerTick(): MillisecondsPerTick {
		return this.#millisecondsPerTick;
	}

	public set millisecondsPerTick(millisecondsPerTick: MillisecondsPerTick) {
		isWithinRange(millisecondsPerTick, 16.66, 4000).ensure();

		this.#ticksPerSecond = (50 / millisecondsPerTick) * 20;
		this.#beatsPerMinute = (15 / millisecondsPerTick) * 1000;

		this.#millisecondsPerTick = millisecondsPerTick;
	}
}
