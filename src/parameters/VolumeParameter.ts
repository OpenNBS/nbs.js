import type { Parameter } from "~/types/parameters/Parameter";
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

// biome-ignore lint/complexity/noStaticOnlyClass: Members have high overlap with other parameters
export class VolumeParameter {
	public static get MAX_VALUE(): MaximumVolume {
		return 100;
	}

	public static get MIN_VALUE(): MinimumVolume {
		return 0;
	}

	public static validate(volume: UnknownVolumeRange): Result {
		const integerStatus = isInteger(volume);

		const rangeStatus = isWithinRange(volume, VolumeParameter.MIN_VALUE, VolumeParameter.MAX_VALUE);

		return mergeResults(integerStatus, rangeStatus);
	}
}

const _: Parameter = VolumeParameter as Parameter;
