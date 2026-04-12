import type { Result } from "~/types/validators/Result";

import { isInteger } from "~/validators/isInteger";
import { isWithinRange } from "~/validators/isWithinRange";
import { mergeResults } from "~/validators/results";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type Key = number;

export type MinimumKey = 0;
export type MaximumKey = 87;

export type MinimumVanillaKey = 33;
export type MaximumVanillaKey = 57;

export type VanillaKeyRange = IntClosedRange<MinimumVanillaKey, MaximumVanillaKey>;
export type ExtendedKeyRange = IntClosedRange<MinimumKey, MaximumKey>;

export type KeyRange = VanillaKeyRange | ExtendedKeyRange;

export type UnknownKeyRange = LiteralUnion<KeyRange, Key>;

function validator(key: UnknownKeyRange, checkVanilla: boolean = false): Result {
	const integerStatus = isInteger(key);

	const minimumKey = checkVanilla ? KeyParameter.MIN_VANILLA_KEY : KeyParameter.MIN_KEY;
	const maximumKey = checkVanilla ? KeyParameter.MAX_VANILLA_KEY : KeyParameter.MAX_KEY;

	const rangeStatus = isWithinRange(key, minimumKey, maximumKey);

	return mergeResults(integerStatus, rangeStatus);
}

export const KeyParameter = {
	// biome-ignore-start lint/style/useNamingConvention: Object acts like an enum
	get MAX_KEY(): MaximumKey {
		return 87;
	},

	get MAX_VANILLA_KEY(): MaximumVanillaKey {
		return 57;
	},

	get MIN_KEY(): MinimumKey {
		return 0;
	},

	get MIN_VANILLA_KEY(): MinimumVanillaKey {
		return 33;
	},
	// biome-ignore-end lint/style/useNamingConvention: Object acts like an enum

	get validate(): typeof validator {
		return validator;
	}
};
