import type { Result } from "~/types/validators/Result";

import { isInteger } from "~/validators/isInteger";
import { isWithinRange } from "~/validators/isWithinRange";
import { mergeResults } from "~/validators/results";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type Beats = number;

export type MinimumBeats = 2;
export type MaximumBeats = 8;

export type BeatsRange = IntClosedRange<MinimumBeats, MaximumBeats>;

export type UnknownBeatsRange = LiteralUnion<BeatsRange, Beats>;

function validator(beats: UnknownBeatsRange): Result {
	const integerStatus = isInteger(beats);
	const rangeStatus = isWithinRange(beats, BeatsParameter.MIN_BEATS, BeatsParameter.MAX_BEATS);

	return mergeResults(integerStatus, rangeStatus);
}

export const BeatsParameter = {
	// biome-ignore-start lint/style/useNamingConvention: Object acts like an enum
	get MAX_BEATS(): MaximumBeats {
		return 8;
	},

	get MIN_BEATS(): MinimumBeats {
		return 2;
	},
	// biome-ignore-end lint/style/useNamingConvention: Object acts like an enum

	get validate(): typeof validator {
		return validator;
	}
};
