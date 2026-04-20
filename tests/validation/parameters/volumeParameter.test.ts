import { VolumeParameter } from "@nbsjs/core";

test("Ensure that volume is validated", () => {
	expect(VolumeParameter.MAX_VALUE).toBe(100);
	expect(VolumeParameter.MIN_VALUE).toBe(0);

	expect(VolumeParameter.validate(VolumeParameter.MAX_VALUE).ok).toBeTrue();
	expect(VolumeParameter.validate(VolumeParameter.MAX_VALUE + 1).ok).toBeFalse();

	expect(VolumeParameter.validate(VolumeParameter.MIN_VALUE).ok).toBeTrue();
	expect(VolumeParameter.validate(VolumeParameter.MIN_VALUE - 1).ok).toBeFalse();

	expect(VolumeParameter.validate(VolumeParameter.MAX_VALUE - 0.5).ok).toBeFalse();
	expect(VolumeParameter.validate(VolumeParameter.MIN_VALUE + 0.5).ok).toBeFalse();
});
