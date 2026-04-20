import type { Parameter } from "~/types/parameters/Parameter";
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

// biome-ignore lint/complexity/noStaticOnlyClass: Members have high overlap with other parameters
export class BeatsParameter {
	public static get MAX_VALUE(): MaximumBeats {
		return 8;
	}

	public static get MIN_VALUE(): MinimumBeats {
		return 2;
	}

	public static validate(beats: UnknownBeatsRange): Result {
		const integerStatus = isInteger(beats);
		const rangeStatus = isWithinRange(beats, BeatsParameter.MIN_VALUE, BeatsParameter.MAX_VALUE);

		return mergeResults(integerStatus, rangeStatus);
	}
}

const _: Parameter = BeatsParameter as Parameter;
