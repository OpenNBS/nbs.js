import type { Result } from "~/types/validators/Result";

import { isInteger } from "~/validators/isInteger";
import { isWithinRange } from "~/validators/isWithinRange";
import { mergeResults } from "~/validators/results";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type Volume = number;

export type MinimumVolume = 0;
export type MaximumVolume = 100;

export type VolumeRange = IntClosedRange<MinimumVolume, MaximumVolume>;

export type UnknownVolumeRange = LiteralUnion<VolumeRange, Volume>;

function validator(volume: UnknownVolumeRange): Result {
	const integerStatus = isInteger(volume);

	const rangeStatus = isWithinRange(volume, VolumeParameter.MIN_VOLUME, VolumeParameter.MAX_VOLUME);

	return mergeResults(integerStatus, rangeStatus);
}

export const VolumeParameter = {
	// biome-ignore-start lint/style/useNamingConvention: Object acts like an enum
	get MAX_VOLUME(): MaximumVolume {
		return 100;
	},

	get MIN_VOLUME(): MinimumVolume {
		return 0;
	},
	// biome-ignore-end lint/style/useNamingConvention: Object acts like an enum

	get validate(): typeof validator {
		return validator;
	}
};
