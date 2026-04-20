/** biome-ignore-all lint/style/noNonNullAssertion: Disabled for brevity */

import { readSample } from "./samples/readSample";

import { BinaryReader, BinaryWriter } from "@nbsjs/core";

test("Read a song with blank custom instrument fields", async () => {
	const originalBuffer = await readSample("blank_instruments.nbs");

	const binaryReader = new BinaryReader(originalBuffer.buffer);

	const song = binaryReader.toSong();

	expect(song.instruments.total).toBe(3);

	const firstInstrument = song.instruments.at(0)!;
	const secondInstrument = song.instruments.at(1)!;
	const thirdInstrument = song.instruments.at(2)!;

	expect(firstInstrument.name).toBeUndefined();
	expect(firstInstrument.identifier.path).toBe("0");

	expect(secondInstrument.name).toBeUndefined();
	expect(secondInstrument.identifier.path).toBe("1");

	expect(thirdInstrument.name).toBe("block.sand.break");
	expect(thirdInstrument.identifier.path).toBe("block.sand.break");

	const binaryWriter = new BinaryWriter(song);

	const exportedArray = binaryWriter.toArrayBuffer();
	const exportedBuffer = new Uint8Array(exportedArray);

	expect(Buffer.compare(originalBuffer, exportedBuffer)).toBe(0);
});

test("Read a song with invalid custom instrument names", async () => {
	const originalBuffer = await readSample("invalid_instruments.nbs");

	const binaryReader = new BinaryReader(originalBuffer.buffer);

	const song = binaryReader.toSong();

	expect(song.instruments.total).toBe(3);

	const firstInstrument = song.instruments.at(0)!;
	const secondInstrument = song.instruments.at(1)!;
	const thirdInstrument = song.instruments.at(2)!;

	expect(firstInstrument.name).toBe("blast!");
	expect(firstInstrument.identifier.path).toBe("blast");

	expect(secondInstrument.name).toBe("TRIGGER");
	expect(secondInstrument.identifier.path).toBe("trigger");

	expect(thirdInstrument.name).toBe("block/sand/break");
	expect(thirdInstrument.identifier.path).toBe("block/sand/break");

	const binaryWriter = new BinaryWriter(song);

	const exportedArray = binaryWriter.toArrayBuffer();
	const exportedBuffer = new Uint8Array(exportedArray);

	expect(Buffer.compare(originalBuffer, exportedBuffer)).toBe(0);
});
