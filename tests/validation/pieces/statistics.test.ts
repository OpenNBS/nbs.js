import { Song } from "@nbsjs/core";

test("Ensure that metadata fields are validated", () => {
	const song = new Song();

	expect(() => {
		song.statistics.minutesSpent = -1;
	}).toThrow();

	expect(() => {
		song.statistics.minutesSpent = 0.5;
	}).toThrow();

	expect(() => {
		song.statistics.leftClicks = -1;
	}).toThrow();

	expect(() => {
		song.statistics.leftClicks = 0.5;
	}).toThrow();

	expect(() => {
		song.statistics.rightClicks = -1;
	}).toThrow();

	expect(() => {
		song.statistics.rightClicks = 0.5;
	}).toThrow();

	expect(() => {
		song.statistics.blocksAdded = -1;
	}).toThrow();

	expect(() => {
		song.statistics.blocksAdded = 0.5;
	}).toThrow();

	expect(() => {
		song.statistics.blocksRemoved = -1;
	}).toThrow();

	expect(() => {
		song.statistics.blocksRemoved = 0.5;
	}).toThrow();
});
