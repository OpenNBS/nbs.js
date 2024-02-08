import { readFile, writeFile } from "node:fs/promises";
import { Layer, fromArrayBuffer, toArrayBuffer } from "../../src";

test("Transform a file to an expected result", async () => {
	const originalFile = await readFile("tests/sample/simple.nbs");
	const originalArray = new Uint8Array(originalFile);
	const originalSong = fromArrayBuffer(originalArray.buffer);

	const expectedFile = await readFile("tests/sample/simpleAdded.nbs");
	const expectedArray = new Uint8Array(expectedFile);

	const harp = originalSong.layers[0];

	const topPling = new Layer(5);
	topPling.volume = 80;

	const middlePling = new Layer(6);
	middlePling.volume = 30;
	middlePling.stereo = -40;

	const bottomPling = new Layer(7);
	bottomPling.volume = 30;
	bottomPling.stereo = 40;

	originalSong.addNote(harp, 64, 0, {
		"key": 46,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	topPling.addNote(64, 8, {
		"key": 46,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	middlePling.addNote(64, 8, {
		"key": 41,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	bottomPling.addNote(64, 8, {
		"key": 38,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});

	originalSong.addNote(harp, 72, 0, {
		"key": 45,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	topPling.addNote(72, 8, {
		"key": 45,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	middlePling.addNote(72, 8, {
		"key": 38,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	bottomPling.addNote(72, 8, {
		"key": 41,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});

	originalSong.addLayer(topPling);
	originalSong.addLayer(middlePling);
	originalSong.addLayer(bottomPling);

	originalSong.meta.description = "A simple melody used for testing NBS.js. Adds two leading notes at the end of the initial melody.";
	originalSong.stats.minutesSpent = 9;
	originalSong.stats.leftClicks = 324;
	originalSong.stats.rightClicks = 4;
	originalSong.stats.blocksAdded = 40;

	const exportedBuffer = toArrayBuffer(originalSong);
	const exportedArray = new Uint8Array(exportedBuffer);

	expect(Buffer.compare(exportedArray, expectedArray)).toBe(0);
});
