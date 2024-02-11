import { format, parse } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { fromArrayBuffer, toJSON } from "@encode42/nbs.js";

// We will be converting a file named "song.nbs"
const songPath = parse("song.nbs");
const inputPath = format(songPath);
const outputPath = format({
	...songPath,
	"ext": ".json"
});

// Read the file into a song
const originalFile = readFileSync(inputPath);
const originalBuffer = new Uint8Array(originalFile).buffer;
const song = fromArrayBuffer(originalBuffer);

// Export the song into a JSON object
const exportedJSON = toJSON(song);
writeFileSync(outputPath, JSON.stringify(exportedJSON));
