import { readFile } from "node:fs/promises";
import { fromArrayBuffer, fromJSON, toJSON } from "../../src";

test.todo("Export a song as JSON", async () => {
	const originalFile = await readFile("tests/sample/full.nbs");
	const originalArray = new Uint8Array(originalFile);
	const originalSong = fromArrayBuffer(originalArray.buffer);
	const originalJSON = toJSON(originalSong);

	const exportedSong = fromJSON(originalJSON);
	const exportedJSON = toJSON(exportedSong);

	expect(exportedJSON).toStrictEqual(originalJSON);
});
