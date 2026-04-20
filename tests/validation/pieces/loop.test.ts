import { Song } from "@nbsjs/core";

test("Ensure that loop fields are validated", () => {
	const song = new Song();

	expect(() => {
		song.loop.startTick = -1;
	}).toThrow();

	expect(() => {
		song.loop.startTick = 0.5;
	}).toThrow();

	expect(() => {
		song.loop.count = -1;
	}).toThrow();

	expect(() => {
		song.loop.count = 0.5;
	}).toThrow();
});
