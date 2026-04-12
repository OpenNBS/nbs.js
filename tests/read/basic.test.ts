import { BinaryReader } from "@nbsjs/core";

interface Fields {
	"size": number;
	"ticksPerSecond": number;
	"totalCustomInstruments": number;
	"totalLayers": number;
	"version": number;
}

test("Read song from file, compare basic information", async () => {
	const originalFile = Bun.file("tests/sample/simple.nbs");

	const binaryReader = new BinaryReader(await originalFile.arrayBuffer());
	const song = binaryReader.toSong();

	const importedFields: Fields = {
		"size": song.size,
		"ticksPerSecond": song.tempo.ticksPerSecond,
		"totalCustomInstruments": song.instruments.total,
		"totalLayers": song.layers.total,
		"version": song.version
	};

	const expectedFields: Fields = {
		"size": 62,
		"ticksPerSecond": 10,
		"totalCustomInstruments": 0,
		"totalLayers": 34,
		"version": 6
	};

	expect(importedFields).toStrictEqual(expectedFields);
});
