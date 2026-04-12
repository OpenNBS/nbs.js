import type { Result } from "~/types/validators/Result";

import { fail, ok } from "~/validators/results";

export function isPositive(argument: number): Result {
	if (argument >= 0) {
		return ok();
	}

	return fail(`Specified value "${argument}" must be positive`);
}
