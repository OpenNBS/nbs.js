import { readFile } from "node:fs/promises";
import { fromArrayBuffer } from "../../src";

interface TestOptions {
	"version": number;
	"length": number;
	"instruments": number;
	"layers": number;
	"tempo": number;
	"lastMeasure": number | undefined;
}

test("Read song from file, compare metadata", async () => {
	const file = await readFile("tests/sample/simple.nbs");
	const buffer = new Uint8Array(file).buffer;
	const song = fromArrayBuffer(buffer, {
		"ignoreEmptyLayers": true
	});

	const input: TestOptions = {
		"version": song.nbsVersion,
		"length": song.length,
		"instruments": song.instruments.loaded.length,
		"layers": song.layers.length,
		"tempo": song.tempo,
		"lastMeasure": song.stats.lastMeasure
	};

	const target: TestOptions = {
		"version": 5,
		"length": 62,
		"instruments": 16,
		"layers": 4,
		"tempo": 10,
		"lastMeasure": 64
	};

	expect(input).toStrictEqual(target);
});
