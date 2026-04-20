import { PanningParameter } from "@nbsjs/core";

test("Ensure that panning is validated", () => {
	expect(PanningParameter.MAX_VALUE).toBe(100);
	expect(PanningParameter.MIN_VALUE).toBe(-100);

	expect(PanningParameter.validate(PanningParameter.MAX_VALUE).ok).toBeTrue();
	expect(PanningParameter.validate(PanningParameter.MAX_VALUE + 1).ok).toBeFalse();

	expect(PanningParameter.validate(PanningParameter.MIN_VALUE).ok).toBeTrue();
	expect(PanningParameter.validate(PanningParameter.MIN_VALUE - 1).ok).toBeFalse();

	expect(PanningParameter.validate(PanningParameter.MAX_VALUE - 0.5).ok).toBeFalse();
	expect(PanningParameter.validate(PanningParameter.MIN_VALUE + 0.5).ok).toBeFalse();
});
