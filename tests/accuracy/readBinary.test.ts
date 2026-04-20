import { readSample } from "./samples/readSample";

import type { HeaderLike } from "@nbsjs/core";
import { BinaryReader, BinaryWriter } from "@nbsjs/core";

async function compare(fileName: string): Promise<void> {
	const originalBuffer = await readSample(fileName);

	const binaryReader = new BinaryReader(originalBuffer.buffer);

	const song = binaryReader.toSong();

	const binaryWriter = new BinaryWriter(song);

	const exportedArray = binaryWriter.toArrayBuffer();
	const exportedBuffer = new Uint8Array(exportedArray);

	expect(Buffer.compare(originalBuffer, exportedBuffer)).toBe(0);
}

function checkHeaderLike(headerLike: HeaderLike): void {
	expect(headerLike.version).toBe(6);
	expect(headerLike.size).toBe(62);

	expect(headerLike.name).toBe("Njalla");
	expect(headerLike.author).toBe("encode42");
	expect(headerLike.originalAuthor).toBe(undefined);
	expect(headerLike.description).toBe("A simple melody used for testing NBS.js.");
	expect(headerLike.importName).toBe(undefined);

	expect(headerLike.tempo.ticksPerSecond).toBe(10);
	expect(headerLike.tempo.millisecondsPerTick).toBe(100);
	expect(headerLike.tempo.beatsPerMinute).toBe(150);

	expect(headerLike.autoSave.isEnabled).toBeFalse();
	expect(headerLike.autoSave.interval).toBe(5);

	expect(headerLike.loop.isEnabled).toBeFalse();
	expect(headerLike.loop.count).toBe(0);
	expect(headerLike.loop.startTick).toBe(0);

	expect(headerLike.statistics.minutesSpent).toBe(5);
	expect(headerLike.statistics.blocksAdded).toBe(26);
	expect(headerLike.statistics.blocksRemoved).toBe(0);
	expect(headerLike.statistics.leftClicks).toBe(186);
	expect(headerLike.statistics.rightClicks).toBe(3);
}

test("Read and write an identical simple song", async () => {
	compare("simple.nbs");
});

test("Read and write an identical complex song", async () => {
	compare("complex.nbs");
});

test("Read a header from a binary file", async () => {
	const originalFile = await readSample("simple.nbs");

	const binaryReader = new BinaryReader(originalFile.buffer);
	const header = binaryReader.toHeader();

	checkHeaderLike(header);

	expect(header.layers.total).toBe(34);

	expect(header.loop.endMeasureTick).toBe(64);
});

test("Read a song from a binary file", async () => {
	const originalBuffer = await readSample("simple.nbs");

	const binaryReader = new BinaryReader(originalBuffer.buffer);

	const song = binaryReader.toSong();

	checkHeaderLike(song);

	expect(song.loop.endMeasureTick).toBe(64);

	expect(song.totalNotes).toBe(49);
	expect(song.layers.total).toBe(34);
	expect(song.instruments.total).toBe(0);
	// TODO: Give the layers some names!
});
