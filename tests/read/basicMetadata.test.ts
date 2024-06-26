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
	const array = new Uint8Array(file).buffer;
	const song = fromArrayBuffer(array, {
		"ignoreEmptyLayers": true
	});

	const input: TestOptions = {
		"version": song.version,
		"length": song.getLength(),
		"instruments": song.instruments.getTotal(),
		"layers": song.layers.all.length,
		"tempo": song.getTempo(),
		"lastMeasure": song.getLastMeasure()
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
