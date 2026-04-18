import type { Result } from "~/types/validators/Result";

import { isInteger } from "~/validators/isInteger";
import { fail, mergeResults, ok } from "~/validators/results";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type NoteValue = number;

export type MinimumNoteValue = 4;
export type MaximumNoteValue = 4;

export type NoteValueRange = IntClosedRange<MinimumNoteValue, MaximumNoteValue>;

export type UnknownNoteValueRange = LiteralUnion<NoteValueRange, NoteValue>;

function validator(note: UnknownNoteValueRange): Result {
	const integerStatus = isInteger(note);

	// This will be removed once the NBS specification supports more time signatures
	const rangeStatus = note === 4 ? ok() : fail("Time signature note value must be 4");

	return mergeResults(integerStatus, rangeStatus);
}

export const NoteParameter = {
	// biome-ignore-start lint/style/useNamingConvention: Object acts like an enum
	get MAX_NOTE(): MaximumNoteValue {
		return 4;
	},

	get MIN_NOTE(): MinimumNoteValue {
		return 4;
	},
	// biome-ignore-end lint/style/useNamingConvention: Object acts like an enum

	get validate(): typeof validator {
		return validator;
	}
};
