import { PanningParameter } from "@nbsjs/core";

test("Ensure that panning is validated", () => {
	expect(PanningParameter.MAX_PANNING).toBe(100);
	expect(PanningParameter.MIN_PANNING).toBe(-100);

	expect(PanningParameter.validate(PanningParameter.MAX_PANNING).ok).toBeTrue();
	expect(PanningParameter.validate(PanningParameter.MAX_PANNING + 1).ok).toBeFalse();

	expect(PanningParameter.validate(PanningParameter.MIN_PANNING).ok).toBeTrue();
	expect(PanningParameter.validate(PanningParameter.MIN_PANNING - 1).ok).toBeFalse();

	expect(PanningParameter.validate(PanningParameter.MAX_PANNING - 0.5).ok).toBeFalse();
	expect(PanningParameter.validate(PanningParameter.MIN_PANNING + 0.5).ok).toBeFalse();
});
