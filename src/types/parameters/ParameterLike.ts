import type { Result } from "../validators/Result";

export interface ParameterLike {
	// biome-ignore-start lint/style/useNamingConvention: These are constant static fields
	"MAX_VALUE": unknown;
	"MIN_VALUE": unknown;
	// biome-ignore-end lint/style/useNamingConvention: These are constant static fields
	"validate": (parameters: unknown) => Result;
}
