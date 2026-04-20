import type { Parameter } from "~/types/parameters/Parameter";
import type { Negate } from "~/types/utility/Negate";
import type { Result } from "~/types/validators/Result";

import { isInteger } from "~/validators/isInteger";
import { isWithinRange } from "~/validators/isWithinRange";
import { mergeResults } from "~/validators/results";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type Panning = number;

export type MinimumPanning = -100;
export type MaximumPanning = 100;

type PositivePanningRange = IntClosedRange<1, MaximumPanning>;
type NegativePanningRange = Negate<PositivePanningRange>;

export type PanningRange = NegativePanningRange | 0 | PositivePanningRange;

export type UnknownPanningRange = LiteralUnion<PanningRange, Panning>;

// biome-ignore lint/complexity/noStaticOnlyClass: Members have high overlap with other parameters
export class PanningParameter {
	public static get MAX_VALUE(): MaximumPanning {
		return 100;
	}

	public static get MIN_VALUE(): MinimumPanning {
		return -100;
	}

	public static validate(panning: UnknownPanningRange): Result {
		const integerStatus = isInteger(panning);

		const rangeStatus = isWithinRange(
			panning,
			PanningParameter.MIN_VALUE,
			PanningParameter.MAX_VALUE
		);

		return mergeResults(integerStatus, rangeStatus);
	}
}

const _: Parameter = PanningParameter as Parameter;
