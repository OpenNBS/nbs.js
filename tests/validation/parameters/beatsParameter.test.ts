import { BeatsParameter } from "@nbsjs/core";

test("Ensure that beats are validated", () => {
	expect(BeatsParameter.MAX_BEATS).toBe(8);
	expect(BeatsParameter.MIN_BEATS).toBe(2);

	expect(BeatsParameter.validate(BeatsParameter.MAX_BEATS).ok).toBeTrue();
	expect(BeatsParameter.validate(BeatsParameter.MAX_BEATS + 1).ok).toBeFalse();

	expect(BeatsParameter.validate(BeatsParameter.MIN_BEATS).ok).toBeTrue();
	expect(BeatsParameter.validate(BeatsParameter.MIN_BEATS - 1).ok).toBeFalse();

	expect(BeatsParameter.validate(BeatsParameter.MAX_BEATS - 0.5).ok).toBeFalse();
	expect(BeatsParameter.validate(BeatsParameter.MIN_BEATS + 0.5).ok).toBeFalse();
});
