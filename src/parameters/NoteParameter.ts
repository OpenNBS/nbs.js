import type { ParameterLike } from "~/types/parameters/ParameterLike";
import type { Result } from "~/types/validators/Result";

import { isInteger } from "~/validators/isInteger";
import { fail, mergeResults, ok } from "~/validators/results";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type NoteValue = number;

export type MinimumNoteValue = 4;
export type MaximumNoteValue = 4;

export type NoteValueRange = IntClosedRange<MinimumNoteValue, MaximumNoteValue>;

export type UnknownNoteValueRange = LiteralUnion<NoteValueRange, NoteValue>;

// biome-ignore lint/complexity/noStaticOnlyClass: Members have high overlap with other parameters
export class NoteParameter {
	public static get MAX_VALUE(): MaximumNoteValue {
		return 4;
	}

	public static get MIN_VALUE(): MinimumNoteValue {
		return 4;
	}

	public static validate(note: UnknownNoteValueRange): Result {
		const integerStatus = isInteger(note);

		// This will be removed once the NBS specification supports more time signatures
		const rangeStatus = note === 4 ? ok() : fail("Time signature note value must be 4");

		return mergeResults(integerStatus, rangeStatus);
	}
}

const _: ParameterLike = NoteParameter as ParameterLike;
