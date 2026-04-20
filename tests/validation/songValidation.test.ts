import { Song, VersionParameter } from "@nbsjs/core";

test("Ensure that song fields are validated", () => {
	const song = new Song();

	expect(() => {
		// @ts-expect-error
		song.size = 100;
	}).toThrow();

	expect(() => {
		song.version = VersionParameter.MAX_SUPPORTED_VERSION + 1;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		song.autoSave = undefined;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		song.loop = undefined;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		song.statistics = undefined;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		song.tempo = undefined;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		song.instruments = undefined;
	}).toThrow();

	expect(() => {
		// @ts-expect-error
		song.layers = undefined;
	}).toThrow();
});
