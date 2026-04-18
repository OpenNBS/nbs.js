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

function validator(version: UnknownSupportedVersionRange): Result {
	const integerStatus = isInteger(version);

	const rangeStatus = isWithinRange(
		version,
		VersionParameter.MIN_SUPPORTED_VERSION,
		VersionParameter.MAX_SUPPORTED_VERSION
	);

	return mergeResults(integerStatus, rangeStatus);
}

export const VersionParameter = {
	// biome-ignore-start lint/style/useNamingConvention: Object acts like an enum
	get MAX_SUPPORTED_VERSION(): MaximumSupportedVersion {
		return 6;
	},

	get MIN_SUPPORTED_VERSION(): MinimumSupportedVersion {
		return 0;
	},
	// biome-ignore-end lint/style/useNamingConvention: Object acts like an enum

	get validate(): typeof validator {
		return validator;
	}
};
