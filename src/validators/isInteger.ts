import type { Result } from "~/types/validators/Result";

import { fail, ok } from "~/validators/results";

export function isInteger(argument: number): Result {
	if (Number.isSafeInteger(argument)) {
		return ok();
	}

	return fail(`Specified value "${argument}" must be a valid whole-number integer`);
}
