import { KeyParameter } from "@nbsjs/core";

test("Ensure that keys are validated", () => {
	expect(KeyParameter.MAX_VALUE).toBe(87);
	expect(KeyParameter.MIN_VALUE).toBe(0);

	expect(KeyParameter.validate(KeyParameter.MAX_VALUE).ok).toBeTrue();
	expect(KeyParameter.validate(KeyParameter.MAX_VALUE + 1).ok).toBeFalse();

	expect(KeyParameter.validate(KeyParameter.MIN_VALUE).ok).toBeTrue();
	expect(KeyParameter.validate(KeyParameter.MIN_VALUE - 1).ok).toBeFalse();

	expect(KeyParameter.validate(KeyParameter.MAX_VALUE - 0.5).ok).toBeFalse();
	expect(KeyParameter.validate(KeyParameter.MIN_VALUE + 0.5).ok).toBeFalse();
});

test("Ensure that vanilla keys are validated", () => {
	expect(KeyParameter.MAX_VANILLA_VALUE).toBe(57);
	expect(KeyParameter.MIN_VANILLA_VALUE).toBe(33);

	expect(KeyParameter.validateVanilla(KeyParameter.MAX_VANILLA_VALUE).ok).toBeTrue();
	expect(KeyParameter.validateVanilla(KeyParameter.MAX_VANILLA_VALUE + 1).ok).toBeFalse();

	expect(KeyParameter.validateVanilla(KeyParameter.MIN_VANILLA_VALUE).ok).toBeTrue();
	expect(KeyParameter.validateVanilla(KeyParameter.MIN_VANILLA_VALUE - 1).ok).toBeFalse();

	expect(KeyParameter.validateVanilla(KeyParameter.MAX_VANILLA_VALUE - 0.5).ok).toBeFalse();
	expect(KeyParameter.validateVanilla(KeyParameter.MIN_VANILLA_VALUE + 0.5).ok).toBeFalse();
});
