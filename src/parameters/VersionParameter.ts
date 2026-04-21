import type { ParameterLike } from "~/types/parameters/ParameterLike";
import type { Result } from "~/types/validators/Result";

import { isInteger } from "~/validators/isInteger";
import { isWithinRange } from "~/validators/isWithinRange";
import { mergeResults } from "~/validators/results";

import type { IntClosedRange, LiteralUnion } from "type-fest";

export type SupportedVersion = number;

export type MinimumSupportedVersion = 0;
export type MaximumSupportedVersion = 6;

export type SupportedVersionRange = IntClosedRange<
	MinimumSupportedVersion,
	MaximumSupportedVersion
>;

export type UnknownSupportedVersionRange = LiteralUnion<SupportedVersionRange, SupportedVersion>;

// biome-ignore lint/complexity/noStaticOnlyClass: Members have high overlap with other parameters
export class VersionParameter {
	public static get MAX_VALUE(): MaximumSupportedVersion {
		return 6;
	}

	public static get MIN_VALUE(): MinimumSupportedVersion {
		return 0;
	}

	public static validate(version: UnknownSupportedVersionRange): Result {
		const integerStatus = isInteger(version);

		const rangeStatus = isWithinRange(
			version,
			VersionParameter.MIN_VALUE,
			VersionParameter.MAX_VALUE
		);

		return mergeResults(integerStatus, rangeStatus);
	}
}

const _: ParameterLike = VersionParameter as ParameterLike;
