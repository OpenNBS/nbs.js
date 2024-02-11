import { writeFileSync } from "node:fs";
import { Song, toArrayBuffer } from "@encode42/nbs.js";

const song = new Song();

// ...do what you need with the song

const exportedBuffer = toArrayBuffer(song, {
	"ignoreEmptyLayers": true
});

writeFileSync("output.nbs", new Uint8Array(exportedBuffer));
