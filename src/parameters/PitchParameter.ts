import type { ParameterLike } from "~/types/parameters/ParameterLike";
import type { Negate } from "~/types/utility/Negate";
import type { Result } from "~/types/validators/Result";

import { isWithinRange } from "~/validators/isWithinRange";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type Pitch = number;

export type MinimumPitch = -12;
export type MaximumPitch = 12;

type PositivePitchRange = IntClosedRange<1, MaximumPitch>;
type NegativePitchRange = Negate<PositivePitchRange>;

// This is a union because `IntClosedRange` does not support decimals
export type PitchRange = LiteralUnion<NegativePitchRange | 0 | PositivePitchRange, Pitch>;

export type UnknownPitchRange = LiteralUnion<PitchRange, Pitch>;

// biome-ignore lint/complexity/noStaticOnlyClass: Members have high overlap with other parameters
export class PitchParameter {
	public static get MAX_VALUE(): MaximumPitch {
		return 12;
	}

	public static get MIN_VALUE(): MinimumPitch {
		return -12;
	}

	public static validate(pitch: UnknownPitchRange): Result {
		return isWithinRange(pitch, PitchParameter.MIN_VALUE, PitchParameter.MAX_VALUE);
	}
}

const _: ParameterLike = PitchParameter as ParameterLike;
