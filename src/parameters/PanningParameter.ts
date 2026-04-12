import type { Result } from "~/types/validators/Result";

import { isInteger } from "~/validators/isInteger";
import { isWithinRange } from "~/validators/isWithinRange";
import { mergeResults } from "~/validators/results";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type Panning = number;

export type MinimumPanning = -100;
export type MaximumPanning = 100;

export type PanningRange = IntClosedRange<MinimumPanning, MaximumPanning>;

export type UnknownPanningRange = LiteralUnion<PanningRange, Panning>;

function validator(panning: UnknownPanningRange): Result {
	const integerStatus = isInteger(panning);

	const rangeStatus = isWithinRange(
		panning,
		PanningParameter.MIN_PANNING,
		PanningParameter.MAX_PANNING
	);

	return mergeResults(integerStatus, rangeStatus);
}

export const PanningParameter = {
	// biome-ignore-start lint/style/useNamingConvention: Object acts like an enum
	get MAX_PANNING(): MaximumPanning {
		return 100;
	},

	get MIN_PANNING(): MinimumPanning {
		return -100;
	},
	// biome-ignore-end lint/style/useNamingConvention: Object acts like an enum

	get validate(): typeof validator {
		return validator;
	}
};
