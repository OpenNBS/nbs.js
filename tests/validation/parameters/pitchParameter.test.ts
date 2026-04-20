import { PitchParameter } from "@nbsjs/core";

test("Ensure that pitch is validated", () => {
	expect(PitchParameter.MAX_VALUE).toBe(12);
	expect(PitchParameter.MIN_VALUE).toBe(-12);

	expect(PitchParameter.validate(PitchParameter.MAX_VALUE).ok).toBeTrue();
	expect(PitchParameter.validate(PitchParameter.MAX_VALUE + 1).ok).toBeFalse();

	expect(PitchParameter.validate(PitchParameter.MIN_VALUE).ok).toBeTrue();
	expect(PitchParameter.validate(PitchParameter.MIN_VALUE - 1).ok).toBeFalse();

	expect(PitchParameter.validate(PitchParameter.MAX_VALUE - 0.5).ok).toBeTrue();
	expect(PitchParameter.validate(PitchParameter.MIN_VALUE + 0.5).ok).toBeTrue();
});
