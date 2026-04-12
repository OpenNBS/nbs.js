import type { Result } from "~/types/validators/Result";

import { fail, ok } from "~/validators/results";

export function isWithinRange(argument: number, minimum: number, maximum: number): Result {
	if (argument >= minimum && argument <= maximum) {
		return ok();
	}

	return fail(
		`Specified value "${argument}" must be within accepted range: ${minimum}, ${maximum}`
	);
}
