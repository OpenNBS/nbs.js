import { VersionParameter } from "@nbsjs/core";

test("Ensure that suppoted versions are validated", () => {
	expect(VersionParameter.MAX_VALUE).toBe(6);
	expect(VersionParameter.MIN_VALUE).toBe(0);

	expect(VersionParameter.validate(VersionParameter.MAX_VALUE).ok).toBeTrue();
	expect(VersionParameter.validate(VersionParameter.MAX_VALUE + 1).ok).toBeFalse();

	expect(VersionParameter.validate(VersionParameter.MIN_VALUE).ok).toBeTrue();
	expect(VersionParameter.validate(VersionParameter.MIN_VALUE - 1).ok).toBeFalse();

	expect(VersionParameter.validate(VersionParameter.MAX_VALUE - 0.5).ok).toBeFalse();
	expect(VersionParameter.validate(VersionParameter.MIN_VALUE + 0.5).ok).toBeFalse();
});
