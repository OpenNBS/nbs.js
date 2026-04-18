import type { Result } from "~/types/validators/Result";

import { fail, ok } from "~/validators/results";

export function isBoolean(argument: boolean): Result {
	return typeof argument === "boolean"
		? ok()
		: fail(`Specified value "${argument}" must be a boolean`);
}
