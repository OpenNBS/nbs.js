import { BeatsParameter, NoteParameter, Song } from "@nbsjs/core";

test("Ensure that tempo fields are validated", () => {
	const song = new Song();

	expect(() => {
		song.tempo.beats = BeatsParameter.MAX_BEATS + 1;
	}).toThrow();

	expect(() => {
		song.tempo.note = NoteParameter.MAX_NOTE + 1;
	}).toThrow();
});
