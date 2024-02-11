import { readFile } from "node:fs/promises";
import { fromArrayBuffer, toArrayBuffer } from "../../src";

test("Add notes to an existing song", async () => {
	const originalFile = await readFile("tests/sample/simple.nbs");
	const originalBuffer = new Uint8Array(originalFile);
	const originalSong = fromArrayBuffer(originalBuffer.buffer);

	const expectedFile = await readFile("tests/sample/simpleAdded.nbs");
	const expectedBuffer = new Uint8Array(expectedFile);

	const harp = originalSong.layers.get[0];

	const topPling = originalSong.layers.get[4];
	topPling.volume = 80;

	const middlePling = originalSong.layers.get[5];
	middlePling.volume = 30;
	middlePling.stereo = -40;

	const bottomPling = originalSong.layers.get[6];
	bottomPling.volume = 30;
	bottomPling.stereo = 40;

	harp.notes.create(64, 0, {
		"key": 46,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	topPling.notes.create(64, 8, {
		"key": 46,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	middlePling.notes.create(64, 8, {
		"key": 41,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	bottomPling.notes.create(64, 8, {
		"key": 38,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});

	harp.notes.create(72, 0, {
		"key": 45,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	topPling.notes.create(72, 8, {
		"key": 45,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	middlePling.notes.create(72, 8, {
		"key": 38,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});
	bottomPling.notes.create(72, 8, {
		"key": 41,
		"velocity": 100,
		"panning": 0,
		"pitch": 0
	});

	originalSong.description = "A simple melody used for testing NBS.js. Adds two leading notes at the end of the initial melody.";
	originalSong.minutesSpent = 9;
	originalSong.leftClicks = 324;
	originalSong.rightClicks = 4;
	originalSong.blocksAdded = 40;

	const exportedArray = toArrayBuffer(originalSong);
	const exportedBuffer = new Uint8Array(exportedArray);

	expect(Buffer.compare(exportedBuffer, expectedBuffer)).toBe(0);
});
