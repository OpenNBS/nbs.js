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

	public static validate(key: UnknownKeyRange, checkVanilla: boolean = false): Result {
		const integerStatus = isInteger(key);

		const minimumKey = checkVanilla ? KeyParameter.MIN_VANILLA_VALUE : KeyParameter.MIN_VALUE;
		const maximumKey = checkVanilla ? KeyParameter.MAX_VANILLA_VALUE : KeyParameter.MAX_VALUE;

		const rangeStatus = isWithinRange(key, minimumKey, maximumKey);

		return mergeResults(integerStatus, rangeStatus);
	}
}

const _: Parameter = KeyParameter as Parameter;
