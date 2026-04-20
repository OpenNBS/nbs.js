import { PitchParameter } from "@nbsjs/core";

test("Ensure that pitch is validated", () => {
	expect(PitchParameter.MAX_PITCH).toBe(12);
	expect(PitchParameter.MIN_PITCH).toBe(-12);

	expect(PitchParameter.validate(PitchParameter.MAX_PITCH).ok).toBeTrue();
	expect(PitchParameter.validate(PitchParameter.MAX_PITCH + 1).ok).toBeFalse();

	expect(PitchParameter.validate(PitchParameter.MIN_PITCH).ok).toBeTrue();
	expect(PitchParameter.validate(PitchParameter.MIN_PITCH - 1).ok).toBeFalse();

	expect(PitchParameter.validate(PitchParameter.MAX_PITCH - 0.5).ok).toBeTrue();
	expect(PitchParameter.validate(PitchParameter.MIN_PITCH + 0.5).ok).toBeTrue();
});
