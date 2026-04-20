import { Song } from "@nbsjs/core";

test("Ensure that auto-save fields are validated", () => {
	const song = new Song();

	expect(() => {
		song.autoSave.interval = -1;
	}).toThrow();

	expect(() => {
		song.autoSave.interval = 1.5;
	}).toThrow();
});
