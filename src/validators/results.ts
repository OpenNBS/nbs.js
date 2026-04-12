import type {
	FailResult,
	OkResult,
	Result,
	ResultErrors,
	ResultOk
} from "~/types/validators/Result";

export function ok(): OkResult {
	return {
		"ensure": () => {},
		"ok": true
	};
}

export function fail(...errors: ResultErrors): FailResult {
	return {
		"ensure": () => {
			throw errors;
		},
		errors,
		"ok": false
	};
}

export function mergeResults(...statuses: Result[]): Result {
	let isOk: ResultOk = true;
	const errors: ResultErrors = [];

	for (const status of statuses) {
		if (status.ok) {
			continue;
		}

		isOk = false;
		errors.push(...status.errors);
	}

	return isOk ? ok() : fail(...errors);
}
