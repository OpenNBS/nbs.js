import { BeatsParameter } from "@nbsjs/core";

test("Ensure that beats are validated", () => {
	expect(BeatsParameter.MAX_VALUE).toBe(8);
	expect(BeatsParameter.MIN_VALUE).toBe(2);

	expect(BeatsParameter.validate(BeatsParameter.MAX_VALUE).ok).toBeTrue();
	expect(BeatsParameter.validate(BeatsParameter.MAX_VALUE + 1).ok).toBeFalse();

	expect(BeatsParameter.validate(BeatsParameter.MIN_VALUE).ok).toBeTrue();
	expect(BeatsParameter.validate(BeatsParameter.MIN_VALUE - 1).ok).toBeFalse();

	expect(BeatsParameter.validate(BeatsParameter.MAX_VALUE - 0.5).ok).toBeFalse();
	expect(BeatsParameter.validate(BeatsParameter.MIN_VALUE + 0.5).ok).toBeFalse();
});
