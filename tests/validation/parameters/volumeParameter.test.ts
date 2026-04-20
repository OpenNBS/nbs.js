import { VolumeParameter } from "@nbsjs/core";

test("Ensure that volume is validated", () => {
	expect(VolumeParameter.MAX_VOLUME).toBe(100);
	expect(VolumeParameter.MIN_VOLUME).toBe(0);

	expect(VolumeParameter.validate(VolumeParameter.MAX_VOLUME).ok).toBeTrue();
	expect(VolumeParameter.validate(VolumeParameter.MAX_VOLUME + 1).ok).toBeFalse();

	expect(VolumeParameter.validate(VolumeParameter.MIN_VOLUME).ok).toBeTrue();
	expect(VolumeParameter.validate(VolumeParameter.MIN_VOLUME - 1).ok).toBeFalse();

	expect(VolumeParameter.validate(VolumeParameter.MAX_VOLUME - 0.5).ok).toBeFalse();
	expect(VolumeParameter.validate(VolumeParameter.MIN_VOLUME + 0.5).ok).toBeFalse();
});
