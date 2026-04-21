import type { Result } from "../validators/Result";

export interface ParameterLike {
	readonly "MAX_VALUE": unknown;
	readonly "MIN_VALUE": unknown;
	"validate": (parameters: unknown) => Result;
}
