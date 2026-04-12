import { BinaryReader, BinaryWriter } from "@nbsjs/core";

test("Import and export identical complex songs", async () => {
	const originalFile = Bun.file("tests/sample/full.nbs");
	const originalBuffer = await originalFile.bytes();

	const binaryReader = new BinaryReader(originalBuffer.buffer);
	const song = binaryReader.toSong();

	const binaryWriter = new BinaryWriter(song);
	const exportedArray = binaryWriter.toArrayBuffer();

	const exportedBuffer = new Uint8Array(exportedArray);

	expect(Buffer.compare(originalBuffer, exportedBuffer)).toBe(0);
});
