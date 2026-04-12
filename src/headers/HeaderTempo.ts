import type { Result } from "~/types/validators/Result";

import { isInteger } from "~/validators/isInteger";
import { isWithinRange } from "~/validators/isWithinRange";
import { fail, mergeResults, ok } from "~/validators/results";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type TimeSignatureBeats = IntClosedRange<2, 8>;
export type TimeSignatureNote = 4;

export type TicksPerSecond = number;
export type BeatsPerMinute = number;
export type MillisecondsPerTick = number;

export type UnknownTimeSignatureBeats = LiteralUnion<TimeSignatureBeats, number>;
export type UnknownTimeSignatureNote = LiteralUnion<TimeSignatureNote, number>;

export class HeaderTempo {
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

	#beats: TimeSignatureBeats = HeaderTempo.DEFAULT_BEATS;
	#note: TimeSignatureNote = HeaderTempo.DEFAULT_NOTE;

	#ticksPerSecond: TicksPerSecond = HeaderTempo.DEFAULT_TICKS_PER_SECOND;
	#beatsPerMinute: BeatsPerMinute = HeaderTempo.DEFAULT_BEATS_PER_MINUTE;
	#millisecondsPerTick: MillisecondsPerTick = HeaderTempo.DEFAULT_MILLISECONDS_PER_TICK;

	public get beats(): TimeSignatureBeats {
		return this.#beats;
	}

	public set beats(beats: UnknownTimeSignatureBeats) {
		HeaderTempo.checkBeats(beats).ensure();

		this.#beats = beats as TimeSignatureBeats;
	}

	public get note(): TimeSignatureNote {
		return this.#note;
	}

	public set note(note: UnknownTimeSignatureNote) {
		HeaderTempo.checkNotes(note).ensure();

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

	public static checkBeats(beats: UnknownTimeSignatureBeats): Result {
		const integerStatus = isInteger(beats);
		const rangeStatus = isWithinRange(beats, 2, 8);

		return mergeResults(integerStatus, rangeStatus);
	}

	public static checkNotes(note: UnknownTimeSignatureNote): Result {
		const integerStatus = isInteger(note);

		// This will be removed once the NBS specification supports more time signatures
		const rangeStatus = note === 4 ? ok() : fail("Time signature notes must be 4");

		return mergeResults(integerStatus, rangeStatus);
	}
}
