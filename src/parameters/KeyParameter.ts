import type { Parameter } from "~/types/parameters/Parameter";
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

function validateWith(key: UnknownKeyRange, minimumKey: Key, maximumKey: Key): Result {
	const integerStatus = isInteger(key);
	const rangeStatus = isWithinRange(key, minimumKey, maximumKey);

	return mergeResults(integerStatus, rangeStatus);
}

// biome-ignore lint/complexity/noStaticOnlyClass: Members have high overlap with other parameters
export class KeyParameter {
	public static get MAX_VALUE(): MaximumKey {
		return 87;
	}

	public static get MAX_VANILLA_VALUE(): MaximumVanillaKey {
		return 57;
	}

	public static get MIN_VALUE(): MinimumKey {
		return 0;
	}

	public static get MIN_VANILLA_VALUE(): MinimumVanillaKey {
		return 33;
	}

	public static validate(key: UnknownKeyRange): Result {
		return validateWith(key, KeyParameter.MIN_VALUE, KeyParameter.MAX_VALUE);
	}

	public static validateVanilla(key: UnknownKeyRange): Result {
		return validateWith(key, KeyParameter.MIN_VANILLA_VALUE, KeyParameter.MAX_VANILLA_VALUE);
	}
}

const _: Parameter = KeyParameter as Parameter;
