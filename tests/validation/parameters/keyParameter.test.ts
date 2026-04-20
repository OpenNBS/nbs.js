import { KeyParameter } from "@nbsjs/core";

test("Ensure that keys are validated", () => {
	expect(KeyParameter.MAX_KEY).toBe(87);
	expect(KeyParameter.MIN_KEY).toBe(0);

	expect(KeyParameter.validate(KeyParameter.MAX_KEY).ok).toBeTrue();
	expect(KeyParameter.validate(KeyParameter.MAX_KEY + 1).ok).toBeFalse();

	expect(KeyParameter.validate(KeyParameter.MIN_KEY).ok).toBeTrue();
	expect(KeyParameter.validate(KeyParameter.MIN_KEY - 1).ok).toBeFalse();

	expect(KeyParameter.validate(KeyParameter.MAX_KEY - 0.5).ok).toBeFalse();
	expect(KeyParameter.validate(KeyParameter.MIN_KEY + 0.5).ok).toBeFalse();
});

test("Ensure that vanilla keys are validated", () => {
	expect(KeyParameter.MAX_VANILLA_KEY).toBe(57);
	expect(KeyParameter.MIN_VANILLA_KEY).toBe(33);

	expect(KeyParameter.validate(KeyParameter.MAX_VANILLA_KEY, true).ok).toBeTrue();
	expect(KeyParameter.validate(KeyParameter.MAX_VANILLA_KEY + 1, true).ok).toBeFalse();

	expect(KeyParameter.validate(KeyParameter.MIN_VANILLA_KEY, true).ok).toBeTrue();
	expect(KeyParameter.validate(KeyParameter.MIN_VANILLA_KEY - 1, true).ok).toBeFalse();

	expect(KeyParameter.validate(KeyParameter.MAX_VANILLA_KEY - 0.5, true).ok).toBeFalse();
	expect(KeyParameter.validate(KeyParameter.MIN_VANILLA_KEY + 0.5, true).ok).toBeFalse();
});
