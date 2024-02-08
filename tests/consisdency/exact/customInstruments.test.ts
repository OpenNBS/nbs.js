import { readFile } from "node:fs/promises";
import { fromArrayBuffer, toArrayBuffer } from "../../../src";

test("Import and export identical complex songs", async () => {
	const originalFile = await readFile("tests/sample/full.nbs");
	const originalArray = new Uint8Array(originalFile);
	const originalSong = fromArrayBuffer(originalArray.buffer);

	const exportedBuffer = toArrayBuffer(originalSong);
	const exportedArray = new Uint8Array(exportedBuffer);

	expect(Buffer.compare(originalArray, exportedArray)).toBe(0);
});
