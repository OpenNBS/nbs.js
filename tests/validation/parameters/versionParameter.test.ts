import { VersionParameter } from "@nbsjs/core";

test("Ensure that suppoted versions are validated", () => {
	expect(VersionParameter.MAX_SUPPORTED_VERSION).toBe(6);
	expect(VersionParameter.MIN_SUPPORTED_VERSION).toBe(0);

	expect(VersionParameter.validate(VersionParameter.MAX_SUPPORTED_VERSION).ok).toBeTrue();
	expect(VersionParameter.validate(VersionParameter.MAX_SUPPORTED_VERSION + 1).ok).toBeFalse();

	expect(VersionParameter.validate(VersionParameter.MIN_SUPPORTED_VERSION).ok).toBeTrue();
	expect(VersionParameter.validate(VersionParameter.MIN_SUPPORTED_VERSION - 1).ok).toBeFalse();

	expect(VersionParameter.validate(VersionParameter.MAX_SUPPORTED_VERSION - 0.5).ok).toBeFalse();
	expect(VersionParameter.validate(VersionParameter.MIN_SUPPORTED_VERSION + 0.5).ok).toBeFalse();
});
