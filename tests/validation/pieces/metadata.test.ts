import { Song, VersionParameter } from "@nbsjs/core";

test("Ensure that metadata fields are validated", () => {
	const song = new Song();

	expect(() => {
		song.version = VersionParameter.MAX_SUPPORTED_VERSION + 1;
	}).toThrow();

	expect(() => {
		song.version = VersionParameter.MAX_SUPPORTED_VERSION - 0.5;
	}).toThrow();
});
