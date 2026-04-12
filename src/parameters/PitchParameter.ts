import type { Result } from "~/types/validators/Result";

import { isWithinRange } from "~/validators/isWithinRange";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type Pitch = number;

export type MinimumPitch = -12;
export type MaximumPitch = 12;

export type PitchRange = IntClosedRange<MinimumPitch, MaximumPitch>;

export type UnknownPitchRange = LiteralUnion<PitchRange, Pitch>;

function validator(pitch: UnknownPitchRange): Result {
	return isWithinRange(pitch, PitchParameter.MIN_PITCH, PitchParameter.MAX_PITCH);
}

export const PitchParameter = {
	// biome-ignore-start lint/style/useNamingConvention: Object acts like an enum
	get MAX_PITCH(): MaximumPitch {
		return 12;
	},

	get MIN_PITCH(): MinimumPitch {
		return -12;
	},
	// biome-ignore-end lint/style/useNamingConvention: Object acts like an enum

	get validate(): typeof validator {
		return validator;
	}
};
